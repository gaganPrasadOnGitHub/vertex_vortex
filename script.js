import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  FontLoader,
  RGBELoader,
  TextGeometry,
} from 'three/examples/jsm/Addons.js';

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', (event) => {
  (size.width = window.innerWidth),
    (size.height = window.innerHeight),
    (camera.aspect = size.width / size.height);
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = -(event.clientY / size.height - 0.5);
});

// canvas && scene
const canvas = document.querySelector('canvas#webgl');
const scene = new THREE.Scene();

// Environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/static/enviroment/sky.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// Axis helper
// const axisHelper = new THREE.AxesHelper();
// scene.add(axisHelper);

// Texture
const textureLoader = new THREE.TextureLoader();
const textTexture = textureLoader.load('/static/textures/q.png');
const pinkTexture = textureLoader.load('/static/textures/tri.jpeg');
const landTexture = textureLoader.load('/static/textures/land.png');
const soilTexture = textureLoader.load('/static/textures/soil.jpeg');
const minecraftTexture = textureLoader.load('/static/textures/diamond.png');

soilTexture.colorSpace = THREE.SRGBColorSpace;
landTexture.colorSpace = THREE.SRGBColorSpace;
pinkTexture.colorSpace = THREE.SRGBColorSpace;
textTexture.colorSpace = THREE.SRGBColorSpace;
minecraftTexture.colorSpace = THREE.SRGBColorSpace;

textTexture.magFilter = THREE.NearestFilter;
landTexture.magFilter = THREE.NearestFilter;
pinkTexture.magFilter = THREE.NearestFilter;
soilTexture.magFilter = THREE.NearestFilter;
minecraftTexture.magFilter = THREE.NearestFilter;

// geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const donutGeometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
const octaGeometry = new THREE.OctahedronGeometry(1, 0);
const triGeometry = new THREE.TetrahedronGeometry(1, 0);

// Material
const textMaterial = new THREE.MeshBasicMaterial({
  map: textTexture,
  color: '#0077B5',
});

const octaMaterial = new THREE.MeshBasicMaterial({ map: minecraftTexture });
const sphereMaterial = new THREE.MeshBasicMaterial({ map: soilTexture });
const donutMaterial = new THREE.MeshBasicMaterial({
  map: landTexture,
  wireframe: true,
});

const triMaterial = new THREE.MeshBasicMaterial({ map: pinkTexture });

// mesh
const triMesh = new THREE.Mesh(triGeometry, triMaterial);

// Font
const fontLoader = new FontLoader();
fontLoader.load('/static/fonts/Minecraft_Regular.json', (font) => {
  const textGeometry = new TextGeometry('three js is amazing', {
    font: font,
    size: 0.8,
    height: 0.2,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

for (let i = 0; i < 150; i++) {
  const octaMesh = new THREE.Mesh(octaGeometry, octaMaterial);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);

  octaMesh.position.x = (Math.random() - 0.5) * 70;
  octaMesh.position.y = (Math.random() - 0.5) * 70;
  octaMesh.position.z = (Math.random() - 0.5) * 70;

  donutMesh.position.x = (Math.random() - 0.5) * 80;
  donutMesh.position.y = (Math.random() - 0.5) * 80;
  donutMesh.position.z = (Math.random() - 0.5) * 80;

  sphereMesh.position.x = (Math.random() - 0.5) * 60;
  sphereMesh.position.y = (Math.random() - 0.5) * 60;
  sphereMesh.position.z = (Math.random() - 0.5) * 60;

  const randomScale = Math.random() * 2;
  donutMesh.scale.set(randomScale, randomScale, randomScale);
  sphereMesh.scale.set(randomScale, randomScale, randomScale);
  octaMesh.scale.set(randomScale, randomScale, randomScale);

  const randomRotation = Math.random() * Math.PI;
  donutMesh.rotation.y = randomRotation;
  octaMesh.rotation.x = randomRotation;

  scene.add(octaMesh);
  scene.add(donutMesh);
  scene.add(sphereMesh);
}

// Camera setup
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
camera.position.set(2, 0, 10);

triMesh.position.set(7.5, 0, 0);

scene.add(triMesh);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(size.width, size.height);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  triMesh.rotation.x = elapsedTime;
  triMesh.rotation.y = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
