// Populate the "Recent Articles" section on index.html from blogs-index.json
// Preserves design by cloning the first card as a template and filling top 3 posts.
(function () {
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

    // Category and author
    const catEl = card.querySelector('.post-meta-cat a');
    if (catEl) catEl.textContent = post.category || catEl.textContent;
    const authorEl = card.querySelector('.post-meta-author');
    if (authorEl) authorEl.textContent = post.author || authorEl.textContent;

    // Description
    const descEl = card.querySelector('.post-desc');
    if (descEl) {
      const text = (post.excerpt || descEl.textContent || '').toString();
      const trimmed = text.length > 160 ? text.slice(0, 157).trimEnd() + '…' : text;
      descEl.textContent = trimmed;
      descEl.title = text;
    }
    return card;
  }

  function init() {
    // Find the Recent Articles grid (first blog-layout1 section on the page)
    const section = document.querySelector('section.blog-layout1');
    if (!section) return;
    const grid = section.querySelector('.container > .row + .row'); // the row containing cards after heading row
    if (!grid) return;

    const templateCol = grid.querySelector('.col-sm-12.col-md-6.col-lg-4');
    if (!templateCol) return;

    fetch('assets/data/blogs/blogs-index.json')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(list => {
        if (!Array.isArray(list) || list.length === 0) return;
        const top = list.slice(0, 3);

        // Remove extra existing cards; keep only the first as template
        const cards = $all('.col-sm-12.col-md-6.col-lg-4', grid);
        cards.slice(1).forEach(c => c.remove());

        // Fill first card
        const firstCard = makeCardFromTemplate(templateCol, top[0]);
        grid.replaceChild(firstCard, templateCol);

        // Append remaining (up to 2 more)
        top.slice(1).forEach(post => {
          const card = makeCardFromTemplate(firstCard, post);
          grid.appendChild(card);
        });
      })
      .catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
