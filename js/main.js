/* ============================================
   AI × COMIC FUTURE — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Scroll Reveal ───
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Nav Scroll Effect ───
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 80);
    lastScroll = y;
  });

  // ─── Active Nav Link ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  // ─── Mobile Menu ───
  const toggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // ─── Progress Bar ───
  const progressFill = document.getElementById('progress-fill');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = progress + '%';
  });

  // ─── Back to Top ───
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Hero Canvas: Comic Pop Particles ───
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Comic-style particles: dots, small rectangles (like Ben-Day dots)
    const particles = [];
    const COLORS = ['#ff2d55', '#00d4ff', '#ffd700', '#ff6b6b'];
    const PARTICLE_COUNT = 80;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.4 + 0.1,
        type: Math.random() > 0.7 ? 'rect' : 'circle',
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02
      });
    }

    // Halftone dots (bigger, decorative)
    const halftones = [];
    for (let i = 0; i < 30; i++) {
      halftones.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 20 + 5,
        alpha: Math.random() * 0.06 + 0.02,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      // Draw halftone circles
      halftones.forEach(h => {
        h.pulse += 0.005;
        const s = h.size + Math.sin(h.pulse) * 3;
        ctx.beginPath();
        ctx.arc(h.x, h.y, s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${h.alpha})`;
        ctx.fill();
      });

      // Draw comic particles
      particles.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.15;
        p.y += p.vy + Math.cos(p.wobble) * 0.15;

        // Wrap around edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === 'rect') {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }
});
