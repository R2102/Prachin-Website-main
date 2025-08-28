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

  function buildPressCard(post, template) {
    const col = document.createElement('div');
    col.className = 'col-sm-12 col-md-6 media-item';
    col.setAttribute('data-category', 'press');

    const wrapper = document.createElement('div');
    wrapper.className = 'post-item';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'post-img media-img';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'media-date';
    dateSpan.textContent = composePressDate(post.date);
    const catSpan = document.createElement('span');
    catSpan.className = 'media-category';
    catSpan.textContent = 'Press';
    const aImg = document.createElement('a');
    aImg.href = `blog-single-post.html?id=${post.slug}`;
    const img = document.createElement('img');
    img.src = post.heroImage || 'assets/images/gallery/8.jpg';
    img.alt = 'media image';
    img.loading = 'lazy';
    aImg.appendChild(img);
    imgWrap.append(dateSpan, catSpan, aImg);

    const body = document.createElement('div');
    body.className = 'post-body media-body';
    const h4 = document.createElement('h4');
    h4.className = 'media-title';
    h4.textContent = post.title;
    const descDiv = document.createElement('div');
    descDiv.className = 'media-desc';
    const p = document.createElement('p');
    const text = (post.excerpt || '').toString();
    p.textContent = text.length > 200 ? text.slice(0, 197).trimEnd() + '…' : text;
    descDiv.appendChild(p);
    const read = document.createElement('a');
    read.className = 'btn btn-link';
    read.href = `blog-single-post.html?id=${post.slug}`;
    read.innerHTML = '<i class="plus-icon">+</i><span>Read More</span>';
    body.append(h4, descDiv, read);

    wrapper.append(imgWrap, body);
    col.appendChild(wrapper);
    return col;
  }

  function init() {
    // The grid for media items inside the left column
    const grid = document.querySelector('section.blog-layout1 .col-lg-8 > .row');
    if (!grid) return;

    const navId = 'press-pagination-nav';

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
      const totalPages = Math.ceil(total / perPage);
      const nav = ensureNav();
      const ul = nav.querySelector('ul.pagination');
      ul.innerHTML = '';
      if (totalPages <= 1) {
        nav.style.display = 'none';
        return;
      }
      // Build page numbers
      for (let p = 1; p <= totalPages; p++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = String(p);
        a.className = 'page-link';
        if (p === page) a.classList.add('current');
        a.addEventListener('click', function (e) { e.preventDefault(); onPage(p); });
        li.className = 'page-item';
        li.appendChild(a);
        ul.appendChild(li);
      }
      nav.style.display = '';
    }

    fetch('assets/data/blogs/blogs-index.json')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(list => {
        if (!Array.isArray(list) || list.length === 0) return;

        // Sort by newest first using parsed timestamps
        const allPress = list.slice().sort((a, b) => parseDateToTs(b) - parseDateToTs(a));
        const perPage = 4;
        let currentPage = 1;

        function clearPress() {
          $all('.media-item[data-category="press"]', grid).forEach(el => el.remove());
          const nav = document.getElementById(navId);
          if (nav) nav.style.display = 'none';
        }

        function renderPage(page) {
          // Remove existing press items to avoid duplicates
          $all('.media-item[data-category="press"]', grid).forEach(el => el.remove());

          const start = (page - 1) * perPage;
          const slice = allPress.slice(start, start + perPage);
          slice.forEach(post => grid.appendChild(buildPressCard(post)));
          currentPage = page;

          renderPagination(allPress.length, page, perPage, renderPage);
          // Ensure visible only when Press is active
          const activeBtn = document.querySelector('.media-filter-btn.active');
          const nav = document.getElementById(navId);
          if (!activeBtn || activeBtn.getAttribute('data-filter') !== 'press') {
            if (nav) nav.style.display = 'none';
          }
        }

        // Hook filter buttons to render or clear press items
        $all('.media-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            const nav = document.getElementById(navId);
            if (filter === 'press') {
              renderPage(currentPage || 1);
              if (nav) nav.style.display = '';
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
