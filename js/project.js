document.addEventListener('DOMContentLoaded', () => {
    
/* --- 1. GESTION DU BOUTON RETOUR AVEC TRANSITION --- */
const backBtn = document.querySelector('.back_btn a');
const overlay = document.querySelector('.transition-overlay'); // On récupère l'overlay rouge

if (backBtn && overlay) {
    backBtn.addEventListener('click', (e) => {
        e.preventDefault(); // On stoppe le retour immédiat

        // On lance l'animation rouge
        overlay.classList.remove('is-leaving');
        overlay.classList.add('is-active');

        // On attend la fin de l'animation (600ms) pour faire le history.back()
        setTimeout(() => {
            if (document.referrer.indexOf(window.location.host) !== -1) {
                window.history.back();
            } else {
                // Si pas d'historique local, on définit une sortie de secours vers l'index
                window.location.href = '/index.html'; 
            }
        }, 600);
    });
}

// Optionnel : Animation de sortie au chargement de la page projet
if (overlay) {
    overlay.classList.add('is-leaving');
}

    /* --- 2. GESTION DU PLEIN ÉCRAN (IMAGE/VIDÉO) --- */
    const viewer = document.getElementById('image-viewer');
    const fullImg = document.getElementById('full-screen-img');
    const fullVideo = document.getElementById('full-screen-video');
    const closeBtn = document.querySelector('.close-viewer');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');

    let currentIndex = 0;
    let currentGallery = [];

    const updateViewer = (index) => {
        currentIndex = index;
        const currentElement = currentGallery[currentIndex];

        fullImg.style.display = 'none';
        fullVideo.style.display = 'none';
        fullVideo.pause();

        if (currentElement.tagName === 'IMG') {
            fullImg.src = currentElement.src;
            fullImg.style.display = 'block';
        } else if (currentElement.tagName === 'VIDEO') {
            const videoSrc = currentElement.querySelector('source') ? currentElement.querySelector('source').src : currentElement.src;
            fullVideo.src = videoSrc;
            fullVideo.style.display = 'block';
            fullVideo.play();
        }

        // Flèches seulement si plusieurs médias dans la même étape
        const showArrows = currentGallery.length > 1 ? 'block' : 'none';
        prevBtn.style.display = showArrows;
        nextBtn.style.display = showArrows;
    };

    // On isole par section ".step"
    document.querySelectorAll('.step').forEach((step) => {
        const stepMedia = Array.from(step.querySelectorAll('.desc_img img, .desc_img_result, .video-element'));

        stepMedia.forEach((media, index) => {
            media.style.cursor = 'zoom-in';
            media.addEventListener('click', () => {
                currentGallery = stepMedia;
                updateViewer(index);
                viewer.showModal();
                document.body.style.overflow = 'hidden';
            });
        });
    });

    const closeViewer = () => {
        viewer.close();
        fullVideo.pause();
        fullVideo.src = "";
        document.body.style.overflow = '';
    };

    if(closeBtn) closeBtn.addEventListener('click', closeViewer);
    if(viewer) viewer.addEventListener('click', (e) => { if (e.target === viewer) closeViewer(); });
    
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % currentGallery.length; updateViewer(currentIndex); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; updateViewer(currentIndex); });

    window.addEventListener('keydown', (e) => {
        if (!viewer.open) return;
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "Escape") closeViewer();
    });

/* --- 3. GESTION DU SCROLL HORIZONTAL --- */
const scrollContainers = document.querySelectorAll('.desc_img');

scrollContainers.forEach((container) => {
    container.addEventListener('wheel', (evt) => {
        // On vérifie si le contenu dépasse effectivement du conteneur
        const isScrollable = container.scrollWidth > container.clientWidth;

        if (evt.deltaY !== 0 && isScrollable) {
            evt.preventDefault();

            // 1. Calculer la position théorique
            let newScrollLeft = container.scrollLeft + evt.deltaY;

            // 2. Calculer le max scrollable possible
            const maxScrollLeft = container.scrollWidth - container.clientWidth;

            // 3. Brider la valeur entre 0 et le max (évite le dépassement invisible)
            if (newScrollLeft < 0) newScrollLeft = 0;
            if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

            // 4. Appliquer le scroll
            container.scrollLeft = newScrollLeft;
        }
    }, { passive: false });
});

    /* --- 4. EFFET HOVER BOUTONS (FANCY BTN) --- */
    document.body.addEventListener("mousemove", (e) => {
        const btn = e.target.closest(".fancy-btn");
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        btn.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });

    /* --- 5. PARALLAX STARS --- */
    const movingBg = document.querySelector(".moving_bg");
    if (movingBg) {
        window.addEventListener("scroll", () => {
            movingBg.style.transform = `translateY(${window.scrollY * -0.3}px)`;
        });
    }

    /* --- 6. CONTRÔLES VIDÉO --- */
    document.querySelectorAll('.video-block').forEach(block => {
        const video = block.querySelector('.video-element');
        const playBtn = block.querySelector('.play_pause_btn');
        if (video && playBtn) {
            const toggle = () => {
                if (video.paused) { video.play(); block.querySelector('.icon').textContent = '⏸'; }
                else { video.pause(); block.querySelector('.icon').textContent = '▶'; }
            };
            playBtn.addEventListener('click', toggle);
            video.addEventListener('click', toggle);
        }
    });
});
