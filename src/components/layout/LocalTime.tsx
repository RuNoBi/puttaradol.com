"use client";

import { useSyncExternalStore } from "react";

// One shared 1-second ticker for every clock on the page.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

/** Live clock in the given IANA timezone. Shows a placeholder until hydrated. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);

  const text =
    second === null
      ? "--:--:--"
      : new Intl.DateTimeFormat("en-GB", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(second * 1000);

  return <time className="tnum">{text}</time>;
}
