function initV8Reveal(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const selectors=[
    'body.v8-home main > section:not(.v6-hero)',
    'body.v8-home .yw-stat-grid article',
    'body.v8-home .yw-product-card',
    'body.v8-home .yw-why-grid article',
    'body.v8-home .v5-proof-card',
    'body.v8-home .yw-news-card',
    'body.v8-home .yw-landscape-grid figure',
    'body.v8-top-page main > section:not(.v6-page-hero)',
    'body.v8-top-page .yw-product-card',
    'body.v8-top-page .project-card',
    'body.v8-top-page .evidence-card',
    'body.v8-top-page .yw-news-card'
  ];
  const nodes=[...new Set(selectors.flatMap(selector=>[...document.querySelectorAll(selector)]))];
  nodes.forEach((node,index)=>{
    node.classList.add('v8-reveal');
    if(node.matches('main > section'))node.classList.add('v8-reveal-soft');
    node.style.setProperty('--v8-delay',`${Math.min(index%6,5)*65}ms`);
  });
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  nodes.forEach(node=>observer.observe(node));
}

document.addEventListener('DOMContentLoaded',initV8Reveal);
