 document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    
    // On vérifie si l'utilisateur est déjà passé par l'accueil durant cette session
    if (sessionStorage.getItem('visited')) {
        // Si oui, on cache le loader immédiatement sans animation
        if (loader) {
            loader.style.display = 'none';
            // On s'assure que le scroll est activé
            document.body.style.overflow = 'auto';
        }
    } else {
        // Si c'est la première fois, on attend le clic sur le bouton "Entrer"
        const enterBtn = document.getElementById('enter-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                loader.classList.add('loader-hidden');
                document.body.style.overflow = 'auto';
                // On enregistre qu'on a déjà vu le loader
                sessionStorage.setItem('visited', 'true');
            });
        }
    }
});
 
 const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const handleImg = document.querySelector('.handle img');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      handleImg.style.transform = `rotate(${scrollY / 10}deg)`;
    });

    function loadSVG() {
      fetch("/img/gacha/gacha_decomposed/gacha.svg")
        .then((response) => { return response.text(); })
        .then((svg) => {
          document.getElementById("gacha").innerHTML = svg;
          document.querySelector('#gacha svg').setAttribute("preserveAspectRatio", "xMidYMid meet");

          setAnimationScroll();
        })
    }

              document.body.addEventListener("mousemove", (e) => {
  const btn = e.target.closest(".fancy-btn");
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  btn.style.setProperty("--x", `${x}%`);
  btn.style.setProperty("--y", `${y}%`);
});

    loadSVG();
    let text4, text5;
    let runAnimation, runAnimation2, runAnimation3;

    function setAnimationScroll() {
      if (runAnimation) runAnimation.kill();
      if (text4) text4.revert();
      if (text5) text5.revert(); // Nettoyage du texte 5

      const target4 = document.querySelector('.sliding_text4');
      const target5 = document.querySelector('.sliding_text5'); // Cible du texte 5
      const svg = document.querySelector("#gacha svg");

      if (!target4 || !target5 || !svg) return;

      const top = svg.querySelector("#top");
      const perso = svg.querySelector("#perso");
      const bottom = svg.querySelector("#bottom");

      // clear
      gsap.set([top, bottom, perso], { clearProps: "all" });
      gsap.set(".sliding_text2 .text, .sliding_text3 .text", { opacity: 0 });

      // split text 4
      text4 = new SplitType(target4, { types: 'lines' });
      text4.lines.forEach(line => {
        const content = line.innerHTML;
        line.innerHTML = `<span class="line-text" style="opacity:0; display:block;">${content}</span><span class="line-highlight"></span>`;
      });

      // split text 5
      text5 = new SplitType(target5, { types: 'lines' });
      text5.lines.forEach(line => {
        const content = line.innerHTML;
        line.innerHTML = `<span class="line-text" style="opacity:0; display:block;">${content}</span><span class="line-highlight"></span>`;
      });

      gsap.registerPlugin(ScrollTrigger);

      runAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: ".container",
          start: "30% center",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      runAnimation
        .to(top, {
          transformOrigin: "70% 100%",
          scale: 0.7,
          rotate: 45,
          opacity: 0,
          duration: 2
        }, 2)
        .to(bottom, {
          transformOrigin: "20% 20%",
          scale: 0.7,
          rotate: 45,
          opacity: 0,
          y: 200,
          duration: 2
        }, 2)
        .to(perso, {
          transformOrigin: "50% 50%",
          scale: 1.5,
          duration: 2
        }, 2)

        .fromTo(".sliding_text1 span", {
          y: "120%",
          opacity: 0
        },
          {
            y: "0%",
            opacity: 1,
            stagger: 0.08,
            duration: 1,
            ease: "power4.out"
          }, 2.5)

        .to(".sliding_text2 .highlight", {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.3,
          ease: "none"
        }, 3.7)
        .set(".sliding_text2 .text", {
          opacity: 1
        }, 4)
        .to(".sliding_text2 .highlight", {
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.3,
          ease: "none"
        }, 4.3)

        .to(".sliding_text3 .highlight", {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.3,
          ease: "none"
        }, 4.3)
        .set(".sliding_text3 .text", {
          opacity: 1
        }, 4.6)
        .to(".sliding_text3 .highlight", {
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.3,
          ease: "none"
        }, 4.9)

        .to(".sliding_text4 .line-highlight", {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.3,
          ease: "none",
          stagger: 0.3
        }, 4.7)
        .set(".sliding_text4 .line-text", {
          opacity: 1,
          stagger: 0.3
        }, 4.9)
        .to(".sliding_text4 .line-highlight", {
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.3,
          ease: "none",
          stagger: 0.3
        }, 4.87)

        .to(".sliding_text5 .line-highlight", {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.3,
          ease: "none",
          stagger: 0.3
        }, 7.3)
        .set(".sliding_text5 .line-text", {
          opacity: 1,
          stagger: 0.3
        }, 7.5)
        .to(".sliding_text5 .line-highlight", {
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.3,
          ease: "none",
          stagger: 0.3
        }, 7.47)

        .fromTo(".sliding_text7 div img", {
          scale: 0
        }, {
          scale: 1,
          duration: 1
        }, 7.6)

        .fromTo(".sliding_text8", {
          x: "300%"
        },{
          x: "0%",
          duration: 1,
            ease: "power4.out"
        }, 7.5)

      

    }

    // Lancement
    window.addEventListener("load", setAnimationScroll);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setAnimationScroll, 250);
    });

    window.addEventListener("resize", setAnimationScroll);

    ScrollTrigger.create({
      trigger: ".container",
      start: "26% center",
      end: "bottom bottom",
      pin: ".container2",
      markers: false,
    });

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });





    runAnimation2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".bottom",
        start: "top center",
        end: "bottom bottom",
        scrub: true
      }
    });

    runAnimation2


      
.fromTo(".sliding_text6 span", { 
  y: "120%", 
  opacity: 0 
}, { 
  y: "0%", 
  opacity: 1, 
  stagger: 0.4, 
  duration: 4, 
  ease: "power4.out" 
}, 2)

.fromTo(".bottom > *:not(.projects_header)", {
  x: "200%"
}, {
  x: 0,
  duration: 4,
  ease: "power3.out",
  stagger: 0.1
}, 1.8)

.fromTo(".nav_projects", {
  x: "-100%"
}, {
  x: 0,
  duration: 4,
  ease: "power3.out",
  stagger: 0.1
}, 1.8);

    runAnimation3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".contacts",
        start: "top center",
        end: "bottom bottom",
        scrub: true
      }
    });

    runAnimation3

    .fromTo(".sliding_text9 span", { 
  y: "120%", 
  opacity: 0 
}, { 
  y: "0%", 
  opacity: 1, 
  stagger: 0.08, 
  duration: 1, 
  ease: "power4.out" 
}, 0);


    const movingBg = document.querySelector(".moving_bg");

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;

      movingBg.style.transform = `translateY(${scrollY * -0.3}px)`;
    });


const mail = document.getElementById('mail');
const copiedText = "melina.chassagnon@gmail.com";
const statusText = document.getElementById('status');

mail.addEventListener('click', async () => {
  await navigator.clipboard.writeText(copiedText);

  statusText.style.display = 'block';
        setTimeout(() => { statusText.style.display = 'none'; }, 2000);
})