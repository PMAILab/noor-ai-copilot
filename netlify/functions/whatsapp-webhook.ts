import type { Handler } from '@netlify/functions';
import { createHmac } from 'crypto';

const WA_VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN || 'noor_webhook_2024';
const WA_APP_SECRET = process.env.META_APP_SECRET || '';
const WA_TOKEN = process.env.WA_TOKEN || '';
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const WA_API = `https://graph.facebook.com/v20.0/${WA_PHONE_NUMBER_ID}/messages`;

export const handler: Handler = async (event) => {
  // ── GET: Webhook Verification ─────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    if (
      params['hub.mode'] === 'subscribe' &&
      params['hub.verify_token'] === WA_VERIFY_TOKEN
    ) {
      return { statusCode: 200, body: params['hub.challenge'] || '' };
    }
    return { statusCode: 403, body: 'Forbidden' };
  }

  // ── POST: Incoming Messages ───────────────────────────────────────────────
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  // Verify webhook signature
  if (WA_APP_SECRET && event.headers['x-hub-signature-256']) {
    const sig = event.headers['x-hub-signature-256'].replace('sha256=', '');
    const expected = createHmac('sha256', WA_APP_SECRET)
      .update(event.body || '')
      .digest('hex');
    if (sig !== expected) {
      return { statusCode: 403, body: 'Invalid signature' };
    }
  }

  let payload: any;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: 'Invalid JSON' }; }

  // Process each message entry
  const entries = payload.entry || [];
  for (const entry of entries) {
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;
      const value = change.value;
      const messages = value?.messages || [];

      for (const msg of messages) {
        if (msg.type !== 'text') continue;
        const fromNumber = `+${msg.from}`;
        const text = msg.text?.body || '';

        await handleIncomingMessage(fromNumber, text, value?.metadata?.display_phone_number_id);
      }
    }
  }

  return { statusCode: 200, body: 'OK' };
};

// ── Lead Qualification Bot ────────────────────────────────────────────────────
async function handleIncomingMessage(fromNumber: string, text: string, _phoneId: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  const sbHeaders = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };

  // Find existing lead
  const leadRes = await fetch(
    `${SUPABASE_URL}/rest/v1/leads?wa_number=eq.${encodeURIComponent(fromNumber)}&order=created_at.desc&limit=1`,
    { headers: sbHeaders }
  );
  const leads = await leadRes.json() as any[];
  const lead = leads?.[0];

  if (!lead) {
    // New lead — create + send greeting
    await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        wa_number: fromNumber,
        bot_step: 1,
        score: 'new',
        message_history: [{ role: 'user', text, ts: new Date().toISOString() }],
      }),
    });

    await sendWA(fromNumber, `🌸 *Noor Beauty* mein aapka swagat hai!\n\nAap kaun si service mein interested hain?\n\n1️⃣ Facial / Cleanup\n2️⃣ Hair Treatment\n3️⃣ Bridal Makeup\n4️⃣ Threading / Waxing\n5️⃣ Kuch aur`);
    return;
  }

  // Update message history
  const history = [...(lead.message_history || []), { role: 'user', text, ts: new Date().toISOString() }];
  const step = lead.bot_step || 0;

  if (step === 1) {
    // Q1 answered — ask date
    await updateLead(lead.id, { service_interest: text, bot_step: 2, message_history: history }, sbHeaders);
    await sendWA(fromNumber, `✨ Perfect! Aap kab aana chahenge?\n\nKoi bhi date batayein ya kaho:\n- *Kal* (tomorrow)\n- *Is weekend*\n- *Jaldi se, koi bhi din chalega*`);
  } else if (step === 2) {
    // Q2 answered — ask budget
    await updateLead(lead.id, { preferred_date: text, bot_step: 3, message_history: history }, sbHeaders);
    await sendWA(fromNumber, `💰 Aapka budget range kya hai?\n\nA) ₹200–₹500\nB) ₹500–₹1,500\nC) ₹1,500–₹3,000\nD) ₹3,000+`);
  } else if (step === 3) {
    // Q3 answered — score + notify owner
    const score = scoreFromBudget(text);
    await updateLead(lead.id, {
      budget_range: text,
      bot_step: 99,
      score,
      owner_notified: false,
      message_history: history,
    }, sbHeaders);

    await sendWA(fromNumber, `🎉 Shukriya! Hamari team aapko jaldi contact karegi.\n\n📍 Apna time book karne ke liye: *getnoor.in/book*\n\nKoi sawaal ho toh bata dena! 💜`);
  }
}

function scoreFromBudget(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('d') || t.includes('3000') || t.includes('3,000')) return 'hot';
  if (t.includes('c') || t.includes('1500') || t.includes('1,500')) return 'warm';
  return 'new';
}

async function updateLead(id: string, updates: any, headers: any) {
  if (!SUPABASE_URL) return;
  await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(updates),
  });
}

async function sendWA(to: string, message: string) {
  if (!WA_TOKEN || !WA_PHONE_NUMBER_ID) return;
  await fetch(WA_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace('+', ''),
      type: 'text',
      text: { body: message, preview_url: false },
    }),
  });
}
