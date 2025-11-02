uniform float uTime;
uniform float uAudio;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
  vNormal = normal;
  vPos = position + normal * uAudio * 0.2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
}
