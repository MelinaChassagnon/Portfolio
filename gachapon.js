import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

// Renderer & Canvas
const canvas = document.getElementById("ballpit");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene & Camera orthographique (full 2D)
const scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camHeight = 10;
const camera = new THREE.OrthographicCamera(
  -aspect * camHeight, aspect * camHeight,
  camHeight, -camHeight,
  0.1, 100
);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// Config
const config = {
  count: 20,
  gravity: 0.01,
  friction: 0.91,
  wallBounce: 1,
  spacing: 0.05
};

// Charger la texture PNG
const loader = new THREE.TextureLoader();
const texture = loader.load('img/gacha.png');

const planes = [];
const balls = [];

// Calcule la taille des PNG selon la largeur de l'écran
function getBallSize() {
  const baseWidth = 1920;
  const maxSize = 4.5;
  const minSize = 2;
  const size = maxSize * (window.innerWidth / baseWidth);
  return Math.max(size, minSize);
}

// Vérifie chevauchement
function isOverlap(x, y, size, others) {
  for (const p of others) {
    if (Math.hypot(p.x - x, p.y - y) < (p.size + size)/2 + config.spacing) return true;
  }
  return false;
}

// Créer les PNG sans superposition et avec rotation
function createBalls() {
  const size = getBallSize();
  for (let i = 0; i < config.count; i++) {
    let x, y, tries = 0;
    do {
      x = THREE.MathUtils.randFloatSpread(aspect * camHeight * 2);
      y = THREE.MathUtils.randFloatSpread(camHeight * 2);
      tries++;
    } while (isOverlap(x, y, size, balls) && tries < 100);

    balls.push({
      x, y, size,
      vx: THREE.MathUtils.randFloatSpread(0.1),
      vy: THREE.MathUtils.randFloatSpread(0.1),
      rotation: THREE.MathUtils.randFloat(0, Math.PI*2),
      vRot: THREE.MathUtils.randFloatSpread(0.02)
    });

    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(x, y, 0);
    plane.rotation.z = balls[i].rotation;
    scene.add(plane);
    planes.push(plane);
  }
}

createBalls();

// Curseur
const mouse = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.x = ((e.clientX / window.innerWidth) * 2 - 1) * aspect * camHeight;
  mouse.y = (-(e.clientY / window.innerHeight) * 2 + 1) * camHeight;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const maxX = aspect * camHeight;
  const maxY = camHeight;
  const minSpeedForRotation = 0.01;

  // Bouger chaque PNG
  for (let i = 0; i < config.count; i++) {
    const ball = balls[i];

    // Gravité
    ball.vy -= config.gravity;

    // Interaction avec le curseur
    const dx = ball.x - mouse.x;
    const dy = ball.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    const pushRadius = ball.size;
    if (dist < pushRadius && dist > 0) {
      const force = (pushRadius - dist) * 0.3;
      ball.vx += (dx / dist) * force;
      ball.vy += (dy / dist) * force;
    }

    // Déplacement
    ball.x += ball.vx;
    ball.y += ball.vy;
  }

  // Collision entre PNG (repousser)
  for (let i = 0; i < config.count; i++) {
    for (let j = i + 1; j < config.count; j++) {
      const a = balls[i];
      const b = balls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = (a.size + b.size)/2 + config.spacing;
      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x -= nx * overlap / 2;
        a.y -= ny * overlap / 2;
        b.x += nx * overlap / 2;
        b.y += ny * overlap / 2;
        // Échanger légèrement les vitesses
        const dvx = (b.vx - a.vx) * 0.5;
        const dvy = (b.vy - a.vy) * 0.5;
        a.vx += dvx; a.vy += dvy;
        b.vx -= dvx; b.vy -= dvy;
      }
    }
  }

  // Murs et friction
  for (let i = 0; i < config.count; i++) {
    const ball = balls[i];
    const plane = planes[i];

    if (ball.x - ball.size/2 < -maxX) { ball.x = -maxX + ball.size/2; ball.vx *= -config.wallBounce; }
    if (ball.x + ball.size/2 > maxX) { ball.x = maxX - ball.size/2; ball.vx *= -config.wallBounce; }
    if (ball.y - ball.size/2 < -maxY) { ball.y = -maxY + ball.size/2; ball.vy *= -config.wallBounce; }
    if (ball.y + ball.size/2 > maxY) { ball.y = maxY - ball.size/2; ball.vy *= -config.wallBounce; }

    ball.vx *= config.friction;
    ball.vy *= config.friction;

    // Rotation seulement si la PNG bouge
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > minSpeedForRotation) {
      ball.rotation += ball.vx * 0.05 + ball.vRot;
    }

    // Update position & rotation
    plane.position.set(ball.x, ball.y, 0);
    plane.rotation.z = ball.rotation;
  }

  renderer.render(scene, camera);
}

animate();

// Resize
function updateCameraAndBounds() {
  aspect = window.innerWidth / window.innerHeight;
  camera.left = -aspect * camHeight;
  camera.right = aspect * camHeight;
  camera.top = camHeight;
  camera.bottom = -camHeight;
  camera.updateProjectionMatrix();

  // Redimensionne les PNG proportionnellement
  const newSize = getBallSize();
  for (let i = 0; i < balls.length; i++) {
    balls[i].size = newSize;
    planes[i].scale.set(newSize / planes[i].geometry.parameters.width, newSize / planes[i].geometry.parameters.height, 1);
  }
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCameraAndBounds();
});
