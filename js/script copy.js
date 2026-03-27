const handleImg = document.querySelector('.handle img');

window.addEventListener('scroll', () => {
    // On récupère combien on a scrollé verticalement
    const scrollY = window.scrollY;

    // On applique la rotation (par exemple 1 degré tous les 2px scrollés)
    const rotation = scrollY / 10;

    // On transforme l'image
    handleImg.style.transform = `rotate(${rotation}deg)`;
});


const gacha = document.querySelector('.gacha');
const stopSection = document.querySelector('.about_me');
const gachaBox = document.querySelector('.gacha_box');

const topPart = gacha.querySelector('.top');
const bottomPart = gacha.querySelector('.bottom');
const perso = gacha.querySelector('.perso');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const stopY = stopSection.offsetTop - window.innerHeight / 2;
    const stopMiddle = stopSection.offsetTop + stopSection.offsetHeight / 2 - window.innerHeight / 2;

    // 🔹 TON ANIMATION (inchangée)
    if (scrollY < stopY) {
        gacha.style.bottom = `${window.innerHeight / 2 - scrollY}px`;
        
    } else {
        const stopY =
            stopSection.offsetTop +
            stopSection.offsetHeight / 2 -
            window.innerHeight / 2;
    }

    // 🔹 VISIBILITÉ (CORRIGÉE)
    const gachaRect = gacha.getBoundingClientRect();
    const boxRect = gachaBox.getBoundingClientRect();

    if (gachaRect.bottom < boxRect.top) {
        gacha.style.opacity = 0;
    } else {
        gacha.style.opacity = 1;
    }

    if (scrollY > stopMiddle) {
        const extraScroll = scrollY - stopMiddle;

        // Top : tourne -15deg max et rapetisse
        const topRotate = Math.min(extraScroll * 0.1, 15);
        const topScale = Math.max(1 - extraScroll * 0.002, 0.9);
        topPart.style.transform = `rotate(-${topRotate}deg) scale(${topScale})`;

        // Bottom : tourne +15deg max et rapetisse
        const bottomRotate = Math.min(extraScroll * 0.1, 15);
        const bottomScale = Math.max(1 - extraScroll * 0.002, 0.9);
        bottomPart.style.transform = `rotate(${bottomRotate}deg) scale(${bottomScale})`;

        // Perso : s'agrandit légèrement
        const persoScale = Math.min(1 + extraScroll * 0.002, 1.1);
        perso.style.transform = `scale(${persoScale})`;
    } else {
        // Reset si on remonte
        topPart.style.transform = `rotate(0deg) scale(1)`;
        bottomPart.style.transform = `rotate(0deg) scale(1)`;
        perso.style.transform = `scale(1)`;
    }
});