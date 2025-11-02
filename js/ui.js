export function initUI(light) {
  const minimizeBtn = document.getElementById('minimizeBtn');
  const panel = document.getElementById('controlPanel');

  minimizeBtn.addEventListener('click', () => {
    panel.classList.toggle('minimized');
  });

  // Touch interaction for trackball
  let dragging = false;
  document.addEventListener('mousedown', () => dragging = true);
  document.addEventListener('mouseup', () => dragging = false);
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const x = (e.clientX / window.innerWidth - 0.5) * Math.PI * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * Math.PI;
    light.position.set(Math.sin(x) * 2, Math.sin(y) * 2, Math.cos(x) * 2);
  });
}

export function getValues() {
  return {
    viscosity: parseFloat(document.getElementById('viscosity').value),
    elasticity: parseFloat(document.getElementById('elasticity').value),
    amplitude: parseFloat(document.getElementById('amplitude').value),
    lightIntensity: parseFloat(document.getElementById('lightIntensity').value),
    shininess: parseFloat(document.getElementById('shininess').value),
    opacity: parseFloat(document.getElementById('opacity').value),
    rotationSpeed: parseFloat(document.getElementById('rotationSpeed').value),
    sphereColor: document.getElementById('sphereColor').value,
    lightColor: document.getElementById('lightColor').value,
    backgroundColor: document.getElementById('backgroundColor').value,
  };
}
