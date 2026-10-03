/**
 * TechFlows TN — Formations & Practical Lessons
 * Supports fetching training programs, interactive syllabus accordions,
 * and custom "Contact Me for More Infos" action handlers.
 */

'use strict';

const FALLBACK_FORMATIONS = [
  {
    id: 'a78895f9-e7be-4233-8b65-30d807421c1e',
    title: 'Formation n8n Mastery: Zero to Production',
    slug: 'formation-n8n-mastery',
    badge: 'Most Popular',
    level: 'Beginner to Intermediate',
    duration: '4 Weeks (16 Hours total)',
    format: 'Live Online (Google Meet) + 1-on-1 Debugging + Recording Access',
    summary: 'Master the world\'s leading open-source automation engine. Learn to build, host, debug, and scale real-world enterprise workflows from scratch.',
    description: 'This hands-on formation is designed for freelancers, developers, IT specialists, and business operators who want to master workflow automation with n8n. Over 4 intensive weeks, you will go from understanding basic node triggers to architecting production-grade workflows that connect CRMs, AI models, payment systems, and custom APIs.',
    syllabus: [
      {
        module_number: 1,
        title: 'Architecture, Installation & Core Fundamentals',
        duration: 'Week 1',
        topics: [
          'n8n ecosystem overview: Self-hosted Docker vs n8n Cloud',
          'Setting up your VPS, Docker Compose, SSL certificates & environment variables',
          'Understanding Nodes: Trigger nodes, Action nodes, and Data flow',
          'Data structures in n8n: Mastering JSON objects, binary data, and JMESPath expressions'
        ]
      },
      {
        module_number: 2,
        title: 'API Integrations, Webhooks & Data Transformation',
        duration: 'Week 2',
        topics: [
          'REST APIs & Webhooks: Authentication headers, OAuth2, and query params',
          'Transforming complex data payloads using the Code (JavaScript/Python) Node',
          'Handling pagination, batch processing, and rate limits',
          'Practical lab: Connecting Google Sheets, Airtable, Notion & Slack'
        ]
      },
      {
        module_number: 3,
        title: 'Advanced Logic, Error Handling & AI Workflows',
        duration: 'Week 3',
        topics: [
          'Conditional routing: Switch, If, Merge, and Loop Over Items nodes',
          'Building fault-tolerant workflows: Error Trigger, retries, and fallback branches',
          'Integrating OpenAI & Claude nodes for dynamic text parsing and classification',
          'Sub-workflows: Calling modular child workflows with execution context'
        ]
      },
      {
        module_number: 4,
        title: 'Capstone Project & Monetization Blueprint',
        duration: 'Week 4',
        topics: [
          'End-to-end Capstone: Building a full client automation system',
          'Production monitoring, database backups, and execution log management',
          'Packaging and exporting workflow templates for clients',
          'How to price and sell automation services to international & local clients'
        ]
      }
    ],
    prerequisites: 'No coding background required. Basic comfort using computer tools and spreadsheets is recommended.',
    outcomes: [
      'Build and maintain complex multi-step automations independently',
      'Host and secure your own unlimited n8n instance on cloud servers',
      'Connect any platform with an API or webhook without code lock-in',
      'Deliver billable automation services to companies and clients'
    ],
    is_featured: true
  },
  {
    id: '7bcf40db-96d3-4d0e-b5b2-322eab7587c9',
    title: 'Formation AI Agents & LLM Orchestration',
    slug: 'formation-ai-agents-llm',
    badge: 'Advanced Practical',
    level: 'Intermediate to Advanced',
    duration: '3 Weeks (12 Hours total)',
    format: 'Live Workshops + Code Templates + Lifetime Community Access',
    summary: 'Learn how to architect, train, and deploy autonomous AI agents with tools, memory, RAG, and vector databases for real businesses.',
    description: 'Move beyond simple ChatGPT prompts. In this formation, you will learn to construct intelligent AI agents that search the web, execute database operations, summarize documents, and interact with customers autonomously through WhatsApp, Telegram, and web chat.',
    syllabus: [
      {
        module_number: 1,
        title: 'Agentic Architecture & Tool Calling',
        duration: 'Week 1',
        topics: [
          'How AI Agents think: ReAct framework, Planning, and Decision loops',
          'OpenAI & Claude Function Calling and Structured Outputs',
          'Equipping agents with custom tools: Web search, Calculator, and API endpoints',
          'Prompt engineering for system prompts that never hallucinate'
        ]
      },
      {
        module_number: 2,
        title: 'Retrieval-Augmented Generation (RAG) & Memory',
        duration: 'Week 2',
        topics: [
          'Understanding Embeddings and Vector Search mathematics simplified',
          'Connecting Supabase pgvector and Pinecone to n8n AI nodes',
          'Chunking and ingesting PDF catalogs, contracts, and company knowledge bases',
          'Managing conversation history and window buffer memory'
        ]
      },
      {
        module_number: 3,
        title: 'Multi-Agent Systems & WhatsApp Deployment',
        duration: 'Week 3',
        topics: [
          'Orchestrating supervisor and specialist sub-agents',
          'Deploying your agent to WhatsApp Cloud API and Telegram bots',
          'Human-in-the-loop validation: approving critical actions before execution',
          'Security guardrails, cost control, and token usage optimization'
        ]
      }
    ],
    prerequisites: 'Basic familiarity with automation tools or JavaScript/Python concepts.',
    outcomes: [
      'Design autonomous agents capable of multi-step reasoning',
      'Build private RAG search engines for internal company data',
      'Deploy conversational AI assistants on WhatsApp and web',
      'Monetize custom AI agent solutions for business clients'
    ],
    is_featured: true
  },
  {
    id: '01339f59-1b00-4bc3-b853-3de7b0c17687',
    title: 'Formation Business Automation & CRM Mastery',
    slug: 'formation-business-automation-crm',
    badge: 'For Founders & Teams',
    level: 'All Levels',
    duration: '2 Weeks (8 Hours total)',
    format: 'Interactive Group Masterclass + Private Stack Audit',
    summary: 'Tailored for business owners, project managers, and agencies wanting to eliminate manual operations and scale with automated pipelines.',
    description: 'Stop wasting precious company hours on data entry, follow-up emails, copy-pasting customer details, and manual invoice generation. This formation audits your current business stack and builds live automation pipelines directly for your operations.',
    syllabus: [
      {
        module_number: 1,
        title: 'Operational Audit & Lead Pipeline Automation',
        duration: 'Week 1',
        topics: [
          'Calculating the ROI of automation: identifying time-drain bottlenecks',
          'Automated lead capture from Meta Ads, Google Forms & Website to CRM',
          'Real-time team notifications via WhatsApp & Slack',
          'Automated appointment scheduling & meeting reminder sequences'
        ]
      },
      {
        module_number: 2,
        title: 'Invoicing, Customer Onboarding & Operations',
        duration: 'Week 2',
        topics: [
          'Automatic PDF invoice and contract generation upon payment or deal won',
          'Digital signature workflows and automated customer onboarding emails',
          'Syncing inventory and sales data across multiple platforms',
          'Setting up management KPI dashboards that update on autopilot'
        ]
      }
    ],
    prerequisites: 'Open to business managers, entrepreneurs, and team members. No programming required.',
    outcomes: [
      'Save 15+ hours per employee every single week',
      'Zero lost leads with sub-minute automated response times',
      'Automated invoicing, payment tracking, and receipt delivery',
      'Clean, self-updating CRM and KPI dashboards'
    ],
    is_featured: false
  }
];

