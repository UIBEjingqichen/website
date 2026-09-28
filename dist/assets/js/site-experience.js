(() => {
  const form = document.querySelector('main .quote-form');
  if(form){
    const url = new URL(location.href);
    const requestType = url.searchParams.get('requestType');
    const reference = url.searchParams.get('reference');
    if(requestType || reference){
      let hidden = form.querySelector('[name="requestContext"]');
      if(!hidden){ hidden = document.createElement('input'); hidden.type='hidden'; hidden.name='requestContext'; form.appendChild(hidden); }
      hidden.value = [requestType,reference].filter(Boolean).join(' · ');
    }
    if(!document.querySelector('.contact-email-path')){
      const fallback = document.createElement('a'); fallback.className='contact-email-path';
      fallback.href='mailto:shangjianchen21@gmail.com'; fallback.textContent='Email directly: shangjianchen21@gmail.com';
      form.insertAdjacentElement('afterend',fallback);
    }
  }
})();
