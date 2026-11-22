import { srgb } from "@/lib/color";
import {
  CanvasTexture,
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";
import { asciiFrag, quadVert, trailFrag } from "./shaders";

export type AsciiOptions = {
  src: string;
  fontFamily: string;
  reducedMotion: boolean;
  /** Characters from sparse → dense. Index 0 is treated as empty. */
  ramp?: string;
  /** Target number of columns across the portrait. */
  columns?: number;
};

export type AsciiHandle = {
  /** Starts the build-in animation (called once the boot loader is done). */
  play: () => void;
  dispose: () => void;
};

const GLYPH_W = 48;
const GLYPH_H = 74;
const TRAIL_RES = 160;

function buildAtlas(ramp: string, fontFamily: string) {
  const c = document.createElement("canvas");
  c.width = GLYPH_W * ramp.length;
  c.height = GLYPH_H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#fff";
  ctx.font = `500 ${Math.round(GLYPH_H * 0.62)}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  [...ramp].forEach((ch, i) => ctx.fillText(ch, i * GLYPH_W + GLYPH_W / 2, GLYPH_H / 2 + 2));
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function makeTarget() {
  return new WebGLRenderTarget(TRAIL_RES, TRAIL_RES, {
    type: HalfFloatType,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  });
}

export async function createAsciiPortrait(
  canvas: HTMLCanvasElement,
  opts: AsciiOptions,
): Promise<AsciiHandle> {
  const ramp = opts.ramp ?? " .,:;-~=+*xoO#%@";
  const columns = opts.columns ?? 80;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);

  await document.fonts.load(`500 40px ${opts.fontFamily}`).catch(() => undefined);
  const atlas = buildAtlas(ramp, opts.fontFamily);
  const portrait: Texture = await new TextureLoader().loadAsync(opts.src);
  portrait.minFilter = LinearFilter;
  portrait.generateMipmaps = false;

  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new PlaneGeometry(2, 2);

  // ── Trail pass ───────────────────────────────────────────────
  let read = makeTarget();
  let write = makeTarget();
  const trailMat = new ShaderMaterial({
    vertexShader: quadVert,
    fragmentShader: trailFrag,
    uniforms: {
      uPrev: { value: read.texture },
      uMouse: { value: new Vector2(-10, -10) },
      uRadius: { value: 0.11 },
      uStrength: { value: 0 },
      uDecay: { value: 1 },
      uFade: { value: 0 },
      uAspect: { value: 1 },
    },
    depthTest: false,
  });
  const trailScene = new Scene().add(new Mesh(quad, trailMat));

  // ── ASCII pass ───────────────────────────────────────────────
  const asciiMat = new ShaderMaterial({
    vertexShader: quadVert,
    fragmentShader: asciiFrag,
    uniforms: {
      uPortrait: { value: portrait },
      uAtlas: { value: atlas },
      uTrail: { value: read.texture },
      uRes: { value: new Vector2(1, 1) },
      uCell: { value: new Vector2(8, 12) },
      uGlyphs: { value: ramp.length },
      uTime: { value: 0 },
      uIntro: { value: opts.reducedMotion ? 1 : 0 },
      uDim: { value: srgb("#aaa397") },
      uFg: { value: srgb("#0c0c0b") },
    },
    transparent: true,
    depthTest: false,
  });
  const asciiScene = new Scene().add(new Mesh(quad, asciiMat));

  // ── Sizing ───────────────────────────────────────────────────
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    const cw = Math.max(5, Math.min(12, width / columns)) * dpr;
    asciiMat.uniforms.uRes.value.set(width * dpr, height * dpr);
    asciiMat.uniforms.uCell.value.set(cw, cw * (GLYPH_H / GLYPH_W) * 0.92);
    trailMat.uniforms.uAspect.value = width / height;
    if (opts.reducedMotion) draw();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // ── Pointer ──────────────────────────────────────────────────
  const pointer = { x: -10, y: -10, inside: false, last: -1e9 };
  let interacted = false;
  const isTouch = window.matchMedia("(hover: none)").matches;

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    pointer.inside = x >= -0.05 && x <= 1.05 && y >= -0.05 && y <= 1.05;
    pointer.x = x;
    pointer.y = y;
    if (pointer.inside) {
      pointer.last = performance.now();
      interacted = true;
    }
  };
  const onLeave = () => (pointer.inside = false);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  // ── Loop ─────────────────────────────────────────────────────
  let start = Infinity; // set by play()
  let prev = performance.now();
  let raf = 0;
  let visible = true;

  function stepTrail(mx: number, my: number, strength: number, decay: number, fade: number) {
    trailMat.uniforms.uPrev.value = read.texture;
    trailMat.uniforms.uMouse.value.set(mx, my);
    trailMat.uniforms.uStrength.value = strength;
    trailMat.uniforms.uDecay.value = decay;
    trailMat.uniforms.uFade.value = fade;
    renderer.setRenderTarget(write);
    renderer.render(trailScene, camera);
    renderer.setRenderTarget(null);
    [read, write] = [write, read];
    asciiMat.uniforms.uTrail.value = read.texture;
  }

  function draw() {
    renderer.render(asciiScene, camera);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    const t = Math.max(0, (now - start) / 1000);
    const k = dt * 60; // normalise to 60fps

    asciiMat.uniforms.uTime.value = t;
    asciiMat.uniforms.uIntro.value = Math.min(1, t / 1.8);
    if (start === Infinity) return; // waiting for play()

    // Real pointer, or a short idle sweep over the face (4s every 12s) to hint
    // that the portrait is interactive.
    const idleFor = now - pointer.last;
    const inSweepWindow = t > 2.2 && (t - 2.2) % 12 < 4;
    const autoSweep = inSweepWindow && (isTouch ? idleFor > 2500 : !interacted);
    let mx = -10;
    let my = -10;
    let strength = 0;
    if (pointer.inside) {
      mx = pointer.x;
      my = pointer.y;
      strength = 0.045 * k;
    } else if (autoSweep) {
      const s = t - 2.2;
      mx = 0.5 + Math.sin(s * 1.6) * 0.22;
      my = 0.66 + Math.sin(s * 2.3) * 0.12;
      strength = 0.04 * k;
    }
    stepTrail(mx, my, strength, Math.pow(0.988, k), 0.0045 * k);
    draw();
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    prev = performance.now();
  });
  io.observe(canvas);
  const onVis = () => {
    visible = !document.hidden;
    prev = performance.now();
  };
  document.addEventListener("visibilitychange", onVis);

  resize();
  if (opts.reducedMotion) {
    stepTrail(-10, -10, 0, 0, 1);
    draw();
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    play() {
      if (start === Infinity) start = performance.now();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      read.dispose();
      write.dispose();
      trailMat.dispose();
      asciiMat.dispose();
      quad.dispose();
      atlas.dispose();
      portrait.dispose();
      renderer.dispose();
    },
  };
}
