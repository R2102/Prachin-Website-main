// Dynamically populate blog single post content without changing markup/classes/styles
// Usage: blog-single-post.html?id=<slug> loads assets/data/blogs/<slug>.json

(function () {
	function safeSelect(selector) {
		return document.querySelector(selector);
	}

	function updateBreadcrumbTitle(title) {
		try {
			const activeCrumb = document.querySelector('.breadcrumb .breadcrumb-item.active');
			if (activeCrumb && title) {
				activeCrumb.textContent = title;
			}
			// Also update the document title for better UX/SEO without changing design
			if (title) {
				document.title = `${title} | Prachin`;
			}
		} catch (e) {
			// no-op
		}
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
			// Breadcrumb active item
			if (data.title) updateBreadcrumbTitle(data.title);

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

	function init() {
		// Hide comment section (list, form, and top meta count)
		try {
			const commentsBlock = document.querySelector('.blog-comments');
			if (commentsBlock) commentsBlock.style.display = 'none';
			const commentsForm = document.querySelector('.blog-comments-form');
			if (commentsForm) commentsForm.style.display = 'none';
			const commentsMeta = document.querySelector('.post-meta-comments');
			if (commentsMeta) commentsMeta.style.display = 'none';
			// Hide tags (in-post block and sidebar widget)
			const tagsBlocks = document.querySelectorAll('.widget-tags');
			tagsBlocks.forEach(el => { el.style.display = 'none'; });
		} catch (_) {}

		const prevLink = document.querySelector('.widget-nav .nav-next'); // left/Previous
		const nextLink = document.querySelector('.widget-nav .nav-prev'); // right/Next
		// Hide both by default to avoid incorrect display before data loads
		if (prevLink) prevLink.style.display = 'none';
		if (nextLink) nextLink.style.display = 'none';

		const params = new URLSearchParams(window.location.search);
		const id = params.get('id') || params.get('slug');
		// If no id, still wire Next to the first item from index (treat as entry point)
		if (!id) {
			fetch('assets/data/blogs/blogs-index.json')
				.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
				.then(list => {
					if (!Array.isArray(list) || list.length === 0) return;
					if (nextLink) {
						nextLink.href = `blog-single-post.html?id=${list[0].slug}`;
						nextLink.style.display = '';
					}
					// No previous on entry page
				})
				.catch(() => {});
			return;
		}
		const url = `assets/data/blogs/${id}.json`;
		fetch(url)
			.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
			.then(populate)
			.catch(() => {
				// Graceful fallback: do nothing if file missing
			});

		// Wire Previous/Next links using the blogs index, preserving labels and design
		fetch('assets/data/blogs/blogs-index.json')
			.then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
			.then(list => {
				if (!Array.isArray(list)) return;
				const idx = list.findIndex(p => p.slug === id);
				if (idx === -1) return;
				const prev = idx > 0 ? list[idx - 1] : null; // previous item in the list
				const next = idx < list.length - 1 ? list[idx + 1] : null; // next item in the list

				const prevLink = document.querySelector('.widget-nav .nav-next'); // left/Previous
				const nextLink = document.querySelector('.widget-nav .nav-prev'); // right/Next
				// Hide both by default to avoid showing invalid links
				if (prevLink) prevLink.style.display = 'none';
				if (nextLink) nextLink.style.display = 'none';

				// Show and set only when available
				if (prevLink && prev) {
					prevLink.href = `blog-single-post.html?id=${prev.slug}`;
					prevLink.style.display = '';
				}
				if (nextLink && next) {
					nextLink.href = `blog-single-post.html?id=${next.slug}`;
					nextLink.style.display = '';
				}
			})
			.catch(() => {
				// Ignore if index not found
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

