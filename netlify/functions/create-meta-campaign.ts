import type { Handler } from '@netlify/functions';

const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || '';
const META_APP_ID = process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const GRAPH_API = 'https://graph.facebook.com/v20.0';

interface CampaignRequest {
  goalText: string;
  dailyBudgetInr: number;
  copyBody: string;
  copyHeadline: string;
  adImageUrl?: string;
  radiusKm?: number;
  targetAgeMin?: number;
  targetAgeMax?: number;
  targetGender?: string;
  meta_access_token?: string;
  salon_lat?: number;
  salon_lng?: number;
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body: CampaignRequest;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const accessToken = body.meta_access_token;

  if (!accessToken || !META_AD_ACCOUNT_ID) {
    // Return pending_meta status — no real campaign, will be launched later
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        status: 'pending_meta',
        campaign_id: null,
        adset_id: null,
        ad_id: null,
        mock: true,
        message: 'Campaign saved. Connect Meta Ads account in Settings to launch.',
      }),
    };
  }

  const adAccountId = META_AD_ACCOUNT_ID.startsWith('act_') ? META_AD_ACCOUNT_ID : `act_${META_AD_ACCOUNT_ID}`;

  try {
    // ── Step 1: Create Campaign ──────────────────────────────────────────
    const campaignRes = await fetch(`${GRAPH_API}/${adAccountId}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        name: `Noor | ${body.goalText.slice(0, 50)} | ${new Date().toLocaleDateString('en-IN')}`,
        objective: 'MESSAGES',           // Click-to-WhatsApp
        status: 'PAUSED',                // Start paused — owner reviews first
        special_ad_categories: [],
      }),
    });
    const campaignData = await campaignRes.json() as any;
    if (campaignData.error) throw new Error(campaignData.error.message);
    const campaignId = campaignData.id;

    // ── Step 2: Create Ad Set ────────────────────────────────────────────
    // Convert INR to account currency (INR) in paisa
    const dailyBudgetPaisa = body.dailyBudgetInr * 100;
    const targeting: any = {
      age_min: body.targetAgeMin || 18,
      age_max: body.targetAgeMax || 55,
      geo_locations: { location_types: ['home'] },
      flexible_spec: [{ interests: [{ id: '6003348604981', name: 'Beauty' }] }],
    };

    if (body.targetGender === 'female') targeting.genders = [2];
    if (body.targetGender === 'male') targeting.genders = [1];

    const adSetRes = await fetch(`${GRAPH_API}/${adAccountId}/adsets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        campaign_id: campaignId,
        name: `Noor AdSet | ${body.goalText.slice(0, 40)}`,
        daily_budget: dailyBudgetPaisa,
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'CONVERSATIONS',
        status: 'PAUSED',
        targeting,
        start_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
      }),
    });
    const adSetData = await adSetRes.json() as any;
    if (adSetData.error) throw new Error(adSetData.error.message);
    const adSetId = adSetData.id;

    // ── Step 3: Create Ad Creative + Ad ─────────────────────────────────
    const adCreativeRes = await fetch(`${GRAPH_API}/${adAccountId}/adcreatives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        name: `Noor Creative | ${body.copyHeadline.slice(0, 30)}`,
        object_story_spec: {
          link_data: {
            message: body.copyBody,
            name: body.copyHeadline,
            call_to_action: {
              type: 'WHATSAPP_MESSAGE',
              value: { app_destination: 'WHATSAPP' },
            },
          },
        },
      }),
    });
    const adCreativeData = await adCreativeRes.json() as any;
    if (adCreativeData.error) throw new Error(adCreativeData.error.message);

    const adRes = await fetch(`${GRAPH_API}/${adAccountId}/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        adset_id: adSetId,
        name: `Noor Ad | ${new Date().toLocaleDateString('en-IN')}`,
        creative: { creative_id: adCreativeData.id },
        status: 'PAUSED',
      }),
    });
    const adData = await adRes.json() as any;
    if (adData.error) throw new Error(adData.error.message);

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        status: 'pending_approval', // In Meta review queue
        campaign_id: campaignId,
        adset_id: adSetId,
        ad_id: adData.id,
      }),
    };
  } catch (err: any) {
    console.error('Meta campaign creation error:', err);
    return {
      statusCode: 200, headers, // Non-500 so app handles gracefully
      body: JSON.stringify({
        success: false,
        status: 'failed',
        error: err.message,
        // Fall back to pending_meta so it can be retried
        campaign_id: null, adset_id: null, ad_id: null,
      }),
    };
  }
};
