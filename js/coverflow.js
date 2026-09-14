// Reusable 3D Coverflow Engine for Bridal Atelier & Video Reels
function initCoverflow({
  viewportId,
  trackId,
  dotsContainerId,
  prevBtnId,
  nextBtnId,
  autoInterval = 3500,
  isVideo = false
}) {
  const viewport = document.getElementById(viewportId);
  const track = document.getElementById(trackId);
  const dotsContainer = document.getElementById(dotsContainerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!track) return null;
  const cards = Array.from(track.querySelectorAll('.coverflow-card'));
  const total = cards.length;
  if (total === 0) return null;

  let currentIndex = 0;
  let autoTimer = null;
  let isHovered = false;
  let isAudioPlaying = false;

  // Build Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `coverflow-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateVideoPlayback() {
    if (!isVideo) return;
    cards.forEach((card) => {
      const vid = card.querySelector('video');
      if (!vid) return;
      const state = card.getAttribute('data-state');
      if (state === 'active') {
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }

  function updateCards() {
    cards.forEach((card, idx) => {
      let diff = idx - currentIndex;
      // Handle circular wrapping
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      if (diff === 0) {
        card.setAttribute('data-state', 'active');
      } else if (diff === -1) {
        card.setAttribute('data-state', 'prev-1');
      } else if (diff === 1) {
        card.setAttribute('data-state', 'next-1');
      } else if (diff === -2) {
        card.setAttribute('data-state', 'prev-2');
      } else if (diff === 2) {
        card.setAttribute('data-state', 'next-2');
      } else {
        card.setAttribute('data-state', 'hidden');
      }
    });

    // Update pagination dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.coverflow-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    if (isVideo) {
      updateVideoPlayback();
    }
  }

  function goToSlide(idx) {
    currentIndex = (idx + total) % total;
    updateCards();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Card Click Interaction
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      const isCardActive = card.getAttribute('data-state') === 'active';

      // If clicking inside active card's interactive controls
      if (e.target.closest('.card-sound-toggle-btn')) {
        const vid = card.querySelector('video');
        const iconSpan = card.querySelector('.sound-icon-text');
        if (vid) {
          vid.muted = !vid.muted;
          isAudioPlaying = !vid.muted;
          if (iconSpan) {
            iconSpan.textContent = vid.muted ? '🔇 Sound' : '🔊 Sound On';
          }
          if (isAudioPlaying) {
            stopTimer(); // Don't swipe away while user is listening to video audio!
          } else {
            resetTimer();
          }
        }
        return;
      }

      if (e.target.closest('.watch-full-video-btn')) {
        const vid = card.querySelector('video');
        const src = card.getAttribute('data-video-src') || (vid ? vid.src : '');
        const title = card.getAttribute('data-video-title') || 'Featured AI Video';
        const cat = card.getAttribute('data-video-cat') || 'AI Video Production';
        if (window.openVideoLightbox) {
          window.openVideoLightbox(src, title, cat);
        }
        return;
      }

      if (e.target.closest('.view-render-btn')) {
        const img = card.querySelector('img');
        const title = card.querySelector('.garment-title')?.textContent || 'Bridal Couture';
        if (img && window.openLightbox) {
          window.openLightbox(img.src, title, 'AI BRIDAL COUTURE');
        }
        return;
      }

      // Clicking active bridal card opens photo lightbox
      if (isCardActive && !isVideo) {
        const img = card.querySelector('img');
        const title = card.querySelector('.garment-title')?.textContent || 'Bridal Couture';
        if (img && window.openLightbox) {
          window.openLightbox(img.src, title, 'AI BRIDAL COUTURE');
        }
        return;
      }

      // If clicking inactive card, jump directly to it
      goToSlide(idx);
      resetTimer();
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });

  // Auto-swiping Timer
  function startTimer() {
    stopTimer();
    if (autoInterval <= 0) return;
    autoTimer = setInterval(() => {
      if (!isHovered && !isAudioPlaying) {
        nextSlide();
      }
    }, autoInterval);
  }

  function stopTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetTimer() {
    startTimer();
  }

  if (viewport) {
    viewport.addEventListener('mouseenter', () => { isHovered = true; });
    viewport.addEventListener('mouseleave', () => { isHovered = false; });

    // Touch & Swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      isHovered = false;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
        resetTimer();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
        resetTimer();
      }
    }, { passive: true });
  }

  // Initial setup
  updateCards();
  startTimer();

  return {
    next: nextSlide,
    prev: prevSlide,
    goTo: goToSlide
  };
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Bridal 3D Coverflow (Auto-swipes every 3.5s)
  initCoverflow({
    viewportId: 'bridal-coverflow-viewport',
    trackId: 'bridal-coverflow-track',
    dotsContainerId: 'bridal-coverflow-dots',
    prevBtnId: 'coverflow-prev',
    nextBtnId: 'coverflow-next',
    autoInterval: 3500,
    isVideo: false
  });

  // 2. Video 3D Coverflow (Default: Bridal Video index 0, NO auto-swipe, only manual swipe/click)
  initCoverflow({
    viewportId: 'video-coverflow-viewport',
    trackId: 'video-coverflow-track',
    dotsContainerId: 'video-coverflow-dots',
    prevBtnId: 'video-coverflow-prev',
    nextBtnId: 'video-coverflow-next',
    autoInterval: 0,
    isVideo: true
  });
});
