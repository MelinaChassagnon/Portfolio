          document.body.addEventListener("mousemove", (e) => {
  const btn = e.target.closest(".fancy-btn");
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  btn.style.setProperty("--x", `${x}%`);
  btn.style.setProperty("--y", `${y}%`);
});

const movingBg = document.querySelector(".moving_bg");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  movingBg.style.transform = `translateY(${scrollY * -0.3}px)`;
});

window.addEventListener('DOMContentLoaded', () => {
    // On récupère TOUS les conteneurs d'images
    const scrollContainers = document.querySelectorAll('.desc_img');

    scrollContainers.forEach((container) => {
        container.addEventListener('wheel', (evt) => {
            // evt.deltaY est positif quand on scrolle vers le bas
            // On empêche le scroll vertical de la page entière
            evt.preventDefault();
            
            // On applique le mouvement horizontalement
            container.scrollLeft += evt.deltaY;
        }, { passive: false }); // "passive: false" est obligatoire pour preventDefault()
    });
});


// On récupère tous les conteneurs de vidéo
const videoBlocks = document.querySelectorAll('.video-block');

videoBlocks.forEach(block => {
    const video = block.querySelector('.video-element');
    const playBtn = block.querySelector('.play_pause_btn');
    const btnIcon = block.querySelector('.icon');

    if (video && playBtn) {
        const togglePlay = () => {
            if (video.paused) {
                video.play();
                if (btnIcon) btnIcon.textContent = '⏸';
                block.classList.add('playing');
            } else {
                video.pause();
                if (btnIcon) btnIcon.textContent = '▶';
                block.classList.remove('playing');
            }
        };

        playBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
    }
});