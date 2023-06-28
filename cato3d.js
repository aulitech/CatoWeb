import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const modelFile = '/assets/scene.gltf';
const PI = Math.PI;
let x, y, z;
let rotationEnabled = false;

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas(e) {
    // Don't resize if the canvas size has not really changed
    if ((canvas === undefined) ||
        ((render.domElement.clientWidth == canvas.width) &&
            (render.domElement.clientHeight == canvas.height))) {
        return
    }
    // In case resize event is triggered before the render object is created
    if (render.hasOwnProperty('setSize')) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        render.setSize(canvas.clientWidth, canvas.clientHeight, false); // false = don't update style
        camera.updateProjectionMatrix(); // prevent camera from getting distorted
        renderScene();
    };
}

function renderScene() {
    render.render(scene, camera);
}

function animateScene() {
    requestAnimationFrame(animateScene); // 60 fps timer callback
    // Rotate the model around the x, y and z axes based on mouse position. Rotation is in radians.
    model.rotation.y = PI * (x - canvas.clientWidth / 2) / (canvas.clientWidth / 2);
    model.rotation.x = PI * (y - canvas.clientHeight / 2) / (canvas.clientHeight / 2);
    model.rotation.z = -PI * (z - canvas.clientWidth / 2) / (canvas.clientWidth / 2);
    renderScene();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add mouse event listeners to the canvas
const canvas = document.getElementById('canvas');
canvas.addEventListener('mousemove', function (event) {
    if (rotationEnabled) {
        z = (event.offsetY < canvas.clientHeight / 2) ? event.offsetX : -event.offsetX;
       } else {
        x = event.offsetX;
        y = event.offsetY;
    }
});

canvas.addEventListener('mousedown', function (event) {
    rotationEnabled = true;
});

canvas.addEventListener('mouseup', function (event) {
    rotationEnabled = false;
});

// Create the renderer, scene and camera
const render = new THREE.WebGLRenderer({ antialias: true, canvas });
render.setClearColor(0xaaaaaa, .5);
render.setSize(canvas.clientWidth, canvas.clientHeight, false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 1, 50);
camera.position.set(0, 0, 5);
camera.lookAt(scene.position);
scene.add(camera);

// Load the 3D model
const loader = new GLTFLoader();
let model;
loader.load(modelFile, function (gltf) {
    scene.add(gltf.scene);
    model = gltf.scene;
}, undefined, function (error) {
    console.error(error);
});

// Start the animation loop
while (model == undefined) {
    await sleep(1000)
}

animateScene();