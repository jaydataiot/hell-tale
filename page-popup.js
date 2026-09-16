(() => {
  const sections = document.querySelectorAll('#holidays, #holiday-directory, #archive');
  if (!sections.length || typeof HTMLDialogElement === 'undefined') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'welcome-scroll page-popup';
  dialog.setAttribute('aria-label', "Hell's Tales reader");
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'welcome-close page-popup-close';
  close.textContent = 'Back to the Descent';
  let returnSection = null;
  let resumeAmbient = false;
  const restoreAmbient = () => {
    delete document.body.dataset.readerSilent;
    if (resumeAmbient) document.getElementById('hellAmbientAudio')?.play()?.catch(() => {});
    resumeAmbient = false;
  };
  const frame = document.createElement('iframe');
  frame.title = "Hell's Tales page";
  dialog.append(close, frame);
  document.body.append(dialog);

  sections.forEach(section => section.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (!url.pathname.endsWith('.html') || url.origin !== location.origin) return;
    event.preventDefault();
    const archiveReader = /\/archive\/(story-index|infernal-geography)\.html$/.test(url.pathname);
    url.searchParams.set('popup', archiveReader ? 'archive' : '1');
    returnSection = section;
    frame.title = link.querySelector('h2, h3, h4')?.textContent || link.textContent.trim() || "Hell's Tales page";
    frame.src = url.href;
    dialog.showModal();
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  window.addEventListener('message', event => {
    if (event.source === frame.contentWindow && event.data?.type === 'hells-tales-reader-audio' && dialog.open) {
      const ambient = document.getElementById('hellAmbientAudio');
      if (event.data.silent) {
        document.body.dataset.readerSilent = 'true';
        resumeAmbient = resumeAmbient || Boolean(ambient && !ambient.paused);
        ambient?.pause();
      } else restoreAmbient();
    }
    if (event.source === frame.contentWindow && event.data?.type === 'hells-tales-close-reader' && dialog.open) dialog.close();
  });
  dialog.addEventListener('close', () => {
    frame.removeAttribute('src');
    restoreAmbient();
    if (returnSection?.id === 'archive') returnSection.scrollIntoView({ block: 'start' });
  });
})();
