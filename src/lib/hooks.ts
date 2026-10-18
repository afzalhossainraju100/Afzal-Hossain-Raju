"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Wall-clock time in a given zone, refreshed every 20s. Empty until mounted so SSR stays deterministic. */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 20_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}
