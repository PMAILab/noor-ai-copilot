/**
 * Meta Ads API client (frontend proxy to /api/create-meta-campaign)
 * Falls back to mock/pending_meta status when Meta not connected
 */

export interface MetaCampaignInput {
  goalText: string;
  dailyBudgetInr: number;
  copyBody: string;
  copyHeadline: string;
  adImageUrl?: string;
  radiusKm?: number;
  targetAgeMin?: number;
  targetAgeMax?: number;
  targetGender?: string;
}

export interface MetaCampaignResult {
  success: boolean;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  status: 'active' | 'pending_meta' | 'pending_approval' | 'failed';
  error?: string;
  mock?: boolean;
}

/**
 * Create a Meta ad campaign via backend proxy
 */
export async function createMetaCampaign(
  input: MetaCampaignInput,
  metaAccessToken?: string
): Promise<MetaCampaignResult> {
  try {
    const res = await fetch('/api/create-meta-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, meta_access_token: metaAccessToken }),
    });

    if (res.status === 404) {
      // Function not deployed — store as pending_meta
      return mockCampaign(input);
    }

    const data = await res.json();
    if (!res.ok) return { success: false, status: 'failed', error: data.error };
    return data;
  } catch {
    return mockCampaign(input);
  }
}

/**
 * Build Meta OAuth URL for connecting an ad account
 */
export function buildMetaOAuthUrl(appId: string, redirectUri: string): string {
  const scope = [
    'ads_management',
    'ads_read',
    'pages_show_list',
    'pages_read_engagement',
    'business_management',
  ].join(',');

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope,
    response_type: 'code',
    state: btoa(JSON.stringify({ ts: Date.now() })),
  });

  return `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`;
}

/**
 * Convert INR daily budget to Meta's USD micro-cents
 * Meta stores budgets in account currency's smallest unit (USD cents)
 * For India ad accounts, currency is INR — Meta uses paisa (1/100 INR)
 */
export function inrToBudgetMicros(inr: number): number {
  return inr * 100; // INR → paisa
}

function mockCampaign(input: MetaCampaignInput): MetaCampaignResult {
  console.log('[Meta Mock] Creating campaign:', input.goalText);
  return {
    success: true,
    campaign_id: `mock_camp_${Date.now()}`,
    adset_id: `mock_adset_${Date.now()}`,
    ad_id: `mock_ad_${Date.now()}`,
    status: 'pending_meta',
    mock: true,
  };
}
