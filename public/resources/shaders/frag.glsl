varying vec2 vUvs;

uniform float time;
uniform sampler2D diffuse;

float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

void main() {
    vec3 color = vec3(0.0);

    float t = remap(sin(vUvs.y * 200.0 + time), -1.0, 1.0, 0.5, 0.75);

    vec4 diffuseSample = texture2D(diffuse, vUvs);
    color = mix(vec3(t), diffuseSample.xyz, 0.8);
    // color = vec3(t);

    gl_FragColor = vec4(color, 1.0);
}