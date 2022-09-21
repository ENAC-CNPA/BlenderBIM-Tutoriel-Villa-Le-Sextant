import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils,
  Clock,
  Color,
  AmbientLight,
  DirectionalLight,
  GridHelper,
  AxesHelper,
} from "three";
import CameraControls from "camera-controls";

const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

import { IFCLoader } from "web-ifc-three/IFCLoader";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { LineBasicMaterial } from "three";
import { Line } from "three";

// CREATE A 3D LABEL AND COMMANDS
const iframeLabel = document.createElement('span');
iframeLabel.textContent = '3D';
iframeLabel.classList.add('iframe-label');
document.body.prepend(iframeLabel);

const iframeCommands = document.createElement('p');
iframeCommands.textContent = 'Clic gauche: orbite 3D - Clic droit: déplacement latéral - Molette: zoom';
iframeCommands.classList.add('iframe-commands');
document.body.append(iframeCommands);

//Creates the Three.js scene
const scene = new Scene();
scene.background = new Color(0x3b3b3b);

//Object to store the size of the viewport
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(50, size.width / size.height);
camera.position.x = 2;
camera.position.z = 1;
camera.position.y = 1;
scene.add(camera);

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.3);
scene.add(ambientLight);

const cameraLight = new DirectionalLight(lightColor, 0.7);
cameraLight.position.set(0, 0, 0);
camera.add(cameraLight);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene
const grid = new GridHelper(10, 10, 0x555555, 0x555555);
scene.add(grid);

const axes = new AxesHelper(5);
axes.setColors(0xff0000, 0x0000ff, 0x00ff00);
axes.material.depthTest = false;
scene.add(axes);

// Controls
CameraControls.install({ THREE: subsetOfTHREE });
const clock = new Clock();
const cameraControls = new CameraControls(camera, threeCanvas);

// 2D Renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.pointerEvents = "none";
labelRenderer.domElement.style.top = "0";
document.body.appendChild(labelRenderer.domElement);

// Set up resize event

window.addEventListener("resize", () => {
  camera.aspect = threeCanvas.clientWidth / threeCanvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight, false);
  labelRenderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
});

// Animation

function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();



// GLTF COTES

const material = new LineBasicMaterial({ color: 0xffffff });

const gltfLoader = new GLTFLoader();
gltfLoader.load("./model.glb", function (gltf) {
  const model = gltf.scene;
  model.traverse(function (child) {
    if (child instanceof Line) {
      child.material = material;

      const coteValue = child.name;

      const cote = document.createElement("span");
      cote.textContent = coteValue.replace("_", " ");
      cote.className = "cote";

      const coteLabel = new CSS2DObject(cote);
      coteLabel.position.set(
        child.position.x,
        child.position.y,
        child.position.z
      );
      scene.add(coteLabel);
    }
  });
  scene.add(model);
});



// IFC
async function loadIfc() {
  const ifcLoader = new IFCLoader();
  const model = await ifcLoader.loadAsync("./model.ifc");
  scene.add(model);
}

loadIfc();