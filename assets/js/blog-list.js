// Populate blog.html from assets/data/blogs/blogs-index.json
// – Builds cards to match the existing grid, supports ?search= and ?category= filters,
// – Populates the sidebar categories dynamically, and hides the static pagination.
(function () {
  // Parse the post date to a timestamp (supports month like "Aug 2025" + day like "10")
  function parseDateToTs(post) {
    try {
      if (!post || !post.date) return 0;
      const m = (post.date.month || '').trim();
      const d = (post.date.day || '').toString().trim();
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
  function hidePagination() {
    try {
      const nav = document.querySelector('nav.pagination-area');
      if (!nav) return;
      const row = nav.closest('.row');
      if (row) {
        row.remove();
      } else {
        nav.style.display = 'none';
      }
    } catch { /* noop */ }
  }
  function getSearchTerm() {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search');
      return q ? q.trim().toLowerCase() : '';
    } catch { return ''; }
  }
  function getTagOrCategory() {
    try {
      const params = new URLSearchParams(window.location.search);
      // Prefer `tag` for taxonomy; fall back to legacy `category` if present
      const t = params.get('tag') || params.get('category');
      return t ? t.trim() : '';
    } catch { return ''; }
  }

  function $(sel, parent) { return (parent || document).querySelector(sel); }
  function $all(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

  function makeCardFromTemplate(template, post) {
    const card = template.cloneNode(true);
    // Date
    const dayEl = card.querySelector('.post-meta-date .day');
    const monthEl = card.querySelector('.post-meta-date .month');
    if (post.date) {
      if (dayEl) dayEl.textContent = post.date.day || '';
      if (monthEl) monthEl.textContent = post.date.month || '';
    }
    // Image and links
    const imgLink = card.querySelector('.post-img a');
    const img = card.querySelector('.post-img img');
    const readMore = card.querySelector('.btn.btn-link');
    const titleLink = card.querySelector('.post-title a');
    const href = `blog-single-post.html?id=${post.slug}`;
    if (imgLink) imgLink.href = href;
    if (img) img.src = post.heroImage || img.src;
    if (readMore) readMore.href = href;
    if (titleLink) titleLink.href = href;

    // Title
    const titleEl = card.querySelector('.post-title a');
    if (titleEl) titleEl.textContent = post.title;

    // Tags (taxonomy) and author
    const catWrap = card.querySelector('.post-meta-cat');
    if (catWrap) {
      const tags = Array.isArray(post.tags) ? Array.from(new Set(post.tags.filter(Boolean))) : [];
      const chips = tags.length ? tags : (post.category ? [post.category] : []);
      catWrap.innerHTML = '';
      chips.forEach((t, idx) => {
        const a = document.createElement('a');
        a.href = 'blog.html?tag=' + encodeURIComponent(t);
        a.textContent = t;
        a.setAttribute('data-tag', t);
        if (idx > 0) a.style.marginLeft = '6px';
        catWrap.appendChild(a);
      });
    }
    const authorEl = card.querySelector('.post-meta-author');
    if (authorEl) authorEl.textContent = post.author || authorEl.textContent;

    // Description: populate from index excerpt while preserving design
    const descEl = card.querySelector('.post-desc');
    if (descEl) {
      const text = (post.excerpt || descEl.textContent || '').toString();
      // Light truncation to roughly match existing layout if very long
      const trimmed = text.length > 180 ? text.slice(0, 177).trimEnd() + '…' : text;
      descEl.textContent = trimmed;
      // Optional tooltip with full text
      descEl.title = text;
    }
    return card;
  }

  function init() {
    // Locate the posts grid within the left column (col-lg-8)
    const leftCol = document.querySelector('section.blog-layout1 .col-lg-8');
    let grid = null;
    if (leftCol) {
      const rows = Array.from(leftCol.querySelectorAll(':scope > .row'));
      grid = rows.find(r => r.querySelector('.post-item')) || null;
    }
    // Fallback to legacy selector if needed
    if (!grid) grid = document.querySelector('section.blog-layout1 .container .row');
    if (!grid) return;

    // Use the first direct column holding a .post-item as the template
    let templateCol = null;
    const directCols = Array.from(grid.children).filter(el => /(^|\s)col-/.test(el.className));
    templateCol = directCols.find(col => col.querySelector('.post-item')) || directCols[0] || null;
    if (!templateCol) return;

  fetch('assets/data/blogs/blogs-index.json')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(list => {
        if (!Array.isArray(list) || list.length === 0) return;
        // Exclude hidden posts if flagged in JSON
        const visible = list.filter(p => !p.hidden);

        // Optional filtering by search term
        const q = getSearchTerm();
    const selectedTag = getTagOrCategory();
  const filtered = visible.filter(p => {
          let ok = true;
          if (q) {
            const hay = [p.title, p.category, p.author, (p.excerpt || '')]
              .filter(Boolean)
              .join(' ').toLowerCase();
            ok = ok && hay.includes(q);
          }
          if (selectedTag && selectedTag.toLowerCase() !== 'all') {
            const tags = (Array.isArray(p.tags) ? p.tags : []).concat(p.category ? [p.category] : []);
            ok = ok && tags.some(t => (t || '').toLowerCase() === selectedTag.toLowerCase());
          }
          return ok;
        });

        // Populate sidebar categories from tags with counts (like single-post)
        try {
          const counts = new Map();
          visible.forEach(p => {
            const tags = Array.isArray(p.tags) ? p.tags : [];
            if (tags.length) {
              tags.forEach(t => {
                const key = (t || '').trim();
                if (!key) return;
                counts.set(key, (counts.get(key) || 0) + 1);
              });
            } else if (p.category) {
              // Fallback: count category as a tag if no tags present
              const key = p.category;
              counts.set(key, (counts.get(key) || 0) + 1);
            }
          });
          const ul = document.querySelector('.widget.widget-categories ul');
          if (ul && counts.size) {
            ul.innerHTML = '';
            const current = (selectedTag || '').toLowerCase();
            Array.from(counts.entries())
              .sort((a, b) => a[0].localeCompare(b[0]))
              .forEach(([name, cnt]) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = 'blog.html?tag=' + encodeURIComponent(name);
                a.className = 'd-flex justify-content-between align-items-center';
                a.setAttribute('data-tag', name);
                if (current && name.toLowerCase() === current) a.classList.add('current');
                const tSpan = document.createElement('span');
                tSpan.className = 'cat-title';
                tSpan.textContent = name;
                const cSpan = document.createElement('span');
                cSpan.className = 'cat-count';
                cSpan.textContent = String(cnt);
                a.appendChild(tSpan);
                a.appendChild(cSpan);
                li.appendChild(a);
                ul.appendChild(li);
              });
          }
        } catch { /* noop */ }

        // Insert result summary and back button when filtering is active
        (function handleResultSummary(){
          try {
            const hasFilter = (q && q.length) || (selectedTag && selectedTag.toLowerCase() !== 'all');
            if (!leftCol) return;
            // Remove existing summary/back if any
            const oldInfo = document.getElementById('blog-result-info');
            if (oldInfo && oldInfo.parentElement) oldInfo.parentElement.removeChild(oldInfo);
            const oldBack = document.getElementById('blog-result-back');
            if (oldBack && oldBack.parentElement) oldBack.parentElement.removeChild(oldBack);
            if (!hasFilter) return;

            // Summary line before grid
            const info = document.createElement('div');
            info.id = 'blog-result-info';
            info.className = 'mb-20';
            const parts = [];
            const countText = `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}`;
            if (q && selectedTag && selectedTag.toLowerCase() !== 'all') {
              parts.push(`Showing ${countText} for "${q}" in "${selectedTag}"`);
            } else if (q) {
              parts.push(`Showing ${countText} for "${q}"`);
            } else if (selectedTag && selectedTag.toLowerCase() !== 'all') {
              parts.push(`Showing ${countText} in "${selectedTag}"`);
            }
            const label = document.createElement('div');
            label.className = 'text-muted';
            label.textContent = parts.join(' ');
            info.appendChild(label);
            // place before the grid
            leftCol.insertBefore(info, leftCol.firstElementChild || grid);

            // Back button after grid
            const backRow = document.createElement('div');
            backRow.id = 'blog-result-back';
            backRow.className = 'row mt-20';
            const col = document.createElement('div');
            col.className = 'col-12 text-center';
            const back = document.createElement('a');
            back.href = 'blog.html';
            back.className = 'btn btn-secondary';
            back.textContent = 'Back to all articles';
            col.appendChild(back);
            backRow.appendChild(col);
            leftCol.appendChild(backRow);
          } catch { /* noop */ }
        })();

        if (filtered.length === 0) {
          // Clear all cards and show a minimal message, preserving container
          const cards = Array.from(grid.children).filter(el => /(^|\s)col-/.test(el.className));
          cards.forEach(c => c.remove());
          const col = document.createElement('div');
          col.className = 'col-12';
          const p = document.createElement('p');
          p.textContent = 'No posts found.';
          col.appendChild(p);
          grid.appendChild(col);
          hidePagination();
          return;
        }

  // Sort newest first so latest blogs show first
  const ordered = filtered.slice().sort((a, b) => parseDateToTs(b) - parseDateToTs(a));

  // Keep the first card as template, clear the rest
        const cards = Array.from(grid.children).filter(el => /(^|\s)col-/.test(el.className));
        cards.slice(1).forEach(c => c.remove());

  // Fill first card with first post
  const first = ordered[0];
        const firstCard = makeCardFromTemplate(templateCol, first);
        grid.replaceChild(firstCard, templateCol);

  // Append others
  ordered.slice(1).forEach(post => {
          const card = makeCardFromTemplate(firstCard, post);
          grid.appendChild(card);
        });

        // No JS pagination yet; remove static pagination block
        hidePagination();

        // Hook category clicks (both inside cards and in sidebar) to filter
        const handleTagClick = (e) => {
          const a = e.target.closest('a[data-tag]');
          if (!a) return;
          e.preventDefault();
          const selected = a.getAttribute('data-tag') || '';
          const params = new URLSearchParams(window.location.search);
          // Update new `tag` param; remove legacy `category`
          if (selected && selected.toLowerCase() !== 'all') params.set('tag', selected); else params.delete('tag');
          params.delete('category');
          // Preserve existing search term if present
          const dest = 'blog.html' + (params.toString() ? ('?' + params.toString()) : '');
          window.location.href = dest;
        };
        $all('.widget-categories a').forEach(a => a.addEventListener('click', handleTagClick));
        $all('.post-meta-cat a', grid).forEach(a => a.addEventListener('click', handleTagClick));
      })
      .catch(() => { /* silent fail to avoid layout changes */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
