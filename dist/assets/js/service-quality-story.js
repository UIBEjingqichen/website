/* The expanded control stage selects an actual Tianyu scene. Native details remain usable without JS. */
(() => {
  const flow=document.querySelector('[data-quality-flow]');
  if(!flow)return;
  const stages=[...flow.querySelectorAll('details[data-scene]')];
  const image=flow.querySelector('[data-control-image]');
  const caption=flow.querySelector('[data-control-caption]');
  const figure=flow.querySelector('figure');
  stages.forEach(stage=>stage.addEventListener('toggle',()=>{
    if(!stage.open)return;
    stages.forEach(other=>{if(other!==stage)other.open=false});
    image.src=stage.dataset.scene;
    image.alt=stage.dataset.sceneAlt;
    caption.textContent=stage.dataset.sceneCaption;
    figure.classList.remove('is-changing');
    requestAnimationFrame(()=>figure.classList.add('is-changing'));
  }));
})();
