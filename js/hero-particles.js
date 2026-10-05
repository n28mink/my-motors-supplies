/* My motors Supplies — hero de partículas (globo ↔ foto).
 * Adaptado del demo de Motion/Three.js: sin dependencias externas,
 * con motor de resortes propio, WebGPU con fallback a la foto estática.
 */
import * as THREE from "./vendor/three.webgpu.js";
import {
  attribute,
  cos,
  mix,
  positionLocal,
  sin,
  time,
  uniform,
  vec3,
} from "./vendor/three.tsl.js";

const MMS_PHOTOS = [
  "img/hero.jpg",
  "img/p04.jpg",
  "img/p13.jpg",
  "img/p23.jpg",
  "img/p25.jpg",
];

function pickPhoto() {
  let prev = null;
  try { prev = sessionStorage.getItem("mms-particle-photo"); } catch (e) { /* noop */ }
  const choices = MMS_PHOTOS.filter((p) => p !== prev);
  const url = choices[Math.floor(Math.random() * choices.length)];
  try { sessionStorage.setItem("mms-particle-photo", url); } catch (e) { /* noop */ }
  return url;
}

/* ── Mini motor de resortes (reemplaza a motion) ── */
function makeSpring(initial) {
  const s = {
    value: initial, velocity: 0,
    target: initial, stiffness: 55, damping: 16, mass: 1,
    delayUntil: 0,
    to(target, { stiffness, damping, mass, delay = 0 }) {
      s.target = target; s.stiffness = stiffness; s.damping = damping; s.mass = mass;
      s.delayUntil = performance.now() + delay * 1000;
    },
    step(now, dt) {
      if (now < s.delayUntil) return;
      const F = -s.stiffness * (s.value - s.target) - s.damping * s.velocity;
      s.velocity += (F / s.mass) * dt;
      s.value += s.velocity * dt;
    },
  };
  return s;
}

function highResolutionMix(globeAmount) {
  const amount = Math.max(globeAmount, 0);
  const start = 0.005, end = 0.035;
  const t = Math.min(1, Math.max(0, (amount - start) / (end - start)));
  return 1 - t * t * (3 - 2 * t);
}

function loadPhoto(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const source = document.createElement("canvas");
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const context = source.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const map = new THREE.Texture(image);
      map.colorSpace = THREE.SRGBColorSpace;
      map.needsUpdate = true;
      resolve({
        width: source.width,
        height: source.height,
        pixels: context.getImageData(0, 0, source.width, source.height).data,
        map,
      });
    };
    image.onerror = () => reject(new Error("No se pudo cargar la foto"));
    image.src = url;
  });
}

function createParticles(photo, columns) {
  const imageAspect = photo.width / photo.height;
  const rows = Math.round(columns / imageAspect);
  const count = columns * rows;
  const imagePositions = new Float32Array(count * 3);
  const globePositions = new Float32Array(count * 3);
  const colours = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const colour = new THREE.Color();

  for (let index = 0; index < count; index++) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const sampleX = Math.min(photo.width - 1, Math.floor(((column + 0.5) / columns) * photo.width));
    const sampleY = Math.min(photo.height - 1, Math.floor(((row + 0.5) / rows) * photo.height));
    const pixel = (sampleY * photo.width + sampleX) * 4;
    const offset = index * 3;
    colour.setRGB(
      photo.pixels[pixel] / 255,
      photo.pixels[pixel + 1] / 255,
      photo.pixels[pixel + 2] / 255,
      THREE.SRGBColorSpace
    );
    colours[offset] = colour.r;
    colours[offset + 1] = colour.g;
    colours[offset + 2] = colour.b;
    phases[index] = Math.random() * Math.PI * 2;
    speeds[index] = 0.7 + Math.random() * 0.35;
  }

  const geometry = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1));
  geometry.instanceCount = count;
  geometry.setAttribute("imagePosition", new THREE.InstancedBufferAttribute(imagePositions, 3));
  geometry.setAttribute("globePosition", new THREE.InstancedBufferAttribute(globePositions, 3));
  geometry.setAttribute("colour", new THREE.InstancedBufferAttribute(colours, 3));
  geometry.setAttribute("phase", new THREE.InstancedBufferAttribute(phases, 1));
  geometry.setAttribute("speed", new THREE.InstancedBufferAttribute(speeds, 1));

  const imagePosition = attribute("imagePosition");
  const spherePosition = attribute("globePosition");
  const phase = attribute("phase");
  const speed = attribute("speed");
  const particleSize = uniform(new THREE.Vector2(0.01, 0.01));
  const turbulence = vec3(
    sin(time.mul(speed.add(0.6)).add(phase)).mul(0.045),
    cos(time.mul(speed.add(0.37)).add(phase.mul(1.71))).mul(0.035),
    sin(time.mul(speed.add(0.22)).add(phase.mul(2.13))).mul(0.045)
  );
  const material = new THREE.MeshBasicNodeMaterial({ toneMapped: false });
  material.colorNode = attribute("colour");
  const globeUniform = uniform(1);
  const particleCenter = mix(imagePosition, spherePosition.add(turbulence), globeUniform);
  material.positionNode = particleCenter.add(vec3(positionLocal.xy.mul(particleSize), 0));

  return { imageAspect, columns, rows, particleSize, globeUniform, object: new THREE.Mesh(geometry, material) };
}

