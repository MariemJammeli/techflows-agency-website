/**
 * TechFlows TN — Newsletter unsubscribe page
 * Reads ?token= from the link in subscriber emails and unsubscribes that address.
 */

'use strict';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function showUnsubscribeResult(title, text) {
  document.getElementById('unsubscribeTitle').textContent = title;
  document.getElementById('unsubscribeText').textContent = text;
}

async function unsubscribe() {
  const token = new URLSearchParams(window.location.search).get('token');

  if (!token || !UUID_PATTERN.test(token)) {
    showUnsubscribeResult('Invalid link', 'This unsubscribe link is not valid. Please use the link from one of our emails.');
    return;
  }

  if (typeof supabaseClient === 'undefined') {
    showUnsubscribeResult('Something went wrong', 'Please try again in a few minutes.');
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc('unsubscribe_from_newsletter', { p_token: token });
    if (error) throw error;

    if (data) {
      showUnsubscribeResult("You're unsubscribed", "You won't receive new article emails from TechFlows TN anymore. You can subscribe again anytime from the blog.");
    } else {
      showUnsubscribeResult('Link not found', 'We could not find a subscription for this link. It may have been removed already.');
    }
  } catch (err) {
    console.error('Unsubscribe failed:', err);
    showUnsubscribeResult('Something went wrong', 'Please try again in a few minutes.');
  }
}

document.addEventListener('DOMContentLoaded', unsubscribe);
