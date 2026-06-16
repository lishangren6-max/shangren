(() => {
  const canvas = document.getElementById('lineCanvas');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  const points = Array.from({ length: 36 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00028, vy: (Math.random() - .5) * .00028 }));
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.lineWidth = 1;
    for(const p of points){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > 1) p.vx *= -1;
      if(p.y < 0 || p.y > 1) p.vy *= -1;
    }
    for(let i=0;i<points.length;i++){
      for(let j=i+1;j<points.length;j++){
        const a=points[i], b=points[j];
        const ax=a.x*w, ay=a.y*h, bx=b.x*w, by=b.y*h;
        const dist=Math.hypot(ax-bx, ay-by);
        if(dist<165){
          ctx.strokeStyle = `rgba(20, 24, 30, ${0.055 * (1-dist/165)})`;
          ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();
        }
      }
    }
    for(const p of points){
      ctx.fillStyle = 'rgba(20,24,30,.16)';
      ctx.beginPath(); ctx.arc(p.x*w,p.y*h,1.15,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); draw(); window.addEventListener('resize', resize);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const close = document.getElementById('lightboxClose');
  document.querySelectorAll('img.clickable').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'Preview';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
  function hide(){ lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); }
  close.addEventListener('click', hide);
  lightbox.addEventListener('click', e => { if(e.target === lightbox) hide(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') hide(); });
})();
