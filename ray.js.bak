/* ray read tracker + dynamic up-next */
(function(){
  const KEY = 'ray.read';
  function getState(){
    try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch(e){ return {}; }
  }
  function setState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

  // --- article metadata for up-next ---
  let ARTICLES = {};
  async function loadArticles(){
    try{
      const r = await fetch('/articles.json');
      const list = await r.json();
      ARTICLES = {};
      list.forEach(a => {
        ARTICLES[a.slug] = { title: a.title, desc: a.desc, thumb: a.thumb, tag: a.tag };
      });
    }catch(e){ /* fallback to empty */ }
  }
  loadArticles();

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
