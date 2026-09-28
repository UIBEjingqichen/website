function initV8Reveal(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const selectors=[
    'body.ty-home main > section:not(.v6-hero)',
    'body.ty-home .ty-home__stat-grid article',
    'body.ty-home .ty-home__product-card',
    'body.ty-home .ty-home__why-grid article',
    'body.ty-home .ty-carousel__proof-card',
    'body.ty-home .ty-home__news-card',
    'body.ty-home .ty-home__landscape-grid figure',
    'body.v8-top-page main > section:not(.v6-page-hero)',
    'body.v8-top-page .ty-home__product-card',
    'body.v8-top-page .project-card',
    'body.v8-top-page .evidence-card',
    'body.v8-top-page .ty-home__news-card'
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
