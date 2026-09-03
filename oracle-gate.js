(() => {
  const riddles = [
    { q: 'I have no mouth, yet I repeat every confession. I have no memory, yet I return what you give me. What am I?', a: ['echo', 'an echo'] },
    { q: 'The more of me you take, the more you leave behind. What am I?', a: ['footsteps', 'steps', 'foot prints', 'footprints'] },
    { q: 'I am always before you, but no mortal eye can see me. What am I?', a: ['future', 'the future'] },
    { q: 'I become smaller every time I take a bath. What am I?', a: ['soap', 'a bar of soap', 'bar of soap'] },
    { q: 'I speak without a tongue and answer without being asked. In darkness I show what light conceals. What am I?', a: ['dream', 'a dream', 'dreams'] },
    { q: 'What belongs to you, yet is spoken more often by others?', a: ['name', 'your name', 'my name'] },
    { q: 'I have keys but open no locks, space but no chamber, and an enter that crosses no gate. What am I?', a: ['keyboard', 'a keyboard'] },
    { q: 'I can be broken without being held, given without being owned, and kept without a lock. What am I?', a: ['promise', 'a promise', 'word', 'your word'] },
    { q: 'I follow every soul in light, abandon every soul in darkness, and never speak of what I see. What am I?', a: ['shadow', 'a shadow', 'your shadow'] },
    { q: 'What dies the moment its true name is spoken?', a: ['silence', 'the silence'] }
  ];

  const dialog = document.getElementById('oracleGate');
  const form = document.getElementById('oracleRiddleForm');
  const riddleText = document.getElementById('oracleRiddle');
  const answerInput = document.getElementById('oracleAnswer');
  const countdown = document.getElementById('oracleCountdown');
  const error = document.getElementById('oracleError');
  let current = 0;
  let seconds = 45;
  let timer;

  const normalize = value => value.toLowerCase().trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ');
  const sentence = () => window.location.replace('lesson.html');
  const stopTimer = () => { if (timer) clearInterval(timer); };

  function openTest() {
    stopTimer();
    current = Number(sessionStorage.getItem('infernalRiddleIndex') || 0) % riddles.length;
    sessionStorage.setItem('infernalRiddleIndex', String((current + 1) % riddles.length));
    sessionStorage.removeItem('infernalOracleAdmitted');
    riddleText.textContent = riddles[current].q;
    answerInput.value = '';
    error.textContent = '';
    seconds = 45;
    countdown.textContent = seconds;
    dialog.showModal();
    answerInput.focus();
    timer = setInterval(() => {
      seconds -= 1;
      countdown.textContent = Math.max(0, seconds);
      if (seconds <= 0) { stopTimer(); sentence(); }
    }, 1000);
  }

  document.querySelectorAll('[data-oracle-summon]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openTest(); }));
  document.querySelector('[data-oracle-refuse]')?.addEventListener('click', sentence);
  dialog?.addEventListener('cancel', event => { event.preventDefault(); sentence(); });
  dialog?.addEventListener('click', event => { if (event.target === dialog) sentence(); });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const answer = normalize(answerInput.value);
    if (!answer) return sentence();
    const accepted = riddles[current].a.map(normalize).includes(answer);
    if (!accepted) {
      error.textContent = 'The Keeper rejects your answer. Sentence is immediate.';
      stopTimer();
      setTimeout(sentence, 900);
      return;
    }
    stopTimer();
    sessionStorage.setItem('infernalOracleAdmitted', 'yes');
    window.location.assign('oracle.html');
  });
})();
