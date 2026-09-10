import * as React from "react";

const subscribe = () => () => {};

/** True only once the component has hydrated on the client. */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
