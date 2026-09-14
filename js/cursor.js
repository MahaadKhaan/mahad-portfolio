// Custom Magnetic Follower Cursor & Contextual Tooltip Pill
(function() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;
  const cursorDot = cursor.querySelector('.cursor-dot');
  const cursorPill = cursor.querySelector('.cursor-pill');
  const cursorPillText = cursor.querySelector('.cursor-pill-text');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursor.style.opacity = '1';
    }
  });

  window.addEventListener('mouseleave', () => {
    isVisible = false;
    cursor.style.opacity = '0';
  });

  // Smooth lerp animation loop
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Dynamic interactive targets
  function bindHoverElements() {
    // 1. Elements with custom cursor text
    document.querySelectorAll('[data-cursor-text]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor-text') || 'View';
        if (cursorPillText) cursorPillText.textContent = text;
        cursor.classList.add('active-pill');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active-pill');
      });
    });

    // 2. Buttons & inputs with magnetic scaling
    document.querySelectorAll('button, a, input, .magnetic-target').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!cursor.classList.contains('active-pill')) {
          cursorDot.style.transform = 'scale(1.8)';
          cursorDot.style.boxShadow = '0 0 16px rgba(255, 255, 255, 1)';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (!cursor.classList.contains('active-pill')) {
          cursorDot.style.transform = 'scale(1)';
          cursorDot.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.9)';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindHoverElements);
  } else {
    bindHoverElements();
  }

  window.refreshCursorHover = bindHoverElements;
})();
