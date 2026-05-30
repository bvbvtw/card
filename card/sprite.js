/* Pixel sakura-uniform girl — drawn on a canvas, scaled with pixelated rendering.
   Two leg frames give a little hop-walk cycle. 16 wide x 24 tall. */
(function () {
  const PALETTE = {
    H: '#3a3540', // hair (black)
    h: '#1d1a22', // hair shadow
    S: '#ffe1cf', // skin
    o: '#ffb9cf', // blush
    e: '#352732', // eyes
    W: '#f8f8f8', // white sailor top
    P: '#f4fbff', // white sailor collar
    R: '#e3596d', // red ribbon
    K: '#a9dcee', // skirt (water-blue)
    k: '#7fbedd', // skirt shadow
    L: '#fbf6f6', // socks
    B: '#7e5160', // shoes
  };

  // rows shared by both frames (head + body), each EXACTLY 16 chars
  const BODY = [
    '.....hHHHHh.....', // 0
    '...hHHHHHHHHh...', // 1
    '..hHHHHHHHHHHh..', // 2
    '..hHHHHHHHHHHh..', // 3
    '..hHHHHHHHHHHh..', // 4
    '..hHSSSSSSSSHh..', // 5
    '..hHSSSSSSSSHh..', // 6
    '..hHSeSSSSeSHh..', // 7  eyes
    '..hHSSSSSSSSHh..', // 8
    '..hHoSSSSSSoHh..', // 9  blush
    '...hHSSSSSSHh...', // 10 jaw
    '......SSSS......', // 11 neck
    '....PPSSSSPP....', // 12 collar
    '...PWWWRRWWWP...', // 13 collar tips + red ribbon
    '..SWWWWWWWWWWS..', // 14 arms
    '..SWWWWWWWWWWS..', // 15
    '..SWWWWWWWWWWS..', // 16
    '...KKKKKKKKKK...', // 17 skirt
    '..KKKKKKKKKKKK..', // 18
    '..kKKKKKKKKKKk..', // 19 skirt hem
  ];

  const LEGS_STAND = [
    '....LL....LL....', // 20
    '....LL....LL....', // 21
    '....BB....BB....', // 22
    '................', // 23
  ];

  const LEGS_WALK = [
    '...LL......LL...', // 20
    '..LL........LL..', // 21
    '..BB........BB..', // 22
    '................', // 23
  ];

  function buildFrame(legs) {
    return BODY.concat(legs);
  }

  const FRAMES = [buildFrame(LEGS_STAND), buildFrame(LEGS_WALK)];

  function drawFrame(ctx, rows, scale) {
    ctx.clearRect(0, 0, 16 * scale, 24 * scale);
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const c = row[x];
        const color = PALETTE[c];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  // Creates a canvas element rendering the girl, with .setWalking(bool)
  function createGirl(scale) {
    scale = scale || 6;
    const canvas = document.createElement('canvas');
    canvas.width = 16 * scale;
    canvas.height = 24 * scale;
    canvas.className = 'girl-canvas';
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let walking = false;
    let frame = 0;
    let last = 0;

    drawFrame(ctx, FRAMES[0], scale);

    function loop(t) {
      if (walking) {
        if (t - last > 160) {
          frame = frame ? 0 : 1;
          drawFrame(ctx, FRAMES[frame], scale);
          last = t;
        }
      } else if (frame !== 0) {
        frame = 0;
        drawFrame(ctx, FRAMES[0], scale);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    canvas.setWalking = (b) => { walking = b; };
    return canvas;
  }

  window.SakuraGirl = { createGirl, PALETTE };
})();
