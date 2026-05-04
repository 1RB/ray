/* ray read tracker + dynamic up-next */
(function(){
  const KEY = 'ray.read';
  function getState(){
    try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch(e){ return {}; }
  }
  function setState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

  // --- article metadata for up-next ---
  const ARTICLES = {
    'network-school': { title:'network school', desc:'a live-in startup campus inside a sinking ghost city', thumb:'/articles/network-school/forest_city_real.jpg', tag:'longform' },
    'realities-terminal': { title:'vibe coding straight to your eyeballs', desc:'the vr headset that runs ai in your field of view', thumb:'https://cdn4.telesco.pe/file/kVxIxrxxOEU7qCO2G6t5xpMYhzptdIA9FncIhtAbCps2nLqyaR1lgf2dQmTe1rXR5L3WAcdlkv1oFshxkSdfx47MvsKPeoGEg3F91oD6289QvY1-4ZuZH6Al3sRjqd0_RitzLJVhKxuaLPhWvXvL8tZYBwt-lgKSyvCb_JYQSvz_q-N9rMqNccWK2gU4iDuCpHgPXc0BM5frQk4iSjnt9UUBNpAn4yHoYxpNKGuH0SNuKZ-9RY87zPFqkSsOEXGkg0AXXTnJ2PSP8bVMxH80_L3j3-wPLXAvQp1oQdG0N_Dy2-KHTvOyIKuIn9ova3wO31fnbuE4n5o2zam_2lIqdQ.jpg', tag:'video' },
    'gemma-4-phone': { title:'gemma 4 on your phone', desc:"google's new model running local on android", thumb:'https://cdn4.telesco.pe/file/QDFMFLBnPrOy6KmAd3lVjI_DCEe1ebfzUZhitd1Rta8MJ8qGiCauBAyLNHZvSBhgvV8RNw0yFuIiJYXSgjUTJQKcivF0rnfD_Np_P8GrdwN5oXK6KIh6DZ7j8L2Ujw-CVW66VbY7ScmByca03aPvSvfpCshxGRqP3P2zS2hankXVNG12zgy1S9NtEj85PUl5r8Yrb9JNo4NXHhwM2K80duTmksmZMlP4FonX_iu54lBXTfxvi96Kt5e4wMGFIkCR717b-AptZgAmArFURat6yPmJEjXmiZJjpjoYAKNIIrFUpRDTBMl0p2SL8bH2tT9-YLwtVskTrqFXA1KVG3HeLA.jpg', tag:'product' },
    'zed-1-0': { title:'zed 1.0', desc:'the ide hits version one. what they built and what they skipped.', thumb:'https://cdn4.telesco.pe/file/GgzoU847rmkBHvScp5QX3-pulnxWPzx3pDSfn5OpbVcquns_KiS50aOJDQYkauAUOHIN9dG-zZ7DouoADRkZv0luJ-zgCnSXbIYTFLGvwFPfpXRb2OsPTLYa9B4oSH0-ZM7wXTP1FMcoQt1uhq_nnl3seLNxV278Dql518hgjf1gJhjMqwxhf9PRMgvYXi24o-wmX-gOM8Y9M5YYfDLo8v7L6ydlNx_zFpu1zS-rR-61fBbK4k4rpOIZHZWHdPmzkYJbBjP4LKWIsyduHlQlWqQTO-dP5FKyb6h6fz2XzSS_aaCIsfF-RmqalHiq_QEpTbChT2FgZfG4YpyFZP191w.jpg', tag:'review' },
    'warp-open-source': { title:'warp goes open source', desc:'$70M in venture funding, now fully open source', thumb:'https://cdn4.telesco.pe/file/kZMDI0LH_1N1xGNZwoZQUfrRPWHuS-w0LBl5w5jfSPe3OQyV_Z30pq-elDHqrw2NBmJhobqL6eE6Qxf-YgcW_ts4m_76Zie5bnq0R7Igv-HRa8iebJHJjoAAcU3lQC8kETTrdtCs6XDJyF_h1w7PY4tSRU0jLBqZNTJMeeVPy_wjipg95-BFNBvcQ7Q5Qfm-qmWY4b0JUdquGSumeVmzAAZxXovRKqqr3ZvEIcbE30ofnmpAQX0tF_Enqr-WapGP8_kidInWFJ_mTthAB-nKwue6pKphZS2KJ5urFbPCQ3mzHFBnVgFprJo2mS0W_tlVqbfKaESPM0Jo90xk2VUMZA.jpg', tag:'news' },
    'browser-use-hermes': { title:'browser use + hermes agent', desc:'free cloud browser automation. unlimited hours. no setup.', thumb:'https://cdn4.telesco.pe/file/tCciM0s1gSSw-l4vYEtybEl7S9eGsacI9o4MXvnMPaUNIQ6H4rcBTcSCGQraoEk3Jqv-fKSqxy4gswW22hpHdjgFlTc5-92-ev7pkRi-38gD4y_eLRZ9v7U4ncDyZZg9zCcgNHmBIye1YuEMllerA83-RsFom5UZbyDdysy92AariyXtkg4qkujvjUyGfN4i0VDuaXH2JKCqtMg9flhuE2zyzasqCcgZwx30IGPquShLwCEbkAbqr5_lHaYkL2T-5Hh3bC1g6_0sORG_Lutx_oUVilcpySt41T0Y4nJd-KgySPDskUpZRpMEMj2e2FW-SRYymQuqYY1ftODZWzvtfQ.jpg', tag:'tutorial' },
    'fieldtheory-cli': { title:'fieldtheory cli', desc:'sync your x bookmarks locally. no api. no oauth.', thumb:'https://cdn4.telesco.pe/file/rV6J3jhPq9_NHscs0574zYBxay1FD5oz6u8HvVbWlb4itwz2ymQlQr-b1foJk7NNKJKSHqiB03efYb9p7kaOVqVBVI6g5JDqtHca5pwvv-oVESDtcs2uVfXpwi9MXhF9qT9NVsr54cOSbmLvraxJjleuLWgcvYVA6RhPcwdxHazY47bZgHh5Vx0vwWbPzOESPZ9SHoefAZz_Z2i6S4TLmP-dyXBTLJpagL2htKGpl4hrRFMSpwVtWCBTeKbgFin1p4_OTaIr7_WaLOr4wg1VN2vG6wtDwr69RAToyJcQe28i3BTua3VfrZ3aNh-Zd5cRsrgbmtmFelfIS35zWnQKDQ.jpg', tag:'tool' },
    'digital-whip': { title:'digital whip', desc:'someone built a usb device to make claude work faster', thumb:'https://cdn4.telesco.pe/file/CNMXAx5TljZsHtZmQ4-ApQpk2wqWnlSGVF3U_TnijaGdGg11Rdckwv5mxDqFfAgL_NNUVi-8w6GZITFIDyd50QU5CmKd4tv17Nkrl3nhf2wn9CIqKDskRIJ0ZaFLQJOc_rDfBf5aEnPawkiHCtdoX0p8reWeY67bFwnbS-L8ZUYfOXjUKIK0bqQE8pn0_8SWZZHEycAE3nd7EcJjwOJ8UFcnDowBQprRJGCZK22jULCTqvXzdTIQ2FF-MpIlpCtL1B9aFJmJrmwOwyM_Mn1nvYfGCFl0jtDzMfzQuEb36H2Al2T_dax8yZaZLn1Llcv5wAwlh3SDFcv5FyHRYX347w.jpg', tag:'hardware' },
    'yc-wishlist-2026': { title:'YC summer 2026 startup wishlist', desc:'what the biggest accelerator wants to fund this year', thumb:'https://cdn4.telesco.pe/file/rutb62QEOXgEnJdiNUPgHQElAWtKzuqBWCnFXwwspWN71l_n33Mq7xH6FBZ1jAgzNW4RXOSdbWG25XmeJLJnd4fA4nuGFXVNaNUD1cHRieqKoahrGsQMxZQ2RvvgW4VQ2Dc7U9tvPZ4woeziFUagmAc76fgShT0tnZls-UzsEu-ACv94NsFSS_j8qaxGILIfj4dbQ31Pu4C15r7u9lCgHzB-qLB7X3AuAzNl1JG8yBqZLOUC8XTWJYTL3zJ7sbWigZ_N3IXMpZExYkMFQrLS_FvpJ8OjSMTyknDDHge-aKjGpgxc47LnA6Q9E-dn8qK1lRe2ASD5NBrB7e5kZY-T1w.jpg', tag:'analysis' },
    'meta-muse-spark': { title:'muse spark', desc:"meta superintelligence labs' first model. leads on multimodal benchmarks.", thumb:'https://cdn4.telesco.pe/file/bX2mjHyVcj5VR6v0UtP3uK0IyKLTkGff4QS_sjgUm6GmhTGseimRORj3l0bdSCM6EHhbFZZ8E3joDlQ40i8rWnox9t27EM9oxKn0w-p_6hJfIpMa34QaNQ2hipbDYn39KiVjjtid3ovbsU9tZOFl1ASwDptB5a6jJRbYWVkE9-JRB0N1AFyAyay3RRoaeVwL56XY4UL5Hci_-_08qcnXiV3TIqb2AvSBNOwl_0xp_99DhR16q2kKXaGK_QE6UpTqYfZJq3TSDChwJDQCVyKY17x8JHiV-TI5iFAmVDW8lbjpyOtEriw1Tqi-SqSRNQoKS0QwPNA3T428YHwfZ9aIqQ.jpg', tag:'news' },
    'toyota-seat': { title:'toyota is selling car seats as desk chairs', desc:'$3,100 and the seatbelt buckle is a usb hub', thumb:'https://cdn4.telesco.pe/file/DxQ5k89R7uf2gzQVO_tySLqn4unO5W60hEW5eTm7j7lG88p7FpRF0MuZgs2YQFf8SjGoX5C3ZDAyX1dDt2bnowc7I8OpCNDaeQtpaKadH8DEsvsc6vMihiT3ZfNw9-zah0tZCZqcvUTlV9EJ0x7chkZp6-hRS4GCSQwEJ37SCBpEdxcJ111zwTzqb3_iOY9fgjOZ828WLhkl4ZtrDza3BkHwjP2hr_fv9NL0DfjnEoMEjTq1OPndpZIK6jIL1kfveWUdTPLiJK8pnQWE30SwUQjpe68xKcYrCRdnhftwGI3F1j0Cv2x4njJ3izaODCuPSozMavEKgiZX290d46gwhA.jpg', tag:'product' },
    'claude-mythos': { title:'claude mythos', desc:'how a single unverified screenshot became a full-blown ai security panic', thumb:'', tag:'essay' },
    'cobe-globe': { title:'cobe globe', desc:'a spinning webgl globe in 330 bytes', thumb:'', tag:'tool' },
    'nvidia-five-trillion': { title:'nvidia five trillion', desc:'on chip design at five trillion dollar scale', thumb:'', tag:'analysis' },
    'pascal-editor': { title:'pascal editor', desc:'a code editor in pascal, for pascal', thumb:'', tag:'tool' },
    'joe-liemandt-education': { title:'joe liemandt education', desc:'on education as a system for producing credentials', thumb:'', tag:'essay' },
    'dogfood': { title:'dogfood', desc:'exploratory qa of web apps: find bugs, evidence, reports', thumb:'', tag:'tool' }
  };

  // --- progress tracking on article pages ---
  const articleBody = document.querySelector('.article-body');
  if(articleBody){
    const slug = location.pathname.replace(/\/+$/, '').split('/').pop() || 'index';
    let maxProgress = 0;

    function updateProgress(){
      const rect = articleBody.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalH = articleBody.offsetHeight;
      const scrolled = Math.max(0, viewportH - rect.top);
      const progress = Math.min(100, Math.max(0, Math.round((scrolled / totalH) * 100)));
      if(progress > maxProgress) maxProgress = progress;

      const st = getState();
      st[slug] = {
        progress: maxProgress,
        read: maxProgress >= 85 || !!st[slug]?.read,
        at: Date.now()
      };
      setState(st);
      window.dispatchEvent(new CustomEvent('ray:progress', {detail:{slug, progress: maxProgress, read: st[slug].read}}));
    }

    window.addEventListener('scroll', updateProgress, {passive:true});
    updateProgress();
  }

  // --- mark cards on homepage ---
  if(document.querySelector('.card-grid')){
    const st = getState();
    document.querySelectorAll('.card[data-slug], .hero-card[data-slug]').forEach(card => {
      const slug = card.dataset.slug;
      const info = st[slug];
      if(!info) return;

      if(info.read){
        const badge = document.createElement('span');
        badge.className = 'read-badge';
        badge.textContent = 'read';
        const meta = card.querySelector('.meta');
        if(meta) meta.appendChild(badge);
        card.classList.add('is-read');
      } else if(info.progress > 0) {
        const prog = document.createElement('span');
        prog.className = 'read-progress';
        prog.textContent = info.progress + '%';
        const meta = card.querySelector('.meta');
        if(meta) meta.appendChild(prog);
        card.classList.add('is-partial');
      }
    });
  }

  // --- dynamic up-next: exclude read, then shuffle ---
  const upNextContainer = document.querySelector('.article-side .side-section');
  if(upNextContainer && articleBody){
    const currentSlug = location.pathname.replace(/\/+$/, '').split('/').pop() || 'index';
    const st = getState();
    const allSlugs = Object.keys(ARTICLES);
    const unread = allSlugs.filter(s => s !== currentSlug && !(st[s]?.read));
    const read = allSlugs.filter(s => s !== currentSlug && (st[s]?.read));

    const picks = [];
    while(picks.length < 2 && unread.length){
      const idx = Math.floor(Math.random() * unread.length);
      picks.push(unread.splice(idx, 1)[0]);
    }
    while(picks.length < 2 && read.length){
      const idx = Math.floor(Math.random() * read.length);
      picks.push(read.splice(idx, 1)[0]);
    }

    if(picks.length){
      const titleEl = upNextContainer.querySelector('.side-title');
      upNextContainer.innerHTML = '';
      if(titleEl) upNextContainer.appendChild(titleEl);

      picks.forEach(slug => {
        const d = ARTICLES[slug];
        if(!d) return;
        const a = document.createElement('a');
        a.className = 'up-next-item';
        a.href = '/articles/' + slug + '/';
        let html = '';
        if(d.thumb){
          html += `<div class="tn"><img src="${d.thumb}" alt="" loading="lazy"></div>`;
        }
        html += `<div class="de"><div class="t">${d.title}</div><div class="a">${d.desc}</div></div>`;
        a.innerHTML = html;
        upNextContainer.appendChild(a);
      });
    }
  }

  window.rayRead = { getState, setState };
})();
