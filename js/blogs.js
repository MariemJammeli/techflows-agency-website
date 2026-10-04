/**
 * TechFlows TN — Blogs & Weekly Insights
 * Supports fetching weekly blogs, category & language filters, live search, and interactive Likes.
 */

'use strict';

// Local storage key for keeping track of user's liked blogs
const LIKED_BLOGS_STORAGE_KEY = 'techflows_liked_blogs';

// Fallback initial data in case Supabase is offline or loading
const FALLBACK_BLOGS = [
  {
    id: '27d185da-f4ed-4d1c-bd33-3daccb62050d',
    title: 'How We Automated 90% of Lead Qualification with n8n and OpenAI',
    slug: 'how-we-automated-lead-qualification-n8n-openai',
    summary: 'Discover the exact n8n workflow architecture we deployed for a B2B client that automatically enriches leads, evaluates budget fit via GPT-4, and schedules meetings without human delay.',
    category: 'AI Automation',
    author: 'Mariem Jammeli',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    language: 'en',
    likes_count: 28,
    tags: ['n8n', 'OpenAI', 'CRM', 'Lead Gen'],
    published_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: '35c37d9f-07c8-42b9-8028-85a483e5084e',
    title: 'Why Tunisian Businesses are Switching to n8n over Zapier in 2026',
    slug: 'why-tunisian-businesses-switch-to-n8n',
    summary: 'From self-hosting to privacy compliance and pricing without task limits: why self-hosted n8n is becoming the de-facto standard for modern Tunisian startups and SMBs.',
    category: 'n8n Workflows',
    author: 'Mariem Jammeli',
    read_time: '6 min read',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    language: 'en',
    likes_count: 41,
    tags: ['n8n', 'Zapier', 'Cloud Hosting', 'Tunisia Tech'],
    published_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'e9ac74c5-a72c-4667-8483-4107e5906fda',
    title: 'Building an Autonomous WhatsApp AI Agent for 24/7 Customer Support',
    slug: 'building-autonomous-whatsapp-ai-agent',
    summary: 'A technical walkthrough on integrating the WhatsApp Cloud API with vector search and AI agent tools to handle multilingual customer queries in French, English, and Tunisian Derja.',
    category: 'AI Agents',
    author: 'Mariem Jammeli',
    read_time: '7 min read',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    language: 'en',
    likes_count: 53,
    tags: ['WhatsApp', 'AI Agents', 'Chatbots', 'Supabase'],
    published_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: '30b7a5a1-9f28-456c-9705-e75c89b05f3e',
    title: '5 Automation Mistakes SMBs Make (And How to Fix Them)',
    slug: '5-automation-mistakes-smbs-make',
    summary: 'From over-automating broken processes to neglecting error fallbacks: practical lessons learned from building over 50+ production workflows.',
    category: 'Business Tech',
    author: 'Mariem Jammeli',
    read_time: '4 min read',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    language: 'en',
    likes_count: 22,
    tags: ['Best Practices', 'Productivity', 'Strategy'],
    published_at: new Date(Date.now() - 21 * 86400000).toISOString()
  }
];

let allBlogs = [];
let activeBlogCategory = 'all';
let activeBlogLanguage = 'all'; // 'all' | 'fr' | 'en'
let blogSearchQuery = '';
let blogsFetchId = 0; // guards against out-of-order responses when switching language quickly

// Blogs without a language value are treated as English
function getBlogLanguage(blog) {
  return (blog.language || 'en').toLowerCase();
}

function matchesActiveLanguage(blog) {
  return activeBlogLanguage === 'all' || getBlogLanguage(blog) === activeBlogLanguage;
}

