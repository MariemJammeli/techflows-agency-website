/**
 * TechFlows TN — Blog Article Reader
 * Handles single blog rendering, markdown parsing, like interaction, and social sharing.
 */

'use strict';

const LIKED_BLOGS_STORAGE_KEY = 'techflows_liked_blogs';

// Fallback dataset for direct access
const FALLBACK_BLOGS = [
  {
    id: '27d185da-f4ed-4d1c-bd33-3daccb62050d',
    title: 'How We Automated 90% of Lead Qualification with n8n and OpenAI',
    slug: 'how-we-automated-lead-qualification-n8n-openai',
    summary: 'Discover the exact n8n workflow architecture we deployed for a B2B client that automatically enriches leads, evaluates budget fit via GPT-4, and schedules meetings without human delay.',
    content: `## The Challenge of Manual Lead Qualification

In high-growth agencies and B2B services, the biggest sales bottleneck is almost always response speed. When a prospective client fills out an inquiry form, every hour of delay decreases conversion rates by up to 391%. 

Before our automation, our client was spending an average of **2.5 hours per day** copying form responses into a spreadsheet, manually searching LinkedIn for company size, and drafting email replies.

### The Architecture We Built

We designed a unified n8n pipeline connected to webhook endpoints:

1. **Intake & Validation:** Incoming webhook captures form payload from Typeform or Webflow.
2. **Data Enrichment:** n8n sends the prospect domain to Clearbit / Hunter API to retrieve company headcount, industry, and tech stack.
3. **AI Scoring Engine:** Using OpenAI GPT-4 with structured outputs (\`json_object\`), the prompt evaluates lead suitability based on custom criteria (budget, timeline, alignment with service offering).
4. **Instant Action Branching:**
   - **Tier A (High Priority):** Automatically generates a personalized calendar invitation link, triggers a notification in the internal Slack/WhatsApp team channel, and writes the qualified record to HubSpot CRM.
   - **Tier B (Nurture):** Pushes the contact into an automated educational email sequence.
   - **Disqualified:** Sends a polite, automated resource guide without draining salesperson time.

\`\`\`json
{
  "lead_score": 92,
  "fit_status": "HIGH_PRIORITY",
  "recommended_action": "Instant Meeting Link",
  "summary": "Verified e-commerce founder with >15 employees seeking n8n automations."
}
\`\`\`

### The Measurable Results

- **Lead response time dropped from 4 hours to 45 seconds.**
- **Conversion from inquiry to discovery call increased by 42%.**
- **10+ hours saved each week** for the core sales team.

Automating lead flow does not mean removing the human touch—it means empowering your team to speak only with qualified, interested clients at the exact moment they are engaged.`,
    category: 'AI Automation',
    author: 'Mariem Jammeli',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    likes_count: 28,
    tags: ['n8n', 'OpenAI', 'CRM', 'Lead Gen'],
    published_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: '35c37d9f-07c8-42b9-8028-85a483e5084e',
    title: 'Why Tunisian Businesses are Switching to n8n over Zapier in 2026',
    slug: 'why-tunisian-businesses-switch-to-n8n',
    summary: 'From self-hosting to privacy compliance and pricing without task limits: why self-hosted n8n is becoming the de-facto standard for modern Tunisian startups and SMBs.',
    content: `## The Automation Dilemma: SaaS Costs vs Data Ownership

As Tunisian businesses rapidly digitize in 2025 and 2026, automation has transitioned from a "nice-to-have" luxury into an operational necessity. For years, Zapier and Make were the default recommendations. However, a major shift is underway across North Africa.

Here is why forward-thinking companies are migrating their entire workflow infrastructure to **n8n**.

### 1. Cost Efficiency Without Task Restrictions

Zapier bills by the individual task. If you run a high-volume e-commerce store with 2,000 monthly orders and each order triggers 6 workflow steps (inventory check, WhatsApp alert, invoice generation, database sync), costs escalate aggressively into hundreds of dollars monthly.

With self-hosted n8n:
- You host on a modest VPS (e.g., $10–$20/month).
- You can execute **hundreds of thousands of executions** without paying per-task surcharges.

### 2. Full Data Sovereignty & Privacy

Under GDPR and local Tunisian data regulations, sending sensitive customer contact details and transaction records through third-party SaaS cloud platforms can pose security compliance concerns. With n8n:
- All database credentials, API keys, and customer information stay strictly within your private server or dedicated VPC.
- Complete audit logs and local encryption.

### 3. Native AI & LangChain Capabilities

n8n has integrated advanced AI agent nodes, vector store integrations (Supabase, Pinecone), and LLM memory modules directly into its visual workflow builder. You can build self-reflecting AI agents that parse documents, search internal databases, and speak fluent Tunisian Derja or French with no code complexity.

### How TechFlows TN Helps You Migrate

We help companies audit their existing Zapier or Make blueprints, reconstruct them cleanly in n8n, verify webhooks, and provide training for your in-house teams.`,
    category: 'n8n Workflows',
    author: 'Mariem Jammeli',
    read_time: '6 min read',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    likes_count: 41,
    tags: ['n8n', 'Zapier', 'Cloud Hosting', 'Tunisia Tech'],
    published_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'e9ac74c5-a72c-4667-8483-4107e5906fda',
    title: 'Building an Autonomous WhatsApp AI Agent for 24/7 Customer Support',
    slug: 'building-autonomous-whatsapp-ai-agent',
    summary: 'A technical walkthrough on integrating the WhatsApp Cloud API with vector search and AI agent tools to handle multilingual customer queries in French, English, and Tunisian Derja.',
    content: `## Why WhatsApp Is The Number One Business Channel

In Tunisia and across the MENA region, WhatsApp is not just a messaging app—it is the central operating system for commerce. Customers expect instant answers on product availability, delivery tracking, and technical support.

Yet staffing a 24/7 human support desk is prohibitively expensive for most companies.

### The Solution: An Autonomous Agent with Tool Calling

A regular rule-based chatbot frustrates customers with rigid numeric menus ("Press 1 for Sales, 2 for Support"). 

Instead, our architecture deploys an **Autonomous AI Agent** built with:
- **WhatsApp Cloud API / Green API** for message reception and transmission.
- **n8n Workflow Engine** as the orchestration layer.
- **Supabase Postgres + pgvector** as the company knowledge base.
- **Claude 3.5 Sonnet or GPT-4o-mini** as the reasoning agent.

### How The Agent Handles Real Conversations

When a customer asks:
> *"Salem! 3andkom livraison l Sousse w 9adech te5o wa9t?"* (Do you deliver to Sousse and how long does it take?)

1. The webhook receives the WhatsApp message payload.
2. The agent converts the message to a semantic vector embedding.
3. It queries the company FAQ database in Supabase and extracts shipping rates and delivery timelines for Sousse.
4. The LLM synthesizes a friendly, polite response in dialect or French based on the client preference:
   > *"Marhba bik! Oui, 3anna livraison l Sousse f 24-48h max. Frais de livraison 7 DT."*

### Key Features Implemented

- **Human Handover:** If the user expresses frustration or asks for human assistance, the agent gracefully flags the ticket in CRM and notifies the on-call support team.
- **Order Tracking Tool:** The agent can query WooCommerce or Shopify via internal API tool calls using only the client phone number or order code.
- **Conversation Memory:** Preserves multi-turn dialogue context so conversations feel natural.`,
    category: 'AI Agents',
    author: 'Mariem Jammeli',
    read_time: '7 min read',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    likes_count: 53,
    tags: ['WhatsApp', 'AI Agents', 'Chatbots', 'Supabase'],
    published_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: '30b7a5a1-9f28-456c-9705-e75c89b05f3e',
    title: '5 Automation Mistakes SMBs Make (And How to Fix Them)',
    slug: '5-automation-mistakes-smbs-make',
    summary: 'From over-automating broken processes to neglecting error fallbacks: practical lessons learned from building over 50+ production workflows.',
    content: `## Why Many Automation Initiatives Fail

Automation is a multiplier. If your underlying business process is organized and logical, automation multiplies your efficiency. But if your manual process is chaotic, automating it will only produce **automated chaos**.

Here are the top 5 mistakes we see when auditing client systems, and the simple frameworks to resolve them.

### 1. Automating an Undefined Process
Never start building nodes until you have mapped the process with pen and paper. Ask:
- What triggers this process?
- What are the required fields?
- What happens when a field is empty or missing?

### 2. Forgetting Error Fallbacks & Alerts
Every external API will fail at some point. If Stripe or your email service experiences a 2-minute downtime and your workflow has no retry logic, customer transactions can vanish silently. Always configure Error Trigger nodes in n8n that send an immediate alert to Slack or Telegram when an execution fails.

### 3. Hardcoding Sensitive Credentials
Store API keys, bearer tokens, and secrets strictly in environment variables or n8n encrypted credential vaults. Never paste live keys inside Code nodes or static webhook URLs.

### 4. Overcomplicating Day 1
Start with the highest-leverage single pain point: usually lead alerts or automated invoice generation. Prove ROI first before attempting a sprawling 50-node multi-branch system.

### 5. Ignoring Team Training
An automation system is only successful if your team actually uses and trusts it. Provide simple 2-minute Loom screen recordings and clean documentation.`,
    category: 'Business Tech',
    author: 'Mariem Jammeli',
    read_time: '4 min read',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    likes_count: 22,
    tags: ['Best Practices', 'Productivity', 'Strategy'],
    published_at: new Date(Date.now() - 21 * 86400000).toISOString()
  }
];

