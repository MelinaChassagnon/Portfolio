import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer;
let container;
const models = [];
let currentCategory = "multimedia";
let currentIndex = 0;

// 1. Initialisation du Manager
let enterBtn, loader, enterWrapper;
const manager = new THREE.LoadingManager();

manager.onLoad = function () {
    if (enterWrapper) enterWrapper.style.display = 'flex';
};

const loaderGLTF = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);

const projectData = {
  multimedia: {
    projects: [
      { title: "Campagne Fête de la Laine", tags: "Graphisme // Design UI/UX", description: "Création d'une campagne...", link: "/pages/project1.html", modelPath: "../3D/cd_laine.glb" },
      { title: "VAG Inventory", tags: "Graphisme // Design UI/UX // 3D // Développement web", description: "Site web d'inventaire...", link: "/pages/project2.html", modelPath: "../3D/cd_vag.glb" },
      { title: "'THE MOTH'", tags: "Montage", description: "Court-métrage", link: "/pages/project3.html", modelPath: "../3D/cd_moth.glb" },
      { title: "Affiche NOOMA", tags: "Graphisme", description: "Affiche rapide", link: "/pages/project4.html", modelPath: "../3D/cd_nooma.glb" },
      { title: "Teaser Exposition", tags: "Motion Design", description: "Motion design pour un teaser d'une exposition immersive", link: "/pages/project5.html", modelPath: "../3D/cd_teaser.glb" }
    ]
  },
  illustration: {
    projects: [
      { title: "Animation ambiance", tags: "animation // ambiance", description: "Courte animation test dans l'objectif de créer une ambiance", link: "/pages/illu1.html", modelPath: "../3D/wolf_anime.glb"},
      { title: "Illustrations sérigraphie", tags: "Illustration // sérigraphie", description: "Illustrations réalisées pour un stand de sérigraphie", link: "/pages/illu2.html", modelPath: "../3D/cd_seri.glb" },
      { title: "Notification animée", tags: "Animation", description: "Animation pour alerte de communauté", link: "/pages/illu3.html", modelPath: "../3D/cd_eye.glb" },
      { title: "Fond de site en Pixel Art", tags: "Pixel Art", description: "Illustration réalisée dans le cadre de la Nuit de l'Info", link: "/pages/illu4.html", modelPath: "../3D/cd_pixelart.glb" },
      { title: "Adaptation et peinture modèle 3D", tags: "3D // Illustration", description: "Adaptation et peinture d'un modèle 3D pour un site internet", link: "/pages/illu5.html", modelPath: "../3D/cd_motoko.glb" }
    ]
  }
};

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

// --- AJOUT LOGIQUE SAUVEGARDE ---
function saveState() {
    localStorage.setItem('portfolio_state', JSON.stringify({
        category: currentCategory,
        index: currentIndex
    }));
}

function loadState() {
    const saved = localStorage.getItem('portfolio_state');
    if (saved) {
        const data = JSON.parse(saved);
        currentCategory = data.category;
        currentIndex = data.index;
    }
}

function loadModels() {
  models.forEach(model => { if (model) scene.remove(model); });
  
  const category = projectData[currentCategory];
  models.length = category.projects.length; 
  models.fill(null);

  category.projects.forEach((project, i) => {
    const path = project.modelPath || category.modelPath;

    loaderGLTF.load(path, (gltf) => {
      const model = gltf.scene;
      models[i] = model; 
      
      const total = category.projects.length;
      let slotIndex = (i - currentIndex + 1 + total) % total;
      applySlot(model, slots[slotIndex]); 
      
      scene.add(model);
      updateText();
    });
  });
}

function init() {
  // Charger la position sauvegardée
  loadState();

  enterBtn = document.getElementById('enter-btn');
  loader = document.getElementById('loader');
  enterWrapper = document.getElementById('enter-wrapper');

  if (enterBtn) {
      enterBtn.addEventListener('click', () => {
          loader.classList.add('loader-hidden');
          document.body.style.overflow = 'auto';
      });
  }

  container = document.getElementById("cd_chain_container");
  if (!container) return;

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
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding; 

  container.appendChild(renderer.domElement);

  loadModels(); 
  animate();

  window.addEventListener("resize", onResize);
  onResize();
}

function getScaleRatio() {
  const correctedWidth = container.clientWidth * window.devicePixelRatio;
  return Math.max(correctedWidth / 1920, 0.8);
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
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Jamais plus de 2
  renderer.setSize(container.clientWidth, container.clientHeight);
  models.forEach((model, i) => {
      if(model) {
          let slotIndex = (i - currentIndex + 1 + models.length) % models.length;
          applySlot(model, slots[slotIndex]);
      }
  });
}

function shiftSlots(direction = "down") {
    if (direction === "down") {
        currentIndex = (currentIndex + 1) % projectData[currentCategory].projects.length;
    } else {
        currentIndex = (currentIndex - 1 + projectData[currentCategory].projects.length) % projectData[currentCategory].projects.length;
    }
    saveState(); // Sauvegarde au clic
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
    const total = projectData[currentCategory].projects.length;

    models.forEach((model, i) => {
        if (!model) return;
        let slotIndex = (i - currentIndex + 1 + total) % total;
        const targetSlot = slots[slotIndex]; 

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
  currentIndex = 0; 
  saveState(); // Sauvegarde au changement d'onglet
  loadModels();
}

window.switchCategory = switchCategory;
document.addEventListener("DOMContentLoaded", init);