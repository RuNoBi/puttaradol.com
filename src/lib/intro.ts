// First-load gate: while <html> has `is-loading`, the calibration intro is on
// screen and entrance animations wait. The inline script below adds the class
// on the first visit of a session (skipped for reduced motion), with a safety
// timeout so the page can never stay hidden.

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

/** Inline <head> script — runs before first paint. */
export const introBootScript = `(function(){try{
var d=document.documentElement;
if(sessionStorage.getItem('${INTRO_SEEN_KEY}'))return;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('is-loading');
setTimeout(function(){if(d.classList.contains('is-loading')){d.classList.remove('is-loading');window.dispatchEvent(new Event('${INTRO_EVENT}'));}},6000);
}catch(e){}})();`;
