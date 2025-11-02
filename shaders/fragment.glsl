uniform vec3 uColor;
uniform float uOpacity;
uniform float uShininess;
uniform vec3 uLightColor;
uniform vec3 uLightPos;
varying vec3 vNormal;
varying vec3 vPos;

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uLightPos - vPos);
  float diff = max(dot(N, L), 0.0);
  vec3 viewDir = normalize(-vPos);
  vec3 reflectDir = reflect(-L, N);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
  vec3 color = uColor * diff + uLightColor * spec;
  gl_FragColor = vec4(color, uOpacity);
}
