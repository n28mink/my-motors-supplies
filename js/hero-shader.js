/* Vanilla-JS adaptation of MengTo/threeui "EmeraldHorizon" (MIT).
 * Raw Three.js fullscreen shader hero — no React needed. */

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAG = `
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_wave_scale;
uniform float u_variation;
uniform float u_glow;
uniform float u_vignette;
uniform vec3 u_color_a;
uniform vec3 u_color_b;
varying vec2 vUv;
float hash(float n) { return fract(sin(n) * 1e4); }
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float yPos = st.y;
  float wave1 = sin(st.x * 3.0 + u_time * 0.5) * 0.1 * u_wave_scale;
  float wave2 = sin(st.x * 5.0 - u_time * 0.3) * 0.05 * u_wave_scale;
  float combinedWave = wave1 + wave2;
  float intensity = smoothstep(0.4, -0.1, yPos + combinedWave);
  float variation = noise(st.x * 2.0 + u_time * 0.1) * 0.5 + 0.5;
  intensity *= variation * 1.5 * u_variation;
  vec3 color = vec3(0.015, 0.008, 0.002);
  vec3 finalGlow = mix(u_color_a, u_color_b, st.x + sin(u_time * 0.2) * 0.5);
  color += finalGlow * pow(intensity, 1.5) * 1.2 * u_glow;
  float vignette = mix(1.0, smoothstep(1.2, 0.5, length(st - vec2(0.5, 0.0))), u_vignette);
  color *= vignette;
  gl_FragColor = vec4(color, 1.0);
}
`;

const THEMES = {
  naranja: { a: [0.85, 0.3, 0.04], b: [1.0, 0.58, 0.12] },
  aurora: { a: [0.05, 0.8, 0.2], b: [0.0, 1.0, 0.5] },
};

window.initHeroShader = function(canvas, opts = {}) {
  const o = Object.assign(
    { speed: 1, waveScale: 1, variation: 1, glow: 1.15, vignette: 1, theme: "naranja" },
    opts
  );
  const host = canvas.parentElement;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return { setTheme() {}, dispose() {}, ok: false };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const t = THEMES[o.theme] || THEMES.naranja;
  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_wave_scale: { value: o.waveScale },
    u_variation: { value: o.variation },
    u_glow: { value: o.glow },
    u_vignette: { value: o.vignette },
    u_color_a: { value: new THREE.Vector3(...t.a) },
    u_color_b: { value: new THREE.Vector3(...t.b) },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    depthWrite: false,
    depthTest: false,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  let visible = true;
  const start = performance.now();

  const resize = () => {
    const r = host.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    uniforms.u_resolution.value.set(r.width, r.height);
  };
  const render = (now) => {
    uniforms.u_time.value = (now - start) * 0.001 * o.speed;
    renderer.render(scene, camera);
    frame = visible && !document.hidden && !reduced ? requestAnimationFrame(render) : 0;
  };
  const ro = new ResizeObserver(resize);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry ? entry.isIntersecting : true;
    if (visible && !frame) frame = requestAnimationFrame(render);
    if (!visible && frame) cancelAnimationFrame(frame), (frame = 0);
  });
  ro.observe(host);
  io.observe(host);
  resize();
  frame = requestAnimationFrame(render);

  return {
    ok: true,
    setTheme(name) {
      const th = THEMES[name];
      if (!th) return;
      uniforms.u_color_a.value.set(...th.a);
      uniforms.u_color_b.value.set(...th.b);
    },
    dispose() {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
