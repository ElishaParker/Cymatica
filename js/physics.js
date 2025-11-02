export function applyPhysics(geometry, level, viscosity, elasticity, amplitude) {
  const pos = geometry.attributes.position;
  const arr = pos.array;

  for (let i = 0; i < arr.length; i += 3) {
    const nx = arr[i];
    const ny = arr[i + 1];
    const nz = arr[i + 2];
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    const displacement = 1 + Math.sin(len * 5 + level * 10) * amplitude * 0.1;
    arr[i] = nx / len * displacement;
    arr[i + 1] = ny / len * displacement;
    arr[i + 2] = nz / len * displacement;
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}
