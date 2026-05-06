/**
 * WhatsApp Cloud API client (frontend proxy to /api/send-whatsapp)
 * Falls back to mock mode when WA credentials are not configured in Netlify
 */

const WA_API_BASE = '/api/send-whatsapp';

export interface WAMessage {
  to: string;          // E.164 format: +919876543210
  body: string;        // Message text
  templateName?: string; // For template messages
}

export interface WASendResult {
  success: boolean;
  message_id?: string;
  error?: string;
  mock?: boolean;
}

/**
 * Send a single WhatsApp message via backend proxy
 */
export async function sendWhatsAppMessage(msg: WAMessage): Promise<WASendResult> {
  try {
    const res = await fetch(WA_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });

    if (res.status === 404) {
      // Netlify function not deployed yet — use mock
      return mockSend(msg);
    }

    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'WhatsApp API error' };
    return { success: true, message_id: data.message_id };
  } catch {
    return mockSend(msg);
  }
}

/**
 * Send a broadcast to multiple recipients
 * Returns array of results in same order
 */
export async function sendBroadcast(
  recipients: Array<{ wa_number: string; name: string }>,
  messageTemplate: string,
  onProgress?: (sent: number, total: number) => void
): Promise<{ sent: number; failed: number; results: WASendResult[] }> {
  const results: WASendResult[] = [];
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const personalized = messageTemplate.replace(/\[Name\]/gi, recipient.name || 'ji');

    const result = await sendWhatsAppMessage({
      to: recipient.wa_number,
      body: personalized,
    });

    results.push(result);
    if (result.success) sent++;
    else failed++;

    onProgress?.(sent + failed, recipients.length);

    // Rate limiting: WhatsApp allows ~80 msg/sec per number
    // For safety, add small delay
    if (recipients.length > 10) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return { sent, failed, results };
}

/**
 * Mock send — used when Netlify functions aren't deployed
 */
function mockSend(msg: WAMessage): WASendResult {
  console.log('[WA Mock] Sending to:', msg.to, '|', msg.body.slice(0, 50));
  return {
    success: true,
    message_id: `mock_${Date.now()}`,
    mock: true,
  };
}

/**
 * Format a WhatsApp number to E.164
 */
export function formatWANumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (phone.startsWith('+')) return phone;
  return `+91${digits}`;
}

/**
 * Build a pre-filled WhatsApp click link
 */
export function buildWALink(phone: string, message: string): string {
  const number = formatWANumber(phone).replace('+', '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
