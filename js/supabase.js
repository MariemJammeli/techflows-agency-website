/**
 * TechFlows TN — Supabase Client Configuration
 * Project: techflows-tn
 * Region: eu-central-1
 */

const SUPABASE_URL = 'https://llsixhavjyzsrtgmusjj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc2l4aGF2anl6c3J0Z211c2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDY5NjEsImV4cCI6MjA5MDc4Mjk2MX0.Et9vphMDHkYNXUlsiuRn4jGyMebOnNJ13b9Ap2d052Y';

// Using Supabase CDN — loaded via <script> tag in each HTML page
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Category to emoji icon mapping
const CATEGORY_ICONS = {
  'AI & GPT':     '🧠',
  'CRM & Leads':  '📊',
  'WhatsApp':     '💬',
  'E-Commerce':   '🛒',
  'Social Media': '📱',
  'n8n':          '⚡',
};

// Fallback placeholder image (data URL — a minimal gradient SVG)
const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0%%' y1='0%%' x2='100%%' y2='100%%'><stop offset='0%%' stop-color='%23161616'/><stop offset='100%%' stop-color='%231a1a1a'/></linearGradient></defs><rect width='800' height='450' fill='url(%23g)'/><text x='400' y='200' font-family='Inter,sans-serif' font-size='56' text-anchor='middle' fill='%23FA8072'>⚡</text><text x='400' y='260' font-family='Inter,sans-serif' font-size='18' text-anchor='middle' fill='%23b5afa6'>TechFlows TN</text></svg>`;
