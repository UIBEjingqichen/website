function initV6Hero(slider){
  const slides=[...slider.querySelectorAll('[data-v6-hero-slide]')];
  const dots=[...slider.querySelectorAll('[data-v6-hero-dot]')];
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
  const main=gallery.querySelector('[data-v6-main-image]');
  const caption=gallery.querySelector('[data-v6-main-caption]');
  const thumbs=[...gallery.querySelectorAll('[data-v6-thumb]')];
  thumbs.forEach((thumb)=>thumb.addEventListener('click',()=>{
    thumbs.forEach((item)=>item.classList.remove('active'));
    thumb.classList.add('active');
    if(main)main.src=thumb.dataset.src||main.src;
    if(caption)caption.textContent=thumb.dataset.caption||'';
  }));
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-v6-hero]').forEach(initV6Hero);
  document.querySelectorAll('.v6-model-gallery').forEach(initV6Gallery);
});