// Dynamically populate blog single post content without changing markup/classes/styles
// Usage: blog-single-post.html?id=<slug> loads assets/data/blogs/<slug>.json

(function () {
	function safeSelect(selector) {
		return document.querySelector(selector);
	}

	function insertImagesRow(container, images) {
		if (!container || !Array.isArray(images) || images.length === 0) return;
		const row = document.createElement('div');
		row.className = 'row';
		const toShow = images.slice(0, 2); // keep two images, preserve design
		toShow.forEach(src => {
			const col = document.createElement('div');
			col.className = 'col-6';
			const img = document.createElement('img');
			img.src = src;
			img.alt = 'blog image';
			img.className = 'mb-30';
			col.appendChild(img);
			row.appendChild(col);
		});
		// Insert after first paragraph if exists, else at top
		const firstP = container.querySelector('p');
		if (firstP && firstP.parentElement === container) {
			firstP.insertAdjacentElement('afterend', row);
		} else {
			container.prepend(row);
		}
	}

	function populate(data) {
		try {
			// Title
			const titleEl = safeSelect('.post-title');
			if (titleEl && data.title) titleEl.textContent = data.title;

			// Category
			const catEl = safeSelect('.post-meta-cat a');
			if (catEl && data.category) catEl.textContent = data.category;

			// Author
			const authorEl = safeSelect('.post-meta-author');
			if (authorEl && data.author) authorEl.textContent = data.author;

			// Comments count (text only)
			const commentsEl = safeSelect('.post-meta-comments');
			if (commentsEl && typeof data.comments === 'number') {
				commentsEl.textContent = `${data.comments} comments`;
			}

			// Date
			if (data.date) {
				const dayEl = safeSelect('.post-meta-date .day');
				const monthEl = safeSelect('.post-meta-date .month');
				if (dayEl && data.date.day) dayEl.textContent = data.date.day;
				if (monthEl && data.date.month) monthEl.textContent = data.date.month; // expects e.g., 'Jan 2025'
			}

			// Hero image
			const heroImg = safeSelect('.post-img img');
			if (heroImg && data.heroImage) heroImg.src = data.heroImage;

			// Body content
			const desc = safeSelect('.post-desc');
			if (desc) {
				if (data.contentHtml) {
					desc.innerHTML = data.contentHtml;
				}
				// Two-image row (preserve design with two columns)
				if (data.images && data.images.length) {
					insertImagesRow(desc, data.images);
				}
			}
		} catch (e) {
			// Fail silently to avoid affecting design
			console.error('Blog populate error:', e);
		}
	}

		function parseDateObj(d) {
			if (!d || !d.day || !d.month) return 0;
			// month contains e.g. 'Aug 2025' or 'Jan 2022'
			const str = `${d.day} ${d.month}`;
			const t = Date.parse(str);
			return isNaN(t) ? 0 : t;
		}

		function updatePrevNext(currentSlug) {
			fetch('assets/data/blogs/blogs-index.json')
				.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
				.then(list => {
					if (!Array.isArray(list) || list.length === 0) return;
					// Sort by date desc (newest first) to make navigation intuitive
					const sorted = list.slice().sort((a, b) => parseDateObj(b.date) - parseDateObj(a.date));
					const idx = sorted.findIndex(p => p.slug === currentSlug);
					if (idx === -1) return;

					const prevPost = sorted[idx + 1]; // older
					const nextPost = sorted[idx - 1]; // newer

					// In markup, .nav-next displays "Previous Post" (arrow left)
					const prevAnchor = document.querySelector('.widget-nav .nav-next');
					const nextAnchor = document.querySelector('.widget-nav .nav-prev');

					if (prevAnchor) prevAnchor.href = prevPost ? `blog-single-post.html?id=${prevPost.slug}` : 'blog.html';
					if (nextAnchor) nextAnchor.href = nextPost ? `blog-single-post.html?id=${nextPost.slug}` : 'blog.html';
				})
				.catch(() => { /* silent */ });
		}

			function formatSidebarDate(d) {
				if (!d) return '';
				const day = d.day || '';
				const parts = String(d.month || '').trim().split(/\s+/); // e.g., ["Aug","2025"]
				if (parts.length === 2) {
					const [mon, year] = parts;
					return `${mon} ${day}, ${year}`.trim();
				}
				return `${day} ${d.month}`.trim();
			}

			function updateRecentPosts(currentSlug) {
				const container = document.querySelector('.widget.widget-posts .widget-content');
				if (!container) return;
				fetch('assets/data/blogs/blogs-index.json')
					.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
					.then(list => {
						if (!Array.isArray(list)) return;
						const sorted = list.slice().sort((a, b) => parseDateObj(b.date) - parseDateObj(a.date));
						const recent = sorted.filter(p => p.slug !== currentSlug).slice(0, 3);

						// Clear existing items
						container.innerHTML = '';

								const maxTitleLen = 60; // adjust as needed to fit design
								const ellipsize = (s, n) => {
									if (!s) return '';
									const t = s.trim();
									return t.length > n ? t.slice(0, n - 1) + '…' : t;
								};

								recent.forEach(post => {
							const item = document.createElement('div');
							item.className = 'widget-post-item d-flex align-items-center';

							const imgWrap = document.createElement('div');
							imgWrap.className = 'widget-post-img';
							const aImg = document.createElement('a');
							aImg.href = `blog-single-post.html?id=${post.slug}`;
							const img = document.createElement('img');
							img.src = post.heroImage || 'assets/images/blog/grid/1.jpg';
							img.alt = 'thumb';
							aImg.appendChild(img);
							imgWrap.appendChild(aImg);

							const content = document.createElement('div');
							content.className = 'widget-post-content';
							const dateSpan = document.createElement('span');
							dateSpan.className = 'widget-post-date';
							dateSpan.textContent = formatSidebarDate(post.date);
							const h4 = document.createElement('h4');
							h4.className = 'widget-post-title';
							  const aTitle = document.createElement('a');
							aTitle.href = `blog-single-post.html?id=${post.slug}`;
							  aTitle.textContent = ellipsize(post.title, maxTitleLen);
							  aTitle.title = post.title; // tooltip with full title
							h4.appendChild(aTitle);
							content.appendChild(dateSpan);
							content.appendChild(h4);

							item.appendChild(imgWrap);
							item.appendChild(content);
							container.appendChild(item);
						});
					})
					.catch(() => { /* silent */ });
			}

	function init() {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id') || params.get('slug');
		if (!id) return; // No dynamic loading if no id
		const url = `assets/data/blogs/${id}.json`;
		fetch(url)
			.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
				.then(data => { populate(data); updatePrevNext(id); updateRecentPosts(id); })
			.catch(() => {
				// Graceful fallback: do nothing if file missing
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

