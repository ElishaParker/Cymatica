let values = {
  intensity: 0.0,
  shininess: 0.0,
  opacity: 0.0,
  rotationSpeed: 0.0
};

export function initUI(updateCallback) {
  const panel = document.createElement('div');
  panel.style.position = 'absolute';
  panel.style.top = '10px';
  panel.style.left = '10px';
  panel.style.padding = '12px';
  panel.style.background = 'rgba(255,255,255,0.1)';
  panel.style.border = '1px solid #aaa';
  panel.style.borderRadius = '8px';
  panel.style.backdropFilter = 'blur(8px)';
  panel.style.color = '#fff';
  panel.style.zIndex = 1000;

  const sliderDefs = [
    { key: 'intensity', label: 'Light Intensity' },
    { key: 'shininess', label: 'Shininess' },
    { key: 'opacity', label: 'Opacity' },
    { key: 'rotationSpeed', label: 'Rotation Speed' }
  ];

  sliderDefs.forEach(({ key, label }) => {
    const container = document.createElement('div');
    container.innerHTML = `<label>${label}</label><br>`;
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = 0;
    slider.oninput = () => {
      values[key] = parseFloat(slider.value);
      updateCallback(values);
    };
    container.appendChild(slider);
    panel.appendChild(container);
  });

  document.body.appendChild(panel);
}

export function getValues() {
  return values;
}
