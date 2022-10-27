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
  LineBasicMaterial,
  Line,
  HemisphereLight,
  LineDashedMaterial,
  SphereGeometry,
} from "three";

import CameraControls from "camera-controls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { IFCLoader } from "web-ifc-three/IFCLoader";

import { IfcViewerAPI } from "web-ifc-viewer";
import { IfcGrid } from "web-ifc-viewer/dist/components";

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

// CREATE INFOS ON TOP OF 3D WINDOW
const iframeLabel = document.createElement("span");
iframeLabel.textContent = "3D";
iframeLabel.classList.add("iframe-label");
document.body.prepend(iframeLabel);

const iframeCommands = document.createElement("p");
iframeCommands.textContent =
  "Clic gauche: orbite 3D - Clic droit: déplacement latéral - Molette: zoom";
iframeCommands.classList.add("iframe-commands");
document.body.append(iframeCommands);

//DEFINE CURRENT PAGE
const currentUrl = window.location.href;
const currentPage = currentUrl.substring(currentUrl.lastIndexOf("ifc") + 4);

//THREEJS AND IFC WIT -> 3D window = canvas with id = "three-canvas"

if (
  currentPage === "2-intro/index.html" ||
  currentPage === "2-modificateurs/index.html" ||
  currentPage === "3-gis-bim/index.html"
) {
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
  axes.setColors(0x00ff00, 0x0000ff, 0xff0000);
  axes.material.depthTest = false;
  axes.rotateY(Math.PI / 2);
  scene.add(axes);

  // Controls
  CameraControls.install({ THREE: subsetOfTHREE });
  const clock = new Clock();
  const cameraControls = new CameraControls(camera, threeCanvas);

  // GLTF COTES
  if (
    currentPage === "2-intro/index.html" ||
    currentPage === "2-modificateurs/index.html"
  ) {
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
  }

  if (currentPage === "3-gis-bim/index.html") {
    scene.background = new Color(0x222222);
    scene.remove(grid);
    scene.remove(axes);

    //const ambientLight = new AmbientLight( 0xffffff, 0.1 ); // soft white light
    //scene.add( ambientLight );

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./model.glb", function (gltf) {
      const model = gltf.scene;
      model.traverse(function (child) {
        if (child instanceof Line) {
          child.material.depthTest = false;
          child.renderOrder = 2;

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
  }

  /*
  // IFC WIT
  if (currentPage === "[no pages is WIT for now]/index.html") {
    async function loadIfc() {
      const ifcLoader = new IFCLoader();
      const model = await ifcLoader.loadAsync("./model.ifc");
      scene.add(model);
    }

    loadIfc();
  }
  */

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
}

// IFC WIV -> 3D window = div with id = "viewer-container"

if (
  currentPage === "5-wall-s1/index.html" ||
  currentPage === "5-wall-01-w1/index.html" ||
  currentPage === "5-wall-01-w5/index.html" ||
  currentPage === "5-slab/index.html"||
  currentPage === "5-column/index.html"
) {
  const container = document.getElementById("viewer-container");
  const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0x3b3b3b),
  });

  // SET WASM PATH
  viewer.IFC.setWasmPath("./wasm-0-0-35/");

  // Create grid and axes
  viewer.grid.setGrid();

  /*
  // Create IfcGrid. Not yet support in Ifc.js -> import as gltf
  const ifcGridLoader = new GLTFLoader();
  ifcGridLoader.load("../5-grid/IfcGrid.glb", function (gltf) {
    const model = gltf.scene;
    model.traverse(function (child) {
      if (child instanceof Line) {
        const ifcGridAxisName = child.name;
        const ifcGridAxisShortName = ifcGridAxisName.substring(
          ifcGridAxisName.lastIndexOf("IfcGridAxis") + 11
        );
        const firstLabel = document.createElement("span");
        firstLabel.textContent = ifcGridAxisShortName;
        const ifcGridAxisFirstLabel = new CSS2DObject(firstLabel);
        ifcGridAxisFirstLabel.position.set(
          child.geometry.attributes.position.array[0],
          child.geometry.attributes.position.array[1],
          child.geometry.attributes.position.array[2]
        );
        viewer.context.getScene().add(ifcGridAxisFirstLabel);
        const secondLabel = document.createElement("span");
        secondLabel.textContent = ifcGridAxisShortName;
        const ifcGridAxisSecondLabel = new CSS2DObject(secondLabel);
        ifcGridAxisSecondLabel.position.set(
          child.geometry.attributes.position.array[3],
          child.geometry.attributes.position.array[4],
          child.geometry.attributes.position.array[5]
        );
        viewer.context.getScene().add(ifcGridAxisSecondLabel);
      }
    });
    viewer.context.getScene().add(model);
  });
  */

  // Camera
  const ifcCamera = viewer.context.getIfcCamera();
  //ifcCamera.cameraControls.setPosition( 5, 15, 15 );
  ifcCamera.cameraControls.setLookAt(4, 12, 8, 15, 0, -6);

  async function loadIfc(url) {
    // Load the model
    const model = await viewer.IFC.loadIfcUrl(url);

    // Add dropped shadow and post-processing effect
    await viewer.shadowDropper.renderShadow(model.modelID);
    //viewer.context.renderer.postProduction.active = true;
  }

  loadIfc("./model.ifc");

  window.ondblclick = async () => await viewer.IFC.selector.pickIfcItem();
  window.onmousemove = async () => await viewer.IFC.selector.prePickIfcItem();

  // ADD GLB DIMENSIONS
  if (
    currentPage === "5-wall-01-w5/index.html" ||
    currentPage === "5-slab/index.html"||
    currentPage === "5-column/index.html"
  ) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./dimensions.glb", function (gltf) {
      const model = gltf.scene;
      model.traverse(function (child) {
        if (child instanceof Line) {
          child.material.depthTest = false;
          child.renderOrder = 2;

          const coteValue = child.name;

          const cote = document.createElement("span");
          const coteReplace1 = coteValue.replace("_", " ");
          const coteReplace2 = coteReplace1.replace(",", ".");
          cote.textContent = coteReplace2;

          cote.className = "cote";

          const coteLabel = new CSS2DObject(cote);
          coteLabel.position.set(
            child.position.x,
            child.position.y,
            child.position.z
          );
          viewer.context.getScene().add(coteLabel);
        }
      });
      viewer.context.getScene().add(model);
    });
  }
}
