(() => {
  const levels = [
    ['about', 'The Threshold', 'The Testament'],
    ['infernal-code', 'Level I', 'The Infernal Code'],
    ['stories', 'Level II', 'Tales from Below'],
    ['doctrine', 'Level III', 'The Doctrine'],
    ['accused', 'Level IV', 'The Accused'],
    ['tome', 'Level V', 'The Infernal Tome'],
    ['holidays', 'Level VI', 'The Infernal Holidays'],
    ['holiday-directory', 'Level VII', 'The Calendar of Rites'],
    ['oracle', 'Level VIII', 'The Keeper of Knowledge'],
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
    const demon = demons[id];
    if (demon) {
      const image = document.createElement('img');
      image.className = `layer-demon layer-demon-${demon[2]}`;
      image.src = demon[0];
      image.alt = demon[1];
      image.loading = 'lazy';
      image.decoding = 'async';
      section.append(image);
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: .45 });
    document.querySelectorAll('.hell-level-marker').forEach(marker => observer.observe(marker));
  }
})();
