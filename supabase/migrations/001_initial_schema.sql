-- ============================================================
-- NOOR AI COPILOT — Full Database Schema + RLS
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- TABLE 1: salons (primary entity — one per salon owner)
-- ============================================================
CREATE TABLE IF NOT EXISTS salons (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wa_number TEXT NOT NULL UNIQUE,
  salon_name TEXT,
  salon_type TEXT NOT NULL DEFAULT 'ladies_parlour' CHECK (salon_type IN (
    'ladies_parlour', 'unisex', 'bridal_studio',
    'home_beautician', 'mens_grooming', 'skin_clinic'
  )),
  city TEXT NOT NULL DEFAULT 'Jaipur',
  pin_code TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,

  -- Business context (for AI prompts)
  avg_ticket_size INT DEFAULT 500,
  top_services TEXT[] DEFAULT ARRAY['facial', 'hair_wash', 'threading'],
  target_customers TEXT[] DEFAULT ARRAY['working_women'],

  -- Meta integration
  meta_access_token TEXT,
  meta_ad_account_id TEXT,
  meta_page_id TEXT,
  wa_business_id TEXT,

  -- Billing & credits
  subscription_tier TEXT DEFAULT 'chamak' CHECK (subscription_tier IN (
    'chamak', 'roshan', 'noor_pro'
  )),
  credit_balance INT DEFAULT 500,
  budget_tier INT DEFAULT 3000,

  -- Preferences
  language TEXT DEFAULT 'hi-en' CHECK (language IN ('hi', 'en', 'hi-en')),

  -- Timestamps
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 2: marketing_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS marketing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,

  goal_text TEXT NOT NULL,
  monthly_budget INT,
  duration_weeks INT DEFAULT 4,

  plan_summary TEXT,
  weekly_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  channel_split JSONB,
  budget_allocation JSONB,
  recommended_recipes TEXT[],

  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  activated_at TIMESTAMPTZ,

  actions_completed INT DEFAULT 0,
  actions_total INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 3: campaigns
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES marketing_plans(id) ON DELETE SET NULL,

  goal_text TEXT NOT NULL,
  recipe_type TEXT CHECK (recipe_type IN (
    'bridal_season', 'weekday_filler', 'festival_offer',
    'new_service_launch', 'win_back', 'custom'
  )),

  -- Meta campaign data
  meta_campaign_id TEXT,
  meta_adset_id TEXT,
  meta_ad_id TEXT,

  -- Budget
  daily_budget_inr INT NOT NULL DEFAULT 300,
  total_budget_inr INT,
  total_spent_inr NUMERIC DEFAULT 0,

  -- Targeting
  radius_km INT DEFAULT 5,
  target_age_min INT DEFAULT 18,
  target_age_max INT DEFAULT 55,
  target_gender TEXT DEFAULT 'all',
  target_interests TEXT[],

  -- Creative
  copy_variants JSONB,
  selected_copy_index INT,
  creative_url TEXT,
  ad_image_url TEXT,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_meta', 'pending_approval', 'active', 'paused', 'completed', 'failed'
  )),
  paused_reason TEXT,

  -- Performance
  enquiry_count INT DEFAULT 0,
  hot_lead_count INT DEFAULT 0,
  booking_count INT DEFAULT 0,
  cost_per_lead NUMERIC,
  cost_per_booking NUMERIC,

  launched_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 4: leads
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,

  wa_number TEXT NOT NULL,
  name TEXT,

  score TEXT DEFAULT 'new' CHECK (score IN ('new', 'hot', 'warm', 'cold', 'booked', 'lost')),
  service_interest TEXT,
  preferred_date TEXT,
  budget_range TEXT,

  bot_step INT DEFAULT 0,
  message_history JSONB DEFAULT '[]'::jsonb,

  booked_at TIMESTAMPTZ,
  booking_amount INT,
  upi_payment_link TEXT,
  payment_confirmed BOOLEAN DEFAULT FALSE,

  owner_notified BOOLEAN DEFAULT FALSE,
  owner_replied BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 5: reports (daily snapshots)
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,

  total_spend_inr NUMERIC DEFAULT 0,
  enquiry_count INT DEFAULT 0,
  hot_lead_count INT DEFAULT 0,
  booking_count INT DEFAULT 0,
  cost_per_enquiry NUMERIC,
  cost_per_booking NUMERIC,
  best_campaign_id UUID REFERENCES campaigns(id),

  wa_message_sent TEXT,
  wa_message_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(salon_id, report_date)
);

