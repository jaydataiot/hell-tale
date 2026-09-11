document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

/* One site-wide, navigation-aware audio controller. */
(() => {
  const ENABLED_KEY = 'hellsTalesAudioEnabled';
  const POSITION_KEY = 'hellsTalesAudioPosition';
  const MUTED_KEY = 'hellsTalesAudioMuted';
  const root = document.body.dataset.archiveRoot || '';
  let audio = document.getElementById('hellAmbientAudio') || document.getElementById('hellStoryAudio');

  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'hellAmbientAudio';
    audio.src = `${root}assets/audio/hell-4.mp3`;
    document.body.appendChild(audio);
  }

  const readState = (key, fallback = '') => {
    try { return sessionStorage.getItem(key) ?? fallback; }
    catch (error) { return fallback; }
  };
  const writeState = (key, value) => {
    try { sessionStorage.setItem(key, value); }
    catch (error) { /* Playback still works when storage is unavailable. */ }
  };

  audio.loop = true;
  audio.autoplay = true;
  audio.preload = readState(ENABLED_KEY) === 'true' ? 'auto' : 'metadata';
  audio.setAttribute('playsinline', '');
  audio.volume = audio.id === 'hellStoryAudio' ? 0.34 : 0.28;
  audio.muted = readState(MUTED_KEY) === 'true';

  let lastSavedSecond = -1;
  let playPending = null;

  const savePosition = () => {
    if (!Number.isFinite(audio.currentTime)) return;
    const second = Math.floor(audio.currentTime);
    if (second === lastSavedSecond) return;
    lastSavedSecond = second;
    writeState(POSITION_KEY, String(audio.currentTime));
  };

  const restorePosition = () => {
    const saved = Number.parseFloat(readState(POSITION_KEY, '0'));
    if (!Number.isFinite(saved) || saved <= 0 || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    try { audio.currentTime = saved % audio.duration; }
    catch (error) { /* Some engines delay seeking until metadata is ready. */ }
  };

  const attemptPlay = ({ arm = false } = {}) => {
    if (arm) writeState(ENABLED_KEY, 'true');
    if (readState(ENABLED_KEY) !== 'true' || readState(MUTED_KEY) === 'true') return Promise.resolve(false);
    if (!audio.paused && !audio.ended) return Promise.resolve(true);
    if (playPending) return playPending;
    audio.muted = false;
    const result = audio.play();
    playPending = result && typeof result.then === 'function'
      ? result.then(() => true).catch(() => false).finally(() => { playPending = null; })
      : Promise.resolve(true);
    return playPending;
  };

  const unlock = (event) => {
    if (event.target && event.target.closest && event.target.closest('#infernalAudioToggle')) return;
    if (event.type === 'keydown' && (event.metaKey || event.ctrlKey || event.altKey || ['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key))) return;
    attemptPlay({ arm: true });
  };
  ['pointerdown', 'touchend', 'keydown'].forEach((eventName) => {
    document.addEventListener(eventName, unlock, { capture: true, passive: true });
  });

  audio.addEventListener('loadedmetadata', () => { restorePosition(); attemptPlay(); });
  audio.addEventListener('timeupdate', savePosition, { passive: true });
  audio.addEventListener('ended', () => attemptPlay());
  window.addEventListener('pagehide', savePosition, { passive: true });
  window.addEventListener('pageshow', () => attemptPlay());
  window.addEventListener('focus', () => attemptPlay(), { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) attemptPlay();
  });

  let toggle = document.getElementById('infernalAudioToggle');
  if (!toggle) {
    if (!document.getElementById('infernalAudioControlStyles')) {
      const style = document.createElement('style');
      style.id = 'infernalAudioControlStyles';
      style.textContent = '.infernal-audio-toggle{position:fixed;right:max(.75rem,env(safe-area-inset-right));bottom:max(.75rem,env(safe-area-inset-bottom));z-index:1000;min-width:44px;min-height:44px;padding:.62rem .8rem;border:1px solid #a52c17;border-radius:999px;color:#f2d2ba;background:rgba(12,2,1,.92);box-shadow:0 0 18px rgba(255,55,15,.3);font:800 .65rem Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.infernal-audio-toggle:hover,.infernal-audio-toggle:focus-visible{color:#fff;border-color:#ff7440;box-shadow:0 0 0 2px #260703,0 0 24px rgba(255,67,18,.62)}';
      document.head.appendChild(style);
    }
    toggle = document.createElement('button');
    toggle.id = 'infernalAudioToggle';
    toggle.className = 'infernal-audio-toggle';
    toggle.type = 'button';
    document.body.appendChild(toggle);
  }

  const updateToggle = () => {
    const enabled = readState(ENABLED_KEY) === 'true';
    const audible = enabled && readState(MUTED_KEY) !== 'true';
    toggle.textContent = audible ? 'Sound: On' : 'Enable Sound';
    toggle.setAttribute('aria-pressed', audible ? 'true' : 'false');
    toggle.setAttribute('aria-label', audible ? 'Turn infernal ambience off' : 'Turn infernal ambience on');
  };
  toggle.addEventListener('click', () => {
    const currentlyAudible = readState(ENABLED_KEY) === 'true' && readState(MUTED_KEY) !== 'true';
    const nextMuted = currentlyAudible;
    writeState(ENABLED_KEY, 'true');
    writeState(MUTED_KEY, String(nextMuted));
    audio.muted = nextMuted;
    if (nextMuted) audio.pause();
    else attemptPlay({ arm: true });
    updateToggle();
  });

  updateToggle();
  restorePosition();
  attemptPlay();
})();
