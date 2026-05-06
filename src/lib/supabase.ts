import { createClient } from '@supabase/supabase-js';

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Lazy singleton so the app doesn't crash when env vars are missing
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client;
}

// ─── Type Definitions ───────────────────────────────────────────────────────
export interface SalonRow {
  id: string;
  wa_number: string;
  salon_name: string | null;
  salon_type: string;
  city: string;
  pin_code: string | null;
  address: string | null;
  avg_ticket_size: number | null;
  top_services: string[];
  target_customers: string[];
  meta_access_token: string | null;
  meta_ad_account_id: string | null;
  meta_page_id: string | null;
  wa_business_id: string | null;
  subscription_tier: 'chamak' | 'roshan' | 'noor_pro';
  credit_balance: number;
  budget_tier: number;
  language: 'hi' | 'en' | 'hi-en';
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string;
  salon_id: string;
  plan_id: string | null;
  goal_text: string;
  recipe_type: string | null;
  meta_campaign_id: string | null;
  meta_adset_id: string | null;
  meta_ad_id: string | null;
  daily_budget_inr: number;
  total_budget_inr: number | null;
  total_spent_inr: number;
  radius_km: number;
  target_age_min: number;
  target_age_max: number;
  target_gender: string;
  copy_variants: any;
  selected_copy_index: number | null;
  creative_url: string | null;
  ad_image_url: string | null;
  status: 'draft' | 'pending_meta' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'failed';
  paused_reason: string | null;
  enquiry_count: number;
  hot_lead_count: number;
  booking_count: number;
  cost_per_lead: number | null;
  launched_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadRow {
  id: string;
  salon_id: string;
  campaign_id: string | null;
  wa_number: string;
  name: string | null;
  score: 'new' | 'hot' | 'warm' | 'cold' | 'booked' | 'lost';
  service_interest: string | null;
  preferred_date: string | null;
  budget_range: string | null;
  bot_step: number;
  message_history: any[];
  booked_at: string | null;
  booking_amount: number | null;
  owner_notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BroadcastRow {
  id: string;
  salon_id: string;
  plan_id: string | null;
  segment: 'regulars' | 'occasional' | 'lapsed' | 'new' | 'all';
  message_body: string;
  recipients: Array<{ wa_number: string; name: string }>;
  total_recipients: number;
  sent_count: number;
  read_count: number;
  replied_count: number;
  scheduled_at: string | null;
  sent_at: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  created_at: string;
}

export interface ReportRow {
  id: string;
  salon_id: string;
  report_date: string;
  total_spend_inr: number;
  enquiry_count: number;
  hot_lead_count: number;
  booking_count: number;
  cost_per_enquiry: number | null;
  cost_per_booking: number | null;
  best_campaign_id: string | null;
  wa_message_sent: string | null;
  created_at: string;
}

export interface MarketingPlanRow {
  id: string;
  salon_id: string;
  goal_text: string;
  monthly_budget: number | null;
  duration_weeks: number;
  plan_summary: string | null;
  weekly_actions: any[];
  channel_split: any;
  budget_allocation: any;
  recommended_recipes: string[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  activated_at: string | null;
  actions_completed: number;
  actions_total: number;
  created_at: string;
  updated_at: string;
}

// ─── Query Helpers ──────────────────────────────────────────────────────────

/** Fetch salon profile for the current user */
export async function fetchSalon(userId: string): Promise<SalonRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from('salons').select('*').eq('id', userId).single();
  if (error) { console.error('fetchSalon:', error.message); return null; }
  return data as unknown as SalonRow;
}

/** Upsert salon profile */
export async function saveSalon(salon: Partial<SalonRow> & { id: string }): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await (sb.from as any)('salons').upsert(salon);
  if (error) { console.error('saveSalon:', error.message); return false; }
  return true;
}

/** Fetch campaigns for current salon */
export async function fetchCampaigns(salonId: string): Promise<CampaignRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('campaigns')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false });
  if (error) { console.error('fetchCampaigns:', error.message); return []; }
  return (data as unknown as CampaignRow[]) || [];
}

/** Insert a new campaign */
export async function insertCampaign(
  campaign: Omit<CampaignRow, 'id' | 'created_at' | 'updated_at'>
): Promise<CampaignRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await (sb.from as any)('campaigns').insert(campaign).select().single();
  if (error) { console.error('insertCampaign:', error.message); return null; }
  return data as CampaignRow;
}

/** Fetch active marketing plan */
export async function fetchActivePlan(salonId: string): Promise<MarketingPlanRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('marketing_plans')
    .select('*')
    .eq('salon_id', salonId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') { console.error('fetchActivePlan:', error.message); }
  return (data as unknown as MarketingPlanRow) || null;
}

/** Save marketing plan */
export async function savePlan(
  plan: Omit<MarketingPlanRow, 'id' | 'created_at' | 'updated_at'>
): Promise<MarketingPlanRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await (sb.from as any)('marketing_plans').insert(plan).select().single();
  if (error) { console.error('savePlan:', error.message); return null; }
  return data as MarketingPlanRow;
}

/** Activate a plan (set status = active, deactivate others) */
export async function activatePlan(planId: string, salonId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  await (sb.from as any)('marketing_plans').update({ status: 'archived' }).eq('salon_id', salonId).eq('status', 'active');
  const { error } = await (sb.from as any)('marketing_plans').update({ status: 'active', activated_at: new Date().toISOString() }).eq('id', planId);
  return !error;
}

/** Fetch recent reports */
export async function fetchReports(salonId: string, limit = 10): Promise<ReportRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('reports')
    .select('*')
    .eq('salon_id', salonId)
    .order('report_date', { ascending: false })
    .limit(limit);
  if (error) { console.error('fetchReports:', error.message); return []; }
  return (data as unknown as ReportRow[]) || [];
}

/** Fetch leads */
export async function fetchLeads(salonId: string, limit = 50): Promise<LeadRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('leads')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('fetchLeads:', error.message); return []; }
  return (data as unknown as LeadRow[]) || [];
}

/** Save a broadcast record */
export async function insertBroadcast(
  broadcast: Omit<BroadcastRow, 'id' | 'created_at'>
): Promise<BroadcastRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await (sb.from as any)('broadcasts').insert(broadcast).select().single();
  if (error) { console.error('insertBroadcast:', error.message); return null; }
  return data as BroadcastRow;
}

/** Update broadcast status */
export async function updateBroadcastStatus(
  id: string,
  updates: Partial<Pick<BroadcastRow, 'status' | 'sent_count' | 'sent_at'>>
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await (sb.from as any)('broadcasts').update(updates).eq('id', id);
  return !error;
}
