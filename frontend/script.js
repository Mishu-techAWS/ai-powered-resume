/* ═══════════════════════════════════════════════════════════
   MISHAL YADAV — PORTFOLIO SCRIPTS
   Particles · Typing · Counters · Skill Bars · 3D Tilt · Nav
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────
     PARTICLE CANVAS BACKGROUND
  ────────────────────────────────────────────────────── */
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 140;
  const COLORS = ['rgba(0,212,255,', 'rgba(139,92,246,', 'rgba(16,185,129,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.45,
      vy:  (Math.random() - 0.5) * 0.45,
      r:   Math.random() * 1.5 + 0.5,
      color,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(randomParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color + opacity + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  drawParticles();


  /* ──────────────────────────────────────────────────────
     NAVBAR — SCROLL + ACTIVE LINK
  ────────────────────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });


  /* ──────────────────────────────────────────────────────
     MOBILE HAMBURGER MENU
  ────────────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const navLinkUl  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinkUl.classList.toggle('open');
  });

  navLinkUl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinkUl.classList.remove('open');
    });
  });


  /* ──────────────────────────────────────────────────────
     TYPING ANIMATION
  ────────────────────────────────────────────────────── */
  const typedEl    = document.getElementById('typed-text');
  const phrases    = [
    'Cloud Architecture',
    'Kubernetes & EKS',
    'CI/CD Automation',
    'AWS Infrastructure',
    'Terraform & IaC',
    'DevSecOps',
    'AI-Powered DevOps',
    'SRE & Observability',
  ];
  let pi = 0, ci = 0, deleting = false;
  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_END     = 1800;
  const PAUSE_START   = 300;

  function typeLoop() {
    const phrase = phrases[pi];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(typeLoop, PAUSE_END);
        return;
      }
    } else {
      typedEl.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(typeLoop, PAUSE_START);
        return;
      }
    }
    setTimeout(typeLoop, deleting ? DELETING_SPEED : TYPING_SPEED);
  }
  typeLoop();


  /* ──────────────────────────────────────────────────────
     INTERSECTION OBSERVER — REVEAL + COUNTERS + SKILL BARS
  ────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));


  /* Counter animation */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step     = 16;
    const steps    = duration / step;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
        return;
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  const counterEls = document.querySelectorAll('.counter');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObs.observe(el));


  /* Skill bar animation */
  const skillBars = document.querySelectorAll('.sk-fill');
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        barObs.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => barObs.observe(bar));


  /* ──────────────────────────────────────────────────────
     3D CARD TILT ON MOUSE MOVE
  ────────────────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -7;
      const tiltY  = dx *  7;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });


  /* ──────────────────────────────────────────────────────
     SMOOTH SCROLL FOR ANCHOR LINKS
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ──────────────────────────────────────────────────────
     RESUME DOWNLOAD BUTTON (nav-resume)
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('[download]').forEach(btn => {
    btn.addEventListener('click', e => {
      const link = document.createElement('a');
      link.href     = btn.getAttribute('href');
      link.download = btn.getAttribute('download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      e.preventDefault();
    });
  });

});
