// Handle the sidebar search on blog pages: redirects to blog.html with a search query.
(function(){
  function onSubmit(e){
    e.preventDefault();
    var input = e.target.querySelector('input[type="text"], input[type="search"]');
    var q = input && input.value ? input.value.trim() : '';
    var dest = 'blog.html';
    if (q) dest += '?search=' + encodeURIComponent(q);
    window.location.href = dest;
  }

  function init(){
    var forms = document.querySelectorAll('.widget-form-search');
    forms.forEach(function(f){ f.addEventListener('submit', onSubmit); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
