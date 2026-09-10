(() => {
  const levels = [
    ['about', 'The Threshold', 'The Testament'],
    ['infernal-code', 'Level I', 'The Infernal Code'],
    ['doctrine', 'Level II', 'The Doctrine'],
    ['accused', 'Level III', 'The Accused'],
    ['tome', 'Level IV', 'The Infernal Tome'],
    ['holidays', 'Level V', 'The Infernal Holidays'],
    ['holiday-directory', 'Level VI', 'The Calendar of Rites'],
    ['oracle', 'Level VII', 'The Keeper of Knowledge'],
    ['tribunal', 'Level VIII', 'The Brazen Tribunal'],
    ['archive', 'Level IX', 'The Infernal Archive']
  ];
  const demons = {
    stories: ['assets/demons/medieval-crowned-demon.png', 'Crowned demon rendered as an antique woodcut', 'left'],
    tome: ['assets/demons/codex-manuscript-demon.png', 'Demon rendered in the style of a medieval illuminated manuscript', 'right'],
    archive: ['assets/demons/engraved-wandering-demon.png', 'Lanky wandering demon rendered as an antique engraving', 'left']
  };

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

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: .45 });
    document.querySelectorAll('.hell-level-marker').forEach(marker => observer.observe(marker));
  }
})();