-- ============================================================
-- TABLE 6: broadcasts
-- ============================================================
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES marketing_plans(id) ON DELETE SET NULL,

  segment TEXT CHECK (segment IN ('regulars', 'occasional', 'lapsed', 'new', 'all')),
  message_body TEXT NOT NULL,

  recipients JSONB DEFAULT '[]'::jsonb,
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  read_count INT DEFAULT 0,
  replied_count INT DEFAULT 0,

  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 7: clients (salon's customer DB for re-booking)
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,

  wa_number TEXT NOT NULL,
  name TEXT,

  last_service TEXT,
  last_visit_at TIMESTAMPTZ,
  visit_count INT DEFAULT 1,
  total_spend INT DEFAULT 0,

  segment TEXT DEFAULT 'new' CHECK (segment IN ('regular', 'occasional', 'lapsed', 'new')),

  next_reminder_at TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(salon_id, wa_number)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_salon ON campaigns(salon_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_leads_salon ON leads(salon_id);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_wa ON leads(wa_number);
CREATE INDEX IF NOT EXISTS idx_reports_salon_date ON reports(salon_id, report_date DESC);
CREATE INDEX IF NOT EXISTS idx_broadcasts_salon ON broadcasts(salon_id);
CREATE INDEX IF NOT EXISTS idx_clients_salon ON clients(salon_id);
CREATE INDEX IF NOT EXISTS idx_clients_reminder ON clients(next_reminder_at) WHERE reminder_sent = FALSE;
CREATE INDEX IF NOT EXISTS idx_plans_salon ON marketing_plans(salon_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON marketing_plans(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "salon_own_data" ON salons;
DROP POLICY IF EXISTS "plans_own_data" ON marketing_plans;
DROP POLICY IF EXISTS "campaigns_own_data" ON campaigns;
DROP POLICY IF EXISTS "leads_own_data" ON leads;
DROP POLICY IF EXISTS "reports_own_data" ON reports;
DROP POLICY IF EXISTS "broadcasts_own_data" ON broadcasts;
DROP POLICY IF EXISTS "clients_own_data" ON clients;

-- Salon owners can only see their own data
CREATE POLICY "salon_own_data" ON salons
  FOR ALL USING (id = auth.uid());

CREATE POLICY "plans_own_data" ON marketing_plans
  FOR ALL USING (salon_id = auth.uid());

CREATE POLICY "campaigns_own_data" ON campaigns
  FOR ALL USING (salon_id = auth.uid());

CREATE POLICY "leads_own_data" ON leads
  FOR ALL USING (salon_id = auth.uid());

CREATE POLICY "reports_own_data" ON reports
  FOR ALL USING (salon_id = auth.uid());

CREATE POLICY "broadcasts_own_data" ON broadcasts
  FOR ALL USING (salon_id = auth.uid());

CREATE POLICY "clients_own_data" ON clients
  FOR ALL USING (salon_id = auth.uid());

-- ============================================================
-- AUTO-UPDATE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS salons_updated_at ON salons;
DROP TRIGGER IF EXISTS plans_updated_at ON marketing_plans;
DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
DROP TRIGGER IF EXISTS leads_updated_at ON leads;
DROP TRIGGER IF EXISTS clients_updated_at ON clients;

CREATE TRIGGER salons_updated_at BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER plans_updated_at BEFORE UPDATE ON marketing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-SEGMENT CLIENTS
-- ============================================================
CREATE OR REPLACE FUNCTION auto_segment_client()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_visit_at < NOW() - INTERVAL '45 days' THEN
    NEW.segment = 'lapsed';
  ELSIF NEW.visit_count >= 3 THEN
    NEW.segment = 'regular';
  ELSIF NEW.visit_count >= 1 THEN
    NEW.segment = 'occasional';
  ELSE
    NEW.segment = 'new';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS client_auto_segment ON clients;
CREATE TRIGGER client_auto_segment BEFORE INSERT OR UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION auto_segment_client();

-- ============================================================
-- SEED: Demo salon for testing (optional — remove in production)
-- ============================================================
-- INSERT INTO salons (id, wa_number, salon_name, salon_type, city, top_services, target_customers)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   '+919876543210',
--   'Ananya Beauty Studio',
--   'ladies_parlour',
--   'Jaipur',
--   ARRAY['facial', 'hair_wash', 'threading', 'bridal_makeup'],
--   ARRAY['working_women', 'homemakers', 'brides']
-- );
