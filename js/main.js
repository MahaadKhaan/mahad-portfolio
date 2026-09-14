// User Interactions, Video Tabs & Lightbox Handler
document.addEventListener('DOMContentLoaded', () => {
  // 1. Email Submission Interaction
  const emailForm = document.getElementById('email-lead-form');
  const emailInput = document.getElementById('email-lead-input');
  const modalLead = document.getElementById('lead-success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = emailInput ? emailInput.value.trim() : '';
      if (!val || !val.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      if (modalLead) {
        modalLead.classList.remove('hidden');
        modalLead.classList.add('flex');
      }
      if (emailInput) emailInput.value = '';
    });
  }

  if (modalCloseBtn && modalLead) {
    modalCloseBtn.addEventListener('click', () => {
      modalLead.classList.add('hidden');
      modalLead.classList.remove('flex');
    });
  }

  // 2. Fullscreen Menu Overlay
  const menuBtn = document.getElementById('header-menu-pill');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuLinks = document.querySelectorAll('.menu-nav-link');

  function openMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('hidden');
    menuOverlay.classList.add('flex');
  }

  function closeMenu() {
    if (!menuOverlay) return;
    menuOverlay.classList.add('hidden');
    menuOverlay.classList.remove('flex');
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        closeMenu();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 3. Smooth Scroll Triggers
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('data-scroll-to'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 4. Global Media Lightbox Handler (Photos & Videos)
  const lightboxModal = document.getElementById('image-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');

  let currentGalleryIndex = 0;
  let galleryItems = [];

  function collectGalleryItems() {
    galleryItems = [];
    document.querySelectorAll('[data-album-img]').forEach(el => {
      const src = el.getAttribute('data-album-img');
      const title = el.getAttribute('data-album-title') || 'AI Photo';
      const cat = el.getAttribute('data-album-cat') || 'Portfolio';
      if (src && !galleryItems.some(i => i.src === src)) {
        galleryItems.push({ src, title, cat });
      }
    });
  }
  collectGalleryItems();

  window.openLightbox = function(src, title, cat) {
    if (!lightboxModal || !lightboxImg) return;
    collectGalleryItems();

    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
      lightboxVideo.classList.add('hidden');
    }
    if (lightboxImg) lightboxImg.classList.remove('hidden');
    if (lightboxPrevBtn) lightboxPrevBtn.classList.remove('hidden');
    if (lightboxNextBtn) lightboxNextBtn.classList.remove('hidden');

    currentGalleryIndex = galleryItems.findIndex(i => i.src === src);
    if (currentGalleryIndex === -1) {
      currentGalleryIndex = 0;
      galleryItems.push({ src, title, cat });
    }

    showLightboxItem(currentGalleryIndex);
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  };

  window.openVideoLightbox = function(src, title, cat) {
    if (!lightboxModal || !lightboxVideo) return;
    if (lightboxImg) lightboxImg.classList.add('hidden');
    if (lightboxPrevBtn) lightboxPrevBtn.classList.add('hidden');
    if (lightboxNextBtn) lightboxNextBtn.classList.add('hidden');

    lightboxVideo.classList.remove('hidden');
    lightboxVideo.src = src;
    lightboxVideo.currentTime = 0;
    lightboxVideo.muted = false;
    lightboxVideo.play().catch(() => {});

    if (lightboxTitle) lightboxTitle.textContent = title || 'Featured AI Video';
    if (lightboxCategory) lightboxCategory.textContent = cat || 'AI VIDEO PRODUCTION';

    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  };

  function showLightboxItem(index) {
    if (!galleryItems.length) return;
    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentGalleryIndex];
    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCategory) lightboxCategory.textContent = item.cat;
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
      lightboxVideo.classList.add('hidden');
    }
    if (lightboxImg) {
      lightboxImg.classList.remove('hidden');
    }
    if (lightboxPrevBtn) lightboxPrevBtn.classList.remove('hidden');
    if (lightboxNextBtn) lightboxNextBtn.classList.remove('hidden');
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => showLightboxItem(currentGalleryIndex - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => showLightboxItem(currentGalleryIndex + 1));

  // Delegate click for all album items
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-album-img]');
    if (card) {
      // Don't trigger if clicking navigation chevrons or inside coverflow unless active
      if (card.classList.contains('coverflow-card') && card.getAttribute('data-state') !== 'active' && !e.target.closest('.view-render-btn')) {
        return;
      }
      const src = card.getAttribute('data-album-img');
      const title = card.getAttribute('data-album-title') || 'AI Fashion Shoot';
      const cat = card.getAttribute('data-album-cat') || 'Couture Campaign';
      window.openLightbox(src, title, cat);
    }
  });

  // 6. Full Photo Archive Modal Handler & Filter
  const archiveModal = document.getElementById('all-photos-archive-modal');
  const openArchiveBtn = document.getElementById('open-archive-modal-btn');
  const menuArchiveLink = document.getElementById('menu-open-archive-link');
  const closeArchiveBtn = document.getElementById('archive-modal-close-btn');
  const filterBtns = document.querySelectorAll('.archive-filter-btn');
  const archiveCards = document.querySelectorAll('.archive-item');

  function openArchive() {
    if (!archiveModal) return;
    archiveModal.classList.remove('hidden');
    archiveModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeArchive() {
    if (!archiveModal) return;
    archiveModal.classList.add('hidden');
    archiveModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (openArchiveBtn) openArchiveBtn.addEventListener('click', openArchive);
  if (menuArchiveLink) {
    menuArchiveLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu();
      openArchive();
    });
  }
  if (closeArchiveBtn) closeArchiveBtn.addEventListener('click', closeArchive);

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => {
        b.classList.remove('bg-white', 'text-black');
        b.classList.add('text-zinc-400');
      });
      btn.classList.add('bg-white', 'text-black');
      btn.classList.remove('text-zinc-400');

      archiveCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Keyboard Shortcuts (Arrow navigation & Escape)
  window.addEventListener('keydown', (e) => {
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'ArrowRight') showLightboxItem(currentGalleryIndex + 1);
      if (e.key === 'ArrowLeft') showLightboxItem(currentGalleryIndex - 1);
      if (e.key === 'Escape') closeLightbox();
    } else if (archiveModal && !archiveModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeArchive();
    }
  });
});
