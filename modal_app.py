"""Deploy Cage Matcher (Next.js) on Modal.

Usage:
    modal deploy modal_app.py

Requires a Modal secret named "streaminglit-supabase" with two keys:
    SUPABASE_URL - your Supabase project URL
    SUPABASE_KEY - a Supabase API key (anon key, paired with a read-only
                   RLS policy on the `films` table, is recommended)

Reuses the same secret name/keys as the original Streamlit app's
deployment, so no new Modal secret is needed if you already have one:

    modal secret create streaminglit-supabase SUPABASE_URL=... SUPABASE_KEY=...
"""

import subprocess

import modal

app = modal.App(name="cage-matcher")

# Files/dirs to skip when shipping the repo into the image — build output,
# dependencies, and anything that shouldn't ride along.
IGNORE = [
    "**/node_modules",
    "**/.next",
    "**/.git",
    "**/.env*",
]

image = (
    modal.Image.debian_slim(python_version="3.13")
    .apt_install("curl")
    .run_commands(
        "curl -fsSL https://deb.nodesource.com/setup_22.x | bash -",
        "apt-get install -y nodejs",
    )
    .add_local_dir(".", remote_path="/app", ignore=IGNORE, copy=True)
    .run_commands("cd /app && npm ci")
    .run_commands("cd /app && npm run build")
)


@app.function(
    image=image,
    secrets=[modal.Secret.from_name("streaminglit-supabase")],
    min_containers=1,
)
@modal.concurrent(max_inputs=100)
@modal.web_server(8000, startup_timeout=60)
def run():
    subprocess.Popen(
        "npm run start -- --port 8000 --hostname 0.0.0.0",
        shell=True,
        cwd="/app",
    )
