// Auto-populate Press Releases in media-library.html from blogs-index.json
// Preserves design by cloning the existing press card pattern
(function () {
  function $(sel, parent) { return (parent || document).querySelector(sel); }
  function $all(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

  function composePressDate(date) {
    if (!date) return '';
    // date.month might be like "Jan 2022"; day like "30"
    const m = (date.month || '').trim();
    const d = (date.day || '').trim();
    // If month already includes year, format "Mon DD, YYYY" else just m + ' ' + d
    const parts = m.split(/\s+/);
    if (parts.length >= 2) {
      const mon = parts[0];
      const yr = parts[1];
      return `${mon} ${d}, ${yr}`.trim();
    }
    return [m, d].filter(Boolean).join(' ');
  }

  function parseDateToTs(post) {
    try {
      if (!post || !post.date) return 0;
      const m = (post.date.month || '').trim();
      const d = (post.date.day || '').toString().trim();
      // Expect formats like "Aug 2025" or "Jan 2022"; add day
      const parts = m.split(/\s+/);
      if (parts.length >= 2) {
        const mon = parts[0];
        const yr = parts[1];
        const dtStr = `${mon} ${d || '01'}, ${yr}`;
        const ts = Date.parse(dtStr);
        return isNaN(ts) ? 0 : ts;
      }
      const ts2 = Date.parse(`${m} ${d || '01'}`);
      return isNaN(ts2) ? 0 : ts2;
    } catch { return 0; }
  }

  function buildPressCard(post) {
    // Build a blog-style card for consistency with blog.html and index.html
    const col = document.createElement('div');
  col.className = 'col-sm-12 col-md-6 col-lg-6'; // 2 per row on md+ screens
  col.setAttribute('data-press-card', '1');

    const wrapper = document.createElement('div');
    wrapper.className = 'post-item';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'post-img';
    const dateWrap = document.createElement('span');
    dateWrap.className = 'post-meta-date';
    const day = document.createElement('span'); day.className = 'day'; day.textContent = (post.date && post.date.day) || '';
    const month = document.createElement('span'); month.className = 'month'; month.textContent = (post.date && post.date.month) || '';
    dateWrap.append(day, month);
    const aImg = document.createElement('a'); aImg.href = `blog-single-post.html?id=${post.slug}`;
    const img = document.createElement('img'); img.src = post.heroImage || 'assets/images/blog/grid/1.jpg'; img.alt = 'post image'; img.loading = 'lazy';
    aImg.appendChild(img);
    imgWrap.append(dateWrap, aImg);

    const body = document.createElement('div'); body.className = 'post-body';
    const meta = document.createElement('div'); meta.className = 'post-meta d-flex align-items-center';
    const catWrap = document.createElement('div'); catWrap.className = 'post-meta-cat';
    const tags = Array.isArray(post.tags) ? Array.from(new Set(post.tags.filter(Boolean))) : [];
    const chips = tags.length ? tags : (post.category ? [post.category] : []);
    chips.forEach((t, idx) => { const a = document.createElement('a'); a.href = 'blog.html?tag=' + encodeURIComponent(t); a.textContent = t; if (idx>0) a.style.marginLeft = '6px'; catWrap.appendChild(a); });
    const author = document.createElement('a'); author.className = 'post-meta-author'; author.href = '#'; author.textContent = post.author || '';
    meta.append(catWrap, author);
    const h4 = document.createElement('h4'); h4.className = 'post-title'; const h4a = document.createElement('a'); h4a.href = `blog-single-post.html?id=${post.slug}`; h4a.textContent = post.title; h4.appendChild(h4a);
    const p = document.createElement('p'); p.className = 'post-desc'; const text = (post.excerpt || '').toString(); p.textContent = text.length > 180 ? text.slice(0,177).trimEnd() + '…' : text; p.title = text;
    const read = document.createElement('a'); read.className = 'btn btn-link'; read.href = `blog-single-post.html?id=${post.slug}`; read.innerHTML = '<i class="plus-icon">+</i><span>Read More</span>';
    body.append(meta, h4, p, read);

    wrapper.append(imgWrap, body);
    col.appendChild(wrapper);
    return col;
  }

  function init() {
    // The grid for media items inside the left column
    const grid = document.querySelector('section.blog-layout1 .col-lg-8 > .row');
    if (!grid) return;

  const navId = 'press-pagination-nav';
  const viewAllId = 'press-viewall-cta';

    function ensureNav() {
      let nav = document.getElementById(navId);
      if (!nav) {
        nav = document.createElement('nav');
        nav.id = navId;
        nav.className = 'pagination-area';
        nav.style.display = 'none'; // hidden by default; only show for Press filter
        const ul = document.createElement('ul');
        ul.className = 'pagination justify-content-center mb-0';
        nav.appendChild(ul);
        // Insert after the grid
        const leftCol = document.querySelector('section.blog-layout1 .col-lg-8');
        if (leftCol) {
          const rowWrapper = leftCol.querySelector(':scope > .row');
          leftCol.appendChild(nav);
        } else {
          grid.parentElement.appendChild(nav);
        }
      }
      return nav;
    }

    function renderPagination(total, page, perPage, onPage) {
      // For Press, we now hide numeric pagination and show a single View All button instead
      const nav = ensureNav();
      if (nav) nav.style.display = 'none';
    }

    function ensureViewAll() {
  let cta = document.getElementById(viewAllId);
      if (!cta) {
        cta = document.createElement('div');
        cta.id = viewAllId;
        cta.className = 'row mt-20';
        const col = document.createElement('div');
        col.className = 'col-12 text-center';
  const a = document.createElement('a');
  a.href = 'blog.html';
        a.className = 'btn btn-primary';
        a.textContent = 'View All';
        col.appendChild(a);
        cta.appendChild(col);
        const leftCol = document.querySelector('section.blog-layout1 .col-lg-8');
        if (leftCol) leftCol.appendChild(cta); else grid.parentElement.appendChild(cta);
      }
      return cta;
    }

    fetch('assets/data/blogs/blogs-index.json')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(list => {
        if (!Array.isArray(list) || list.length === 0) return;
        const visible = list.filter(p => !p.hidden);

        // Filter for Press releases first (by tag, category, or explicit type), else fallback to all
        function isPressItem(p) {
          const tagHit = Array.isArray(p.tags) && p.tags.some(t => (t || '').toLowerCase() === 'press');
          const catHit = (p.category || '').toLowerCase() === 'press';
          const typeHit = (p.type || '').toLowerCase() === 'press';
          return tagHit || catHit || typeHit;
        }
  const pressOnly = visible.filter(isPressItem);

        // Sort by newest first using parsed timestamps
  const allPress = (pressOnly.length ? pressOnly : visible).slice().sort((a, b) => parseDateToTs(b) - parseDateToTs(a));
  const perPage = 4; // show only latest 4
        let currentPage = 1;

        function clearPress() {
          $all('[data-press-card="1"]', grid).forEach(el => el.remove());
          const nav = document.getElementById(navId);
          if (nav) nav.style.display = 'none';
          const cta = document.getElementById(viewAllId);
          if (cta) cta.style.display = 'none';
        }

        function renderPage(page) {
          // Remove existing press items to avoid duplicates
          $all('[data-press-card="1"]', grid).forEach(el => el.remove());

          const start = (page - 1) * perPage;
          const slice = allPress.slice(start, start + perPage);
          slice.forEach(post => grid.appendChild(buildPressCard(post)));
          currentPage = page;

          renderPagination(allPress.length, page, perPage, renderPage);
          // Ensure View All is visible only when Press is active
          const activeBtn = document.querySelector('.media-filter-btn.active');
          const cta = ensureViewAll();
          if (!activeBtn || activeBtn.getAttribute('data-filter') !== 'press') {
            if (cta) cta.style.display = 'none';
          } else {
            if (cta) cta.style.display = '';
          }
        }

        // Hook filter buttons to render or clear press items
        $all('.media-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            if (filter === 'press') {
              renderPage(currentPage || 1);
            } else {
              clearPress();
            }
          });
        });

        // On initial load, do not render press unless Press is already active
        const activeBtn = document.querySelector('.media-filter-btn.active');
        if (activeBtn && activeBtn.getAttribute('data-filter') === 'press') {
          renderPage(1);
        } else {
          clearPress();
        }
      })
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
