import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { srgb } from "@/lib/color";
import { contourFrag, dataFieldVert } from "./dataFieldShader";

export type DataFieldHandle = { play: () => void; dispose: () => void };

// Render scale (drawing-buffer px per CSS px), stepped down if frames are slow.
const SCALES = [1.25, 1, 0.75];

export function createDataField(
  canvas: HTMLCanvasElement,
  { reducedMotion }: { reducedMotion: boolean },
): DataFieldHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new PlaneGeometry(2, 2);

  const uniforms = {
    uRes: { value: new Vector2(1, 1) },
    uScale: { value: 1 },
    uTime: { value: 0 },
    uIntro: { value: reducedMotion ? 1.2 : 0 },
    uScroll: { value: 0 },
    uMouse: { value: new Vector2(-9999, -9999) },
    uMouseOn: { value: 0 },
    uClick: { value: new Vector3(0, 0, -1) },
    uBg: { value: srgb("#0e1012") },
    uLine: { value: srgb("#e6e9ec") },
    uAccent: { value: srgb("#62d2c0") },
    uVis: { value: 1 },
  };
  const material = new ShaderMaterial({
    vertexShader: dataFieldVert,
    fragmentShader: contourFrag,
    uniforms,
    depthTest: false,
  });
  const scene = new Scene().add(new Mesh(quad, material));
  const draw = () => renderer.render(scene, camera);

  // ── Sizing (with adaptive quality) ───────────────────────────
  const scales = SCALES;
  let level = 0;
  const resize = () => {
    const scale = Math.min(scales[level], window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(1);
    renderer.setSize(Math.round(w * scale), Math.round(h * scale), false);
    uniforms.uRes.value.set(Math.round(w * scale), Math.round(h * scale));
    uniforms.uScale.value = scale;
    if (reducedMotion) draw();
  };
  window.addEventListener("resize", resize);

  // ── Input (CSS px, y up) ─────────────────────────────────────
  const mouse = { x: -9999, y: -9999, on: false };
  const smooth = { x: -9999, y: -9999, on: 0 };
  let clickAt = -1;

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return; // touch gets ripples only
    mouse.x = e.clientX;
    mouse.y = window.innerHeight - e.clientY;
    if (!mouse.on) {
      smooth.x = mouse.x;
      smooth.y = mouse.y;
    }
    mouse.on = true;
  };
  const onLeave = () => (mouse.on = false);
  const onDown = (e: PointerEvent) => {
    uniforms.uClick.value.set(e.clientX, window.innerHeight - e.clientY, 0);
    clickAt = performance.now();
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  // ── Loop ─────────────────────────────────────────────────────
  const start = performance.now();
  let introStart = Infinity;
  let prev = start;
  let raf = 0;
  let paused = false;
  let slowFrames = 0;
  let drewBlank = false;
  let sampled = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (paused) return;
    const rawDt = (now - prev) / 1000;
    const dt = Math.min(rawDt, 0.05);
    prev = now;

    // Adaptive quality: if most recent frames miss ~45fps, render smaller.
    if (rawDt < 0.25) {
      sampled++;
      if (rawDt > 1 / 45) slowFrames++;
      if (sampled === 90) {
        if (slowFrames > 45 && level < scales.length - 1) {
          level++;
          resize();
        }
        sampled = slowFrames = 0;
      }
    }

    // Light smoothing only — the glow should feel attached to the cursor.
    const follow = 1 - Math.pow(0.000001, dt);
    smooth.x += (mouse.x - smooth.x) * follow;
    smooth.y += (mouse.y - smooth.y) * follow;
    smooth.on += ((mouse.on ? 1 : 0) - smooth.on) * (1 - Math.pow(0.02, dt));

    uniforms.uTime.value = (now - start) / 1000;
    uniforms.uIntro.value = Math.min(1.2, Math.max(0, (now - introStart) / 1400));
    uniforms.uScroll.value = window.scrollY;
    uniforms.uMouse.value.set(smooth.x, smooth.y);
    uniforms.uMouseOn.value = smooth.on;
    uniforms.uClick.value.z = clickAt < 0 ? -1 : (now - clickAt) / 1000;

    // Only the hero gets the map; below it the page is plain paper.
    const vh = window.innerHeight;
    const vis = 1 - Math.min(1, Math.max(0, (window.scrollY - vh * 0.3) / (vh * 0.6)));
    uniforms.uVis.value = vis;
    if (vis === 0 && drewBlank) return; // nothing to animate — skip the GPU work
    drewBlank = vis === 0;
    draw();
  };

  const onVis = () => {
    paused = document.hidden;
    prev = performance.now();
  };
  document.addEventListener("visibilitychange", onVis);

  resize();
  if (reducedMotion) draw();
  else raf = requestAnimationFrame(frame);

  return {
    play() {
      if (introStart === Infinity) introStart = performance.now();
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      material.dispose();
      quad.dispose();
      renderer.dispose();
    },
  };
}
