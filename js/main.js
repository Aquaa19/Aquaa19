// js/main.js
// Portfolio interactions: typewriter, glass lens, skill reveal, section fade-in, and project stagger

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------
     Typewriter (reads .typed-text)
     --------------------------- */
  (function initTypewriter(){
    const source = document.querySelector('.typed-text');
    const output = document.getElementById('typed-roles');
    if (!source || !output) return;

    const raw = source.textContent.trim();
    const phrases = raw.length ? raw.split(/\s*,\s*/) : [];
    if (!phrases.length) return;

    const cfg = { typeSpeed: 50, backSpeed: 30, pause: 1400, loop: true };

    let pIndex = 0, charIndex = 0, typing = true, timeoutId = null;

    function typeTick(){
      const current = phrases[pIndex];
      if (typing) {
        charIndex++;
        output.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          typing = false;
          timeoutId = setTimeout(typeTick, cfg.pause);
        } else {
          timeoutId = setTimeout(typeTick, cfg.typeSpeed);
        }
      } else {
        charIndex--;
        output.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          typing = true;
          pIndex = (pIndex + 1) % phrases.length;
          timeoutId = setTimeout(typeTick, cfg.typeSpeed);
        } else {
          timeoutId = setTimeout(typeTick, cfg.backSpeed);
        }
      }
    }

    typeTick();

    const prm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prm && prm.matches) {
      clearTimeout(timeoutId);
      output.textContent = phrases[0];
    }
  })();

  /* ---------------------------
     Glass lens cursor
     --------------------------- */
  (function initGlassLens(){
    const lens = document.querySelector('.glass-lens');
    if (!lens) return;

    const isTouch = matchMedia('(pointer:coarse)').matches || ('ontouchstart' in window);
    if (isTouch) {
      lens.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', function (e) {
      const x = e.clientX, y = e.clientY;
      lens.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1) rotate(${(x - window.innerWidth/2)/80}deg)`;
      lens.style.opacity = '0.98';
    });

    document.addEventListener('mouseleave', function () {
      lens.style.opacity = '0';
    });
  })();

  /* ---------------------------
     Tabs & Skills reveal
     --------------------------- */
  (function initTabsAndSkills(){
    // tabs
    document.querySelectorAll('.tabs .tab').forEach(btn => {
      btn.addEventListener('click', function(){
        const parent = btn.closest('.tabs');
        if (!parent) return;
        parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        const panels = parent.parentElement.querySelectorAll('.panel');
        panels.forEach(p => {
          p.hidden = p.id !== target;
        });
      });
    });

    // reveal skill bars when skills section enters viewport
    const skillsCard = document.querySelector('.skills-card');
    if (!skillsCard) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillsCard.classList.add('revealed');
          // Animate each bar to its data-percent value
          skillsCard.querySelectorAll('.skill').forEach(skill => {
            const fill = skill.querySelector('.skill-fill');
            if (!fill) return;
            const percent = skill.getAttribute('data-percent') || '0';
            fill.style.setProperty('--target-width', percent + '%');
          });
        }
      });
    }, { threshold: 0.2 });

    observer.observe(skillsCard);
  })();

  /* ---------------------------
     Section fade-in on scroll
     --------------------------- */
  (function initSectionAnimations(){
    const sections = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(sec => observer.observe(sec));
  })();

  /* ---------------------------
     Project cards stagger animation
     --------------------------- */
  (function initProjectCardStagger(){
    const projectSection = document.querySelector('.projects-card');
    if (!projectSection) return;

    const projectCards = projectSection.querySelectorAll('.project-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          projectCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('in-view'), i * 120); // 120ms stagger
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(projectSection);
  })();

}); // DOMContentLoaded
