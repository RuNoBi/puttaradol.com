// Full-screen quad vertex shader shared by both passes.
export const quadVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Pass 1 — mouse trail. Ping-pongs between two float targets:
// previous value fades by uDecay, a soft brush adds colour where the cursor is.
export const trailFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform vec2  uMouse;     // uv, or far away when no pointer
  uniform float uRadius;    // in uv units (height-relative)
  uniform float uStrength;  // amount added this frame
  uniform float uDecay;     // multiplier this frame
  uniform float uFade;      // linear fade this frame (guarantees it reaches 0
                            // even when the target is only 8-bit precision)
  uniform float uAspect;    // width / height

  void main() {
    float prev = max(texture2D(uPrev, vUv).r * uDecay - uFade, 0.0);
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    float brush = exp(-dot(d, d) / (uRadius * uRadius)) * uStrength;
    gl_FragColor = vec4(min(prev + brush, 1.0), 0.0, 0.0, 1.0);
  }
`;

// Pass 2 — ASCII. Each cell samples the portrait once, picks a glyph by
// brightness, then blends from monochrome to the photo's real colour by the
// trail value at that cell.
export const asciiFrag = /* glsl */ `
  precision highp float;
  uniform sampler2D uPortrait;
  uniform sampler2D uAtlas;
  uniform sampler2D uTrail;
  uniform vec2  uRes;       // drawing-buffer size in px
  uniform vec2  uCell;      // cell size in px
  uniform float uGlyphs;    // number of glyphs in the atlas
  uniform float uTime;
  uniform float uIntro;     // 0 → 1 build-in
  uniform vec3  uDim;       // colour of the faintest glyphs
  uniform vec3  uFg;        // colour of the brightest glyphs

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 px   = gl_FragCoord.xy;
    vec2 cell = floor(px / uCell);
    vec2 cuv  = (cell + 0.5) * uCell / uRes;

    vec4 img = texture2D(uPortrait, cuv);          // one sample per cell
    vec4 photo = texture2D(uPortrait, px / uRes);  // per pixel, for the glow
    if (img.a < 0.02 && photo.a < 0.02) discard;

    // Light on dark: brighter pixels get denser, brighter glyphs.
    float l = pow(smoothstep(0.04, 0.92, luma(img.rgb)), 0.72);

    // Edge detection at cell scale — outlines hair, eyes, brows, jaw.
    vec2 o = uCell / uRes;
    float gx = luma(texture2D(uPortrait, cuv + vec2(o.x, 0.0)).rgb) - luma(texture2D(uPortrait, cuv - vec2(o.x, 0.0)).rgb);
    float gy = luma(texture2D(uPortrait, cuv + vec2(0.0, o.y)).rgb) - luma(texture2D(uPortrait, cuv - vec2(0.0, o.y)).rgb);
    float edge = smoothstep(0.08, 0.45, length(vec2(gx, gy)));
    l = max(l, edge * 0.85);

    float reveal = smoothstep(0.0, 1.0, texture2D(uTrail, cuv).r);

    // Build-in: cells appear top → bottom with jitter.
    float h = hash(cell);
    float order = h * 0.35 + (1.0 - cuv.y) * 0.65;
    float appear = smoothstep(order, order + 0.06, uIntro * 1.06);

    float maxG = uGlyphs - 1.0;
    float g = floor(mix(1.0, maxG, l) + reveal * 2.0 + 0.5);

    // "Decoding" flicker on the leading edge of the reveal and during build-in.
    float tick = floor(uTime * 14.0);
    float front = step(0.06, reveal) * (1.0 - step(0.3, reveal));
    float building = step(0.001, appear) * (1.0 - step(0.999, appear));
    if (max(front, building) > 0.5 && hash(cell + tick) > 0.78) {
      g = 1.0 + floor(hash(cell * 1.7 + tick) * maxG);
    }
    g = clamp(g, 1.0, maxG);

    vec2 local = fract(px / uCell);
    float glyph = texture2D(uAtlas, vec2((g + local.x) / uGlyphs, local.y)).r;

    // Monochrome by default; the cursor slowly brings out the real colours.
    vec3 mono  = mix(uDim, uFg, smoothstep(0.0, 0.85, l));
    vec3 color = pow(img.rgb, vec3(0.85)) * 1.1;
    color = mix(vec3(luma(color)), color, 1.3);
    vec3 col = mix(mono, color, reveal);

    // Fade the shoulders/shirt out toward the bottom so the face leads.
    float fade = smoothstep(0.2, 0.58, cuv.y);
    float a = glyph * smoothstep(0.02, 0.5, img.a) * appear * fade;

    // Faint glow of the photo underneath, so the face reads at a glance.
    float glow = smoothstep(0.1, 0.95, luma(photo.rgb)) * 0.13 * photo.a
               * smoothstep(0.2, 0.58, px.y / uRes.y) * smoothstep(0.3, 1.0, uIntro);
    vec3 glowCol = mix(uFg, photo.rgb, reveal);

    vec3 outCol = col * a + glowCol * glow * (1.0 - a);
    float outA = a + glow * (1.0 - a);
    gl_FragColor = vec4(outCol, outA);
  }
`;
