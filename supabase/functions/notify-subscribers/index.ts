// TechFlows TN — newsletter emails:
//   * a new blog post is published  -> email every active subscriber
//   * someone subscribes (or re-subscribes after unsubscribing) -> welcome email
//
// Called by database triggers on public.blogs and public.newsletter_subscribers,
// which send a shared secret kept in Supabase Vault (see the migrations).
//
// Secrets:
//   SITE_URL             e.g. "https://techflows.tn" (no trailing slash), always required
// Send through Gmail (used when both are set; no domain needed, ~500 emails/day):
//   GMAIL_USER           the Gmail address, e.g. "you@gmail.com"
//   GMAIL_APP_PASSWORD   a Google "app password" (requires 2-Step Verification)
// Or send through Resend (needs a domain verified in Resend):
//   RESEND_API_KEY       Resend API key
//   FROM_EMAIL           e.g. "TechFlows TN <blog@yourdomain.com>"
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.

import { createClient } from 'npm:@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6';

const RESEND_BATCH_LIMIT = 100;

type Email = { to: string; subject: string; html: string; unsubscribeUrl: string };

// Sends a list of emails, returning how many went out and any error messages.
type Sender = (emails: Email[]) => Promise<{ sent: number; failures: string[] }>;

function gmailSender(user: string, appPassword: string): Sender {
  return async (emails) => {
    // Port 465 (implicit TLS): Supabase blocks outgoing 25 and 587.
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 1,
      auth: { user, pass: appPassword.replace(/\s+/g, '') },
    });

    let sent = 0;
    const failures: string[] = [];
    try {
      for (const email of emails) {
        try {
          await transport.sendMail({
            from: `"TechFlows TN" <${user}>`,
            to: email.to,
            subject: email.subject,
            html: email.html,
            headers: { 'List-Unsubscribe': `<${email.unsubscribeUrl}>` },
          });
          sent++;
        } catch (err) {
          failures.push(`gmail: ${String(err)}`);
        }
      }
    } finally {
      transport.close();
    }
    return { sent, failures };
  };
}

function resendSender(apiKey: string, from: string): Sender {
  return async (emails) => {
    let sent = 0;
    const failures: string[] = [];
    for (let i = 0; i < emails.length; i += RESEND_BATCH_LIMIT) {
      const batch = emails.slice(i, i + RESEND_BATCH_LIMIT).map((email) => ({
        from,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        headers: { 'List-Unsubscribe': `<${email.unsubscribeUrl}>` },
      }));

      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });

      if (res.ok) sent += batch.length;
      else failures.push(`resend ${res.status}: ${await res.text()}`);
    }
    return { sent, failures };
  };
}

const optionalEnv = (name: string): string | undefined => Deno.env.get(name) || undefined;

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

