/* Touch navigation and accessible horizontal tables; no form submission changes. */
(function(){
 'use strict';
 const mobile=matchMedia('(max-width:1100px)');
 const header=document.querySelector('.site-header'),nav=document.querySelector('[data-nav]'),button=document.querySelector('[data-menu-toggle]');
 if(header){
  const size=()=>{if(!nav||getComputedStyle(nav).position==='absolute'||!nav.classList.contains('open'))document.documentElement.style.setProperty('--mobile-header-height',Math.ceil(header.getBoundingClientRect().height)+'px')};
  size();if('ResizeObserver' in window)new ResizeObserver(size).observe(header);else addEventListener('resize',size);
 }
 if(nav&&button){
  nav.id=nav.id||'main-navigation';button.setAttribute('aria-controls',nav.id);button.setAttribute('aria-expanded','false');
  const sections=[...nav.querySelectorAll('.nav-dropdown')];
  sections.forEach((section,i)=>{
   const links=section.querySelector('.dropdown-menu'),parent=section.querySelector('a');if(!links||!parent)return;
   links.id=links.id||'navigation-section-'+i;
   section.dataset.mobileExpanded='false';
   const toggle=document.createElement('button');toggle.type='button';toggle.className='mobile-nav-section-toggle';toggle.setAttribute('aria-controls',links.id);toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Show '+parent.textContent.trim()+' links');
   toggle.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
   parent.insertAdjacentElement('afterend',toggle);
   toggle.addEventListener('click',()=>{const expanded=section.dataset.mobileExpanded!=='true';section.dataset.mobileExpanded=String(expanded);toggle.setAttribute('aria-expanded',String(expanded));toggle.setAttribute('aria-label',(expanded?'Hide ':'Show ')+parent.textContent.trim()+' links')});
  });
  const sync=()=>{const open=mobile.matches&&nav.classList.contains('open');document.body.classList.toggle('mobile-nav-open',open);document.documentElement.classList.toggle('mobile-nav-open',open)};
  const close=focus=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false');sync();if(focus)button.focus({preventScroll:true})};
  button.addEventListener('click',()=>{sync()});
  nav.addEventListener('click',event=>{if(event.target.closest('a')&&mobile.matches)close(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobile.matches&&nav.classList.contains('open'))close(true)});
  document.addEventListener('pointerdown',event=>{if(mobile.matches&&nav.classList.contains('open')&&!header.contains(event.target))close(false)});
  document.querySelectorAll('[data-quote-open]').forEach(el=>el.addEventListener('click',()=>close(false)));
  mobile.addEventListener('change',()=>{if(!mobile.matches)close(false);else sync()});
 }
 const modalLock=()=>document.documentElement.classList.toggle('mobile-modal-open',mobile.matches&&document.body.classList.contains('modal-open'));
 modalLock();new MutationObserver(modalLock).observe(document.body,{attributes:true,attributeFilter:['class']});mobile.addEventListener('change',modalLock);
 const wrappers=[];
 document.querySelectorAll('main table').forEach((table,i)=>{
  let wrapper=table.parentElement;
  if(!wrapper||(!/table.*wrap|table-scroll|scroll.*table/.test(wrapper.className)&&wrapper.children.length>1)){
   wrapper=document.createElement('div');table.before(wrapper);wrapper.append(table);
  }
  wrapper.classList.add('mobile-table-scroll');wrapper.setAttribute('role','region');wrapper.tabIndex=0;
  const heading=table.closest('.pd-table-block')?.querySelector('h3')||table.closest('section')?.querySelector('h2');
  wrapper.setAttribute('aria-label',(table.caption?.textContent||heading?.textContent||'Technical parameters').trim()+' — scrollable table');
  const hint=document.createElement('p');hint.className='mobile-table-hint';hint.id='mobile-table-hint-'+i;hint.textContent='Swipe sideways to view all columns.';hint.hidden=true;wrapper.before(hint);wrapper.setAttribute('aria-describedby',hint.id);wrappers.push({wrapper,hint});
 });
 const tables=()=>wrappers.forEach(({wrapper,hint})=>{const wide=mobile.matches&&wrapper.scrollWidth>wrapper.clientWidth+1;wrapper.classList.toggle('is-wide',wide);hint.hidden=!wide});
 tables();addEventListener('resize',tables);document.fonts?.ready.then(tables);
 const chapters=[...document.querySelectorAll('.as-chap')];
 if(chapters.length){
  const states=()=>chapters.forEach(c=>{const active=c.classList.contains('is-active');c.setAttribute('aria-hidden',String(!active));c.inert=!active});
  states();chapters.forEach(c=>new MutationObserver(states).observe(c,{attributes:true,attributeFilter:['class']}));
 }
})();
