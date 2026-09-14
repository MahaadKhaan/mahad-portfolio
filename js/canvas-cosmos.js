// Optimized Lightweight Starfield & Constellation Engine (Zero Scroll Lag)
(function() {
  const canvas = document.getElementById('cosmos-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let width = 0, height = 0;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let isTabActive = true;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - width / 2) * 0.03;
    targetMouseY = (e.clientY - height / 2) * 0.03;
  }, { passive: true });

  // 1. Efficient Stars (Dynamically scaled for mobile vs desktop)
  const isMobile = window.innerWidth < 768;
  const STAR_COUNT = isMobile ? 25 : 80;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2
    });
  }

  let time = 0;

  function draw() {
    if (!isTabActive) {
      requestAnimationFrame(draw);
      return;
    }

    time += 0.016;
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // Render Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = Math.sin(time * 2.5 + s.phase) * 0.25 + 0.75;
      const px = (s.x + mouseX + width) % width;
      const py = (s.y + mouseY + height) % height;

      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * twinkle})`;
      ctx.fill();
    }

    // Render Celestial Ellipse Arcs
    const cx = width / 2 + mouseX * 0.2;
    const cy = height / 2 + mouseY * 0.2;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(cx, cy, width * 0.44, height * 0.52, -0.2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + 40, cy - 20, width * 0.3, height * 0.38, 0.3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
