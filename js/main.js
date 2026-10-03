/* ==========================================
   TechFlows TN - Main JavaScript
   ========================================== */

'use strict';

// ---- Navbar scroll behavior ----
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ---- Mobile nav toggle ----
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav?.classList.toggle('open');
  document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close mobile nav on outside click
mobileNav?.addEventListener('click', (e) => {
  if (e.target === mobileNav) {
    hamburger?.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ---- Active nav link ----
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- Scroll Reveal Animation ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ---- Counter Animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ---- Contact Form & URL Pre-fill ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.querySelector('.form-success');

function initContactFormPrefill() {
  const serviceSelect = document.getElementById('service');
  const messageInput = document.getElementById('message');
  if (!serviceSelect && !messageInput) return;

  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  const courseParam = params.get('course');
  const subjectParam = params.get('subject');

  if (serviceParam && serviceSelect) {
    serviceSelect.value = serviceParam;
  }

  if (courseParam && messageInput) {
    messageInput.value = `Hello TechFlows TN! I would like to get more information and the complete training plan for the "${courseParam}" formation.`;
  } else if (subjectParam && messageInput) {
    messageInput.value = `Regarding: ${subjectParam}\n\n`;
  }
}
initContactFormPrefill();

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML; // store exact HTML because the button has an svg icon
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const formData = new FormData(contactForm);

  fetch('https://formsubmit.co/ajax/mariemjammeli99@gmail.com', {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    contactForm.style.display = 'none';
    if (formSuccess) {
      formSuccess.style.display = 'block';
    }
  })
  .catch(error => {
    console.error(error);
    btn.disabled = false;
    btn.innerHTML = originalText;
    alert('Oops! There was a problem submitting your form. Please try again or use WhatsApp.');
  });
});

// ---- Workflow filter ----
const filterBtns = document.querySelectorAll('.filter-btn');
const workflowCards = document.querySelectorAll('.workflow-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    workflowCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.animation = 'fadeSlideUp 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ---- Parallax tilt on cards (subtle) ----
document.querySelectorAll('.service-card, .glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- Smooth page transitions ----
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Internal links that are not fragments/emails/etc.
    const isInternal = href && 
                       !href.startsWith('#') && 
                       !href.startsWith('http') && 
                       !href.startsWith('mailto') && 
                       !href.startsWith('tel');
    
    // Only apply to .html pages or root
    const isPage = href && (href.includes('.html') || href === './');

    if (isInternal && isPage) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.25s ease';
      setTimeout(() => { 
        window.location.href = href; 
      }, 250);
    }
  });
});

// Fade in on load
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.4s ease';
});
