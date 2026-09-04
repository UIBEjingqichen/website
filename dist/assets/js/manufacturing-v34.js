(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const metrics = [...document.querySelectorAll('[data-mfg-count]')];
  const format = (value, el) => {
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = Number(el.dataset.decimals || 0);
    return `${prefix}${Number(value).toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}${suffix}`;
  };
  const animate = (el) => {
    const target = Number(el.dataset.mfgCount || 0);
    const start = performance.now();
    const duration = Number(el.dataset.duration || 1350);
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased), el);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = format(target, el);
    };
    requestAnimationFrame(tick);
  };
  if (metrics.length) {
    if (reduced || !('IntersectionObserver' in window)) metrics.forEach((el)=>{el.textContent=format(Number(el.dataset.mfgCount||0),el);});
    else {
      metrics.forEach((el)=>{el.textContent=format(0,el);});
      const block = document.querySelector('#overview .mfg34-metrics');
      const observer = new IntersectionObserver((entries)=>{
        if (!entries[0]?.isIntersecting) return;
        metrics.forEach((el,i)=>setTimeout(()=>animate(el),i*55));
        observer.disconnect();
      },{threshold:.2});
      if (block) observer.observe(block); else metrics.forEach(animate);
    }
  }

  const links = [...document.querySelectorAll('.mfg34-jump a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const activate = (id) => links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries)=>{
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (visible?.target?.id) activate(visible.target.id);
    },{rootMargin:'-20% 0px -62% 0px',threshold:[0,.1,.4,.8]});
    sections.forEach(s=>navObserver.observe(s));
  }
  links.forEach(a=>a.addEventListener('click',()=>activate(a.getAttribute('href').slice(1))));
})();
