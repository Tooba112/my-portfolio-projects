/* ===========================
   DEVELOPER TOOBA — script.js
   =========================== */

/* ---- CODE TYPER ---- */
const CODE_LINES = [
  ['<span class="tok-kw">const</span> <span class="tok-var">tooba</span> = {'],
  ['  <span class="tok-key">role:</span> <span class="tok-str">\'BS Computer Science\'</span>,'],
  ['  <span class="tok-key">university:</span> <span class="tok-str">\'COMSATS University Islamabad\'</span>,'],
  ['  <span class="tok-key">semester:</span> <span class="tok-num">6</span>,'],
  ['  <span class="tok-key">status:</span> <span class="tok-str">\'open to internships\'</span>,'],
  ['};'],
];

(function runTyper() {
  const el = document.getElementById('codeTyper');
  if (!el) return;

  let lineIndex = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';

  function typeNextLine() {
    if (lineIndex >= CODE_LINES.length) {
      el.removeChild(cursor);
      return;
    }
    const line = document.createElement('div');
    line.innerHTML = CODE_LINES[lineIndex][0];
    el.insertBefore(line, cursor.parentNode ? cursor : null);

    // append cursor if not already there
    el.appendChild(cursor);
    lineIndex++;
    setTimeout(typeNextLine, 400);
  }

  el.appendChild(cursor);
  setTimeout(typeNextLine, 600);
})();

/* ---- INTERSECTION OBSERVER FOR REVEALS ---- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- SKILL BARS ---- */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const width = target.dataset.width || '0';
      // Small delay so reveal animation lands first
      setTimeout(() => {
        target.style.width = width + '%';
      }, 150);
      skillObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ---- MOBILE NAV TOGGLE ---- */
const toggleBtn = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.getElementById('mobileNav');

if (toggleBtn && mobileNav) {
  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* ---- SMOOTH NAV ACTIVE STATE ---- */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + id
          ? 'var(--violet-300)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));

/* ---- CONTACT FORM ---- */
function handleSend(btn) {
  const panel = btn.closest('.code-panel');
  const inputs = panel.querySelectorAll('input, textarea');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ff5f56';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) return;

  const original = btn.innerHTML;
  btn.innerHTML = 'Message sent ✓';
  btn.style.background = 'linear-gradient(135deg, #27c93f, #5eead4)';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    btn.disabled = false;
    inputs.forEach(input => (input.value = ''));
  }, 4000);
}

/* ---- PROJECT CARD TILT EFFECT ---- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.35s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  });
});

/* ---- NAV HIDE ON SCROLL DOWN ---- */
(function navScroll() {
  const nav = document.querySelector('.nav-bar');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80 && y > lastY) {
      nav.style.transform = 'translateY(-100%)';
      nav.style.transition = 'transform 0.3s ease';
    } else {
      nav.style.transform = '';
    }
    lastY = y;
  }, { passive: true });
})();