function createPhotoOverlay(photo) {
  const photoMaterial = new THREE.MeshBasicMaterial({
    map: photo.map, toneMapped: false, transparent: true, depthWrite: false, depthTest: false, opacity: 0,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), photoMaterial);
  mesh.renderOrder = 1;
  return mesh;
}

function layoutParticles(particles, photoMesh, aspect, globeYaw) {
  const { columns, imageAspect, object, particleSize, rows } = particles;
  const imageHalfHeight = Math.min(0.72, (0.86 * aspect) / imageAspect);
  const imageHalfWidth = imageHalfHeight * imageAspect;
  const globeRadius = Math.min(0.58, aspect * 0.82);
  const position = object.geometry.getAttribute("imagePosition");
  const sphere = object.geometry.getAttribute("globePosition");
  const yawCos = Math.cos(globeYaw), yawSin = Math.sin(globeYaw), tilt = -0.28;

  for (let index = 0; index < position.count; index++) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = (column + 0.5) / columns;
    const y = (row + 0.5) / rows;
    const sphereY = 1 - (index / Math.max(position.count - 1, 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
    const angle = index * 2.39996323;
    const sphereX = Math.cos(angle) * ringRadius;
    const sphereZ = Math.sin(angle) * ringRadius;
    const spunX = sphereX * yawCos + sphereZ * yawSin;
    const spunZ = -sphereX * yawSin + sphereZ * yawCos;
    position.setXYZ(index, (x - 0.5) * imageHalfWidth * 2, (0.5 - y) * imageHalfHeight * 2, 0);
    sphere.setXYZ(
      index,
      spunX * globeRadius,
      (sphereY * Math.cos(tilt) - spunZ * Math.sin(tilt)) * globeRadius,
      (sphereY * Math.sin(tilt) + spunZ * Math.cos(tilt)) * globeRadius
    );
  }
  position.needsUpdate = true;
  sphere.needsUpdate = true;
  particleSize.value.set((imageHalfWidth * 2) / columns * 1.01, (imageHalfHeight * 2) / rows * 1.01);
  photoMesh.scale.set(imageHalfWidth * 2, imageHalfHeight * 2, 1);
}

export async function initParticleHero() {
  const stage = document.getElementById("particleStage");
  const canvas = document.getElementById("particleCanvas");
  const heroImg = document.getElementById("heroImg");
  if (!stage || !canvas) return false;

  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
  await renderer.init();
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const photo = await loadPhoto(pickPhoto());
  const smallScreen = matchMedia("(max-width: 860px)").matches;
  const particles = createParticles(photo, smallScreen ? 110 : 200);
  const photoMesh = createPhotoOverlay(photo);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  scene.background = new THREE.Color(0x141417);
  camera.position.z = 4;
  scene.add(particles.object);
  scene.add(photoMesh);

  const globeYaw = Math.random() * Math.PI * 2;
  const spring = makeSpring(1);

  const resize = () => {
    const width = Math.max(stage.clientWidth, 1);
    const height = Math.max(stage.clientHeight, 1);
    const aspect = width / height;
    renderer.setSize(width, height, false);
    camera.left = -aspect; camera.right = aspect;
    camera.top = 1; camera.bottom = -1;
    camera.updateProjectionMatrix();
    layoutParticles(particles, photoMesh, aspect, globeYaw);
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  // Foto → las partículas se asientan en la foto tras 0.8s
  spring.to(0, { stiffness: 55, damping: 16, mass: 1, delay: 0.8 });

  // Mantener presionado → globo
  const pressGlobe = () => spring.to(1, { stiffness: 120, damping: 18, mass: 0.9 });
  const releaseGlobe = () => spring.to(0, { stiffness: 70, damping: 16, mass: 1 });
  canvas.addEventListener("pointerdown", pressGlobe);
  canvas.addEventListener("pointerup", releaseGlobe);
  canvas.addEventListener("pointercancel", releaseGlobe);
  canvas.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); pressGlobe(); }
  });
  canvas.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") releaseGlobe();
  });

  let visible = true;
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(stage);

  let last = performance.now();
  const tick = (now) => {
    requestAnimationFrame(tick);
    if (!visible || document.hidden) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    spring.step(now, dt);
    particles.globeUniform.value = spring.value;
    photoMesh.material.opacity = highResolutionMix(spring.value);
    renderer.render(scene, camera);
  };
  requestAnimationFrame(tick);

  // Activo: ocultar la foto estática y mostrar el canvas
  stage.hidden = false;
  if (heroImg) heroImg.style.display = "none";
  canvas.dataset.ready = "true";
  return true;
}
