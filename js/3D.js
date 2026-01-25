import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer;
let container;
const models = [];


const cdTexts = [
  { title: "Campagne de la Fête de la Laine", description: "Création d'une campagne institutionelle", link:"/pages/project1.html"},
  { title: "VAG Inventary", description: "Site web recueillant l'inventaire des figurines 'VAG'.", link:"/pages/project2.html" },
  { title: "'THE MOTH'", description: "Court-métrage", link:"/pages/project3.html"},
  { title: "Affiche NOOMA", description: "Exercice de création de concept et d’affiche rapide", link:"/pages/project4.html" },
  { title: "Logo", description: "Création d'un logo fictif pour les deuxièmes années du BUT MMI", link:"/pages/project5.html" }
];

let titleEl, descEl, linkEl;
let prevBtn, nextBtn;


// Slots
const slots = [
  { position: new THREE.Vector3(-1.2, 0.3, 1.3), rotation: new THREE.Euler(0.2, -0.1, -0.1), scale: 0.8 },
  { position: new THREE.Vector3(-0.7, 0.5, 0.9), rotation: new THREE.Euler(0.5, -0.1, -0.1), scale: 1 },
  { position: new THREE.Vector3(0.1, 0.6, 0.6), rotation: new THREE.Euler(-0.1, -0.1, 0.2), scale: 0.8 },
  { position: new THREE.Vector3(0.7, 0.3, 0), rotation: new THREE.Euler(-0.3, -0.7, -0.1), scale: 0.7 },
  { position: new THREE.Vector3(1.4, 0.2, -0.3), rotation: new THREE.Euler(0, -0.5, 0.2), scale: 0.6 }
];

let currentSlots = slots.map(s => ({...s}));
let currentIndex = 0;

// Scroll
let scrollDelta = 0;
const scrollSpeed = 0.0015;

// init
function init() {
  console.log("Init démarré");

  container = document.getElementById("cd_chain_container");
  if (!container) {
    console.error("Container #cd_chain_container introuvable !");
    return;
  }
  console.log("Container trouvé :", container);


  titleEl = document.querySelector(".cd_title");
  descEl = document.querySelector(".cd_description");
  linkEl = document.querySelector(".cd_link");
  prevBtn = document.querySelector(".cd_prev");
nextBtn = document.querySelector(".cd_next");

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    shiftSlots("up");
  });

  nextBtn.addEventListener("click", () => {
    shiftSlots("down");
  });
}


  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(248, 237, 231)");

  camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2, 2);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  const envTexture = new THREE.CubeTextureLoader().load([
    "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
    "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg"
  ]);
  scene.environment = envTexture;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  loader.load("../3D/Cd.gltf", (gltf) => {
    console.log("Modèle chargé !");
    slots.forEach((slot, i) => {
      const model = gltf.scene.clone(true);
      applySlot(model, currentSlots[i]);
      scene.add(model);
      models.push(model);
    });

    initScroll();
    updateText();
    animate();
  });

  window.addEventListener("resize", onResize);
  onResize();
}


function getScaleRatio() {
  return Math.max(container.clientWidth / 1920, 0.55);
}

function applySlot(model, slot) {
  const ratio = getScaleRatio();
  model.position.set(slot.position.x * ratio, slot.position.y * ratio, slot.position.z * ratio);
  model.rotation.copy(slot.rotation);
  model.scale.setScalar(slot.scale * ratio);

  model.traverse((child) => {
    if (child.isMesh && child.material && "metalness" in child.material) {
      child.material.metalness = 0.2;
      child.material.roughness = 0;
      child.material.envMapIntensity = 0.8;
      child.material.envMap = scene.environment;
      child.material.needsUpdate = true;
    }
  });
}

function onResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  models.forEach((model, i) => applySlot(model, currentSlots[i]));
}

// scroll
function initScroll() {
  container.addEventListener("wheel", (e) => {
    console.log("Scroll détecté sur la scène ! deltaY:", e.deltaY);
    scrollDelta += e.deltaY * scrollSpeed;
    e.preventDefault();
  }, { passive: false });
}

// chaine
function shiftSlots(direction = "down") {
  if (direction === "down") {
    const last = currentSlots.pop();
    currentSlots.unshift(last);
    currentIndex = (currentIndex + 1) % slots.length;
  } else {
    const first = currentSlots.shift();
    currentSlots.push(first);
    currentIndex = (currentIndex - 1 + slots.length) % slots.length;
  }
  updateText();
}

function updateText() {
  if (!titleEl || !descEl || !linkEl) return;
  const text = cdTexts[currentIndex];
  titleEl.textContent = text.title;
  descEl.textContent = text.description;
  linkEl.href = text.link;
  linkEl.textContent = "Voir le projet";
}

// loop
function animate() {
  requestAnimationFrame(animate);
  const ratio = getScaleRatio();

  const steps = Math.floor(scrollDelta);
  if (steps !== 0) {
    for (let s = 0; s < Math.abs(steps); s++) {
      if (steps > 0) shiftSlots("down");
      else shiftSlots("up");
    }
    scrollDelta -= steps;
  }

  models.forEach((model, i) => {
    const targetSlot = currentSlots[i];
    model.position.lerp(new THREE.Vector3(
      targetSlot.position.x * ratio,
      targetSlot.position.y * ratio,
      targetSlot.position.z * ratio
    ), 0.1);
    model.rotation.x += (targetSlot.rotation.x - model.rotation.x) * 0.1;
    model.rotation.y += (targetSlot.rotation.y - model.rotation.y) * 0.1;
    model.rotation.z += (targetSlot.rotation.z - model.rotation.z) * 0.1;
    const targetScale = targetSlot.scale * ratio;
    model.scale.x += (targetScale - model.scale.x) * 0.1;
    model.scale.y += (targetScale - model.scale.y) * 0.1;
    model.scale.z += (targetScale - model.scale.z) * 0.1;
  });

  renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", init);
