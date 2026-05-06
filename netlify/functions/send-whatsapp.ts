import type { Handler } from '@netlify/functions';

const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || '';
const WA_TOKEN = process.env.WA_TOKEN || '';
const WA_API = `https://graph.facebook.com/v20.0/${WA_PHONE_NUMBER_ID}/messages`;

interface SendRequest {
  to: string;
  body: string;
  templateName?: string;
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!WA_PHONE_NUMBER_ID || !WA_TOKEN) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        message_id: `mock_${Date.now()}`,
        mock: true,
        reason: 'WA credentials not configured',
      }),
    };
  }

  let body: SendRequest;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { to, body: messageBody, templateName } = body;
  if (!to || !messageBody) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing to or body' }) };
  }

  // Build WA message payload
  const payload: any = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to.replace(/\D/g, '').startsWith('91') ? to : `+91${to.replace(/\D/g, '')}`,
  };

  if (templateName) {
    // Template message (needed for first outreach)
    payload.type = 'template';
    payload.template = {
      name: templateName,
      language: { code: 'en_IN' },
      components: [{
        type: 'body',
        parameters: [{ type: 'text', text: messageBody }],
      }],
    };
  } else {
    // Free-form text (only within 24h window)
    payload.type = 'text';
    payload.text = { body: messageBody, preview_url: false };
  }

  try {
    const waRes = await fetch(WA_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const waData = await waRes.json() as any;

    if (!waRes.ok) {
      console.error('WA API error:', waData);
      return {
        statusCode: 200, headers, // Return 200 so app doesn't crash
        body: JSON.stringify({
          success: false,
          error: waData?.error?.message || 'WhatsApp API error',
          wa_error_code: waData?.error?.code,
        }),
      };
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        message_id: waData.messages?.[0]?.id,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
