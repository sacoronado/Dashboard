# Cage Matcher

> One way to match you with a Nicolas Cage movie.

A Next.js + shadcn/ui rebuild of the [StreamingLit](../../../../Desktop/StreamingLit)
Streamlit app, expanded into three parts:

1. **Spin the wheel** — every film gets a wedge on a giant roulette wheel.
2. **Open the cage** — a CS:GO-style case opener: 15 random films cycle past
   until one lands center.
3. **Stats for nerds** — the original filterable/sortable data explorer.

- **Framework**: Next.js (App Router) + TypeScript + Tailwind v4
- **UI**: [shadcn/ui](https://ui.shadcn.com) (Nova preset) + Recharts
- **Data**: Supabase (`films` table), falling back to a bundled CSV snapshot
  for local dev when no Supabase credentials are set
- **Posters**: [OMDb API](https://www.omdbapi.com), matched via the IMDb ID
  embedded in each film's `imdb_url`
- **Hosting**: Modal, via `modal.web_server` (same pattern as the original
  Streamlit deployment)

## Data model

Reads a `films` table from Supabase with columns:

| column          | type                          |
| --------------- | ----------------------------- |
| `rank`          | int                            |
| `title`         | text                           |
| `imdb_rating`   | float                          |
| `genres`        | text, pipe-delimited (`A\|B`) or a Postgres array |
| `primary_genre` | text                           |
| `imdb_url`      | text                           |

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in:

- `SUPABASE_URL` / `SUPABASE_KEY` — to read live data instead of the bundled
  `data/films.csv` snapshot.
- `OMDB_API_KEY` — a free key from https://www.omdbapi.com/apikey.aspx, to
  fetch movie posters for the wheel and the case opener. Without it, films
  fall back to a plain title card.

## Deploying to Modal

```bash
pip install modal
modal setup  # first time only

# Reuses the same secret name as the original Streamlit deployment — add
# OMDB_API_KEY to it (or create it fresh) before deploying.
modal secret create streaminglit-supabase \
  SUPABASE_URL=... SUPABASE_KEY=... OMDB_API_KEY=...

modal deploy modal_app.py
```

`modal_app.py` builds the Next.js app inside the image (Node 22 + `npm ci`
+ `npm run build`) and serves the production server with `next start` on
port 8000 via `modal.web_server`.
