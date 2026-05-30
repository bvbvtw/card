/* Flow: tap the girl (or the arrow) to walk forward. Each checkpoint reveals a
   photo slot + a message. The journey ends with 交往週年快樂. */
(function () {
  // ====== EDIT ME ======================================================
  // Her name / nickname, your sign-off, and the message at each checkpoint.
  const HER = '波波';
  const SIGN = '— 你的小波';

  const CHECKPOINTS = [
    {
      key: 's1',
      photo: 'screens/s1.jpg',   // ← 把照片放到 screens/ 資料夾，改這裡的檔名
      msg: '一起搭上幸福列車，一緒に出発しましょう！！',
    },
    {
      key: 's2',
      photo: 'screens/s2.jpg',
      msg: '這是我們在由布院列車上闖關的時候，小波拿著娃娃開心的笑容，小波開心我就好開心。',
    },
    {
      key: 's3',
      photo: 'screens/s3.jpg',
      msg: '這也是小波在由布院列車上睡死的照片，也是好愛。',
    },
    {
      key: 's4',
      photo: 'screens/s4.jpg',
      msg: '一起變粗的情侶，未來就是 Hyrox 情侶了。',
    },
    {
      key: 's5',
      photo: 'screens/s5.jpg',
      msg: '今年我們一起度過 30 歲了，我們都成為 PRO 級大人了 yaeee～～',
    },
  ];

  const FINAL = {
    title: '交際六周年おめでとう！',
    photo: 'screens/s6.jpg',  // ← 最後一頁的合照
    msg: '未來也要一起<br>しあわせ下去！',
  };
  // =====================================================================

  const TOTAL = CHECKPOINTS.length;
  let step = 0;          // 0 = start; 1..TOTAL = checkpoints; TOTAL+1 = final
  let busy = false;

  const $ = (s) => document.querySelector(s);
  const root = $('.stage');
  const scene = $('.scene');
  const girlWrap = $('.girl-wrap');
  const panel = $('.panel');
  const forwardBtn = $('.forward');
  const hearts = $('.hearts');
  const finale = $('.finale');

  // girl sprite
  const girl = window.SakuraGirl.createGirl(7);
  girlWrap.appendChild(girl);

  window.SakuraScene.init(root);
  window.SakuraScene.setSky(root, 0);

  // progress hearts
  for (let i = 0; i < TOTAL; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    hearts.appendChild(h);
  }
  function paintHearts() {
    [...hearts.children].forEach((h, i) => {
      h.classList.toggle('on', i < step);
    });
  }

  function setWalking(b) {
    girl.setWalking(b);
    root.classList.toggle('walking', b);
    girlWrap.classList.toggle('bobbing', b);
  }

  function showPanel(cp, idx) {
    panel.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'panel-card';
    const photoHTML = cp.photo
      ? `<img src="${cp.photo}" class="panel-photo" alt="" onerror="this.style.display='none'">`
      : '';
    card.innerHTML = `
      <div class="panel-tag">第 ${idx} 站 / ${TOTAL}</div>
      ${photoHTML}
      <p class="panel-msg">${cp.msg}</p>
      <div class="panel-sign">${SIGN}</div>
      <button class="panel-next">繼續往前走 →</button>
    `;
    panel.appendChild(card);
    panel.classList.add('show');
    card.querySelector('.panel-next').addEventListener('click', () => {
      panel.classList.remove('show');
      setTimeout(() => { panel.innerHTML = ''; busy = false; }, 300);
    });
  }

  function showFinale() {
    forwardBtn.classList.add('hide');
    const finalPhotoHTML = FINAL.photo
      ? `<img src="${FINAL.photo}" class="finale-photo" alt="" onerror="this.style.display='none'">`
      : '';
    finale.innerHTML = `
      <div class="finale-card">
        <div class="finale-sub">${HER}，</div>
        <h1 class="finale-title">${FINAL.title}</h1>
        ${finalPhotoHTML}
        <p class="finale-msg">${FINAL.msg}</p>
        <div class="finale-sign">${SIGN}</div>
        <button class="finale-heart" aria-label="愛你">♥</button>
      </div>
    `;
    finale.classList.add('show');
    const heartBtn = finale.querySelector('.finale-heart');
    heartBtn.addEventListener('click', () => burstHearts(heartBtn));
    setTimeout(() => burstHearts(heartBtn), 500);
  }

  function burstHearts(origin) {
    const r = origin.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    for (let i = 0; i < 16; i++) {
      const h = document.createElement('div');
      h.className = 'fly-heart';
      h.textContent = '♥';
      h.style.left = cx + 'px';
      h.style.top = cy + 'px';
      const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
      const dist = 80 + Math.random() * 120;
      h.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      h.style.setProperty('--dy', (Math.sin(ang) * dist - 60) + 'px');
      h.style.fontSize = 14 + Math.random() * 18 + 'px';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1400);
    }
  }

  function advance() {
    if (busy) return;
    if (step >= TOTAL) return;
    busy = true;
    step += 1;

    setWalking(true);
    // walk for a moment, then arrive
    setTimeout(() => {
      setWalking(false);
      window.SakuraScene.setSky(root, step);
      paintHearts();
      if (step <= TOTAL) {
        showPanel(CHECKPOINTS[step - 1], step);
      }
      if (step === TOTAL) {
        // after the final message is dismissed, the next tap shows finale
      }
    }, 1700);
  }

  forwardBtn.addEventListener('click', () => {
    if (busy) return;
    if (step >= TOTAL) { showFinale(); return; }
    advance();
  });
  // tapping the girl also moves forward
  girlWrap.addEventListener('click', () => {
    if (busy) return;
    if (step >= TOTAL) { showFinale(); return; }
    advance();
  });

  // intro hint pulse
  forwardBtn.classList.add('pulse');
})();
