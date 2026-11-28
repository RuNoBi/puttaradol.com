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
  uniform vec3  uShadow;    // duotone dark
  uniform vec3  uHigh;      // duotone light

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Iridescent palette (teal → blue → violet → amber), cosine-based.
  vec3 iridescent(float t) {
    return 0.55 + 0.45 * cos(6.28318 * (t + vec3(0.48, 0.62, 0.80)));
  }

  // A soft band of light travelling across the portrait along direction dir.
  float band(vec2 uv, vec2 dir, float speed, float offset, float width) {
    float d = dot(uv - 0.5, normalize(dir));
    float pos = fract(uTime * speed + offset) * 2.4 - 1.2;
    float x = (d - pos) / width;
    return exp(-x * x);
  }

  // Data portrait: a softened photo tinted graphite → pale teal,
  // with ASCII characters carved into it. Reads as a face from a distance,
  // as data up close; the cursor brings out the real colours.
  void main() {
    vec2 px   = gl_FragCoord.xy;
    vec2 uv   = px / uRes;
    vec2 cell = floor(px / uCell);
    vec2 cuv  = (cell + 0.5) * uCell / uRes;

    vec4 img   = texture2D(uPortrait, cuv);        // one sample per cell → glyph choice
    vec4 photo = texture2D(uPortrait, uv, 1.3);    // softened (mip bias) photo
    if (photo.a < 0.02 && img.a < 0.02) discard;

    // Glyph density from brightness, boosted on edges.
    float l = pow(smoothstep(0.04, 0.92, luma(img.rgb)), 0.72);
    vec2 o = uCell / uRes;
    float gx = luma(texture2D(uPortrait, cuv + vec2(o.x, 0.0)).rgb) - luma(texture2D(uPortrait, cuv - vec2(o.x, 0.0)).rgb);
    float gy = luma(texture2D(uPortrait, cuv + vec2(0.0, o.y)).rgb) - luma(texture2D(uPortrait, cuv - vec2(0.0, o.y)).rgb);
    l = max(l, smoothstep(0.08, 0.45, length(vec2(gx, gy))) * 0.85);

    float reveal = smoothstep(0.0, 1.0, texture2D(uTrail, cuv).r);

    // Build-in: cells resolve top → bottom with jitter.
    float h = hash(cell);
    float order = h * 0.35 + (1.0 - cuv.y) * 0.65;
    float appear = smoothstep(order, order + 0.08, uIntro * 1.08);

    float maxG = uGlyphs - 1.0;
    float g = floor(mix(1.0, maxG, l) + 0.5);
    float tick = floor(uTime * 14.0);
    float front = step(0.06, reveal) * (1.0 - step(0.3, reveal));
    float building = step(0.001, appear) * (1.0 - step(0.999, appear));
    if (max(front, building) > 0.5 && hash(cell + tick) > 0.75) {
      g = 1.0 + floor(hash(cell * 1.7 + tick) * maxG);
    }
    g = clamp(g, 1.0, maxG);
    vec2 local = fract(px / uCell);
    float glyph = texture2D(uAtlas, vec2((g + local.x) / uGlyphs, local.y)).r;

    // Base: the real colours, softened a touch and lightly cooled toward the
    // site palette. The cursor brings out the full, untinted photo.
    float lp = smoothstep(0.03, 0.95, luma(photo.rgb));
    vec3 duo = mix(uShadow, uHigh, lp);
    vec3 real = pow(photo.rgb, vec3(0.9)) * 1.12;
    vec3 base = mix(mix(duo, real, 0.85), real, reveal);

    // Characters carve the image: brighter inside glyphs, dimmer between.
    float carve = mix(0.68, 1.12, glyph);
    vec3 col = base * carve;

    // Running colour light: two iridescent bands sweep through the portrait
    // and light up the characters they cross, plus a slow shimmer between.
    // Three staggered bands, so one is always crossing the face.
    float b1 = band(uv, vec2(1.0, 0.55), 0.09, 0.0, 0.24);
    float b2 = band(uv, vec2(-0.6, 1.0), 0.09, 0.33, 0.26);
    float b3 = band(uv, vec2(0.25, 1.0), 0.09, 0.66, 0.22);
    vec3 hue1 = iridescent(uv.y * 0.7 + uTime * 0.07);
    vec3 hue2 = iridescent(uv.x * 0.7 - uTime * 0.06 + 0.33);
    vec3 hue3 = iridescent((uv.x + uv.y) * 0.5 + uTime * 0.05 + 0.66);
    float shimmer = 0.2 + 0.12 * sin(uTime * 1.1 + (uv.x + uv.y) * 7.0);
    // Where a band passes, the characters take on its colour (tint, not add,
    // so it stays saturated on bright skin); a gentle shimmer elsewhere.
    float bandSum = clamp(b1 + b2 * 0.9 + b3 * 0.9, 0.0, 1.0);
    vec3 bandHue = (hue1 * b1 + hue2 * b2 * 0.9 + hue3 * b3 * 0.9) / max(b1 + b2 * 0.9 + b3 * 0.9, 1e-3);
    vec3 glow = bandHue * (0.55 + 0.75 * lp);
    float k = glyph * (1.0 - reveal * 0.8);
    col = mix(col, glow * 1.5, k * bandSum);
    col += iridescent(uv.y + uTime * 0.04) * shimmer * 0.35 * k;
    // A soft wash of the band colour between the characters too.
    col += bandHue * bandSum * 0.1;

    // Soft vignette: dissolve shoulders and sides so the face leads.
    float fade = smoothstep(0.18, 0.56, uv.y) * smoothstep(0.0, 0.14, uv.x) * smoothstep(1.0, 0.86, uv.x);
    float a = photo.a * fade * appear;

    gl_FragColor = vec4(col * a, a);
  }
`;