let allFormations = [];
let activeFormationFilter = 'all';

// Build single formation card HTML
function buildFormationCardHtml(f, index, isPreview = false) {
  const syllabusList = (f.syllabus && Array.isArray(f.syllabus)) ? f.syllabus : [];
  const outcomesList = (f.outcomes && Array.isArray(f.outcomes)) ? f.outcomes : [];

  // Generate syllabus modules accordion HTML
  let syllabusHtml = '';
  syllabusList.forEach((m, mIdx) => {
    const isFirst = mIdx === 0;
    const topicsHtml = (m.topics || []).map(t => `<li>${t}</li>`).join('');
    syllabusHtml += `
      <div class="syllabus-module-item ${isFirst ? 'open' : ''}" id="module-${f.id}-${mIdx}">
        <button 
          type="button" 
          class="syllabus-module-trigger" 
          onclick="toggleSyllabusModule('${f.id}', ${mIdx})"
          aria-expanded="${isFirst ? 'true' : 'false'}"
        >
          <span>
            <span class="syllabus-module-num">M${m.module_number || (mIdx + 1)}:</span>
            ${m.title}
          </span>
          <svg class="syllabus-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="syllabus-module-body">
          <div style="font-size:0.75rem; color:var(--salmon); margin-bottom:8px; font-weight:600;">
            ⏳ ${m.duration || ''}
          </div>
          <ul class="syllabus-topics">
            ${topicsHtml}
          </ul>
        </div>
      </div>
    `;
  });

  // Generate outcomes list HTML
  const outcomesHtml = outcomesList.map(item => `
    <div class="outcome-item">
      <div class="outcome-check">✓</div>
      <span>${item}</span>
    </div>
  `).join('');

  // WhatsApp pre-filled message
  const waMessage = encodeURIComponent(
    `Hello Mariem! I am interested in the "${f.title}" formation and would like to get more information and the complete training plan.`
  );
  const waUrl = `https://wa.me/21650066125?text=${waMessage}`;
  const contactFormUrl = `contact.html?service=formation&course=${encodeURIComponent(f.title)}`;

  return `
    <div class="formation-card ${f.is_featured ? 'featured-formation' : ''} reveal visible" style="animation-delay: ${index * 0.1}s">
      <div class="formation-top-badge">
        <span>⭐ ${f.badge || 'Formation Tech'}</span>
      </div>

      <h3>${f.title}</h3>
      <p class="formation-desc">${f.summary || f.description || ''}</p>

      <div class="formation-meta-pills">
        <span class="formation-pill" title="Level">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          ${f.level || 'All Levels'}
        </span>
        <span class="formation-pill" title="Duration">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${f.duration || '4 Weeks'}
        </span>
        <span class="formation-pill" title="Format">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Live Online + Coaching
        </span>
      </div>

      <!-- Syllabus / Lessons Plan Box -->
      <div class="formation-syllabus-box">
        <div class="formation-syllabus-head">
          <h4><span>📋</span> Lessons Plan & Syllabus</h4>
          <button type="button" class="syllabus-toggle-btn" onclick="toggleAllModules('${f.id}')">
            Expand / Collapse
          </button>
        </div>
        <div class="syllabus-modules-list" id="syllabus-list-${f.id}">
          ${syllabusHtml}
        </div>
      </div>

      <!-- Key Outcomes -->
      <div class="outcomes-box">
        <div class="outcomes-title">What You Will Master:</div>
        <div class="outcomes-list">
          ${outcomesHtml}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="formation-actions">
        <a href="${waUrl}" target="_blank" class="btn btn-primary btn-contact-formation wa">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Contact Me for More Infos
        </a>
        <a href="${contactFormUrl}" class="btn btn-outline btn-formation-outline">
          Send Inquiry via Form →
        </a>
      </div>
    </div>
  `;
}

