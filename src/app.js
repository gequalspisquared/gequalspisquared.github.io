import * as THREE from "https://cdn.skypack.dev/three@0.136";

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
    const vert_shader = await fetch("./../public/resources/shaders/vert.glsl");
    const frag_shader = await fetch("./../public/resources/shaders/frag.glsl");

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: await vert_shader.text(),
      fragmentShader: await frag_shader.text(),
    });

    const geometry = new THREE.PlaneGeometry(1, 1);

    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0.5, 0.5, 0);
    this.scene_.add(plane);
  }

  onWindowResize_() {
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  raf_() {
    requestAnimationFrame((t) => {
      this.threejs_.render(this.scene_, this.camera_);
      this.raf_();
    });
  }
}

export { App };
