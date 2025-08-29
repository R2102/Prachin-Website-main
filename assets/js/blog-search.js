// Handle the sidebar search on blog pages: redirects to blog.html with a search query.
(function(){
  function onSubmit(e){
    e.preventDefault();
    var form = e.target;
    var input = form.querySelector('#blog-search-input, input[type="search"], input[type="text"]');
    var q = input && input.value ? input.value.trim() : '';
    var params = new URLSearchParams(window.location.search);
    // Update search term
    if (q) {
      params.set('search', q);
    } else {
      params.delete('search');
    }
    var dest = 'blog.html' + (params.toString() ? ('?' + params.toString()) : '');
    window.location.href = dest;
  }

  function init(){
    var form = document.getElementById('blog-search-form') || document.querySelector('.widget.widget-search form');
    if (form) {
      form.addEventListener('submit', onSubmit);
      try {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('search') || '';
        var input = form.querySelector('#blog-search-input, input[type="search"], input[type="text"]');
        if (input) input.value = q;
      } catch { /* noop */ }
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
