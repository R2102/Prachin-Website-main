// Populate the "Recent Posts" widget on the blog single page from blogs-index.json
// Keeps existing markup/classes; fills top 3 posts excluding the current one.
(function () {
  function truncateTitle(text, max) {
    if (!text) return '';
    if (text.length <= max) return text;
    // Trim to nearest word before max
    var cut = text.slice(0, max);
    var lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > max * 0.6) cut = cut.slice(0, lastSpace);
    return cut.replace(/[\s.,;:!?'"-]+$/,'') + '…';
  }

  function init() {
    var container = document.querySelector('.widget.widget-posts .widget-content');
    if (!container) return;

    var params = new URLSearchParams(window.location.search);
    var currentId = params.get('id') || params.get('slug') || '';

    fetch('assets/data/blogs/blogs-index.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (list) {
        if (!Array.isArray(list)) return;
        // Treat the index order as newest-first
        var posts = list.filter(function (p) { return p && p.slug !== currentId; }).slice(0, 3);
        if (posts.length === 0) return;

        // Clear existing static items
        container.innerHTML = '';

        posts.forEach(function (post) {
          var item = document.createElement('div');
          item.className = 'widget-post-item d-flex align-items-center';

          var imgWrap = document.createElement('div');
          imgWrap.className = 'widget-post-img';
          var imgLink = document.createElement('a');
          imgLink.href = 'blog-single-post.html?id=' + post.slug;
          var img = document.createElement('img');
          img.src = post.heroImage || 'assets/images/blog/grid/1.jpg';
          img.alt = 'thumb';
          imgLink.appendChild(img);
          imgWrap.appendChild(imgLink);

          var content = document.createElement('div');
          content.className = 'widget-post-content';
          var date = document.createElement('span');
          date.className = 'widget-post-date';
          if (post.date && (post.date.day || post.date.month)) {
            var day = post.date.day ? String(post.date.day).trim() : '';
            var month = post.date.month ? String(post.date.month).trim() : '';
            date.textContent = (day && month) ? (day + ' ' + month) : (day || month);
          }
          var h4 = document.createElement('h4');
          h4.className = 'widget-post-title';
          var titleLink = document.createElement('a');
          titleLink.href = 'blog-single-post.html?id=' + post.slug;
          var fullTitle = post.title || 'Blog Post';
          titleLink.textContent = truncateTitle(fullTitle, 55);
          titleLink.title = fullTitle;
          h4.appendChild(titleLink);

          content.appendChild(date);
          content.appendChild(h4);

          item.appendChild(imgWrap);
          item.appendChild(content);
          container.appendChild(item);
        });
      })
      .catch(function () { /* silent fail to preserve design */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
