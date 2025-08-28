// Lightweight comments for blog-single-post.html using localStorage per post slug
// No backend required. Scope: preserves existing design/markup.
(function () {
  // State shared across handlers
  let currentList = [];
  let replyParentId = null;

  function getSlug() {
    const p = new URLSearchParams(window.location.search);
    return p.get('id') || p.get('slug') || 'default';
  }

  function $(sel, parent) { return (parent || document).querySelector(sel); }
  function $all(sel, parent) { return Array.from((parent || document).querySelectorAll(sel)); }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadComments(slug) {
    try {
      const raw = localStorage.getItem('blog_comments_' + slug);
  const arr = raw ? JSON.parse(raw) : [];
  return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }

  function saveComments(slug, list) {
    try { localStorage.setItem('blog_comments_' + slug, JSON.stringify(list)); } catch {}
  }

  function fmtDate(ts) {
    const d = ts ? new Date(ts) : new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mm = months[d.getMonth()];
    const dd = d.getDate().toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12; h = h ? h : 12;
    return `${mm} ${dd}, ${yyyy} - ${h}:${m} ${ampm}`;
  }

  function genId() {
    // Simple unique id for local use
    return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function ensureIds(list) {
    let changed = false;
    list.forEach(c => {
      if (!c.id) { c.id = genId(); changed = true; }
      if (typeof c.parentId === 'undefined') { c.parentId = null; }
    });
    return changed;
  }

  function buildTree(list) {
    const byId = new Map();
    list.forEach(c => { c.children = []; byId.set(c.id, c); });
    const roots = [];
    list.forEach(c => {
      if (c.parentId && byId.has(c.parentId)) {
        byId.get(c.parentId).children.push(c);
      } else {
        roots.push(c);
      }
    });
    return roots;
  }

  function renderComments(list) {
    const ul = $('.blog-comments .comments-list');
    if (!ul) return;
    // Clear existing static comments
    ul.innerHTML = '';

  function makeItem(c) {
      const li = document.createElement('li');
      li.className = 'comment-item';

      const avatar = document.createElement('div');
      avatar.className = 'comment-avatar';
      const img = document.createElement('img');
      img.src = 'assets/images/blog/author/2.jpg';
      img.alt = 'avatar';
      avatar.appendChild(img);

      const content = document.createElement('div');
      content.className = 'comment-content';
      const h5 = document.createElement('h5');
      h5.className = 'comment-author';
      h5.textContent = c.name;
      const date = document.createElement('span');
      date.className = 'comment-date';
      date.textContent = fmtDate(c.ts);
      const p = document.createElement('p');
      p.className = 'comment-desc';
      p.textContent = c.comment;
      const reply = document.createElement('a');
      reply.className = 'comment-reply';
      reply.href = '#';
      reply.setAttribute('data-id', c.id);
      reply.innerHTML = '<i class="icon-arrow-right"></i><span>reply</span>';
      content.append(h5, date, p, reply);

      li.append(avatar, content);

      if (Array.isArray(c.children) && c.children.length) {
        const childUl = document.createElement('ul');
        childUl.className = 'nested-comment list-unstyled';
        c.children.forEach(ch => childUl.appendChild(makeItem(ch)));
        li.appendChild(childUl);
      }
      return li;
    }

    // Build tree and render
    const roots = buildTree(list);
    roots.forEach(c => ul.appendChild(makeItem(c)));

    // Update count heading and top meta count
    const count = list.length;
    const title = $('.blog-comments .blog-widget-title');
    if (title) title.textContent = `${count} comment${count === 1 ? '' : 's'}`;
    const topMeta = $('.post-meta-comments');
    if (topMeta) topMeta.textContent = `${count} comment${count === 1 ? '' : 's'}`;
  }

  function parseStaticDate(text) {
    // Try to parse formats like: "Feb 28, 2017 - 08:07 pm"; fallback to now
    if (!text) return Date.now();
    const d = Date.parse(text.replace(/\s*-\s*/,' '));
    return isNaN(d) ? Date.now() : d;
  }

  function importStaticComments() {
    const container = $('.blog-comments .comments-list');
    if (!container) return [];
    const imported = [];
    // Only import top-level .comment-item directly under .comments-list
    const tops = Array.from(container.children).filter(el => el.classList && el.classList.contains('comment-item'));
    tops.forEach(top => {
      const name = top.querySelector('.comment-author')?.textContent?.trim() || 'Anonymous';
      const dateText = top.querySelector('.comment-date')?.textContent?.trim() || '';
      const desc = top.querySelector('.comment-desc')?.textContent?.trim() || '';
      const pid = genId();
      imported.push({ id: pid, name, email: '', website: '', comment: desc, ts: parseStaticDate(dateText), parentId: null });
      // nested under ul.nested-comment
      const nested = top.querySelector('ul.nested-comment');
      if (nested) {
        const kids = nested.querySelectorAll(':scope > li.comment-item');
        kids.forEach(k => {
          const n2 = k.querySelector('.comment-author')?.textContent?.trim() || 'Anonymous';
          const d2 = k.querySelector('.comment-date')?.textContent?.trim() || '';
          const t2 = k.querySelector('.comment-desc')?.textContent?.trim() || '';
          imported.push({ id: genId(), name: n2, email: '', website: '', comment: t2, ts: parseStaticDate(d2), parentId: pid });
        });
      }
    });
    return imported;
  }

  function setReplyBanner(form, commentId) {
    // Remove existing banner
    const old = form.querySelector('.replying-banner');
    if (old) old.remove();
    if (!commentId) return;
    const target = currentList.find(c => c.id === commentId);
    const banner = document.createElement('div');
    banner.className = 'replying-banner';
    banner.style.margin = '10px 0';
    banner.style.padding = '8px 12px';
    banner.style.background = '#f5f5f5';
    banner.style.borderLeft = '3px solid #ccc';
    banner.style.fontSize = '14px';
    const name = target ? target.name : 'comment';
    banner.innerHTML = `Replying to <strong>${escapeHTML(name)}</strong> <a href="#" class="cancel-reply" style="margin-left:10px;">(cancel)</a>`;
    const area = form.querySelector('textarea');
    if (area && area.parentElement) {
      area.parentElement.insertAdjacentElement('beforebegin', banner);
    } else {
      form.insertBefore(banner, form.firstChild);
    }
  }

  function bindReplyClicks() {
    const container = $('.blog-comments .comments-list');
    if (!container) return;
    container.addEventListener('click', function (e) {
      const link = e.target.closest && e.target.closest('.comment-reply');
      if (!link) return;
      e.preventDefault();
      const id = link.getAttribute('data-id');
      if (!id) return;
      replyParentId = id;
      const form = $('.blog-comments-form form');
      if (form) {
        setReplyBanner(form, id);
        const ta = form.querySelector('textarea');
        if (ta) { ta.focus(); }
        try { form.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
      }
    });
  }

  function bindCancelReply() {
    const form = $('.blog-comments-form form');
    if (!form) return;
    form.addEventListener('click', function (e) {
      const cancel = e.target.closest && e.target.closest('.cancel-reply');
      if (!cancel) return;
      e.preventDefault();
      replyParentId = null;
      setReplyBanner(form, null);
    });
  }

  function bindForm(slug, list) {
    const form = $('.blog-comments-form form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('input[placeholder="Name:"]');
      const email = form.querySelector('input[placeholder="Email:"]');
      const website = form.querySelector('input[placeholder="Website:"]');
      const comment = form.querySelector('textarea');

      const nameVal = (name && name.value || '').trim();
      const emailVal = (email && email.value || '').trim();
      const websiteVal = (website && website.value || '').trim();
      const commentVal = (comment && comment.value || '').trim();

      // Require only the comment; default name if missing
      if (!commentVal) {
        if (comment && comment.reportValidity) comment.reportValidity();
        return;
      }

      const entry = {
        id: genId(),
        name: nameVal || 'Anonymous',
        email: emailVal,
        website: websiteVal,
        comment: commentVal,
        ts: Date.now(),
        parentId: replyParentId
      };
      list.push(entry);
      saveComments(slug, list);
      currentList = list;
      renderComments(currentList);
      form.reset();
      // Clear reply state
      replyParentId = null;
      setReplyBanner(form, null);
    });
  }

  function init() {
    const slug = getSlug();
    let list = loadComments(slug);
    // If no saved comments, try importing the static markup the first time
    if (!list.length) {
      list = importStaticComments();
      if (list.length) { saveComments(slug, list); }
    }
    // Ensure ids/parentId present for legacy entries
    if (ensureIds(list)) { saveComments(slug, list); }
    currentList = list;
    renderComments(currentList);
    bindForm(slug, list);
    bindReplyClicks();
    bindCancelReply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
