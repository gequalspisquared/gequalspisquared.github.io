import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

class App {
  constructor() {}

  async init() {
    this.threejs_ = new THREE.WebGLRenderer({ antialias: true });
    // this.threejs_.setPixelRatio(window.devicePixelRatio * 1.5); // AA
    document.body.appendChild(this.threejs_.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize_();
      },
      false
    );

    this.scene_ = new THREE.Scene();

    this.camera_ = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000.0
    );
    this.camera_.position.set(1, 0, 3);

    const controls = new OrbitControls(this.camera_, this.threejs_.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const cubemapLoader = new THREE.CubeTextureLoader();
    // const texture = cubemapLoader.load([
    //   "./resources/images/cubemap/Cold_Sunset/Cold_Sunset__Cam_2_Left+X.png",
    //   "./resources/images/cubemap/Cold_Sunset/Cold_Sunset__Cam_3_Right-X.png",
    //   "./resources/images/cubemap/Cold_Sunset/Cold_Sunset__Cam_4_Up+Y.png",
    //   "./resources/images/cubemap/Cold_Sunset/Cold_Sunset__Cam_5_Down-Y.png",
    //   "./resources/images/cubemap/Cold_Sunset/Cold_Sunset__Cam_0_Front+Z.png",
    //   "./resources/images/cubemap/Cold_Sunset/Cold_Sunset__Cam_1_Back-Z.png",
    // ]);
    const texture = cubemapLoader.load([
      "./resources/images/cubemap/MilkyWay/GalaxyTex_PositiveX.png",
      "./resources/images/cubemap/MilkyWay/GalaxyTex_NegativeX.png",
      "./resources/images/cubemap/MilkyWay/GalaxyTex_NegativeY.png",
      "./resources/images/cubemap/MilkyWay/GalaxyTex_PositiveY.png",
      "./resources/images/cubemap/MilkyWay/GalaxyTex_PositiveZ.png",
      "./resources/images/cubemap/MilkyWay/GalaxyTex_NegativeZ.png",
    ]);

    this.scene_.background = texture;

    await this.setupProject_();

    this.previousRAF_ = null;
    this.onWindowResize_();
    this.raf_();
  }

  async setupProject_() {
    const vert_shader = await fetch("./resources/shaders/vert.glsl");
    const frag_shader = await fetch("./resources/shaders/frag.glsl");
    const atmosphere_vert_shader = await fetch(
      "./resources/shaders/atmosphere_vert.glsl"
    );
    const atmosphere_frag_shader = await fetch(
      "./resources/shaders/atmosphere_frag.glsl"
    );

    const loader = new THREE.TextureLoader();
    const quincyTexture = loader.load("./resources/images/quincy.jpg");
    const earth2kTexture = loader.load("./resources/images/earth2k.jpg");
    const earthNormal8k = loader.load("./resources/images/earthNormal8k.png");
    // const overlayTexture = loader.load("./resources/images/overlay.png");

    const material = new THREE.ShaderMaterial({
      uniforms: {
        // diffuse: { value: quincyTexture },
        // resolution: {
        //   value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        // },
        time: { value: 0.0 },
        specMap: { value: this.scene_.background },
        diffuse: { value: earth2kTexture },
        normalMap: { value: earthNormal8k },
      },
      vertexShader: await vert_shader.text(),
      fragmentShader: await frag_shader.text(),
    });
    material.App;

    this.material_ = material;

    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: await atmosphere_vert_shader.text(),
      fragmentShader: await atmosphere_frag_shader.text(),
    });
    // atmosphereMaterial.opacity = 0.5;
    atmosphereMaterial.transparent = true;

    // const geometry = new THREE.PlaneGeometry(1, 1);

    // const plane = new THREE.Mesh(geometry, material);
    // plane.position.set(0.5, 0.5, 0);
    // this.scene_.add(plane);

    // const gltfLoader = new GLTFLoader();
    // gltfLoader.setPath("/resources/models/");
    // gltfLoader.load("suzanne.glb", (gltf) => {
    //   gltf.scene.traverse((c) => {
    //     c.material = material;
    //   });
    //   this.scene_.add(gltf.scene);
    // });

    const geometry = new THREE.SphereGeometry(1, 128, 128);
    geometry.computeTangents(); // Compute tangents for normal map
    const mesh = new THREE.Mesh(geometry, material);
    this.scene_.add(mesh);

    const atmosphereGeometry = new THREE.SphereGeometry(1.1, 128, 128);
    const atmosphereMesh = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    this.scene_.add(atmosphereMesh);

    /*
    const geometry = new THREE.BoxGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    this.scene_.add(mesh);
    */

    this.totalTime_ = 0.0;
  }

  onWindowResize_() {
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
    // this.material_.uniforms.resolution.value = new THREE.Vector2(
    //   window.innerWidth,
    //   window.innerHeight
    // );
    this.camera_.aspect = window.innerWidth / window.innerHeight;
  }

  raf_() {
    requestAnimationFrame((t) => {
      if (this.previousRAF_ === null) {
        this.previousRAF_ = t;
      }

      this.step_(t - this.previousRAF_);
      this.threejs_.render(this.scene_, this.camera_);
      this.raf_();
      this.previousRAF_ = t;
    });
  }

  step_(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    this.totalTime_ += timeElapsedS;
    this.material_.uniforms.time.value = this.totalTime_;
  }
}

export { App };
