/**
 * TechFlows TN — Dynamic Workflows Store
 * Fetches workflows from Supabase and renders the card grid.
 * Requires: supabase.js loaded first.
 */

'use strict';

const workflowsGrid   = document.getElementById('workflowsGrid');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const errorMessage    = document.getElementById('errorMessage');
const storeFilters    = document.getElementById('storeFilters');

let allWorkflows = [];
let activeCategory = 'all';

// ---- Fetch all published workflows from Supabase ----
async function fetchWorkflows() {
  showSkeleton();
  try {
    const { data, error } = await supabaseClient
      .from('workflows')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    allWorkflows = data || [];
    
    // Dynamically build categories
    if (storeFilters && allWorkflows.length > 0) {
      const uniqueCats = [...new Set(allWorkflows.map(w => w.category))].filter(Boolean);
      let btnHTML = `<button class="filter-btn active" data-filter="all">All Workflows</button>`;
      uniqueCats.forEach(cat => {
        btnHTML += `<button class="filter-btn" data-filter="${cat}">${cat}</button>`;
      });
      storeFilters.innerHTML = btnHTML;

      // Attach events to new buttons
      const newFilterBtns = storeFilters.querySelectorAll('.filter-btn');
      newFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          newFilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          filterWorkflows(btn.dataset.filter === 'all' ? 'all' : btn.dataset.filter);
        });
      });
    }

    renderWorkflows(allWorkflows);
  } catch (err) {
    console.error('Failed to fetch workflows:', err);
    showError();
  }
}

// ---- Filter by category ----
function filterWorkflows(category) {
  activeCategory = category;
  if (category === 'all') {
    renderWorkflows(allWorkflows);
  } else {
    renderWorkflows(allWorkflows.filter(w => w.category === category));
  }
}

// ---- Build category icon ----
function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '⚡';
}

// ---- Render workflow cards ----
function renderWorkflows(workflows) {
  hideSkeleton();
  hideError();

  if (!workflowsGrid) return;

  if (workflows.length === 0) {
    workflowsGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 0;">
        <p style="font-size:2rem; margin-bottom:12px;">🔍</p>
        <p style="color:var(--text-secondary); font-size:1rem;">No workflows found in this category yet.</p>
        <a href="contact.html" class="btn btn-outline" style="margin-top:20px; display:inline-flex;">Request a Custom Workflow</a>
      </div>`;
    return;
  }

  workflowsGrid.innerHTML = workflows.map((wf, i) => buildWorkflowCard(wf, i)).join('');

  // Re-trigger scroll reveal on new cards
  requestAnimationFrame(() => {
    document.querySelectorAll('.workflow-card.reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50 + (parseInt(el.dataset.index) % 3) * 80);
    });
  });
}

// ---- Build single workflow card HTML ----
function buildWorkflowCard(wf, index) {
  console.log("Workflow ID:", wf.id, "Title:", wf.title);

  const icon = getCategoryIcon(wf.category);

  // --- Handle tools ---
  let toolsArray = wf.tools || [];
  if (typeof toolsArray === 'string') {
    try {
      toolsArray = JSON.parse(toolsArray);
    } catch {
      toolsArray = toolsArray.split(',').map(t => t.trim());
    }
  }
  const toolTags = toolsArray.map(t => `<span class="tool-tag">${t}</span>`).join('');

  const imgSrc   = wf.image_url || PLACEHOLDER_IMG;
  const featured = wf.is_featured
    ? `<span class="featured-badge">⭐ Featured</span>`
    : '';

  const priceStr = wf.price ? parseFloat(wf.price).toFixed(0) : '0';

  return `
    <div class="workflow-card reveal visible" data-category="${wf.category}" data-index="${index}">
      <div class="workflow-thumb">
        <img src="${imgSrc}" alt="${wf.title}" loading="lazy" onerror="this.src='${PLACEHOLDER_IMG}'"/>
        ${featured}
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
        <div class="workflow-price">${priceStr}DT<span>one-time</span></div>
        <div class="workflow-actions">
          <a href="workflow-detail.html?id=${wf.id}#id=${wf.id}" class="btn-details">View</a>
          <button class="btn-demo" onclick="openDemo('${wf.demo_url || ''}', '${wf.title}')">Demo</button>
          <button class="btn-buy"  onclick="buyWorkflow('${wf.id}', '${wf.title}', ${priceStr})">Buy</button>
        </div>
      </div>
    </div>`;
}

// ---- Demo click handler ----
function openDemo(url, title) {
  if (url) {
    window.open(url, '_blank');
  } else {
    window.location.href = `contact.html?subject=Demo Request: ${encodeURIComponent(title)}`;
  }
}

// ---- Buy click handler ----
function buyWorkflow(id, title, price) {
  const msg = `Hello TechFlows TN! I would like to purchase the "${title}" workflow for ${price}DT. Workflow ID: ${id}`;
  window.open(`https://wa.me/21650066125?text=${encodeURIComponent(msg)}`, '_blank');
}

// ---- Skeleton helpers ----
function showSkeleton() {
  if (loadingSkeleton) loadingSkeleton.style.display = 'grid';
  if (workflowsGrid) workflowsGrid.style.display = 'none';
  hideError();
}

function hideSkeleton() {
  if (loadingSkeleton) loadingSkeleton.style.display = 'none';
  if (workflowsGrid) workflowsGrid.style.display = 'grid';
}

function showError() {
  hideSkeleton();
  if (workflowsGrid) workflowsGrid.style.display = 'none';
  if (errorMessage) errorMessage.style.display = 'block';
}

function hideError() {
  if (errorMessage) errorMessage.style.display = 'none';
}

// ---- Load on DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', fetchWorkflows);