// Get array of liked blog IDs from localStorage
function getLikedBlogIds() {
  try {
    const raw = localStorage.getItem(LIKED_BLOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading liked blogs from localStorage:', e);
    return [];
  }
}

// Check if a specific blog is liked by current user
function isBlogLiked(blogId) {
  return getLikedBlogIds().includes(blogId);
}

// Toggle like for a blog
async function toggleBlogLike(blogId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const likedIds = getLikedBlogIds();
  const currentlyLiked = likedIds.includes(blogId);
  const delta = currentlyLiked ? -1 : 1;

  // Update local storage
  let newLikedIds;
  if (currentlyLiked) {
    newLikedIds = likedIds.filter(id => id !== blogId);
  } else {
    newLikedIds = [...likedIds, blogId];
  }

  try {
    localStorage.setItem(LIKED_BLOGS_STORAGE_KEY, JSON.stringify(newLikedIds));
  } catch (e) {
    console.warn('Could not write to localStorage:', e);
  }

  // Update cached blogs data
  const targetBlog = allBlogs.find(b => b.id === blogId);
  if (targetBlog) {
    targetBlog.likes_count = Math.max(0, (targetBlog.likes_count || 0) + delta);
  }

  // Update all like buttons for this blog on page
  const likeButtons = document.querySelectorAll(`[data-like-btn="${blogId}"]`);
  likeButtons.forEach(btn => {
    const countEl = btn.querySelector('.like-count');
    if (currentlyLiked) {
      btn.classList.remove('liked');
      btn.setAttribute('aria-label', 'Like this blog post');
    } else {
      btn.classList.add('liked');
      btn.setAttribute('aria-label', 'Unlike this blog post');
    }
    if (countEl && targetBlog) {
      countEl.textContent = targetBlog.likes_count;
    }
  });

  // Sync with Supabase
  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient.rpc('increment_blog_likes', {
        blog_id: blogId,
        delta: delta
      });
      if (error) {
        console.warn('Supabase like RPC failed, falling back to direct update:', error);
        // Fallback direct update if RPC is missing
        if (targetBlog) {
          await supabaseClient
            .from('blogs')
            .update({ likes_count: targetBlog.likes_count })
            .eq('id', blogId);
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync like count to Supabase:', err);
  }
}

// Format relative/friendly date
function formatBlogDate(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

// Build a single Blog Card HTML
function buildBlogCardHtml(blog, index) {
  const isLiked = isBlogLiked(blog.id);
  const formattedDate = formatBlogDate(blog.published_at || blog.created_at);
  const detailUrl = `blog-detail.html?id=${blog.id}`;
  const imgUrl = blog.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';

  return `
    <article class="blog-card reveal visible" data-category="${blog.category}" data-language="${getBlogLanguage(blog)}" style="animation-delay: ${index * 0.08}s">
      <div class="blog-thumb-wrap">
        <a href="${detailUrl}">
          <img src="${imgUrl}" alt="${blog.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'" />
        </a>
        <span class="blog-badge">${blog.category || 'Tech & AI'}</span>
      </div>
      <div class="blog-content">
        <div class="blog-meta-top">
          <span class="blog-lang-tag" title="${getBlogLanguage(blog) === 'fr' ? 'Article en français' : 'Article in English'}">${getBlogLanguage(blog).toUpperCase()}</span>
          <span>
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${blog.read_time || '5 min read'}
          </span>
          <span>•</span>
          <span>
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${formattedDate}
          </span>
        </div>

        <h3><a href="${detailUrl}">${blog.title}</a></h3>
        <p class="blog-excerpt">${blog.summary || ''}</p>

        <div class="blog-footer">
          <div class="blog-author">
            <div class="blog-avatar">MJ</div>
            <div class="blog-author-info">
              <div class="blog-author-name">${blog.author || 'Mariem Jammeli'}</div>
              <div class="blog-author-role">TechFlows TN</div>
            </div>
          </div>

          <div class="blog-actions">
            <button 
              type="button"
              class="btn-like ${isLiked ? 'liked' : ''}" 
              data-like-btn="${blog.id}"
              onclick="toggleBlogLike('${blog.id}', event)"
              aria-label="${isLiked ? 'Unlike this blog post' : 'Like this blog post'}"
              title="Like this post"
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="like-count">${blog.likes_count || 0}</span>
            </button>
            <a href="${detailUrl}" class="btn-read-blog">
              Read →
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Fetch published blogs, filtered by the active language in Supabase
async function fetchBlogs() {
  const blogsGrid = document.getElementById('blogsGrid');
  const featuredBlogsGrid = document.getElementById('featuredBlogsGrid');
  const blogsLoading = document.getElementById('blogsLoadingSkeleton');
  const fetchId = ++blogsFetchId;

  if (blogsLoading) blogsLoading.style.display = 'block';

  let blogs;
  try {
    if (typeof supabaseClient !== 'undefined') {
      let query = supabaseClient
        .from('blogs')
        .select('*')
        .eq('is_published', true);

      if (activeBlogLanguage !== 'all') {
        query = query.eq('language', activeBlogLanguage);
      }

      const { data, error } = await query.order('published_at', { ascending: false });

      if (error) throw error;
      // Only fall back to sample data when there are no blogs at all,
      // not when a language simply has no articles yet
      if (data && data.length > 0) {
        blogs = data;
      } else {
        blogs = activeBlogLanguage === 'all' ? FALLBACK_BLOGS : [];
      }
    } else {
      blogs = FALLBACK_BLOGS;
    }
  } catch (err) {
    console.warn('Could not fetch blogs from Supabase, using local fallback:', err);
    blogs = FALLBACK_BLOGS;
  }

  // A newer fetch (e.g. another language click) has started; drop this result
  if (fetchId !== blogsFetchId) return;

  allBlogs = blogs;
  if (blogsLoading) blogsLoading.style.display = 'none';

  // Render on blogs.html if grid exists
  if (blogsGrid) {
    renderFilteredBlogs();
  }

  // Render on index.html if featuredBlogsGrid exists
  if (featuredBlogsGrid) {
    renderFeaturedBlogsPreview();
  }
}

// Render on blogs.html
function renderFilteredBlogs() {
  const blogsGrid = document.getElementById('blogsGrid');
  if (!blogsGrid) return;

  const query = blogSearchQuery.trim().toLowerCase();

  const filtered = allBlogs.filter(blog => {
    const matchesCategory = (activeBlogCategory === 'all') || 
      (blog.category && blog.category.toLowerCase() === activeBlogCategory.toLowerCase());

    const matchesSearch = !query || 
      blog.title.toLowerCase().includes(query) || 
      (blog.summary && blog.summary.toLowerCase().includes(query)) ||
      (blog.category && blog.category.toLowerCase().includes(query));

    // Language is filtered in Supabase; this also covers the local fallback data
    return matchesCategory && matchesSearch && matchesActiveLanguage(blog);
  });

  if (filtered.length === 0) {
    blogsGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <p style="font-size:2.5rem; margin-bottom:12px;">📰</p>
        <h3 style="color:var(--white); margin-bottom:8px;">No weekly blogs found</h3>
        <p style="color:var(--text-secondary); max-width:400px; margin:0 auto 20px;">
          Try adjusting your search query or selecting a different category or language.
        </p>
        <button class="btn btn-outline" onclick="resetBlogFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  blogsGrid.innerHTML = filtered.map((blog, idx) => buildBlogCardHtml(blog, idx)).join('');
}

// Render preview on index.html (top 3 weekly articles)
function renderFeaturedBlogsPreview() {
  const featuredBlogsGrid = document.getElementById('featuredBlogsGrid');
  if (!featuredBlogsGrid) return;

  const previewList = allBlogs.slice(0, 3);
  featuredBlogsGrid.innerHTML = previewList.map((blog, idx) => buildBlogCardHtml(blog, idx)).join('');
}

// Setup search input, category pills and language toggle
function setupBlogFiltersAndSearch() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const langBtns = document.querySelectorAll('.blog-lang-btn');
  const searchInput = document.getElementById('blogSearchInput');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBlogCategory = btn.dataset.filter || 'all';
      renderFilteredBlogs();
    });
  });

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang || 'all';
      if (lang === activeBlogLanguage) return;
      setActiveLanguageButton(lang);
      activeBlogLanguage = lang;
      fetchBlogs();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      blogSearchQuery = e.target.value;
      renderFilteredBlogs();
    });
  }
}

function setActiveLanguageButton(lang) {
  document.querySelectorAll('.blog-lang-btn').forEach(b => {
    const isActive = b.dataset.lang === lang;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function resetBlogFilters() {
  const languageChanged = activeBlogLanguage !== 'all';
  activeBlogCategory = 'all';
  activeBlogLanguage = 'all';
  setActiveLanguageButton('all');
  blogSearchQuery = '';
  const searchInput = document.getElementById('blogSearchInput');
  if (searchInput) searchInput.value = '';
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  filterBtns.forEach(b => {
    if (b.dataset.filter === 'all') b.classList.add('active');
    else b.classList.remove('active');
  });
  if (languageChanged) fetchBlogs();
  else renderFilteredBlogs();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('blogsGrid')) setupBlogFiltersAndSearch();
  fetchBlogs();
});
