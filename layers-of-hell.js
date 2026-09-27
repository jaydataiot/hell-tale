(() => {
  const levels = [
    ['about', 'The Threshold', 'The Testament'],
    ['infernal-code', '⭕I', 'The Infernal Code'],
    ['doctrine', '⭕II', 'The Doctrine'],
    ['accused', '⭕III', 'The Accused'],
    ['tome', '⭕IV', 'The Infernal Tome'],
    ['holidays', '⭕V', "Today's Infernal Holiday"],
    ['holiday-directory', '⭕VI', 'The Calendar of Rites'],
    ['oracle', '⭕VII', 'The Keeper of Knowledge'],
    ['archive', '⭕VIII', 'The Infernal Archive'],
    ['hells', '⭕IX', 'The Hells']
  ];
  const demons = {
    stories: ['assets/demons/medieval-crowned-demon.png', 'Crowned demon rendered as an antique woodcut', 'left'],
    tome: ['assets/demons/codex-manuscript-demon.png', 'Demon rendered in the style of a medieval illuminated manuscript', 'right'],
    archive: ['assets/demons/engraved-wandering-demon.png', 'Lanky wandering demon rendered as an antique engraving', 'left']
  };
  const parentinoDemons = [
    ['about', '01-skeletal-kneeling-demon.png', 'left', 'a'],
    ['about', '08-red-flying-demon.png', 'right', 'b'],
    ['infernal-code', '03-club-bearing-demon.png', 'right', 'a'],
    ['doctrine', '04-hunched-demon.png', 'left', 'a'],
    ['accused', '05-pale-horned-demon.png', 'right', 'a'],
    ['holidays', '09-red-crouching-demon.png', 'left', 'a'],
    ['holiday-directory', '07-ram-headed-demon.png', 'right', 'a'],
    ['oracle', '06-screaming-winged-demon.png', 'left', 'a'],
    ['oracle', '02-dark-winged-demon.png', 'right', 'b']
  ];

  levels.forEach(([id, number, title]) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.dataset.hellLevel = number;
    const marker = document.createElement('div');
    marker.className = 'hell-level-marker';
    marker.setAttribute('aria-label', `${number}: ${title}`);
    marker.innerHTML = `<strong>${number}</strong><span>${title}</span>`;
    section.prepend(marker);
  });

  Object.entries(demons).forEach(([id, demon]) => {
    const section = document.getElementById(id);
    if (!section) return;
    const image = document.createElement('img');
    image.className = `layer-demon layer-demon-${demon[2]}`;
    image.src = demon[0];
    image.alt = demon[1];
    image.loading = 'lazy';
    image.decoding = 'async';
    section.append(image);
  });

  parentinoDemons.forEach(([id, filename, side, slot]) => {
    const section = document.getElementById(id);
    if (!section) return;
    const image = document.createElement('img');
    image.className = `parentino-section-demon parentino-${side} parentino-slot-${slot}`;
    image.src = `assets/characters/parentino-demons-individual/${filename}`;
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.loading = 'lazy';
    image.decoding = 'async';
    section.append(image);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: .45 });
    document.querySelectorAll('.hell-level-marker').forEach(marker => observer.observe(marker));
  }
})();
