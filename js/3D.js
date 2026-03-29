import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer;
let container;
const models = [];
const loader = new GLTFLoader();


const projectData = {
  multimedia: {
    modelPath: "../3D/Cd.gltf", // Ton modèle de CD actuel
    projects: [
      { title: "Campagne Fête de la Laine", tags: "Graphisme // Design UI/UX", description: "Création d'une campagne...", link: "/pages/project1.html" },
      { title: "VAG Inventory", tags: "Graphisme // 3D", description: "Site web d'inventaire...", link: "/pages/project2.html" },
      { title: "'THE MOTH'", tags: "Montage", description: "Court-métrage", link: "/pages/project3.html" },
      { title: "Affiche NOOMA", tags: "Graphisme", description: "Affiche rapide", link: "/pages/project4.html" },
      { title: "Logo", tags: "Graphisme", description: "Logo fictif", link: "/pages/project5.html" }
    ]
  },
  illustration: {
    projects: [
      { title: "Animation ambiance", tags: "animation // ambiance", description: "Courte animation test dans l'objectif de créer une ambiance", link: "/pages/illu1.html", modelPath: "../3D/wolf_anime.glb"},
      { title: "Illustrations sérigraphie", tags: "Illustration // sérigraphie", description: "Illustrations réalisées pour un stand de sérigraphie", link: "/pages/illu2.html", modelPath: "../3D/cd_seri.glb" },
      { title: "Notification animée", tags: "Animaton", description: "Animation pour alerte de communauté", link: "/pages/illu3.html", modelPath: "../3D/cd_eye.glb" },
      { title: "Fond de site en Pixel Art", tags: "Traditionnel", description: "Illustration réalisée dans le cadre de la Nuit de l'Info", link: "/pages/illu4.html", modelPath: "../3D/cd_pixelart.glb" },
      { title: "Adaptation et peinture modèle 3D", tags: "3D // Illustration", description: "Adaptation et peinture d'un modèle 3D pour un site internet", link: "/pages/illu5.html", modelPath: "../3D/cd_motoko.glb" }
    ]
  }
};

let currentCategory = "multimedia";

let titleEl, tagsEl, descEl, linkEl;
let prevBtn, nextBtn;

const slots = [
  { position: new THREE.Vector3(-1.2, 0.3, 1), rotation: new THREE.Euler(0.2, -0.1, -0.1), scale: 0.8 },
  { position: new THREE.Vector3(-0.7, 0.5, 0.6), rotation: new THREE.Euler(0.5, -0.1, -0.1), scale: 1 },
  { position: new THREE.Vector3(0.1, 0.6, 0.3), rotation: new THREE.Euler(-0.1, -0.1, 0.2), scale: 0.8 },
  { position: new THREE.Vector3(0.7, 0.3, -0.3), rotation: new THREE.Euler(-0.3, -0.7, -0.1), scale: 0.7 },
  { position: new THREE.Vector3(1.4, 0.2, -0.6), rotation: new THREE.Euler(0, -0.5, 0.2), scale: 0.6 }
];

let currentSlots = slots.map(s => ({...s}));
let currentIndex = 0;

function loadModels() {
  // On nettoie la scène
  models.forEach(model => { if (model) scene.remove(model); });
  models.length = 0; 

  const category = projectData[currentCategory];

  category.projects.forEach((project, i) => {
    const path = project.modelPath || category.modelPath;

    loader.load(path, (gltf) => {
      const model = gltf.scene;
      applySlot(model, currentSlots[i]);
      scene.add(model);
      
      // On l'ajoute au tableau. 
      // Si on utilise models[i], l'itérateur du forEach dans animate 
      // peut sauter des étapes si le modèle 2 charge avant le 1.
      models.push(model); 
      
      console.log("Modèle affiché :", path);
      updateText();
    });
  });
}
function init() {

  container = document.getElementById("cd_chain_container");
  if (!container) {
    console.error("Container #cd_chain_container introuvable !");
    return;
  }

  titleEl = document.querySelector(".cd_title");
  descEl = document.querySelector(".cd_description");
  tagsEl = document.querySelector(".cd_tags");
  linkEl = document.querySelector(".cd_link");
  prevBtn = document.querySelector(".cd_prev");
  nextBtn = document.querySelector(".cd_next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => shiftSlots("up"));
    nextBtn.addEventListener("click", () => shiftSlots("down"));
  }

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2.5, 2.5);
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

  // correction DPI
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);

  container.appendChild(renderer.domElement);

  container.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding; 

  // Supprime l'ancien loader.load et remplace par ça :
  loadModels(); 
  animate();

  window.addEventListener("resize", onResize);
  onResize();
}

function getScaleRatio() {

  // correction DPI
  const correctedWidth = container.clientWidth * window.devicePixelRatio;

  return Math.max(correctedWidth / 1920, 0.8);
}

function applySlot(model, slot) {

  // Temporairement, pour voir si le loup apparaît
model.scale.setScalar(100);

  const ratio = getScaleRatio();

  model.position.set(
    slot.position.x * ratio,
    slot.position.y * ratio,
    slot.position.z * ratio
  );

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

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  models.forEach((model, i) => applySlot(model, currentSlots[i]));
}

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
  if (!titleEl || !tagsEl || !descEl || !linkEl) return;

  const text = projectData[currentCategory].projects[currentIndex];

  titleEl.textContent = text.title;
  tagsEl.textContent = text.tags;
  descEl.textContent = text.description;
  linkEl.href = text.link;
}

function animate() {

  requestAnimationFrame(animate);

  const ratio = getScaleRatio();

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



function switchCategory(categoryName) {
  if (!projectData[categoryName] || currentCategory === categoryName) return;
  
  currentCategory = categoryName;
  currentIndex = 0; // On revient au premier projet
  
  // On réinitialise l'ordre des slots pour que le premier projet 
  // soit bien au centre/devant au changement
  currentSlots = slots.map(s => ({...s}));

  // On appelle la fonction pour charger les nouveaux modèles
  loadModels();
}

// Rendre la fonction accessible depuis ton HTML
window.switchCategory = switchCategory;

document.addEventListener("DOMContentLoaded", init);
