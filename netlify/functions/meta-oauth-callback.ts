import type { Handler } from '@netlify/functions';

const META_APP_ID = process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const GRAPH_API = 'https://graph.facebook.com/v20.0';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const { code, state } = event.queryStringParameters || {};

  if (!code) {
    return {
      statusCode: 400, headers,
      body: JSON.stringify({ error: 'Missing OAuth code' }),
    };
  }

  // Determine redirect URI (same as what was used to initiate OAuth)
  const host = event.headers['x-forwarded-host'] || event.headers['host'] || 'localhost:8888';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/meta-oauth`;

  try {
    // ── Step 1: Exchange code for short-lived token ──────────────────────
    const tokenRes = await fetch(
      `${GRAPH_API}/oauth/access_token?` +
      `client_id=${META_APP_ID}` +
      `&client_secret=${META_APP_SECRET}` +
      `&code=${code}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    const tokenData = await tokenRes.json() as any;
    if (tokenData.error) throw new Error(tokenData.error.message);

    // ── Step 2: Exchange for long-lived token (60 days) ──────────────────
    const longRes = await fetch(
      `${GRAPH_API}/oauth/access_token?` +
      `grant_type=fb_exchange_token` +
      `&client_id=${META_APP_ID}` +
      `&client_secret=${META_APP_SECRET}` +
      `&fb_exchange_token=${tokenData.access_token}`
    );
    const longData = await longRes.json() as any;
    if (longData.error) throw new Error(longData.error.message);
    const longLivedToken = longData.access_token;

    // ── Step 3: Fetch ad account & page info ─────────────────────────────
    const adAccRes = await fetch(
      `${GRAPH_API}/me/adaccounts?fields=id,name,account_status&access_token=${longLivedToken}`
    );
    const adAccData = await adAccRes.json() as any;
    const adAccount = adAccData.data?.[0];

    // ── Step 4: Save to Supabase (if configured) ─────────────────────────
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && state) {
      try {
        const stateObj = JSON.parse(atob(state));
        const userId = stateObj.user_id;
        if (userId) {
          await fetch(`${SUPABASE_URL}/rest/v1/salons?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              meta_access_token: longLivedToken,
              meta_ad_account_id: adAccount?.id || null,
            }),
          });
        }
      } catch (e) {
        console.warn('Failed to save Meta token to Supabase:', e);
      }
    }

    // ── Step 5: Redirect back to Settings page ───────────────────────────
    const successUrl = `${protocol}://${host}/settings?meta_connected=true&account=${encodeURIComponent(adAccount?.name || 'Connected')}`;
    return {
      statusCode: 302,
      headers: { ...headers, Location: successUrl },
      body: '',
    };
  } catch (err: any) {
    console.error('Meta OAuth error:', err);
    const failUrl = `${protocol}://${host}/settings?meta_error=${encodeURIComponent(err.message)}`;
    return {
      statusCode: 302,
      headers: { ...headers, Location: failUrl },
      body: '',
    };
  }
};
