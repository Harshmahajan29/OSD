/** GLSL for the hero fog. Layered value-noise (fbm) with a warm moon glow. */

export const VERTEX = /* glsl */ `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

export const FRAGMENT = /* glsl */ `
precision mediump float;
uniform vec2 r;   // canvas size in px
uniform float t;  // time in seconds
uniform vec2 m;   // pointer position, 0..1 (y up)

float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r;
  float asp = r.x / r.y;
  vec2 p = vec2(uv.x * asp, uv.y) * 2.2;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.03)), fbm(p + vec2(5.2, 1.3) - t * 0.02));
  float f = fbm(p + 1.6 * q + vec2(t * 0.05, t * 0.012));

  float low = smoothstep(0.72, 0.0, uv.y);
  float wisps = smoothstep(0.45, 0.85, f) * 0.55;
  float a = clamp(f * f * low * 1.5 + wisps * (0.35 + low), 0.0, 0.78);

  // part the fog around the pointer
  vec2 d = vec2((uv.x - m.x) * asp, uv.y - m.y);
  a *= mix(0.25, 1.0, smoothstep(0.0, 0.32, length(d)));

  vec3 c = mix(vec3(0.32, 0.2, 0.55), vec3(0.86, 0.78, 1.0), f);
  vec2 mo = vec2((uv.x - 0.74) * asp, uv.y - 0.6);
  float g = exp(-length(mo) * 2.6);
  c = mix(c, vec3(1.0, 0.72, 0.38), g * 0.55);
  vec3 glow = vec3(1.0, 0.55, 0.18) * g * 0.16;

  gl_FragColor = vec4(c * a + glow, a + glow.r * 0.4);
}
`;
