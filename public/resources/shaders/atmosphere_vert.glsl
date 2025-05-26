varying vec2 vUvs;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float time;

float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

mat3 rotateX(float radians) {
    float s = sin(radians);
    float c = cos(radians);

    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, -s,
        0.0, s, c
    );
}

mat3 rotateY(float radians) {
    float s = sin(radians);
    float c = cos(radians);

    return mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
    );
}

mat3 rotateZ(float radians) {
    float s = sin(radians);
    float c = cos(radians);

    return mat3(
        c, -s, 0.0,
        s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

void main() {
    vec3 localPosition = position;

    // float t = sin(localPosition.y * 20.0 + time * 10.0);
    // t = remap(t, -1.0, 1.0, 0.0, 0.2);
    // localPosition += normal * t;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(localPosition, 1.0);
    vUvs = uv;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    // vNormal = normal;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    // vColor = mix(
    //     vec3(0.0, 0.0, 0.5),
    //     vec3(0.1, 0.5, 0.8),
    //     smoothstep(0.0, 0.2, t)
    // );
}