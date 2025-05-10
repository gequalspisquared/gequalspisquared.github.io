import * as THREE from "three";

class App {
  constructor() {}

  async init() {
    this.threejs_ = new THREE.WebGLRenderer();
    document.body.appendChild(this.threejs_.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize_();
      },
      false
    );

    this.scene_ = new THREE.Scene();

    this.camera_ = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
    this.camera_.position.set(0, 0, 1);

    await this.setupProject_();

    this.previousRAF_ = null;
    this.onWindowResize_();
    this.raf_();
  }

  async setupProject_() {
    const vert_shader = await fetch("./resources/shaders/vert.glsl");
    const frag_shader = await fetch("./resources/shaders/frag.glsl");

    const loader = new THREE.TextureLoader();
    const quincyTexture = loader.load("./resources/images/quincy.jpg");
    // const overlayTexture = loader.load("./resources/images/overlay.png");

    const material = new THREE.ShaderMaterial({
      uniforms: {
        diffuse: { value: quincyTexture },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        time: { value: 0.0 },
      },
      vertexShader: await vert_shader.text(),
      fragmentShader: await frag_shader.text(),
    });
    this.material_ = material;

    const geometry = new THREE.PlaneGeometry(1, 1);

    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0.5, 0.5, 0);
    this.scene_.add(plane);

    this.totalTime_ = 0.0;
  }

  onWindowResize_() {
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
    this.material_.uniforms.resolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
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
