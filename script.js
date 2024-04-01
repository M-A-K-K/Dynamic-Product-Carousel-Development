// console.log("hello world");

// // Now THREE object should be accessible
// console.log(THREE);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Define different colors for each side
// const materials = [
//     new THREE.MeshPhongMaterial({ color: 0xff0000 }), // Right side: red
//     new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // Left side: green
//     new THREE.MeshPhongMaterial({ color: 0x0000ff }), // Top side: blue
//     new THREE.MeshPhongMaterial({ color: 0xffff00 }), // Bottom side: yellow
//     new THREE.MeshPhongMaterial({ color: 0xff00ff }), // Front side: magenta
//     new THREE.MeshPhongMaterial({ color: 0x00ffff })  // Back side: cyan
// ];

// const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
// scene.add(cube);

// camera.position.z = 5;

// function animate() {
//     requestAnimationFrame(animate);

//     cube.rotation.x -= 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render(scene, camera);
// }

// // Set up a directional light to illuminate the scene from one side
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(1, 1, 1); // Set the position of the light
// scene.add(directionalLight);

// // Change the clear color of the renderer to light gray
// renderer.setClearColor(0xeeeeee);

// // Adjust camera position to view the cube properly
// camera.position.set(0, 0, 10);
// camera.lookAt(0, 0, 0);

// animate();










import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
spotLight.position.set(0, 50, 0); // Adjust the position to cover the entire scene
spotLight.target.position.set(0, 0, 0); // Point the spotlight towards the center of the scene
scene.add(spotLight);


let cars = []; // Array to hold multiple car models
let modelsLoaded = false; // Flag to track if models are loaded
const loader = new GLTFLoader();
const numModels = 5; // Number of models to display
const carouselRadius = 8;
const carouselSpeed = 0.005;

function loadModels() {
    for (let i = 0; i < numModels; i++) {
        loader.load("scene.gltf", function (gltf) {
            const car = gltf.scene.clone(); // Clone the model to avoid reusing the same instance
            const angle = (i / numModels) * Math.PI * 2;
            car.position.set(Math.cos(angle) * carouselRadius, 1.05, Math.sin(angle) * carouselRadius);
            scene.add(car);
            cars.push(car); // Add the model to the cars array
            
            // If all models are loaded, set modelsLoaded flag to true
            if (cars.length === numModels) {
                modelsLoaded = true;
            }
        });
    }
}

function animateCarousel() {
    if (!modelsLoaded) {
        loadModels(); // Load models only when the user interacts with the scene
    }

    const time = performance.now() * carouselSpeed;

    for (let i = 0; i < numModels; i++) {
        const car = cars[i];
        if (car) {
            const angle = time + (i / numModels) * Math.PI * 2;
            car.position.set(Math.cos(angle) * carouselRadius, 1.05, Math.sin(angle) * carouselRadius);
            car.rotation.y = angle;
        }
    }

    requestAnimationFrame(animateCarousel);
    controls.update();
    renderer.render(scene, camera);
}

animateCarousel();
