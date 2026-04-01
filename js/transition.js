document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector('.transition-overlay');

    // --- SORTIE (La diagonale s'en va vers la droite) ---
    // Au chargement, on part de 0 (couvre l'écran) vers 150% (sort à droite)
    gsap.fromTo(overlay, 
        { xPercent: 0 }, 
        { 
            xPercent: 150, 
            duration: 1, 
            ease: "power4.inOut",
            delay: 0.2 
        }
    );

    // --- ENTRÉE (La diagonale arrive depuis la gauche) ---
    const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                const target = link.href;

                // On replace le bloc à gauche (-150%) et on l'amène au centre (0)
                gsap.set(overlay, { xPercent: -150 });
                
                gsap.to(overlay, {
                    xPercent: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                    onComplete: () => {
                        window.location.href = target;
                    }
                });
            }
        });
    });
});