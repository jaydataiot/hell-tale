(() => {
  const total = 42;
  let current = 1;
  let direction = 'forward';
  const page = document.getElementById('page');
  const status = document.getElementById('status');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const jump = document.getElementById('jump');
  const motion = document.getElementById('motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const chapters = [
    [1, 'The Threshold', '', '⛧', '#da501b'],
    [3, 'The Descent', '', '⛧', '#da501b'],
    [4, 'The Bargain', 'the-bargain', '⛧', '#c98c37'],
    [11, 'The Pious', 'the-pious', '♱', '#be562b'],
    [17, 'The Accuser', 'the-accuser', '☿', '#967446'],
    [23, 'The Tribunal', 'the-tribunal', '⚖', '#c16f32'],
    [30, 'The Furnace Gospel', 'the-furnace-gospel', '🔥', '#ed541c'],
    [36, 'The Last Sermon', 'the-last-sermon', '♱', '#a74428']
  ];
  const error = document.createElement('p');
  error.className = 'page-error';
  error.hidden = true;
  error.setAttribute('role', 'alert');
  error.textContent = 'This page could not load. Try another page or open the original PDF below.';
  page.after(error);
  page.addEventListener('error', () => { error.hidden = false; });
  page.addEventListener('load', () => {
    error.hidden = true;
    page.classList.remove('turn-forward', 'turn-back');
    if (!paused && !reduced.matches) {
      void page.offsetWidth;
      page.classList.add('turn-' + direction);
    }
  });
  function show(n) {
    const target = Math.max(1, Math.min(total, n));
    direction = target < current ? 'back' : 'forward';
    current = target;
    page.src = 'pages/' + String(current).padStart(2, '0') + '.webp';
    page.alt = 'Original anthology page ' + current + ' of ' + total;
    status.textContent = 'Page ' + current + ' / ' + total;
    prev.disabled = current === 1;
    next.disabled = current === total;
    const chapter = chapters.filter(c => c[0] <= current).pop();
    jump.value = String(chapter[0]);
    document.getElementById('chapter-name').textContent = chapter[1];
    document.getElementById('chapter-symbol').textContent = chapter[3];
    document.body.style.setProperty('--fire', chapter[4]);
    const fullStory = document.getElementById('full-story');
    fullStory.hidden = !chapter[2];
    if (chapter[2]) fullStory.href = '../../../stories/' + chapter[2] + '.html';
    else fullStory.removeAttribute('href');
    if (current < total) {
      const preload = new Image();
      preload.src = 'pages/' + String(current + 1).padStart(2, '0') + '.webp';
    }
  }
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  jump.addEventListener('change', () => show(Number(jump.value)));
  document.addEventListener('keydown', event => {
    if (['SELECT','INPUT','TEXTAREA','BUTTON'].includes(event.target.tagName)) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  });
  function setMotion() {
    document.body.classList.toggle('paused', paused || reduced.matches);
    motion.disabled = reduced.matches;
    motion.textContent = reduced.matches ? 'Motion off · system preference' : paused ? 'Resume motion' : 'Pause motion';
    motion.setAttribute('aria-pressed', String(paused || reduced.matches));
  }
  motion.addEventListener('click', () => { paused = !paused; setMotion(); });
  reduced.addEventListener('change', setMotion);
  setMotion();
  for (let n = 0; n < 48; n++) {
    const spark = document.createElement('i');
    spark.style.cssText = '--x:' + ((n * 47) % 100) + '%;--d:' + (7 + n % 10) + 's;--delay:-' + (n % 13) + 's;--size:' + (1 + n % 3) + 'px';
    document.querySelector('.embers').append(spark);
  }
  for (let n = 0; n < 8; n++) {
    const soul = document.createElement('span');
    soul.className = 'soul';
    const side = n % 2 === 0 ? 1 + n : 90 - n;
    soul.style.cssText = '--x:' + side + '%;--size:' + (60 + n * 5) + 'px;--duration:' + (24 + n * 2) + 's;--delay:-' + (n * 4) + 's';
    const figure = document.createElement('img');
    figure.src = '../../../assets/falling-souls/soul-' + String(n + 1).padStart(2, '0') + '.png';
    figure.alt = '';
    soul.append(figure);
    document.querySelector('.souls').append(soul);
  }
  for (let n = 0; n < 16; n++) {
    const flame = document.createElement('i');
    flame.className = 'flame';
    flame.style.cssText = '--x:' + (n * 6.5) + '%;--w:' + (70 + n % 4 * 20) + 'px;--h:' + (100 + n % 5 * 35) + 'px;--duration:' + (3 + n % 4) + 's;--delay:-' + (n % 5) + 's';
    document.querySelector('.flame-bank').append(flame);
  }
  show(1);
})();
