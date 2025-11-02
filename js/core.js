import * as THREE from 'https://esm.sh/three@0.161.0';
import { OrbitControls } from 'https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls';

import { initUI, getValues } from './ui.js';
import { applyPhysics } from './physics.js';

// Your existing logic here


let scene, camera, renderer, sphere, material, analyser, dataArray, light, rotationSpeed = 0;
let audioReady = false;

// ---------- AUDIO SETUP ----------
async function initAudio() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const src = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    src.connect(analyser);
    audioReady = true;
    console.log("✅ Audio initialized");
  } catch (e) {
    console.warn("⚠️ Microphone unavailable — running visualizer fallback mode.");
    audioReady = false;
  }
}

// ---------- SCENE SETUP ----------
async function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const vertexShader = await fetch('./shaders/vertex.glsl', { cache: 'no-store' }).then(r => r.text());
  const fragmentShader = await fetch('./shaders/fragment.glsl', { cache: 'no-store' }).then(r => r.text());

  const geometry = new THREE.SphereGeometry(1, 128, 128);

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uColor: { value: new THREE.Color('#00aaff') },
      uOpacity: { value: 1.0 },
      uShininess: { value: 50.0 },
      uLightColor: { value: new THREE.Color('#ffffff') },
      uLightPos: { value: new THREE.Vector3(1, 1, 1) }
    }
  });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  light = new THREE.DirectionalLight('#ffffff', 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

// ---------- RENDER LOOP ----------
function animate(t = 0) {
  requestAnimationFrame(animate);

  let avg = 0;
  if (audioReady && analyser) {
    analyser.getByteFrequencyData(dataArray);
    avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
  }

  const {
    viscosity,
    elasticity,
    amplitude,
    lightIntensity,
    shininess,
    opacity,
    rotationSpeed: rs,
    sphereColor,
    lightColor,
    backgroundColor
  } = getValues();

  rotationSpeed = rs;
  light.intensity = lightIntensity;
  light.color.set(lightColor);
  material.uniforms.uColor.value.set(sphereColor);
  material.uniforms.uOpacity.value = opacity;
  material.uniforms.uShininess.value = shininess;
  renderer.setClearColor(backgroundColor);

  // Apply physics or fallback gentle motion
  if (audioReady) {
    applyPhysics(sphere.geometry, avg, viscosity, elasticity, amplitude);
  } else {
    const gentlePulse = (Math.sin(t * 0.001) + 1) * 0.02;
    applyPhysics(sphere.geometry, gentlePulse, 0.3, 0.5, 0.3);
  }

  sphere.rotation.y += rotationSpeed * 0.005;
  material.uniforms.uAudio.value = avg;
  material.uniforms.uTime.value = t * 0.001;

  renderer.render(scene, camera);
}

// ---------- START ----------
(async function start() {
  await initScene();
  await initAudio();
  initUI(light);
  animate();
})();
