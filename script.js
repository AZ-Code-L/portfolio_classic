// Smooth scroll updates and page interactions for the portfolio.
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const siteHeader = document.querySelector('.site-header');
const scrollProgress = document.getElementById('scrollProgress');
const fadeElements = document.querySelectorAll('.fade-in');
const form = document.getElementById('contactForm');

// Toggle mobile menu visibility.
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.setAttribute(
      'aria-label',
      navMenu.classList.contains('open') ? 'Close navigation' : 'Open navigation'
    );
  });
}

// Close mobile menu on navigation link click.
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
  });
});

// Add sticky header shadow after scrolling.
window.addEventListener('scroll', () => {
  if (siteHeader) {
    if (window.scrollY > 24) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  if (scrollProgress) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    scrollProgress.style.width = `${scrolled}%`;
  }
});

// Intersection Observer for fade-in animations and active nav state.
const observerOptions = {
  threshold: 0.15,
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

fadeElements.forEach(el => revealObserver.observe(el));

const sections = document.querySelectorAll('main section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href='#${id}']`);
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      if (navLink) {
        navLink.classList.add('active');
      }
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

// Skill rows stay still until the user drags them.
const skillRows = document.querySelectorAll('.skill-row');
const projectCarousel = document.querySelector('.projects-grid');

function initSkillRow(row) {
  const track = row.querySelector('.skill-row-track');
  const content = row.querySelector('.skill-row-content');

  if (!track || !content) return;

  const cards = Array.from(content.querySelectorAll('.skill-card'));

  if (cards.length < 2) {
    row.classList.add('skill-row--static');
    return;
  }

  let isDragging = false;
  let activePointerId = null;
  let dragStartX = 0;
  let startScrollLeft = 0;

  row.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    isDragging = true;
    activePointerId = event.pointerId;
    dragStartX = event.clientX;
    startScrollLeft = row.scrollLeft;
    row.classList.add('is-dragging');
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    row.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  row.addEventListener('pointermove', (event) => {
    if (!isDragging || event.pointerId !== activePointerId) return;

    const deltaX = event.clientX - dragStartX;
    row.scrollLeft = startScrollLeft - deltaX;
  });

  const stopDragging = (event) => {
    if (!isDragging) return;
    if (event.pointerId !== undefined && event.pointerId !== activePointerId) return;

    isDragging = false;
    row.classList.remove('is-dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    activePointerId = null;

    if (event.pointerId !== undefined) {
      row.releasePointerCapture?.(event.pointerId);
    }
  };

  row.addEventListener('pointerup', stopDragging);
  row.addEventListener('pointercancel', stopDragging);
  row.addEventListener('pointerleave', stopDragging);

  row.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      row.scrollLeft += event.deltaY;
    }
  }, { passive: false });
}

skillRows.forEach(initSkillRow);

if (projectCarousel) {
  let isDraggingProjects = false;
  let projectDragStartX = 0;
  let projectStartScrollLeft = 0;
  let projectActivePointerId = null;

  const startProjectDrag = (event) => {
    if (event.button !== 0) return;

    isDraggingProjects = true;
    projectDragStartX = event.clientX;
    projectStartScrollLeft = projectCarousel.scrollLeft;
    projectActivePointerId = event.pointerId;
    projectCarousel.classList.add('is-dragging');
    projectCarousel.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const moveProjectDrag = (event) => {
    if (!isDraggingProjects || event.pointerId !== projectActivePointerId) return;
    const deltaX = event.clientX - projectDragStartX;
    projectCarousel.scrollLeft = projectStartScrollLeft - deltaX;
  };

  const stopProjectDrag = (event) => {
    if (!isDraggingProjects) return;
    if (event.pointerId !== undefined && event.pointerId !== projectActivePointerId) return;

    isDraggingProjects = false;
    projectCarousel.classList.remove('is-dragging');
    projectActivePointerId = null;

    if (event.pointerId !== undefined) {
      projectCarousel.releasePointerCapture?.(event.pointerId);
    }
  };

  projectCarousel.addEventListener('pointerdown', startProjectDrag);
  projectCarousel.addEventListener('pointermove', moveProjectDrag);
  projectCarousel.addEventListener('pointerup', stopProjectDrag);
  projectCarousel.addEventListener('pointercancel', stopProjectDrag);
  projectCarousel.addEventListener('pointerleave', stopProjectDrag);

  projectCarousel.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      projectCarousel.scrollLeft += event.deltaY;
    }
  }, { passive: false });

  projectCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      projectCarousel.scrollBy({ left: 320, behavior: 'smooth' });
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      projectCarousel.scrollBy({ left: -320, behavior: 'smooth' });
    }
  });
}

// Contact form validation with helpful messages.
function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}Error`);
  errorEl.textContent = message;
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
  const errorEl = document.getElementById(`${input.id}Error`);
  errorEl.textContent = '';
  input.removeAttribute('aria-invalid');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name;
    const email = form.elements.email;
    const subject = form.elements.subject;
    const message = form.elements.message;

    let isValid = true;

    [name, email, subject, message].forEach(input => {
      if (!input.value.trim()) {
        showError(input, 'This field is required.');
        isValid = false;
      } else {
        clearError(input);
      }
    });

    if (email.value && !validateEmail(email.value)) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (isValid) {
      alert('Message submitted successfully! Replace this with real form handling.');
      form.reset();
    }
  });
}

// Setup accessible smooth scroll for anchor links.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (event) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
