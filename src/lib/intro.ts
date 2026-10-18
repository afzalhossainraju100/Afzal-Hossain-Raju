import { useSyncExternalStore } from "react";

/** Tiny store that flips once the intro curtain has lifted, so hero animations can start on cue. */
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
