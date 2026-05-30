/* Scrolling sakura scenery: parallax layers generated as pixel-art data URLs,
   falling petals, and per-step sky moods (the journey moves through the day). */
(function () {
  // ---- generate a pixel scenery tile (tree + bushes) as a dataURL ----
  function makeTile(w, h, draw) {
    const s = 4; // pixel size
    const c = document.createElement('canvas');
    c.width = w * s;
    c.height = h * s;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const px = (x, y, color, pw = 1, ph = 1) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * s, y * s, pw * s, ph * s);
    };
    draw(px);
    return { url: c.toDataURL(), width: w * s };
  }

  // a single sakura tree centered in a 64-wide tile
  function treeTile() {
    return makeTile(64, 60, (px) => {
      const trunk = '#9a6b52', trunkD = '#7d5440';
      const f1 = '#ffd0e2', f2 = '#f7b3d0', f3 = '#ef98bf';
      // trunk
      for (let y = 40; y < 58; y++) px(30, y, trunk, 4, 1);
      for (let y = 40; y < 58; y++) px(33, y, trunkD, 1, 1);
      // branches
      px(26, 44, trunk, 4, 1); px(34, 46, trunk, 4, 1);
      // foliage blobs (chunky cloud of blossom)
      const blobs = [
        [22, 14, 20, 16], [16, 22, 14, 12], [36, 20, 16, 14],
        [26, 8, 14, 12], [20, 30, 24, 8],
      ];
      blobs.forEach(([x, y, bw, bh]) => px(x, y, f2, bw, bh));
      // highlights / shadows for dithered look
      px(24, 12, f1, 12, 6); px(30, 18, f1, 8, 6);
      px(20, 30, f3, 24, 4); px(18, 26, f3, 8, 4); px(40, 28, f3, 8, 6);
      // a couple of floating petals near tree
      px(14, 38, f1, 1, 1); px(50, 34, f2, 1, 1); px(46, 42, f1, 1, 1);
    });
  }

  // distant softer trees for the far layer
  function farTile() {
    return makeTile(80, 40, (px) => {
      const f = '#ffdcea', fd = '#ffc8df';
      [[10, 16, 18, 12], [40, 12, 22, 14], [64, 18, 14, 10]].forEach(
        ([x, y, w, h]) => { px(x, y, f, w, h); px(x, y + h - 3, fd, w, 3); }
      );
    });
  }

  // ground tile: grass top edge + dirt path texture
  function groundTile() {
    return makeTile(48, 36, (px) => {
      const grass = '#bfe08c', grassD = '#a6cf72';
      const dirt = '#e7c79c', dirtD = '#d8b384', dirtDot = '#c9a172';
      // grass strip
      px(0, 0, grass, 48, 6);
      px(0, 5, grassD, 48, 2);
      // little grass blades
      px(6, 3, grassD, 1, 3); px(20, 2, grassD, 1, 4); px(38, 3, grassD, 1, 3);
      // dirt path
      px(0, 7, dirt, 48, 29);
      px(0, 7, dirtD, 48, 1);
      // pebbles / texture dots
      px(8, 14, dirtDot, 2, 1); px(30, 20, dirtDot, 2, 1);
      px(18, 27, dirtDot, 1, 1); px(40, 16, dirtDot, 2, 1);
      px(12, 24, dirtD, 3, 1); px(34, 30, dirtD, 3, 1);
    });
  }

  // ---- petals ----
  function startPetals(container) {
    const colors = ['#ffd0e2', '#f7b3d0', '#ffe1ee', '#ef98bf'];
    function spawn() {
      const p = document.createElement('div');
      p.className = 'petal';
      const size = 6 + Math.random() * 8;
      p.style.width = size + 'px';
      p.style.height = size * 0.8 + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[(Math.random() * colors.length) | 0];
      const dur = 5 + Math.random() * 5;
      p.style.animationDuration = dur + 's, ' + (1.5 + Math.random() * 1.5) + 's';
      p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      container.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 200);
    }
    setInterval(spawn, 600);
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 300);
  }

  // ---- sky moods per step (morning -> day -> golden -> dusk -> night -> dawn) ----
  const SKIES = [
    ['#ffe3ee', '#fff4f8'], // start: soft morning
    ['#ffd9e6', '#fff0f5'], // 1 morning
    ['#cfe9ff', '#eafaff'], // 2 bright day
    ['#ffe0c2', '#ffd6e0'], // 3 golden afternoon
    ['#ffc3b0', '#ffd9c2'], // 4 sunset
    ['#7c6aa8', '#caa9d6'], // 5 dusk/night
    ['#ffd9e6', '#fff4f8'], // final dawn (celebration)
  ];

  function init(root) {
    const tree = treeTile();
    const far = farTile();
    const ground = groundTile();

    const far_l = root.querySelector('.layer-far');
    const tree_l = root.querySelector('.layer-trees');
    const ground_l = root.querySelector('.layer-ground');

    far_l.style.backgroundImage = `url(${far.url})`;
    far_l.style.backgroundSize = `${far.width}px auto`;
    tree_l.style.backgroundImage = `url(${tree.url})`;
    tree_l.style.backgroundSize = `${tree.width}px auto`;
    ground_l.style.backgroundImage = `url(${ground.url})`;
    ground_l.style.backgroundSize = `${ground.width}px auto`;

    // expose tile widths for seamless scroll keyframes
    root.style.setProperty('--far-tile', far.width + 'px');
    root.style.setProperty('--tree-tile', tree.width + 'px');
    root.style.setProperty('--ground-tile', ground.width + 'px');

    startPetals(root.querySelector('.petals'));
  }

  function setSky(root, step) {
    const sky = SKIES[Math.min(step, SKIES.length - 1)];
    root.querySelector('.sky').style.background =
      `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} 100%)`;
  }

  window.SakuraScene = { init, setSky };
})();
