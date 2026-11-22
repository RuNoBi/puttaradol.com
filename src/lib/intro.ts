// Optional first-load gate: while <html> has `is-loading`, entrance animations
// wait. Nothing sets the class right now (the boot loader was removed), so
// onIntroDone() simply runs immediately.

export const INTRO_EVENT = "intro:done";
export const INTRO_SEEN_KEY = "intro-seen";

export function isIntroDone() {
  return !document.documentElement.classList.contains("is-loading");
}

export function markIntroDone() {
  if (isIntroDone()) return;
  document.documentElement.classList.remove("is-loading");
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Runs `fn` once the intro has finished (immediately if it already has). */
export function onIntroDone(fn: () => void) {
  if (isIntroDone()) {
    fn();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, fn, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, fn);
}