let currentBlog = null;

// Simple markdown to HTML parser
function parseMarkdownToHtml(markdown) {
  if (!markdown) return '';
  let html = markdown;

  // Code blocks
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, lang, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code class="language-${lang}">${escaped.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Unordered list items
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
  // Clean duplicate nested uls if any
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Paragraphs
  const paragraphs = html.split(/\n{2,}/);
  html = paragraphs.map(p => {
    p = p.trim();
    if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<ul') || p.startsWith('<ol')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');

  return html;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

// Get query param
function getBlogParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '');
  return urlParams.get('id') || urlParams.get('slug') || hash || '';
}

// Fetch single blog
async function loadBlogArticle() {
  const idOrSlug = getBlogParam();
  const loadingEl = document.getElementById('articleLoading');
  const errorEl = document.getElementById('articleError');
  const contentEl = document.getElementById('articleContent');

  if (!idOrSlug) {
    // Default to first article if none specified
    displayBlog(FALLBACK_BLOGS[0]);
    return;
  }

  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'none';

  try {
    let blogData = null;

    if (typeof supabaseClient !== 'undefined') {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      let query = supabaseClient.from('blogs').select('*').eq('is_published', true);

      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();
      if (!error && data) {
        blogData = data;
      }
    }

    if (!blogData) {
      // Find in fallback
      blogData = FALLBACK_BLOGS.find(b => b.id === idOrSlug || b.slug === idOrSlug);
    }

    if (!blogData) {
      throw new Error('Blog article not found');
    }

    displayBlog(blogData);
  } catch (err) {
    console.error('Error loading article:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

// Display blog in DOM
function displayBlog(blog) {
  currentBlog = blog;
  const loadingEl = document.getElementById('articleLoading');
  const errorEl = document.getElementById('articleError');
  const contentEl = document.getElementById('articleContent');

  if (loadingEl) loadingEl.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';

  // Set page title
  document.title = `${blog.title} — TechFlows TN Blog`;

  // Populate elements
  const categoryEl = document.getElementById('articleCategory');
  const titleEl = document.getElementById('articleTitle');
  const readTimeEl = document.getElementById('articleReadTime');
  const dateEl = document.getElementById('articleDate');
  const authorEl = document.getElementById('articleAuthor');
  const imgEl = document.getElementById('articleImg');
  const bodyEl = document.getElementById('articleBody');
  const tagsContainer = document.getElementById('articleTags');

  if (categoryEl) categoryEl.textContent = blog.category || 'Tech & Automation';
  if (titleEl) titleEl.textContent = blog.title;
  if (readTimeEl) readTimeEl.textContent = blog.read_time || '5 min read';
  if (dateEl) dateEl.textContent = formatDate(blog.published_at || blog.created_at);
  if (authorEl) authorEl.textContent = blog.author || 'Mariem Jammeli';
  
  if (imgEl) {
    imgEl.src = blog.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';
    imgEl.alt = blog.title;
  }

  if (bodyEl) {
    bodyEl.innerHTML = parseMarkdownToHtml(blog.content || blog.summary || '');
  }

  if (tagsContainer && blog.tags && Array.isArray(blog.tags)) {
    tagsContainer.innerHTML = blog.tags.map(t => `<span class="tool-tag">#${t}</span>`).join('');
  }

  // Update like buttons
  syncLikeButtons();
  loadRelatedBlogs(blog.id, blog.category);
}

// Sync like button states
function syncLikeButtons() {
  if (!currentBlog) return;

  const raw = localStorage.getItem(LIKED_BLOGS_STORAGE_KEY);
  const likedIds = raw ? JSON.parse(raw) : [];
  const isLiked = likedIds.includes(currentBlog.id);

  const likeBtns = document.querySelectorAll('.btn-article-like');
  likeBtns.forEach(btn => {
    if (isLiked) {
      btn.classList.add('liked');
    } else {
      btn.classList.remove('liked');
    }
    const countEl = btn.querySelector('.like-count');
    if (countEl) countEl.textContent = currentBlog.likes_count || 0;
  });
}

// Like toggle handler for article page
async function toggleArticleLike() {
  if (!currentBlog) return;

  const raw = localStorage.getItem(LIKED_BLOGS_STORAGE_KEY);
  let likedIds = raw ? JSON.parse(raw) : [];
  const currentlyLiked = likedIds.includes(currentBlog.id);
  const delta = currentlyLiked ? -1 : 1;

  if (currentlyLiked) {
    likedIds = likedIds.filter(id => id !== currentBlog.id);
  } else {
    likedIds.push(currentBlog.id);
  }

  localStorage.setItem(LIKED_BLOGS_STORAGE_KEY, JSON.stringify(likedIds));
  currentBlog.likes_count = Math.max(0, (currentBlog.likes_count || 0) + delta);

  syncLikeButtons();

  // Sync to Supabase
  try {
    if (typeof supabaseClient !== 'undefined') {
      await supabaseClient.rpc('increment_blog_likes', {
        blog_id: currentBlog.id,
        delta: delta
      });
    }
  } catch (err) {
    console.error('Error syncing like to Supabase:', err);
  }
}

// Share functions
function shareOnWhatsApp() {
  const url = window.location.href;
  const title = currentBlog ? currentBlog.title : document.title;
  window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this article from TechFlows TN: "${title}" - ${url}`)}`, '_blank');
}

function shareOnLinkedIn() {
  const url = window.location.href;
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnTwitter() {
  const url = window.location.href;
  const title = currentBlog ? currentBlog.title : document.title;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
}

function copyArticleLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Link copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy link.');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

// Load related blogs
async function loadRelatedBlogs(excludeId, category) {
  const relatedGrid = document.getElementById('relatedBlogsGrid');
  if (!relatedGrid) return;

  let related = FALLBACK_BLOGS.filter(b => b.id !== excludeId);
  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .neq('id', excludeId)
        .limit(3);
      if (data && data.length > 0) related = data;
    }
  } catch (e) {
    console.warn('Could not load related blogs from Supabase:', e);
  }

  if (related.length === 0) {
    document.getElementById('relatedSection')?.remove();
    return;
  }

  const raw = localStorage.getItem(LIKED_BLOGS_STORAGE_KEY);
  const likedIds = raw ? JSON.parse(raw) : [];

  relatedGrid.innerHTML = related.slice(0, 3).map((blog, idx) => {
    const isLiked = likedIds.includes(blog.id);
    const detailUrl = `blog-detail.html?id=${blog.id}`;
    return `
      <article class="blog-card reveal visible" style="animation-delay: ${idx * 0.1}s">
        <div class="blog-thumb-wrap">
          <a href="${detailUrl}">
            <img src="${blog.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'}" alt="${blog.title}" loading="lazy"/>
          </a>
          <span class="blog-badge">${blog.category || 'Tech'}</span>
        </div>
        <div class="blog-content">
          <div class="blog-meta-top">
            <span>${blog.read_time || '5 min read'}</span>
          </div>
          <h3><a href="${detailUrl}">${blog.title}</a></h3>
          <p class="blog-excerpt">${blog.summary || ''}</p>
          <div class="blog-footer">
            <span style="font-size:0.8rem; color:var(--text-secondary);">${blog.author || 'Mariem Jammeli'}</span>
            <a href="${detailUrl}" class="btn-read-blog">Read →</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', loadBlogArticle);
