varying vec2 vUvs;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

uniform float time;
uniform samplerCube specMap;

float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

void main() {
    vec3 baseColor = vColor; // vec3(0.5);
    vec3 lighting = vec3(0.0);
    // vec3 normal = normalize(vNormal); // Must be done due to barycentric interp.
    vec3 normal = normalize(
        cross(
            dFdx(vPosition.xyz),
            dFdy(vPosition.xyz)
        )
    );
    // cameraPosition comes from 3js
    vec3 viewDir = normalize(cameraPosition - vPosition);

    // Ambient
    vec3 ambient = vec3(0.5);

    // Hemi light
    vec3 skyColor = vec3(0.0, 0.3, 0.6);
    vec3 groundColor = vec3(0.6, 0.3, 0.1);

    float hemiMix = remap(normal.y, -1.0, 1.0, 0.0, 1.0);
    vec3 hemi = mix(groundColor, skyColor, hemiMix);

    // Diffuse lighting
    vec3 lightDir = normalize(vec3(1.0));
    vec3 lightColor = vec3(1.0, 1.0, 0.9);
    float dp = max(0.0, dot(lightDir, normal));

    vec3 diffuse = dp * lightColor;

    // Phong specular
    vec3 r = normalize(reflect(-lightDir, normal));
    float phongValue = max(0.0, dot(viewDir, r));
    phongValue = pow(phongValue, 32.0);

    vec3 specular = vec3(phongValue);

    // IBL specular
    vec3 iblCoord = normalize(reflect(-viewDir, normal));
    vec3 iblSample = textureCube(specMap, iblCoord).xyz;

    specular += iblSample * 0.5;

    // Fresnel
    float fresnel = 1.0 - max(0.0,dot(viewDir, normal));
    fresnel = pow(fresnel, 2.0);

    specular *= fresnel;

    lighting = ambient*0.1 + hemi*0.0 + diffuse*0.9;

    vec3 color = baseColor * lighting + specular;
    color = pow(color, vec3(1.0/2.2)); // gamma approx. for linear -> sRGB

    gl_FragColor = vec4(color, 1.0);
}