function emailLayout(content: string, footer: string, unsubscribeUrl: string, unsubscribeLabel: string): string {
  return `<!doctype html>
<html><body style="margin:0;background:#0b0b0b;font-family:Inter,Arial,sans-serif;color:#f5f0e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" style="max-width:560px;">
      <tr><td style="font-size:20px;font-weight:700;padding-bottom:24px;">Tech<span style="color:#FA8072;">Flows</span> TN</td></tr>
      <tr><td>
        ${content}
      </td></tr>
      <tr><td style="padding-top:36px;font-size:12px;line-height:1.6;color:#7a756e;">
        ${footer}<br /><a href="${escapeHtml(unsubscribeUrl)}" style="color:#7a756e;">${unsubscribeLabel}</a>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

const button = (href: string, label: string): string =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;background:#FA8072;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;">${label}</a>`;

function buildEmailHtml(blog: Blog, postUrl: string, unsubscribeUrl: string): string {
  const isFrench = blog.language === 'fr';
  const t = isFrench
    ? { kicker: 'Nouvel article', cta: "Lire l'article →", why: 'Vous recevez cet e-mail car vous êtes abonné(e) au blog TechFlows TN.', unsub: 'Se désabonner' }
    : { kicker: 'New article', cta: 'Read the article →', why: 'You are receiving this because you subscribed to the TechFlows TN blog.', unsub: 'Unsubscribe' };

  const image = blog.image_url
    ? `<img src="${escapeHtml(blog.image_url)}" alt="" width="560" style="width:100%;max-width:560px;border-radius:12px;display:block;margin-bottom:20px;" />`
    : '';

  return emailLayout(
    `<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#FA8072;margin-bottom:10px;">${t.kicker}</div>
        ${image}
        <h1 style="font-size:24px;line-height:1.3;margin:0 0 12px;color:#ffffff;">${escapeHtml(blog.title)}</h1>
        <p style="font-size:15px;line-height:1.6;color:#b5afa6;margin:0 0 24px;">${escapeHtml(blog.summary)}</p>
        ${button(postUrl, t.cta)}`,
    t.why,
    unsubscribeUrl,
    t.unsub,
  );
}

// Subscribers don't pick a language, so the welcome email is bilingual.
const WELCOME_SUBJECT = 'Welcome to the TechFlows TN blog · Bienvenue sur le blog TechFlows TN';

function buildWelcomeHtml(blogUrl: string, unsubscribeUrl: string): string {
  const p = 'font-size:15px;line-height:1.6;color:#b5afa6;margin:0 0 16px;';
  return emailLayout(
    `<h1 style="font-size:24px;line-height:1.3;margin:0 0 12px;color:#ffffff;">You're subscribed! 🎉</h1>
        <p style="${p}">Thanks for subscribing to the TechFlows TN blog. You'll get an email each time we publish a new article: n8n workflows, AI agents and automation tips for your business.</p>
        <h2 style="font-size:20px;line-height:1.3;margin:28px 0 12px;color:#ffffff;">Vous êtes abonné(e) !</h2>
        <p style="${p}margin-bottom:24px;">Merci de vous être abonné(e) au blog TechFlows TN. Vous recevrez un e-mail à chaque nouvel article : workflows n8n, agents IA et astuces d'automatisation pour votre entreprise.</p>
        ${button(blogUrl, 'Read the blog · Lire le blog →')}`,
    "You're receiving this because this address subscribed to the TechFlows TN blog. · Vous recevez cet e-mail car cette adresse s'est abonnée au blog TechFlows TN.",
    unsubscribeUrl,
    'Unsubscribe · Se désabonner',
  );
}

// Welcome email for a new (or returning) subscriber.
async function sendWelcome(
  supabase: ReturnType<typeof createClient>,
  send: Sender,
  siteUrl: string,
  subscriberId: string,
): Promise<Response> {
  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .select('email, unsubscribe_token')
    .eq('id', subscriberId)
    .is('unsubscribed_at', null)
    .maybeSingle();

  if (error) {
    console.error('Could not load subscriber:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!subscriber) return Response.json({ skipped: 'subscriber not active' });

  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`;
  const result = await send([{
    to: subscriber.email,
    subject: WELCOME_SUBJECT,
    html: buildWelcomeHtml(`${siteUrl}/blogs`, unsubscribeUrl),
    unsubscribeUrl,
  }]);

  if (result.failures.length > 0) {
    console.error('Welcome email failed:', result.failures);
    return Response.json({ sent: result.sent, failures: result.failures }, { status: 500 });
  }
  return Response.json({ sent: result.sent });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Read every secret before claiming a post, so a missing one never marks a
  // post as sent without emailing anyone.
  let siteUrl: string;
  let send: Sender;
  try {
    siteUrl = env('SITE_URL').replace(/\/+$/, '');
    const gmailUser = optionalEnv('GMAIL_USER');
    const gmailPassword = optionalEnv('GMAIL_APP_PASSWORD');
    send = gmailUser && gmailPassword
      ? gmailSender(gmailUser, gmailPassword)
      : resendSender(env('RESEND_API_KEY'), env('FROM_EMAIL'));
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

  if (payload?.table === 'newsletter_subscribers' && record?.id) {
    return sendWelcome(supabase, send, siteUrl, record.id);
  }

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

    const result = await send(
      subscribers.map((s) => {
        const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${s.unsubscribe_token}`;
        return { to: s.email, subject, html: buildEmailHtml(blog, postUrl, unsubscribeUrl), unsubscribeUrl };
      }),
    );
    sent += result.sent;
    failures.push(...result.failures);

    if (subscribers.length < pageSize) break;
  }

  // If nothing went out at all, release the claim so the next save retries.
  if (sent === 0 && failures.length > 0) {
    await supabase.from('blogs').update({ notified_at: null }).eq('id', blog.id);
  }

  if (failures.length > 0) {
    console.error('notify-subscribers failures:', failures);
    return Response.json({ sent, failed: failures.length, failures: failures.slice(0, 10) }, { status: 500 });
  }
  return Response.json({ sent });
});
