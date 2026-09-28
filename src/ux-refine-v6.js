function initV6Hero(slider){
  const slides=[...slider.querySelectorAll('[data-ty-panel__hero-slide]')];
  const dots=[...slider.querySelectorAll('[data-ty-panel__hero-dot]')];
  if(slides.length<2)return;
  let index=slides.findIndex((slide)=>slide.classList.contains('active'));
  if(index<0)index=0;
  const show=(next)=>{
    index=(next+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===index));
    dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
  };
  let timer;
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>show(index+1),5200)};
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);restart()}));
  slider.addEventListener('mouseenter',()=>clearInterval(timer));
  slider.addEventListener('mouseleave',restart);
  restart();
}

function initV6Gallery(gallery){
  const main=gallery.querySelector('[data-ty-panel__main-image]');
  const caption=gallery.querySelector('[data-ty-panel__main-caption]');
  const thumbs=[...gallery.querySelectorAll('[data-ty-panel__thumb]')];
  thumbs.forEach((thumb)=>thumb.addEventListener('click',()=>{
    thumbs.forEach((item)=>item.classList.remove('active'));
    thumb.classList.add('active');
    if(main)main.src=thumb.dataset.src||main.src;
    if(caption)caption.textContent=thumb.dataset.caption||'';
  }));
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-ty-panel__hero]').forEach(initV6Hero);
  document.querySelectorAll('.ty-panel__model-gallery').forEach(initV6Gallery);
});