/**
 * Fetches featured workflows for the homepage
 */

'use strict';

const featuredWorkflowsGrid = document.getElementById('featuredWorkflowsGrid');
const indexLoadingSkeleton = document.getElementById('indexLoadingSkeleton');

async function fetchFeaturedWorkflows() {
  if (indexLoadingSkeleton) indexLoadingSkeleton.style.display = 'block';
  
  try {
    const { data, error } = await supabaseClient
      .from('workflows')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    if (indexLoadingSkeleton) indexLoadingSkeleton.style.display = 'none';
    renderFeaturedWorkflows(data || []);
  } catch (err) {
    console.error('Failed to fetch featured workflows:', err);
    if (indexLoadingSkeleton) {
      indexLoadingSkeleton.innerHTML = 'Could not load workflows at this time.';
    }
  }
}

function getCategoryIcon(cat) {
  const CATEGORY_ICONS = {
    'AI & GPT': '🤖',
    'CRM & Leads': '📊',
    'WhatsApp': '💬',
    'E-Commerce': '🛒',
    'Social Media': '📱',
    'Automation': '⚡',
    'AI Agents': '🧠',
    'Content Automation': '✍️',
    'Data Automation': '📈',
    'AI Automation': '🤖',
    'Business Automation': '💼'
  };
  return CATEGORY_ICONS[cat] || '⚡';
}

function renderFeaturedWorkflows(workflows) {
  if (!featuredWorkflowsGrid) return;
  
  const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1618401471353-b98a52333646?auto=format&fit=crop&q=80&w=600';

  let html = '';
  workflows.forEach((wf, index) => {
    const icon     = getCategoryIcon(wf.category);
    const toolTags = (wf.tools || []).map(t => `<span class="tool-tag">${t}</span>`).join('');
    const imgSrc   = wf.image_url || PLACEHOLDER_IMG;
    const featuredBadge = wf.is_featured ? `<span class="featured-badge">⭐ Featured</span>` : '';
    
    html += `
      <div class="workflow-card reveal visible" style="animation-delay: ${index * 0.1}s">
        <div class="workflow-thumb">
          <img src="${imgSrc}" alt="${wf.title}" loading="lazy" onerror="this.src='${PLACEHOLDER_IMG}'"/>
          ${featuredBadge}
        </div>
        <div class="workflow-header">
          <div class="workflow-icon-wrap">${icon}</div>
          <h3>${wf.title}</h3>
          <p class="desc">${wf.description || ''}</p>
        </div>
        <div class="workflow-body">
          <p class="tools-label">Tools Used</p>
          <div class="tools-list">${toolTags}</div>
        </div>
        <div class="workflow-footer">
          <div class="workflow-price">${parseFloat(wf.price).toFixed(0)}DT<span>one-time</span></div>
          <div class="workflow-actions">
            <a href="workflow-detail.html?id=${wf.id}#id=${wf.id}" class="btn-details">View</a>
            <button class="btn-buy" onclick="buyWorkflowIndex('${wf.id}', '${wf.title}', ${wf.price})">Buy</button>
          </div>
        </div>
      </div>
    `;
  });
  
  featuredWorkflowsGrid.innerHTML = html;
}

function buyWorkflowIndex(id, title, price) {
  const msg = `Hello TechFlows TN! I would like to purchase the "${title}" workflow for ${price}DT. Workflow ID: ${id}`;
  window.open(`https://wa.me/21650066125?text=${encodeURIComponent(msg)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', fetchFeaturedWorkflows);