// Toggle individual syllabus module
function toggleSyllabusModule(formationId, moduleIndex) {
  const item = document.getElementById(`module-${formationId}-${moduleIndex}`);
  if (!item) return;

  const isOpen = item.classList.contains('open');
  const trigger = item.querySelector('.syllabus-module-trigger');

  if (isOpen) {
    item.classList.remove('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  } else {
    item.classList.add('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }
}

// Toggle all modules for a formation
function toggleAllModules(formationId) {
  const list = document.getElementById(`syllabus-list-${formationId}`);
  if (!list) return;

  const items = list.querySelectorAll('.syllabus-module-item');
  const anyClosed = Array.from(items).some(item => !item.classList.contains('open'));

  items.forEach(item => {
    const trigger = item.querySelector('.syllabus-module-trigger');
    if (anyClosed) {
      item.classList.add('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.remove('open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Fetch formations from Supabase or fallback
async function fetchFormations() {
  const formationsGrid = document.getElementById('formationsGrid');
  const featuredFormationsGrid = document.getElementById('featuredFormationsGrid');
  const loadingSkeleton = document.getElementById('formationsLoadingSkeleton');

  if (loadingSkeleton) loadingSkeleton.style.display = 'block';

  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient
        .from('formations')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      allFormations = (data && data.length > 0) ? data : FALLBACK_FORMATIONS;
    } else {
      allFormations = FALLBACK_FORMATIONS;
    }
  } catch (err) {
    console.warn('Could not fetch formations from Supabase, using local fallback:', err);
    allFormations = FALLBACK_FORMATIONS;
  }

  if (loadingSkeleton) loadingSkeleton.style.display = 'none';

  if (formationsGrid) {
    renderFormationsList();
    setupFormationFilters();
  }

  if (featuredFormationsGrid) {
    renderFeaturedFormations();
  }
}

// Render on formations.html
function renderFormationsList() {
  const formationsGrid = document.getElementById('formationsGrid');
  if (!formationsGrid) return;

  let filtered = allFormations;
  if (activeFormationFilter !== 'all') {
    filtered = allFormations.filter(f => {
      const titleLower = f.title.toLowerCase();
      if (activeFormationFilter === 'n8n') return titleLower.includes('n8n');
      if (activeFormationFilter === 'ai') return titleLower.includes('ai') || titleLower.includes('agent');
      if (activeFormationFilter === 'business') return titleLower.includes('business') || titleLower.includes('crm');
      return true;
    });
  }

  if (filtered.length === 0) {
    formationsGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px;">
        <p style="font-size:2.5rem; margin-bottom:12px;">🎓</p>
        <h3 style="color:var(--white); margin-bottom:8px;">No formations found in this category</h3>
        <p style="color:var(--text-secondary); max-width:400px; margin:0 auto 20px;">
          Reach out to request a tailored private training for your business or team.
        </p>
        <a href="contact.html?service=formation" class="btn btn-primary">Request Custom Formation</a>
      </div>
    `;
    return;
  }

  formationsGrid.innerHTML = filtered.map((f, idx) => buildFormationCardHtml(f, idx)).join('');
}

// Render on index.html (top 2 or 3 flagship formations)
function renderFeaturedFormations() {
  const grid = document.getElementById('featuredFormationsGrid');
  if (!grid) return;

  const featured = allFormations.slice(0, 3);
  grid.innerHTML = featured.map((f, idx) => buildFormationCardHtml(f, idx, true)).join('');
}

// Setup formation filter tabs
function setupFormationFilters() {
  const btns = document.querySelectorAll('.formation-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFormationFilter = btn.dataset.filter || 'all';
      renderFormationsList();
    });
  });
}

document.addEventListener('DOMContentLoaded', fetchFormations);
