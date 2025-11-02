import * as THREE from 'https://esm.sh/three@0.161.0';
import { OrbitControls } from 'https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls';

import { initUI, getValues } from './ui.js';
import { applyPhysics } from './physics.js';

let scene, camera, renderer, sphere, controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x44aa88,
    metalness: 0.3,
    roughness: 0.1,
    transparent: true,
    opacity: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.update();

  initUI(updateMaterial);

  animate();
}

function updateMaterial(values) {
  if (!sphere || !sphere.material) return;
  sphere.material.opacity = values.opacity;
  sphere.material.roughness = 1.0 - values.shininess;
  sphere.material.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  const { rotationSpeed } = getValues();
  sphere.rotation.y += rotationSpeed;
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
