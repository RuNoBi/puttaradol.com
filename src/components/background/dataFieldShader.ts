// Background shaders. Both are a single full-screen pass and deliberately
// cheap (2–3 noise lookups per pixel) so they stay at 60fps on laptops.
//
//  • "contour" (default) — a slowly shifting topographic map of the data
//    "terrain". The cursor raises a hill (contours wrap around it and light
//    up), clicks send a ripple through the lines.

export const dataFieldVert = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// 3D simplex noise — Ian McEwan / Ashima Arts (MIT).
const simplex = /* glsl */ `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
      i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
      i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const common = /* glsl */ `
  precision highp float;
  uniform vec2  uRes;      // drawing buffer px
  uniform float uScale;    // drawing buffer px per CSS px
  uniform float uTime;
  uniform float uIntro;    // 0 → ~1.2
  uniform float uScroll;   // CSS px
  uniform vec2  uMouse;    // CSS px, gl coords (y up)
  uniform float uMouseOn;  // 0..1, eased
  uniform vec3  uClick;    // x, y (CSS px), seconds since click (<0 = none)
  uniform vec3  uBg;
  uniform vec3  uLine;
  uniform vec3  uAccent;
  uniform float uVis;      // 1 in the hero, fades to 0 as you scroll on

  float hash21(vec2 p) {
    p = fract(p * vec2(233.34, 851.73));
    p += dot(p, p + 23.45);
    return fract(p.x * p.y);
  }
  ${simplex}
`;

export const contourFrag = /* glsl */ `
  ${common}

  void main() {
    vec2 px = gl_FragCoord.xy / uScale;          // CSS px
    vec2 res = uRes / uScale;

    // Terrain height: two octaves of slowly evolving noise.
    vec2 p = vec2(px.x, px.y - uScroll * 0.25) / 620.0;
    float t = uTime * 0.03;
    float h = snoise(vec3(p, t)) * 0.72 + snoise(vec3(p * 2.3 + 11.7, t * 1.7)) * 0.28;

    // Cursor raises a hill; clicks send a ring outward.
    vec2 dm = px - uMouse;
    float d2 = dot(dm, dm);
    float hill = exp(-d2 / (240.0 * 240.0)) * uMouseOn;
    h += hill * 0.6;

    float ripple = 0.0;
    if (uClick.z >= 0.0) {
      float rd = length(px - uClick.xy) - uClick.z * 650.0;
      ripple = exp(-rd * rd / (50.0 * 50.0)) * exp(-uClick.z * 1.5);
      h += ripple * 0.22;
    }

    // Anti-aliased contour lines with constant ~1px width.
    float bands = h * 8.0;
    float fw = max(fwidth(bands), 1e-4);
    float dist = abs(fract(bands - 0.5) - 0.5) / fw;
    float line = 1.0 - smoothstep(0.0, 1.1, dist);
    float idx = floor(bands + 0.5);
    float major = 1.0 - step(0.5, abs(mod(idx, 4.0)));  // every 4th line is an index line

    // Build-in: lines draw outward from the centre.
    float fromCentre = length(px - res * 0.5) / length(res * 0.5);
    float appear = smoothstep(fromCentre - 0.25, fromCentre, uIntro);

    float near = exp(-d2 / (300.0 * 300.0)) * uMouseOn;
    float alpha = (mix(0.07, 0.13, major) + near * 0.35 + ripple * 0.45) * line * appear;
    vec3 lineCol = mix(uLine, uAccent, clamp(near * 1.2 + ripple, 0.0, 1.0));

    vec3 col = uBg;
    // A faint wash of accent on the "peaks" and under the cursor.
    col = mix(col, uAccent, (0.025 * smoothstep(0.3, 0.95, h) + 0.03 * near) * appear);
    col = mix(col, lineCol, alpha);
    col += (hash21(gl_FragCoord.xy + fract(uTime * 7.0) * 100.0) - 0.5) * 0.012;

    col = mix(uBg, col, uVis);
    gl_FragColor = vec4(col, 1.0);
  }
`;
