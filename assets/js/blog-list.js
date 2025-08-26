// Populate blog.html cards from assets/data/blogs/blogs-index.json
// Preserves the existing grid layout and styles by cloning the first card as a template.
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

    // Description: leave as-is to preserve design; optionally truncate from JSON in future
    return card;
  }

  function init() {
    // Find the blog grid row that contains cards
    const grid = document.querySelector('section.blog-layout1 .container .row');
    if (!grid) return;

    // Use the first post card as the template
    const templateCol = grid.querySelector('.col-sm-12.col-md-6.col-lg-4');
    if (!templateCol) return;

    fetch('assets/data/blogs/blogs-index.json')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then(list => {
        if (!Array.isArray(list) || list.length === 0) return;

        // Keep the first card as template, clear the rest
        const cards = $all('.col-sm-12.col-md-6.col-lg-4', grid);
        cards.slice(1).forEach(c => c.remove());

        // Fill first card with first post
        const first = list[0];
        const firstCard = makeCardFromTemplate(templateCol, first);
        grid.replaceChild(firstCard, templateCol);

        // Append others
        list.slice(1).forEach(post => {
          const card = makeCardFromTemplate(firstCard, post);
          grid.appendChild(card);
        });
      })
      .catch(() => { /* silent fail to avoid layout changes */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
