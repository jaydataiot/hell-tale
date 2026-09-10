(() => {
  const trigger = document.getElementById('openWelcomeLetter');
  const letter = document.getElementById('welcomeLetter');
  if (!trigger || !letter) return;

  trigger.addEventListener('click', () => {
    if (typeof letter.showModal === 'function') letter.showModal();
    else letter.setAttribute('open', '');
  });

  letter.querySelector('[data-welcome-close]')?.addEventListener('click', () => letter.close());

  letter.addEventListener('click', event => {
    if (event.target === letter) letter.close();
  });
})();
