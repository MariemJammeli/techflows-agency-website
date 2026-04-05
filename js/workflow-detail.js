'use strict';

const params     = new URLSearchParams(window.location.search);
let workflowId = params.get('id')?.trim();

// Fallback to hash if query param is missing (npx serve might strip it during redirect)
if (!workflowId && window.location.hash) {
  try {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    workflowId = hashParams.get('id')?.trim();
  } catch (e) {
    console.warn('Failed to parse ID from hash');
  }
}

// Elements
const detailLoading = document.getElementById('detailLoading');
const detailContent = document.getElementById('detailContent');
const detailError   = document.getElementById('detailError');

async function loadWorkflowDetail() {
  if (!workflowId) {
    showDetailError(`No workflow ID provided. URL: ${window.location.href}`);
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      showDetailError(`Error loading workflow: ${error.message}`);
      return;
    }

    if (!data) {
      console.warn(`No workflow found for ID: ${workflowId}`);
      showDetailError('Workflow not found. It might be unpublished or the link might be broken.');
      return;
    }

    renderDetail(data);
  } catch (err) {
    console.error('Failed to load workflow detail:', err);
    showDetailError('Failed to load workflow. Please try again.');
  }
}

function renderDetail(wf) {
  if (detailLoading) detailLoading.style.display = 'none';
  if (detailError)   detailError.style.display   = 'none';
  if (detailContent) detailContent.style.display = 'block';

  document.title = `${wf.title} – TechFlows TN`;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', wf.description || '');

  setEl('detailTitle', wf.title);
  setEl('detailCategory', wf.category);
  setEl('detailShortDesc', wf.description);

  const featuredBadge = document.getElementById('detailFeatured');
  if (featuredBadge) {
    featuredBadge.style.display = wf.is_featured ? 'inline-flex' : 'none';
  }

  // FIX PRICE
  const price = wf.price ? parseFloat(wf.price).toFixed(0) : '0';
  setEl('detailPrice', `${price}DT`);
  setEl('detailPriceCard', `${price}DT`);

  // Image
  const img = document.getElementById('detailImage');
  if (img) {
    const src = wf.image_url || PLACEHOLDER_IMG;
    img.src = src;
    img.alt = wf.title;
    img.onerror = () => { img.src = PLACEHOLDER_IMG; };
  }

  // Long description
  const longDescEl = document.getElementById('detailLongDesc');
  if (longDescEl && wf.long_description) {
    longDescEl.innerHTML = wf.long_description
      .split('\n')
      .map(line => {
        if (line.startsWith('•') || line.startsWith('-')) {
          return `<li>${line.replace(/^[•\-]\s*/, '')}</li>`;
        }
        if (/^\d+\./.test(line)) {
          return `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
        }
        return line ? `<p>${line}</p>` : '';
      })
      .join('');
  }

  // FIX TOOLS (important)
  const toolsWrap = document.getElementById('detailTools');
  if (toolsWrap && wf.tools) {
    let toolsArray = wf.tools;

    // If tools is stored as JSON string → parse it
    if (typeof toolsArray === 'string') {
      try {
        toolsArray = JSON.parse(toolsArray);
      } catch {
        toolsArray = toolsArray.split(',').map(t => t.trim());
      }
    }

    toolsWrap.innerHTML = toolsArray
      .map(t => `<span class="tool-tag">${t}</span>`)
      .join('');
  }

  // Buy button
  const buyBtn = document.getElementById('detailBuyBtn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      const msg = `Hello TechFlows TN! I would like to purchase the "${wf.title}" workflow for ${price}DT.`;
      window.open(`https://wa.me/21650066125?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // Demo button
  const demoBtn = document.getElementById('detailDemoBtn');
  if (demoBtn) {
    if (wf.demo_url) {
      demoBtn.href = wf.demo_url;
      demoBtn.target = '_blank';
    } else {
      demoBtn.href = `contact.html?subject=Demo+Request:+${encodeURIComponent(wf.title)}`;
    }
  }

  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }, 100);
}

function showDetailError(msg) {
  if (detailLoading) detailLoading.style.display = 'none';
  if (detailContent) detailContent.style.display = 'none';
  if (detailError) {
    detailError.style.display = 'block';
    const span = detailError.querySelector('.error-msg');
    if (span) span.textContent = msg;
  }
}

function setEl(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.textContent = value;
  }
}

document.addEventListener('DOMContentLoaded', loadWorkflowDetail);