import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import { initUI, getValues } from './ui.js';
import { applyPhysics } from './physics.js';

let scene, camera, renderer, sphere, material, analyser, dataArray, light, rotationSpeed = 0;

async function initAudio() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const src = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  src.connect(analyser);
}

async function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 128, 128);
  const vertexShader = await fetch('./shaders/vertex.glsl').then(r => r.text());
  const fragmentShader = await fetch('./shaders/fragment.glsl').then(r => r.text());

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

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  if (!analyser) return;
  analyser.getByteFrequencyData(dataArray);

  const avg = dataArray.reduce((a, b) => a + b) / dataArray.length / 255;
  const { viscosity, elasticity, amplitude, lightIntensity, shininess, opacity, rotationSpeed: rs, sphereColor, lightColor, backgroundColor } = getValues();

  rotationSpeed = rs;
  light.intensity = lightIntensity;
  light.color.set(lightColor);
  material.uniforms.uColor.value.set(sphereColor);
  material.uniforms.uOpacity.value = opacity;
  material.uniforms.uShininess.value = shininess;
  renderer.setClearColor(backgroundColor);

  applyPhysics(sphere.geometry, avg, viscosity, elasticity, amplitude);

  sphere.rotation.y += rotationSpeed * 0.005;
  material.uniforms.uAudio.value = avg;
  material.uniforms.uTime.value = t * 0.001;
  renderer.render(scene, camera);
}

(async function start() {
  await initScene();
  await initAudio();
  initUI(light);
  animate();
})();
