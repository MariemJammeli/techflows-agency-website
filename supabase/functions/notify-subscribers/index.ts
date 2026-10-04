// TechFlows TN — emails every active newsletter subscriber when a blog post is published.
//
// Called by the notify_subscribers_on_publish trigger on public.blogs, which
// sends a shared secret kept in Supabase Vault (see the migrations).
// Sends through Resend (https://resend.com). Required secrets:
//   RESEND_API_KEY   Resend API key
//   FROM_EMAIL       e.g. "TechFlows TN <blog@yourdomain.com>" (domain verified in Resend)
//   SITE_URL         e.g. "https://techflows.tn" (no trailing slash)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.

import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_BATCH_LIMIT = 100;

const env = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing secret ${name}`);
  return value;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

type Blog = {
  id: string;
  title: string;
  summary?: string | null;
  image_url?: string | null;
  language?: string | null;
  read_time?: string | null;
};

function buildEmailHtml(blog: Blog, postUrl: string, unsubscribeUrl: string): string {
  const isFrench = blog.language === 'fr';
  const t = isFrench
    ? { kicker: 'Nouvel article', cta: "Lire l'article →", why: 'Vous recevez cet e-mail car vous êtes abonné(e) au blog TechFlows TN.', unsub: 'Se désabonner' }
    : { kicker: 'New article', cta: 'Read the article →', why: 'You are receiving this because you subscribed to the TechFlows TN blog.', unsub: 'Unsubscribe' };

  const image = blog.image_url
    ? `<img src="${escapeHtml(blog.image_url)}" alt="" width="560" style="width:100%;max-width:560px;border-radius:12px;display:block;margin-bottom:20px;" />`
    : '';

  return `<!doctype html>
<html><body style="margin:0;background:#0b0b0b;font-family:Inter,Arial,sans-serif;color:#f5f0e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" style="max-width:560px;">
      <tr><td style="font-size:20px;font-weight:700;padding-bottom:24px;">Tech<span style="color:#FA8072;">Flows</span> TN</td></tr>
      <tr><td>
        <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#FA8072;margin-bottom:10px;">${t.kicker}</div>
        ${image}
        <h1 style="font-size:24px;line-height:1.3;margin:0 0 12px;color:#ffffff;">${escapeHtml(blog.title)}</h1>
        <p style="font-size:15px;line-height:1.6;color:#b5afa6;margin:0 0 24px;">${escapeHtml(blog.summary)}</p>
        <a href="${escapeHtml(postUrl)}" style="display:inline-block;background:#FA8072;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;">${t.cta}</a>
      </td></tr>
      <tr><td style="padding-top:36px;font-size:12px;line-height:1.6;color:#7a756e;">
        ${t.why}<br /><a href="${escapeHtml(unsubscribeUrl)}" style="color:#7a756e;">${t.unsub}</a>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Read every secret before claiming a post, so a missing one never marks a
  // post as sent without emailing anyone.
  let config: { resendApiKey: string; fromEmail: string; siteUrl: string };
  try {
    config = {
      resendApiKey: env('RESEND_API_KEY'),
      fromEmail: env('FROM_EMAIL'),
      siteUrl: env('SITE_URL').replace(/\/+$/, ''),
    };
  } catch (err) {
    console.error(String(err));
    return Response.json({ error: 'Function is not configured yet' }, { status: 500 });
  }

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  const { data: webhookSecret, error: secretError } = await supabase.rpc('get_notify_webhook_secret');
  if (secretError || !webhookSecret) {
    console.error('Could not load webhook secret:', secretError);
    return Response.json({ error: 'Function is not configured yet' }, { status: 500 });
  }
  if (req.headers.get('x-webhook-secret') !== webhookSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const record = payload?.record;
  if (payload?.table !== 'blogs' || !record?.id || !record.is_published) {
    return Response.json({ skipped: 'not a published blog' });
  }

  // Claim the post: only the first call for a given article gets a row back,
  // so a post is never emailed twice (edits, retries, duplicate webhooks).
  const { data: claimed, error: claimError } = await supabase
    .from('blogs')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', record.id)
    .eq('is_published', true)
    .is('notified_at', null)
    .select('id, title, summary, image_url, language, read_time')
    .maybeSingle();

  if (claimError) {
    console.error('Could not claim blog for notification:', claimError);
    return Response.json({ error: claimError.message }, { status: 500 });
  }
  if (!claimed) return Response.json({ skipped: 'already notified' });

  const blog = claimed as Blog;
  const { siteUrl } = config;
  const postUrl = `${siteUrl}/blog-detail?id=${encodeURIComponent(blog.id)}`;
  const subject = blog.language === 'fr' ? `Nouvel article : ${blog.title}` : `New article: ${blog.title}`;

  let sent = 0;
  const failures: string[] = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email, unsubscribe_token')
      .is('unsubscribed_at', null)
      .order('subscribed_at', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      failures.push(`load subscribers: ${error.message}`);
      break;
    }
    if (!subscribers || subscribers.length === 0) break;

    for (let i = 0; i < subscribers.length; i += RESEND_BATCH_LIMIT) {
      const batch = subscribers.slice(i, i + RESEND_BATCH_LIMIT).map((s) => {
        const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${s.unsubscribe_token}`;
        return {
          from: config.fromEmail,
          to: [s.email],
          subject,
          html: buildEmailHtml(blog, postUrl, unsubscribeUrl),
          headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
        };
      });

      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });

      if (res.ok) sent += batch.length;
      else failures.push(`resend ${res.status}: ${await res.text()}`);
    }

    if (subscribers.length < pageSize) break;
  }

  // If nothing went out at all, release the claim so the next save retries.
  if (sent === 0 && failures.length > 0) {
    await supabase.from('blogs').update({ notified_at: null }).eq('id', blog.id);
  }

  if (failures.length > 0) {
    console.error('notify-subscribers failures:', failures);
    return Response.json({ sent, failures }, { status: 500 });
  }
  return Response.json({ sent });
});
