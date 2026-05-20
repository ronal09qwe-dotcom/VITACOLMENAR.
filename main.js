/* =============================================
   VITOCOLMENAR – main.js (versión mejorada)
   ============================================= */

// === CURSOR PERSONALIZADO ===
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// El ring sigue con un pequeño retraso
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Efecto hover en elementos interactivos
const interactiveEls = document.querySelectorAll('a, button, .product-card, .mini-card, .step');
interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// === BARRA DE PROGRESO SCROLL ===
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / maxScroll) * 100) + '%';
}, { passive: true });

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// === HAMBURGER MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('#navbar ul');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.innerHTML = isOpen ? '&#x2715;' : '&#9776;';
});
document.querySelectorAll('#navbar ul a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.innerHTML = '&#9776;';
  });
});

// === ACTIVE NAV LINK CON CLASE (no inline style) ===
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  document.querySelectorAll('#navbar ul a').forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// === REVEAL ON SCROLL (con stagger) ===
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const target = entry.target;

    // Si el padre tiene varios hermanos con .reveal, los escalona
    const siblings = [...target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')]
      .filter(el => !el.classList.contains('visible'));

    if (siblings.length > 1) {
      siblings.forEach((el, idx) => {
        setTimeout(() => el.classList.add('visible'), idx * 130);
      });
    } else {
      target.classList.add('visible');
    }

    revealObserver.unobserve(target);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// === CONTADOR ANIMADO (impact band) ===
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString('es-CO');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (!isNaN(target)) animateCounter(el, target);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// === PARTÍCULAS EN EL HERO ===
(function spawnParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size   = Math.random() * 4 + 2;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 8;
    const dur    = Math.random() * 8 + 6;
    const opacity = Math.random() * 0.5 + 0.2;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
      opacity: ${opacity};
    `;
    container.appendChild(p);
  }
})();

// === EFECTO PARALLAX SUAVE EN HERO ===
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!heroContent) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
    heroContent.style.opacity   = 1 - (scrolled / (window.innerHeight * 0.85));
  }
}, { passive: true });

// === TOAST / NOTIFICACIÓN ===
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// === FORMULARIO DE CONTACTO ===
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = this.querySelector('.btn');
  const msg = document.getElementById('formMsg');

  // Estado de carga
  btn.textContent = 'Enviando…';
  btn.disabled    = true;

  // Simula envío (500 ms)
  setTimeout(() => {
    msg.textContent = '✓ ¡Mensaje enviado! Te contactaremos pronto.';
    btn.textContent = 'Enviar mensaje';
    btn.disabled    = false;
    this.reset();

    showToast('🍯 ¡Gracias por contactarnos!');

    setTimeout(() => { msg.textContent = ''; }, 5000);
  }, 500);
});

// === TILT SUAVE EN PRODUCT CARDS ===
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const rotateX = -(y / rect.height) * 6;
    const rotateY =  (x / rect.width)  * 6;
    card.style.transform     = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    card.style.transition    = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .35s ease, box-shadow .35s';
  });
});
