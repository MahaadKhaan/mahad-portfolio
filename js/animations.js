// Native Hardware-Accelerated GSAP & ScrollTrigger Pipeline (Zero Trackpad Latency)
window.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Preloader & Brand Morph
  const preloader = document.getElementById('preloader');
  const preloaderLogo = document.getElementById('preloader-logo');
  const preloaderText = document.getElementById('preloader-brand-text');
  const preloaderRings = document.querySelectorAll('.preloader-ring');
  const headerBrand = document.getElementById('header-brand');
  const headerCenterPill = document.getElementById('header-center-pill');
  const headerMenuPill = document.getElementById('header-menu-pill');

  const preloaderTl = gsap.timeline();

  preloaderTl
    .to(preloaderRings, {
      scale: 1.5,
      opacity: 0.5,
      duration: 0.9,
      stagger: 0.15,
      ease: "power2.out"
    })
    .fromTo(preloaderText, 
      { opacity: 0, letterSpacing: "12px" },
      { opacity: 1, letterSpacing: "4px", duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .to(preloaderText, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      delay: 0.1
    });

  preloaderTl.add(() => {
    const startRect = preloaderLogo.getBoundingClientRect();
    const targetRect = headerBrand.getBoundingClientRect();

    const dx = targetRect.left + targetRect.width / 2 - (startRect.left + startRect.width / 2);
    const dy = targetRect.top + targetRect.height / 2 - (startRect.top + startRect.height / 2);
    const scaleFactor = targetRect.height / startRect.height;

    gsap.to(preloaderLogo, {
      x: dx,
      y: dy,
      scale: scaleFactor,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        headerBrand.style.opacity = '1';
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            initHeroEntrance();
          }
        });
      }
    });

    gsap.fromTo([headerCenterPill, headerMenuPill],
      { y: -25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.4, stagger: 0.1, ease: "power2.out" }
    );
  });

  // 2. Hero Entrance Sequence
  function initHeroEntrance() {
    const heroTl = gsap.timeline();

    heroTl
      .to('.hero-title-line', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })
      .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to('.hero-coords', {
        opacity: 0.6,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4");

    const heroCards = document.querySelectorAll('.hero-card');
    const heroMobileCards = document.querySelectorAll('.hero-mobile-card');
    
    if (heroCards.length) {
      heroTl.fromTo(heroCards,
        { y: 120, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          onComplete: initHeroIdleParallax
        },
        "-=0.6"
      );
    }

    if (heroMobileCards.length) {
      heroTl.fromTo(heroMobileCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out"
        },
        "-=0.5"
      );
    }
  }

  function initHeroIdleParallax() {
    // Gentle floating motion for desktop cards
    gsap.to(['.card-pos-1', '.card-pos-3'], {
      y: '+=8',
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(['.card-pos-2', '.card-pos-4'], {
      y: '-=8',
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // 3. Section 1 -> Section 2 Gentle Scroll Parallax (Cards never disappear abruptly)
  const heroSection = document.getElementById('section-hero');
  const sec2 = document.getElementById('section-about');

  gsap.to('.hero-card', {
    scrollTrigger: {
      trigger: heroSection,
      start: "center top",
      end: "bottom top",
      scrub: 1
    },
    y: -60,
    opacity: 0.35
  });

  gsap.to('#hero-center-content', {
    scrollTrigger: {
      trigger: heroSection,
      start: "center top",
      end: "bottom top",
      scrub: 1
    },
    y: -50,
    opacity: 0.3
  });

  // Section 2: Polaroid & Headline
  const polaroid = document.querySelector('.polaroid-frame');
  if (polaroid) {
    gsap.fromTo(polaroid,
      { y: 80, rotate: 5, opacity: 0 },
      {
        scrollTrigger: {
          trigger: sec2,
          start: "top 75%",
          end: "top 30%",
          scrub: 0.5
        },
        y: 0,
        rotate: -2.5,
        opacity: 1
      }
    );
  }

  gsap.utils.toArray('.sec2-reveal-line').forEach((line, index) => {
    gsap.fromTo(line,
      { y: "110%", opacity: 0 },
      {
        scrollTrigger: {
          trigger: sec2,
          start: `top ${70 - index * 6}%`,
          end: `top ${40 - index * 6}%`,
          scrub: 0.5
        },
        y: "0%",
        opacity: 1
      }
    );
  });

  gsap.fromTo('.sec2-narrative',
    { opacity: 0, y: 25 },
    {
      scrollTrigger: {
        trigger: sec2,
        start: "top 55%",
        end: "top 25%",
        scrub: 0.5
      },
      opacity: 1,
      y: 0
    }
  );

  // 4. Section 3: "ALL TYPES OF PROJECTS"
  const sec3 = document.getElementById('section-projects');
  if (sec3) {
    gsap.fromTo('.sec3-title-line',
      { y: "110%", opacity: 0 },
      {
        scrollTrigger: {
          trigger: sec3,
          start: "top 75%",
          end: "top 45%",
          scrub: 0.5
        },
        y: "0%",
        opacity: 1,
        stagger: 0.1
      }
    );

    gsap.fromTo('.project-card',
      { y: 100, opacity: 0, scale: 0.94 },
      {
        scrollTrigger: {
          trigger: sec3,
          start: "top 60%",
          end: "bottom 90%",
          scrub: 0.5
        },
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1
      }
    );
  }

  // 5. Section 4: "SYNTHETIC MASTERY"
  const sec4 = document.getElementById('section-mastery');
  if (sec4) {
    gsap.utils.toArray('.sec4-title-line').forEach((line, index) => {
      gsap.fromTo(line,
        { y: "115%", opacity: 0 },
        {
          scrollTrigger: {
            trigger: sec4,
            start: `top ${75 - index * 8}%`,
            end: `top ${40 - index * 8}%`,
            scrub: 0.5
          },
          y: "0%",
          opacity: 1
        }
      );
    });
  }

  // 6. Section 5: CTA
  const sec5 = document.getElementById('section-cta');
  if (sec5) {
    gsap.fromTo('.cta-headline-line',
      { y: "110%", opacity: 0 },
      {
        scrollTrigger: {
          trigger: sec5,
          start: "top 65%",
          end: "top 30%",
          scrub: 0.5
        },
        y: "0%",
        opacity: 1,
        stagger: 0.12
      }
    );
  }
});
