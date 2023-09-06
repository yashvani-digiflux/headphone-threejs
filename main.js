import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const loader = new GLTFLoader();
let headphone;

loader.load(
  "/dist/assets/headphone/headphonemodel.glb",
  function (gltf) {
    headphone = gltf.scene;
    scene.add(headphone);

    // Position and scale the model
    headphone.position.set(0, 0, 0);
    headphone.scale.set(25, 25, 25);

    animate();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100) + "% loaded";
  },
  function (error) {
    console.error(error);
  }
);
const group = new THREE.Group();
scene.add(group);

const labels = [];
const lines = [];

function createLabelAndLine(text, color, position, direction) {
  const labelCanvas = document.createElement("canvas");
  const context = labelCanvas.getContext("2d");
  context.font = "Bold 24px Arial";
  context.fillStyle = "white";
  context.fillText(text, 0, 24);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);

  const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
  const labelSprite = new THREE.Sprite(labelMaterial);
  labelSprite.scale.set(1.5, 1, 2);
  labelSprite.position.copy(position);
  group.add(labelSprite);
  labels.push(labelSprite);

  const lineGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    1.8,
    0,
    1.3,
    direction.x,
    direction.y,
    direction.z,
  ]);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  group.add(line);
  lines.push(line);

  labelSprite.onClick = () => {
    line.visible = !line.visible; // Toggle line visibility on label click
  };
}
createLabelAndLine(
  "Speaker",
  0xffffffff,
  new THREE.Vector3(1.5, 2.4, 1),
  new THREE.Vector3(0, 10, 0)
);

function updateLinePositions() {
  lines.forEach((line, index) => {
    const labelPosition = labels[index].position;
    line.geometry.attributes.position.array[3] = labelPosition.x;
    line.geometry.attributes.position.array[4] = labelPosition.y;
    line.geometry.attributes.position.array[5] = labelPosition.z;
    line.geometry.attributes.position.needsUpdate = true;
  });
}

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(1, 1, 3);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const torus = new THREE.Mesh(headphone, material);

scene.add(torus);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;
function animate() {
  requestAnimationFrame(animate);
  updateLinePositions();

  renderer.render(scene, camera);
}

animate();
