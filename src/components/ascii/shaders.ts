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

  // Duotone data portrait: a softened photo tinted graphite → pale teal,
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

    // Duotone base, real colour where revealed.
    float lp = smoothstep(0.03, 0.95, luma(photo.rgb));
    vec3 duo = mix(uShadow, uHigh, lp);
    vec3 real = pow(photo.rgb, vec3(0.95)) * 1.04;
    vec3 base = mix(duo, real, reveal);

    // Characters carve the image: brighter inside glyphs, dimmer between.
    float carve = mix(0.62, 1.12, glyph);
    vec3 col = base * carve;

    // Soft vignette: dissolve shoulders and sides so the face leads.
    float fade = smoothstep(0.18, 0.56, uv.y) * smoothstep(0.0, 0.14, uv.x) * smoothstep(1.0, 0.86, uv.x);
    float a = photo.a * fade * appear;

    gl_FragColor = vec4(col * a, a);
  }
`;
