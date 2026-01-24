const handleImg = document.querySelector('.handle img');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    handleImg.style.transform = `rotate(${scrollY / 10}deg)`;
});

function loadSVG() {
    fetch("/img/gacha/gacha_decomposed/gacha.svg")
    .then((response) => {return response.text();})
    .then((svg) => {
        document.getElementById("gacha").innerHTML = svg;
        document.querySelector('#gacha svg').setAttribute("preserveAspectRatio", "xMidYMid meet");

        setAnimationScroll();
    })
}

loadSVG();


function setAnimationScroll() {
    const svg = document.querySelector("#gacha svg");

    const top = svg.querySelector("#top");
    const perso = svg.querySelector("#perso");
    const bottom = svg.querySelector("#bottom");
    const gachaWrap = document.querySelector('.gacha_wrap');

    gsap.registerPlugin(ScrollTrigger);

    let runAnimation = gsap.timeline({
        scrollTrigger: {
            trigger: gachaWrap,
            markers: false,
            start:"15% center",
            end: "+=3100 top",
            scrub: true,
        }
    });

    runAnimation.to(gachaWrap, { y: 2600, duration:10});

    runAnimation.to(top, {
        transformOrigin: "70% 100%",
        scale: 0.7,
        rotate: 45,
        opacity: 0,
        duration:2
    }, 2)

    .to(bottom, {
        transformOrigin: "20% 20%",
        scale: 0.7,
        rotate: 45,
        opacity: 0,
        y: 200,
        duration:2
    }, 2)

    .to(perso, {
        transformOrigin: "50% 50%",
        scale: 1.5,
        duration:2
    }, 2)

    .to(".sliding_text1", {
        y: 0,
        opacity: 1,
        ease: "power4.out",
        duration:2
    }, 2)

    .to(".sliding_text2, .sliding_text4, .sliding_text6", {
        x: 0,
        opacity: 1,
        ease: "power4.out",
        duration:2
    }, 2)

    .to(".sliding_text3, .sliding_text5", {
        x: 0,
        opacity: 1,
        ease: "power4.out",
        duration:2
    }, 2);
}





