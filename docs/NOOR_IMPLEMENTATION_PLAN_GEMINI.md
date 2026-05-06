# NOOR · Full MVP Implementation Plan

**AI Marketing Co-Pilot for Indian Beauty & Salon Businesses**
**Serverless · Netlify · Supabase · Meta APIs · Gemini AI**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Pre-Build Checklist](#2-pre-build-checklist)
3. [Project Structure](#3-project-structure)
4. [Supabase Schema & RLS](#4-supabase-schema--rls)
5. [Feature Implementation Map](#5-feature-implementation-map)
   - F1 — Onboarding Flow
   - F2 — Marketing Plan Builder (AI-Powered)
   - F3 — Conversational Campaign Builder
   - F4 — AI Creative & Copy Generator
   - F5 — Lead Pre-Qualification Bot (WhatsApp)
   - F6 — Plain-Language ROI Reports
   - F7 — Budget Guardrails + Account Health Monitor
   - F8 — WhatsApp Broadcast Manager
   - F9 — Festival Campaign Calendar
   - F10 — Service-Cycle Re-Booking Reminders
6. [Netlify Functions Registry](#6-netlify-functions-registry)
7. [Meta API Integration](#7-meta-api-integration)
8. [WhatsApp Business API Integration](#8-whatsapp-business-api-integration)
9. [Gemini AI Integration](#9-gemini-ai-integration)
10. [Frontend Page Map](#10-frontend-page-map)
11. [Build Order (Day-by-Day Sprint Plan)](#11-build-order)
12. [Environment Variables](#12-environment-variables)
13. [Deployment & CI/CD](#13-deployment--cicd)
14. [Testing Strategy](#14-testing-strategy)
15. [Risk Register](#15-risk-register)

---

## 1. Architecture Overview

### Stack Decision

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR, file routing, React Server Components, Netlify-native |
| UI Framework | Tailwind CSS + Shadcn/ui | Mobile-first, accessible, Noor Luxe design system |
| Backend | Netlify Functions (serverless) | Zero server, auto-scale, zero downtime atomic deploys |
| Database | Supabase (PostgreSQL) | Auth, realtime, RLS, Storage — all in one |
| Auth | Supabase Auth (Phone OTP) | WhatsApp number as primary identity, no email needed |
| AI Engine | Google Gemini 2.5 Flash (Google GenAI SDK) | Hindi-native, fast, cost-efficient ($0.30/1M input tokens), structured JSON output |
| Ads Platform | Meta Marketing API v19+ | Campaign creation, insights, account health |
| Messaging | WhatsApp Business API (via Meta Cloud API) | Lead bot, daily reports, broadcast, owner alerts |
| Payments | Razorpay (subscriptions) + Cashfree (UPI links) | Noor billing + in-chat payment links for leads |
| PWA | next-pwa (Workbox) | Offline cache, home screen install, push notifications |
| i18n | next-intl | Hindi/English routing, Devanagari support |
| Analytics | PostHog | Funnels, session replay, feature flags |
| Error Tracking | Sentry | Mobile browser errors, source maps |
| Hosting | Netlify (frontend + functions) | Global CDN, atomic deploys, scheduled functions |

### Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SALON OWNER (Mobile Browser / PWA)          │
│    Onboarding → Dashboard → Campaign Builder → Lead Inbox → Reports│
└───────────────┬────────────────┬────────────────┬──────────────────┘
                │                │                │
         Next.js SSR        API Calls       WhatsApp Messages
                │                │                │
┌───────────────▼────────────────▼────────────────▼──────────────────┐
│                     NETLIFY (Edge Network)                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │
│  │ Static Pages │  │ Netlify Functions │  │ Scheduled Functions   │ │
│  │ (Next.js SSR)│  │                  │  │                       │ │
│  │              │  │ create-campaign  │  │ daily-report (9pm)    │ │
│  │ /onboarding  │  │ generate-plan    │  │ budget-monitor (6h)   │ │
│  │ /dashboard   │  │ generate-creative│  │ rebooking-check (24h) │ │
│  │ /campaigns   │  │ save-onboarding  │  │                       │ │
│  │ /leads       │  │ whatsapp-webhook │  │                       │ │
│  │ /reports     │  │ get-leads        │  │                       │ │
│  │ /plan        │  │ send-broadcast   │  │                       │ │
│  └──────────────┘  └────────┬─────────┘  └───────────┬───────────┘ │
└─────────────────────────────┼────────────────────────┼─────────────┘
                              │                        │
              ┌───────────────┼────────────────────────┼──────┐
              │               ▼                        ▼      │
              │  ┌────────────────────┐  ┌─────────────────┐  │
              │  │   SUPABASE         │  │   EXTERNAL APIs  │  │
              │  │                    │  │                  │  │
              │  │ PostgreSQL (6 tbl) │  │ Meta Marketing   │  │
              │  │ Auth (Phone OTP)   │  │ WhatsApp Cloud   │  │
              │  │ Storage (photos)   │  │ Gemini 2.5 Flash │  │
              │  │ Realtime (leads)   │  │ Razorpay         │  │
              │  │ RLS (row security) │  │ Cashfree UPI     │  │
              │  └────────────────────┘  └─────────────────┘  │
              └───────────────────────────────────────────────┘
```

### Zero Downtime Guarantee

Netlify's atomic deploy model means the old version keeps serving traffic until the new build passes all checks. Rollback is a single click. No PM2, no Nginx, no server restarts. WhatsApp webhook URLs stay stable across deploys because Netlify function URLs are deterministic (`/.netlify/functions/whatsapp-webhook`).

---

## 2. Pre-Build Checklist

Everything below must be done BEFORE Day 1 of coding. API approvals take 24–72 hours.

### Accounts to Create (Day 0)

- [ ] **Netlify account** — Free tier (125k fn invocations/month)
- [ ] **Supabase project** — Free tier (500MB DB, 1GB storage)
- [ ] **Meta Developer App** — Request permissions:
  - `ads_management` — create/manage campaigns
  - `ads_read` — pull insights data
  - `pages_show_list` — list connected pages
  - `pages_read_engagement` — read page data
  - `whatsapp_business_management` — manage WA Business account
  - `whatsapp_business_messaging` — send/receive WA messages
- [ ] **Meta Business Account** — Link ad account + WhatsApp Business number
- [ ] **WhatsApp Business API** — Set up via Meta Cloud API (not BSP)
  - Register a test phone number
  - Set up webhook verification URL (placeholder, update after first deploy)
- [ ] **Google AI Studio API key** — Gemini 2.5 Flash access (free tier: 15 RPM, paid: $0.30/1M input tokens)
- [ ] **Razorpay account** — Subscription billing (test mode for MVP)
- [ ] **Cashfree account** — UPI payment link generation (test mode)
- [ ] **PostHog** — Cloud account (free tier: 1M events/month)
- [ ] **Sentry** — Free developer account
- [ ] **GitHub repo** — Connect to Netlify for auto-deploy

### Meta App Review Checklist

Meta requires app review for production access. For MVP/testing, use development mode with test users:

1. Add all salon owner test users as app testers in Meta Developer dashboard
2. Use test ad accounts (no real spend during dev)
3. WhatsApp sandbox number for bot testing
4. Submit for app review at end of soft launch phase

### Domain & SSL

- Register domain (e.g., `noor.salon` or `getnoor.in`)
- Point DNS to Netlify — SSL auto-provisioned
- WhatsApp webhook URL: `https://getnoor.in/.netlify/functions/whatsapp-webhook`

---

## 3. Project Structure

```
noor/
├── netlify.toml                    # Netlify config (functions, redirects, schedules)
├── next.config.js                  # Next.js config + PWA + i18n
├── tailwind.config.js              # Noor Luxe design tokens
├── package.json
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker (generated by next-pwa)
│   ├── icons/                      # PWA icons (192, 512px)
│   └── fonts/                      # Cormorant Garamond, DM Sans, DM Mono, Noto Sans
│
├── app/                            # Next.js App Router
│   ├── layout.js                   # Root layout (fonts, Tailwind, i18n provider)
│   ├── page.js                     # Landing / marketing page
│   ├── (auth)/
│   │   ├── login/page.js           # WhatsApp OTP login
│   │   └── onboarding/page.js      # 7-step wizard
│   ├── (dashboard)/
│   │   ├── layout.js               # Dashboard shell (bottom nav, auth guard)
│   │   ├── page.js                 # Home — metrics + shortcuts
│   │   ├── plan/page.js            # Marketing Plan Builder ← NEW
│   │   ├── campaigns/
│   │   │   ├── page.js             # Campaign list
│   │   │   ├── new/page.js         # Campaign builder wizard
│   │   │   └── [id]/page.js        # Campaign detail + live stats
│   │   ├── leads/page.js           # Lead inbox (chat-list style)
│   │   ├── reports/page.js         # Report cards + weekly summary
│   │   ├── broadcasts/page.js      # WhatsApp broadcast manager
│   │   ├── calendar/page.js        # Festival campaign calendar
│   │   └── settings/page.js        # Account, billing, language
│   └── api/                        # Next.js API routes (light proxies if needed)
│
├── components/
│   ├── ui/                         # Shadcn/ui components (customised to Noor Luxe)
│   ├── onboarding/                 # Wizard steps
│   ├── campaign/                   # Campaign builder components
│   ├── plan/                       # Marketing plan builder components ← NEW
│   │   ├── PlanWizard.jsx          # Goal → audience → channels → timeline
│   │   ├── PlanPreview.jsx         # AI-generated plan card layout
│   │   ├── PlanTimeline.jsx        # Weekly action timeline
│   │   ├── PlanBudgetSlider.jsx    # Budget allocation UI
│   │   └── PlanRecipeCard.jsx      # Pre-built recipe selector
│   ├── leads/                      # Lead inbox + detail
│   ├── reports/                    # Report cards
│   ├── broadcasts/                 # Broadcast composer
│   ├── calendar/                   # Festival calendar grid
│   └── shared/                     # BottomNav, MetricCard, Noor AI bubble, etc.
│
├── lib/
│   ├── supabase/
│   │   ├── client.js               # Browser client (anon key)
│   │   ├── server.js               # Server client (service role key)
│   │   └── types.js                # TypeScript-like JSDoc types for tables
│   ├── meta/
│   │   ├── campaigns.js            # Meta Marketing API helpers
│   │   ├── insights.js             # Meta Insights API helpers
│   │   └── oauth.js                # Meta OAuth token exchange
│   ├── whatsapp/
│   │   ├── send.js                 # Send WA message helper
│   │   ├── templates.js            # WA message template builders
│   │   └── webhook-verify.js       # Webhook signature verification
│   ├── ai/
│   │   ├── gemini.js               # Gemini API wrapper (@google/genai SDK)
│   │   ├── prompts/
│   │   │   ├── campaign-copy.js    # Campaign copy generation prompt
│   │   │   ├── lead-qualify.js     # Lead qualification prompt
│   │   │   ├── plan-builder.js     # Marketing plan generation prompt ← NEW
│   │   │   ├── report-translate.js # Metrics → plain language prompt
│   │   │   └── creative-brief.js   # Photo → ad creative prompt
│   │   └── recipes/
│   │       ├── bridal-season.js    # Pre-built campaign recipe
│   │       ├── weekday-filler.js
│   │       ├── festival-offer.js
│   │       ├── new-service-launch.js
│   │       └── win-back.js
│   ├── constants/
│   │   ├── festivals.js            # 40+ Indian festivals with dates, regions
│   │   ├── salon-types.js          # Enum + metadata
│   │   └── service-cycles.js       # Haircut=4wk, Facial=6wk, Color=8wk, etc.
│   └── utils/
│       ├── currency.js             # ₹ formatting
│       ├── dates.js                # IST helpers
│       └── phone.js                # Indian phone number validation
│
├── netlify/
│   └── functions/
│       ├── save-onboarding.js      # POST — save salon profile
│       ├── generate-plan.js        # POST — AI marketing plan builder ← NEW
│       ├── create-campaign.js      # POST — create Meta ad campaign
│       ├── generate-creative.js    # POST — AI creative from photo
│       ├── whatsapp-webhook.js     # GET/POST — WA webhook handler
│       ├── send-broadcast.js       # POST — send WA broadcast to segment
│       ├── get-leads.js            # GET — paginated lead inbox
│       ├── get-reports.js          # GET — report data for dashboard
│       ├── daily-report.js         # SCHEDULED — 9pm IST daily report
│       ├── budget-monitor.js       # SCHEDULED — every 6h billing check
│       └── rebooking-check.js      # SCHEDULED — daily re-booking reminders
│
├── i18n/
│   ├── en.json                     # English strings
│   └── hi.json                     # Hindi strings (Devanagari)
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Full schema + RLS policies
```

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

# Scheduled functions
[functions."daily-report"]
  schedule = "30 15 * * *"          # UTC 15:30 = IST 21:00 (9pm)

[functions."budget-monitor"]
  schedule = "0 */6 * * *"          # Every 6 hours

[functions."rebooking-check"]
  schedule = "0 4 * * *"            # UTC 04:00 = IST 09:30 (morning check)

# Redirects for clean API URLs
[[redirects]]
  from = "/api/onboarding"
  to = "/.netlify/functions/save-onboarding"
  status = 200

[[redirects]]
  from = "/api/plan"
  to = "/.netlify/functions/generate-plan"
  status = 200

[[redirects]]
  from = "/api/campaign"
  to = "/.netlify/functions/create-campaign"
  status = 200

[[redirects]]
  from = "/api/creative"
  to = "/.netlify/functions/generate-creative"
  status = 200

[[redirects]]
  from = "/api/broadcast"
  to = "/.netlify/functions/send-broadcast"
  status = 200

[[redirects]]
  from = "/api/leads"
  to = "/.netlify/functions/get-leads"
  status = 200

[[redirects]]
  from = "/api/reports"
  to = "/.netlify/functions/get-reports"
  status = 200

[[redirects]]
  from = "/webhook/whatsapp"
  to = "/.netlify/functions/whatsapp-webhook"
  status = 200

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 4. Supabase Schema & RLS

### Full Migration SQL

```sql
-- 001_initial_schema.sql

-- ============================================================
-- TABLE 1: salons (primary entity)
-- ============================================================
CREATE TABLE salons (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wa_number TEXT NOT NULL UNIQUE,
  salon_name TEXT,
  salon_type TEXT NOT NULL CHECK (salon_type IN (
    'ladies_parlour', 'unisex', 'bridal_studio',
    'home_beautician', 'mens_grooming', 'skin_clinic'
  )),
  city TEXT NOT NULL,
  pin_code TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  
  -- Business context (for AI)
  avg_ticket_size INT,                    -- ₹ average bill per customer
  top_services TEXT[],                    -- ['facial', 'hair_colour', 'bridal_makeup']
  target_customers TEXT[],                -- ['working_women', 'homemakers', 'brides']
  
  -- Meta integration
  meta_access_token TEXT,                 -- Encrypted long-lived token
  meta_ad_account_id TEXT,               -- act_XXXXXXXXX
  meta_page_id TEXT,                      -- Page linked to WA number
  wa_business_id TEXT,                   -- WhatsApp Business Account ID
  
  -- Billing & credits
  subscription_tier TEXT DEFAULT 'chamak' CHECK (subscription_tier IN (
    'chamak', 'roshan', 'noor_pro'
  )),
  credit_balance INT DEFAULT 500,         -- Free ₹500 on signup
  budget_tier INT DEFAULT 3000,          -- Monthly spend cap in ₹
  
  -- Preferences
  language TEXT DEFAULT 'hi-en' CHECK (language IN ('hi', 'en', 'hi-en')),
  
  -- Timestamps
  onboarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 2: marketing_plans (AI-generated marketing plans)
-- ============================================================
CREATE TABLE marketing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  
  -- Plan input
  goal_text TEXT NOT NULL,                -- Owner's original goal in Hindi/English
  monthly_budget INT,                     -- ₹ total monthly budget for plan
  duration_weeks INT DEFAULT 4,           -- Plan duration
  
  -- AI-generated plan content
  plan_summary TEXT,                      -- 2-3 line plain-language overview
  weekly_actions JSONB NOT NULL,          -- Array of week objects with daily tasks
  /* weekly_actions structure:
  [
    {
      "week": 1,
      "theme": "Build awareness in your locality",
      "actions": [
        {
          "day": "Mon",
          "channel": "instagram",
          "action_type": "post",
          "description": "Before/after transformation reel",
          "copy_suggestion": "Hindi copy here...",
          "estimated_cost": 0,
          "recipe_id": null
        },
        {
          "day": "Wed",
          "channel": "whatsapp",
          "action_type": "broadcast",
          "description": "Weekday offer to regular clients",
          "copy_suggestion": "...",
          "estimated_cost": 0,
          "recipe_id": "weekday_filler"
        },
        {
          "day": "Fri",
          "channel": "meta_ads",
          "action_type": "campaign",
          "description": "Click-to-WhatsApp ad for facial offer",
          "copy_suggestion": "...",
          "estimated_cost": 500,
          "recipe_id": "festival_offer"
        }
      ]
    }
  ]
  */
  
  channel_split JSONB,                    -- {"whatsapp": 40, "instagram": 35, "meta_ads": 25}
  budget_allocation JSONB,               -- {"whatsapp_broadcasts": 0, "meta_ads": 2000, "content": 500}
  
  -- Recommended campaigns to launch from this plan
  recommended_recipes TEXT[],             -- ['weekday_filler', 'bridal_season', 'festival_offer']
  
  -- Plan status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  activated_at TIMESTAMPTZ,
  
  -- Tracking: how much of the plan was actually executed
  actions_completed INT DEFAULT 0,
  actions_total INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 3: campaigns
-- ============================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES marketing_plans(id) ON DELETE SET NULL,
  
  -- Campaign input
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
  daily_budget_inr INT NOT NULL,          -- Hard cap per day
  total_budget_inr INT,                   -- Total campaign budget
  total_spent_inr NUMERIC DEFAULT 0,     -- Updated by daily-report function
  
  -- Targeting
  radius_km INT DEFAULT 5,
  target_age_min INT DEFAULT 18,
  target_age_max INT DEFAULT 55,
  target_gender TEXT DEFAULT 'all',
  target_interests TEXT[],
  
  -- Creative
  copy_variants JSONB,                    -- 3 Gemini-generated copy options
  selected_copy_index INT,               -- Which variant owner approved
  creative_url TEXT,                       -- Supabase Storage URL for ad image
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_approval', 'active', 'paused', 'completed', 'failed'
  )),
  paused_reason TEXT,
  
  -- Performance (updated by daily-report)
  enquiry_count INT DEFAULT 0,
  hot_lead_count INT DEFAULT 0,
  booking_count INT DEFAULT 0,
  cost_per_lead NUMERIC,
  cost_per_booking NUMERIC,
  
  -- Timestamps
  launched_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 4: leads
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  
  -- Lead identity
  wa_number TEXT NOT NULL,
  name TEXT,
  
  -- Qualification data (from bot)
  score TEXT DEFAULT 'new' CHECK (score IN ('new', 'hot', 'warm', 'cold', 'booked', 'lost')),
  service_interest TEXT,                  -- Q1 answer
  preferred_date TEXT,                    -- Q2 answer
  budget_range TEXT,                      -- Q3 answer
  
  -- Conversation state
  bot_step INT DEFAULT 0,                -- 0=greeting, 1=Q1, 2=Q2, 3=Q3, 99=complete
  message_history JSONB DEFAULT '[]'::jsonb,
  
  -- Booking tracking
  booked_at TIMESTAMPTZ,
  booking_amount INT,
  upi_payment_link TEXT,
  payment_confirmed BOOLEAN DEFAULT FALSE,
  
  -- Owner interaction
  owner_notified BOOLEAN DEFAULT FALSE,
  owner_replied BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 5: reports (daily snapshots)
-- ============================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  
  -- Metrics
  total_spend_inr NUMERIC DEFAULT 0,
  enquiry_count INT DEFAULT 0,
  hot_lead_count INT DEFAULT 0,
  booking_count INT DEFAULT 0,
  cost_per_enquiry NUMERIC,
  cost_per_booking NUMERIC,
  best_campaign_id UUID REFERENCES campaigns(id),
  
  -- The actual message sent to owner
  wa_message_sent TEXT,
  wa_message_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(salon_id, report_date)
);

-- ============================================================
-- TABLE 6: broadcasts
-- ============================================================
CREATE TABLE broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES marketing_plans(id) ON DELETE SET NULL,
  
  -- Broadcast content
  segment TEXT CHECK (segment IN ('regulars', 'occasional', 'lapsed', 'new', 'all')),
  message_body TEXT NOT NULL,
  
  -- Recipients
  recipients JSONB DEFAULT '[]'::jsonb,   -- Array of {wa_number, name}
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  read_count INT DEFAULT 0,
  replied_count INT DEFAULT 0,
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE 7: clients (salon's customer database for re-booking)
-- ============================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  
  wa_number TEXT NOT NULL,
  name TEXT,
  
  -- Visit history
  last_service TEXT,
  last_visit_at TIMESTAMPTZ,
  visit_count INT DEFAULT 1,
  total_spend INT DEFAULT 0,
  
  -- Segmentation
  segment TEXT DEFAULT 'new' CHECK (segment IN ('regular', 'occasional', 'lapsed', 'new')),
  -- regular = 3+ visits, occasional = 1-2, lapsed = 45+ days since last, new = first time
  
  -- Re-booking
  next_reminder_at TIMESTAMPTZ,           -- Calculated from service cycle
  reminder_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(salon_id, wa_number)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_campaigns_salon ON campaigns(salon_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_leads_salon ON leads(salon_id);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_leads_wa ON leads(wa_number);
CREATE INDEX idx_reports_salon_date ON reports(salon_id, report_date DESC);
CREATE INDEX idx_broadcasts_salon ON broadcasts(salon_id);
CREATE INDEX idx_clients_salon ON clients(salon_id);
CREATE INDEX idx_clients_reminder ON clients(next_reminder_at) WHERE reminder_sent = FALSE;
CREATE INDEX idx_plans_salon ON marketing_plans(salon_id);
CREATE INDEX idx_plans_status ON marketing_plans(status);

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
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Auto-segment clients based on visit count and recency
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

CREATE TRIGGER client_auto_segment BEFORE INSERT OR UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION auto_segment_client();
```

---

## 5. Feature Implementation Map

### F1 — Onboarding Flow (< 10 min, No Credit Card)

**Goal:** Any salon owner can go from first click to profile saved in under 10 minutes on mobile browser.

**UI:** Full-screen wizard, one question per screen, progress dots, mobile-first.

**Steps:**

| Step | Screen | Input | Saved To |
|---|---|---|---|
| 1 | WhatsApp number | Phone OTP via Supabase Auth | auth.users |
| 2 | Salon type | 6 pill buttons (ladies parlour, unisex, bridal, home beautician, mens grooming, skin clinic) | salons.salon_type |
| 3 | Location | City free-text + PIN code + optional GPS | salons.city, pin_code, lat/long |
| 4 | Top service | Upload 1 photo OR type service name | Supabase Storage + salons.top_services |
| 5 | Your customers | Multi-select pills: Working women / Homemakers / Brides / Students / All | salons.target_customers |
| 6 | Monthly budget comfort | Slider: ₹500 / ₹1,000–3,000 / ₹5,000+ / Not sure | salons.budget_tier |
| 7 | Connect Meta (optional) | OAuth redirect to FB login | salons.meta_access_token, meta_ad_account_id |

**Netlify Function:** `save-onboarding.js`

```javascript
// netlify/functions/save-onboarding.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const body = JSON.parse(event.body);
  const { 
    user_id, salon_name, salon_type, city, pin_code,
    top_services, target_customers, budget_tier, language,
    meta_code // OAuth code from Meta redirect
  } = body;
  
  // Exchange Meta OAuth code for long-lived token (if provided)
  let meta_access_token = null;
  let meta_ad_account_id = null;
  
  if (meta_code) {
    const tokenResp = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
      `client_id=${process.env.META_APP_ID}` +
      `&client_secret=${process.env.META_APP_SECRET}` +
      `&code=${meta_code}` +
      `&redirect_uri=${process.env.META_REDIRECT_URI}`
    );
    const tokenData = await tokenResp.json();
    
    // Exchange short-lived for long-lived token
    const longResp = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
      `grant_type=fb_exchange_token` +
      `&client_id=${process.env.META_APP_ID}` +
      `&client_secret=${process.env.META_APP_SECRET}` +
      `&fb_exchange_token=${tokenData.access_token}`
    );
    const longData = await longResp.json();
    meta_access_token = longData.access_token;
    
    // Get ad account ID
    const adAccResp = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${meta_access_token}`
    );
    const adAccData = await adAccResp.json();
    if (adAccData.data && adAccData.data.length > 0) {
      meta_ad_account_id = adAccData.data[0].id;
    }
  }
  
  const { data, error } = await supabase.from('salons').upsert({
    id: user_id,
    salon_name,
    salon_type,
    city,
    pin_code,
    top_services,
    target_customers,
    budget_tier: parseInt(budget_tier) || 3000,
    language: language || 'hi-en',
    meta_access_token,
    meta_ad_account_id,
    credit_balance: 500, // Free ₹500 on signup
    onboarded_at: new Date().toISOString()
  });
  
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      credit_balance: 500,
      message: 'Salon profile saved! ₹500 free credit applied.'
    })
  };
};
```

**After onboarding completes:** Redirect to `/plan` (Marketing Plan Builder) to generate their first marketing plan.

---

### F2 — Marketing Plan Builder (AI-Powered) ← CORE NEW FEATURE

**Goal:** Salon owner answers 4–5 simple questions, and Noor generates a complete 4-week marketing plan with daily/weekly actions, channel recommendations, budget allocation, and ready-to-execute campaign recipes.

**This is the "brain" of Noor** — it sits between onboarding and campaign execution. The plan builder doesn't just suggest what to do, it tells the owner exactly what to do, when, on which channel, with what budget, in what language.

**User Flow:**

```
Owner opens /plan → 
  Step 1: "What's your main goal this month?" 
    → Get more walk-ins / Fill weekday slots / Bridal season bookings / Launch new service / Win back old clients
  
  Step 2: "How much can you spend on marketing this month?" 
    → Slider: ₹500 – ₹10,000 (defaults to salon's budget_tier)
  
  Step 3: "Any upcoming occasion?" 
    → Auto-populated from festival calendar (e.g., "Navratri is in 3 weeks")
    → Owner can also type custom event
  
  Step 4: "Which channels do you want to use?"
    → Pre-selected based on salon profile: WhatsApp (always on), Instagram (if connected), Meta Ads (if Meta OAuth done)
  
  → GENERATE button →
  
  Noor AI generates a 4-week plan →
  
  Plan Preview screen shows:
    - Plan summary in Hindi/English
    - Week-by-week timeline with daily actions
    - Channel split pie (WA 40%, Insta 35%, Ads 25%)
    - Budget allocation bar
    - "Ready to launch" campaign recipe cards
    
  → Owner taps "Activate Plan" → plan.status = 'active'
  → First week's actions appear on dashboard Home
  → Each action has a "Do it now" button (opens campaign builder / broadcast composer / content prompt)
```

**Netlify Function:** `generate-plan.js`

```javascript
// netlify/functions/generate-plan.js
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const { salon_id, goal, monthly_budget, upcoming_occasion, channels } = JSON.parse(event.body);
  
  // Fetch salon profile for context
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salon_id)
    .single();
  
  if (!salon) return { statusCode: 404, body: JSON.stringify({ error: 'Salon not found' }) };
  
  // Fetch past campaign performance for smarter recommendations
  const { data: pastCampaigns } = await supabase
    .from('campaigns')
    .select('recipe_type, total_spent_inr, booking_count, cost_per_booking')
    .eq('salon_id', salon_id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);
  
  // Build the Gemini prompt
  const systemInstruction = `You are Noor, an AI marketing co-pilot for Indian beauty salons. 
You generate practical, actionable 4-week marketing plans.

RULES:
- Output ONLY valid JSON. No markdown, no explanation outside JSON.
- All copy suggestions must be in ${salon.language === 'hi' ? 'Hindi (Devanagari script)' : salon.language === 'en' ? 'English' : 'Hinglish (Hindi-English mix)'}.
- Every action must be concrete and executable by a busy salon owner in under 5 minutes.
- Budget allocation must stay within ₹${monthly_budget} total.
- WhatsApp broadcasts cost ₹0 (free WA Business app).
- Instagram organic posts cost ₹0.
- Meta ads: minimum ₹200/day for meaningful results.
- Include festival/occasion-specific offers when relevant.
- For Tier 2/3 cities, lean heavier on WhatsApp and local community groups.
- For Tier 1 cities, include Instagram Reels and Meta ads.
- Always include at least one win-back action for lapsed clients.
- Service cycle reminders: Haircut=4 weeks, Facial=6 weeks, Hair colour=8 weeks, Bridal prep=3 months before.`;

  const userPrompt = `Generate a 4-week marketing plan for this salon:

SALON PROFILE:
- Name: ${salon.salon_name || 'My Salon'}
- Type: ${salon.salon_type}
- City: ${salon.city} (${salon.pin_code})
- Top services: ${(salon.top_services || []).join(', ')}
- Target customers: ${(salon.target_customers || []).join(', ')}
- Average ticket: ₹${salon.avg_ticket_size || 500}
- Has Meta Ads connected: ${salon.meta_access_token ? 'Yes' : 'No'}

PLAN REQUEST:
- Goal: ${goal}
- Monthly budget: ₹${monthly_budget}
- Upcoming occasion: ${upcoming_occasion || 'None specified'}
- Channels available: ${channels.join(', ')}

${pastCampaigns && pastCampaigns.length > 0 ? `
PAST PERFORMANCE (use this to optimize):
${pastCampaigns.map(c => `- ${c.recipe_type}: spent ₹${c.total_spent_inr}, ${c.booking_count} bookings, ₹${c.cost_per_booking}/booking`).join('\n')}
` : ''}

Return JSON with this exact structure:
{
  "plan_summary": "2-3 sentence plain-language summary of the plan",
  "channel_split": {"whatsapp": 40, "instagram": 35, "meta_ads": 25},
  "budget_allocation": {"whatsapp_broadcasts": 0, "instagram_content": 0, "meta_ads": 2000, "content_creation": 500},
  "recommended_recipes": ["weekday_filler", "festival_offer"],
  "weekly_actions": [
    {
      "week": 1,
      "theme": "Short theme for the week",
      "actions": [
        {
          "day": "Mon",
          "channel": "instagram",
          "action_type": "post",
          "description": "What to do",
          "copy_suggestion": "Ready-to-use caption or message text",
          "estimated_cost": 0,
          "recipe_id": null,
          "time_needed_minutes": 5
        }
      ]
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: 'application/json', // Forces valid JSON output
      maxOutputTokens: 4000,
      temperature: 0.7,
    }
  });
  
  // Parse Gemini's response (responseMimeType ensures valid JSON)
  let planData;
  try {
    const text = response.text.replace(/```json\n?|```/g, '').trim();
    planData = JSON.parse(text);
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'AI plan generation failed — retrying...' }) };
  }
  
  // Calculate total actions
  const totalActions = planData.weekly_actions.reduce(
    (sum, week) => sum + week.actions.length, 0
  );
  
  // Save plan to Supabase
  const { data: plan, error } = await supabase
    .from('marketing_plans')
    .insert({
      salon_id,
      goal_text: goal,
      monthly_budget: monthly_budget,
      duration_weeks: 4,
      plan_summary: planData.plan_summary,
      weekly_actions: planData.weekly_actions,
      channel_split: planData.channel_split,
      budget_allocation: planData.budget_allocation,
      recommended_recipes: planData.recommended_recipes,
      status: 'draft',
      actions_total: totalActions,
      actions_completed: 0
    })
    .select()
    .single();
  
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, plan })
  };
};
```

**Frontend Components for Plan Builder:**

| Component | What It Does |
|---|---|
| `PlanWizard.jsx` | 4-step input form (goal → budget → occasion → channels). Pill-button selectors, Noor Luxe styling. Calls `/api/plan` on submit. Shows loading state with Noor AI animation. |
| `PlanPreview.jsx` | Full plan display after generation. Card layout with plan summary, channel split donut chart, budget allocation bar. "Activate Plan" primary CTA at bottom. |
| `PlanTimeline.jsx` | Week-by-week accordion view. Each day's action shown as a mini-card with channel icon, description, copy preview, cost badge. "Do it now" button on each action. |
| `PlanBudgetSlider.jsx` | Budget allocation visualization. Stacked horizontal bar showing how ₹ is split across channels. Owner can drag to reallocate (triggers re-generation). |
| `PlanRecipeCard.jsx` | Recommended campaign recipe card. Shows recipe name, expected outcome, effort level, "Launch This" button that opens campaign builder pre-filled. |

**Plan → Campaign Flow:**

When the owner taps "Do it now" on a plan action that has `action_type: "campaign"`:
1. Open `/campaigns/new` pre-filled with the plan action's data
2. `campaign.plan_id` links back to the marketing plan
3. When campaign launches, update `marketing_plans.actions_completed += 1`
4. Dashboard Home shows plan progress: "Week 2: 5/8 actions completed"

---

### F3 — Conversational Campaign Builder

**Goal:** Owner describes goal in Hindi → AI generates campaign → one-tap launch on Meta → owner never sees Ads Manager.

**Implementation:**

```javascript
// netlify/functions/create-campaign.js (simplified core logic)

// 1. Receive owner's goal
const { salon_id, goal_text, budget, photo_url, plan_id } = body;

// 2. Load salon context
const salon = await getSalon(salon_id);

// 3. Call Gemini to generate campaign strategy + copy
const aiResponse = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: `Goal: "${goal_text}"
    Salon: ${salon.salon_type} in ${salon.city}
    Budget: ₹${budget}/day
    Services: ${salon.top_services.join(', ')}
    Language: ${salon.language}
    
    Generate 3 ad copy variants + targeting recommendation.
    Return JSON: { copies: [...], targeting: {...}, headline: "...", cta: "..." }`,
  config: {
    systemInstruction: CAMPAIGN_SYSTEM_PROMPT,
    responseMimeType: 'application/json',
    maxOutputTokens: 2000,
    temperature: 0.8,
  }
});

// 4. Create Meta campaign via Marketing API
const campaignResp = await fetch(
  `https://graph.facebook.com/v19.0/${salon.meta_ad_account_id}/campaigns`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Noor: ${goal_text.slice(0, 50)}`,
      objective: 'OUTCOME_ENGAGEMENT', // Click-to-WhatsApp
      special_ad_categories: [],
      status: 'PAUSED', // Start paused, activate after owner approves
      access_token: salon.meta_access_token
    })
  }
);

// 5. Create ad set with targeting
const adsetResp = await fetch(
  `https://graph.facebook.com/v19.0/${salon.meta_ad_account_id}/adsets`,
  {
    method: 'POST',
    body: JSON.stringify({
      name: `Noor Adset: ${salon.city}`,
      campaign_id: campaignData.id,
      daily_budget: budget * 100, // Meta uses paisa
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'CONVERSATIONS',
      targeting: {
        geo_locations: {
          custom_locations: [{
            latitude: salon.latitude,
            longitude: salon.longitude,
            radius: salon.radius_km || 5,
            distance_unit: 'kilometer'
          }]
        },
        age_min: targeting.age_min,
        age_max: targeting.age_max,
        genders: targeting.genders,
        flexible_spec: [{
          interests: targeting.interests.map(i => ({ id: i.id, name: i.name }))
        }]
      },
      access_token: salon.meta_access_token
    })
  }
);

// 6. Create ad with click-to-WhatsApp CTA
const adResp = await fetch(
  `https://graph.facebook.com/v19.0/${salon.meta_ad_account_id}/ads`,
  {
    method: 'POST',
    body: JSON.stringify({
      name: `Noor Ad`,
      adset_id: adsetData.id,
      creative: {
        object_story_spec: {
          page_id: salon.meta_page_id,
          link_data: {
            message: selectedCopy.body,
            link: `https://wa.me/${salon.wa_number}?text=${encodeURIComponent(selectedCopy.wa_prefill)}`,
            call_to_action: {
              type: 'WHATSAPP_MESSAGE',
              value: { whatsapp_number: salon.wa_number }
            },
            image_url: photo_url || creative_url
          }
        }
      },
      status: 'PAUSED',
      access_token: salon.meta_access_token
    })
  }
);

// 7. Save to Supabase
await supabase.from('campaigns').insert({
  salon_id, plan_id, goal_text,
  meta_campaign_id: campaignData.id,
  meta_adset_id: adsetData.id,
  meta_ad_id: adData.id,
  daily_budget_inr: budget,
  copy_variants: copies,
  status: 'pending_approval'
});

// 8. Return preview to owner for approval
return { campaign_id, preview_url, copies, targeting_summary };
```

**After owner approves:** Update campaign status to ACTIVE on Meta + Supabase.

---

### F4 — AI Creative & Copy Generator

**Netlify Function:** `generate-creative.js`

| Input | Process | Output |
|---|---|---|
| Phone photo (Supabase Storage URL) | Gemini analyzes photo (multimodal) → generates creative brief | 3 copy variants (Hindi/English/Hinglish) |
| Salon type + service + occasion | Platform-aware copy: Instagram = aspirational, WhatsApp = warm/direct | Ad headline, body, CTA, WA broadcast text |
| Festival calendar context | Auto-includes festival greetings + limited-time urgency | Festival-specific offer framing |

**Copy generation prompt** includes:
- Salon's city and language preference
- Service being promoted
- Target audience segment
- Channel-specific formatting rules
- Festival/occasion context if within 2 weeks
- Past-performing copy patterns (from completed campaigns)

---

### F5 — Lead Pre-Qualification Bot (WhatsApp)

**Netlify Function:** `whatsapp-webhook.js`

```javascript
// netlify/functions/whatsapp-webhook.js

exports.handler = async (event) => {
  // GET = webhook verification
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters;
    if (params['hub.verify_token'] === process.env.WA_VERIFY_TOKEN) {
      return { statusCode: 200, body: params['hub.challenge'] };
    }
    return { statusCode: 403 };
  }
  
  // POST = incoming message
  const body = JSON.parse(event.body);
  const entry = body.entry?.[0];
  const change = entry?.changes?.[0]?.value;
  const message = change?.messages?.[0];
  
  if (!message) return { statusCode: 200 }; // Not a message event
  
  const from = message.from;           // Sender's WA number
  const text = message.text?.body;     // Message text
  const wa_business_id = change.metadata.phone_number_id;
  
  // Find which salon this WA number belongs to
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('wa_business_id', wa_business_id)
    .single();
  
  if (!salon) return { statusCode: 200 };
  
  // Find or create lead
  let { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('salon_id', salon.id)
    .eq('wa_number', from)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (!lead) {
    const { data: newLead } = await supabase.from('leads').insert({
      salon_id: salon.id,
      wa_number: from,
      name: change.contacts?.[0]?.profile?.name || null,
      bot_step: 0,
      message_history: []
    }).select().single();
    lead = newLead;
  }
  
  // Add message to history
  const updatedHistory = [...(lead.message_history || []), {
    role: 'user', content: text, timestamp: new Date().toISOString()
  }];
  
  // Use Gemini to generate next bot response based on qualification step
  const botResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: text,
    config: {
      systemInstruction: `You are a friendly salon receptionist bot for "${salon.salon_name || 'our salon'}" in ${salon.city}.
    Language: ${salon.language === 'hi' ? 'Hindi' : salon.language === 'en' ? 'English' : 'Hinglish'}
    Services: ${(salon.top_services || []).join(', ')}
    
    Your job: Qualify this lead in exactly 3 questions:
    Q1: Which service are you interested in?
    Q2: When would you like to visit? (preferred date/time)
    Q3: What's your budget range for this service?
    
    Current step: ${lead.bot_step}
    Previous messages: ${JSON.stringify(updatedHistory.slice(-6))}
    
    Rules:
    - Be warm, brief (under 50 words per message)
    - If they answered the current question, extract the answer and move to next
    - After Q3, summarize and say "Let me connect you with [salon name]"
    - Score: hot (all 3 answered + budget fits), warm (2 answered), cold (unclear intent)
    
    Return JSON: { "reply": "message text", "extracted": {"field": "value"}, "score": "hot|warm|cold", "next_step": 1-3 or 99 }`,
      responseMimeType: 'application/json',
      maxOutputTokens: 300,
      temperature: 0.7,
    }
  });
  
  const botData = JSON.parse(botResponse.text.replace(/```json\n?|```/g, '').trim());
  
  // Send WhatsApp reply
  await sendWhatsAppMessage(salon.wa_business_id, from, botData.reply);
  
  // Update lead in Supabase
  const updateData = {
    bot_step: botData.next_step,
    score: botData.score,
    message_history: [...updatedHistory, {
      role: 'assistant', content: botData.reply, timestamp: new Date().toISOString()
    }]
  };
  if (botData.extracted.service_interest) updateData.service_interest = botData.extracted.service_interest;
  if (botData.extracted.preferred_date) updateData.preferred_date = botData.extracted.preferred_date;
  if (botData.extracted.budget_range) updateData.budget_range = botData.extracted.budget_range;
  
  await supabase.from('leads').update(updateData).eq('id', lead.id);
  
  // If hot lead, notify owner
  if (botData.score === 'hot' && !lead.owner_notified) {
    const ownerMsg = salon.language === 'hi' 
      ? `🔥 नया हॉट लीड!\n\n${lead.name || 'Customer'}\nसर्विस: ${botData.extracted.service_interest}\nतारीख: ${botData.extracted.preferred_date}\nबजट: ${botData.extracted.budget_range}\n\nरिप्लाई करने के लिए टैप करें`
      : `🔥 New hot lead!\n\n${lead.name || 'Customer'}\nService: ${botData.extracted.service_interest}\nDate: ${botData.extracted.preferred_date}\nBudget: ${botData.extracted.budget_range}\n\nTap to reply`;
    
    await sendWhatsAppMessage(salon.wa_business_id, salon.wa_number, ownerMsg);
    await supabase.from('leads').update({ owner_notified: true }).eq('id', lead.id);
  }
  
  return { statusCode: 200 };
};

// Helper: Send WhatsApp message via Cloud API
async function sendWhatsAppMessage(phoneNumberId, to, text) {
  await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    })
  });
}
```

---

### F6 — Plain-Language ROI Reports

**Netlify Function:** `daily-report.js` (Scheduled: 9pm IST daily)

```javascript
// For each active salon with running campaigns:
// 1. Pull Meta Insights API
const insightsResp = await fetch(
  `https://graph.facebook.com/v19.0/${campaign.meta_campaign_id}/insights` +
  `?fields=spend,actions,cost_per_action_type` +
  `&date_preset=today` +
  `&access_token=${salon.meta_access_token}`
);

// 2. Count today's leads from Supabase
const { count: enquiries } = await supabase
  .from('leads').select('*', { count: 'exact' })
  .eq('salon_id', salon.id)
  .gte('created_at', todayStart);

const { count: hotLeads } = await supabase
  .from('leads').select('*', { count: 'exact' })
  .eq('salon_id', salon.id)
  .eq('score', 'hot')
  .gte('created_at', todayStart);

// 3. Generate plain-language report via Gemini
const reportText = await generateReport(salon.language, {
  spend: insights.spend,
  enquiries,
  hotLeads,
  bestCampaign: bestPerformer.goal_text,
  costPerEnquiry: insights.spend / Math.max(enquiries, 1)
});

// 4. Send via WhatsApp
await sendWhatsAppMessage(salon.wa_business_id, salon.wa_number, reportText);

// 5. Save to reports table
await supabase.from('reports').insert({ ... });
```

**Report format (Hindi example):**
```
📊 Noor Daily Report · 15 Jan

💰 आज खर्च: ₹480
📩 नई पूछताछ: 6
🔥 हॉट लीड: 2
📅 बुकिंग: 1

💡 सबसे अच्छा: "Bridal facial" वाला ऐड
📈 ₹240 में 1 बुकिंग मिली

Reply: PAUSE / CONTINUE / INCREASE
```

---

### F7 — Budget Guardrails + Account Health Monitor

**Netlify Function:** `budget-monitor.js` (Scheduled: every 6 hours)

**Logic:**
1. For each active campaign, check spend vs. daily cap → if `spend > cap * 1.1`, pause campaign on Meta
2. Check billing status via Meta API → if any billing error, alert owner before account ban
3. Check if 0 hot leads in last 48h → auto-pause + send fix suggestion
4. Check Meta account health score → if flagged, alert immediately

---

### F8 — WhatsApp Broadcast Manager

**Netlify Function:** `send-broadcast.js`

**Segments:** Built from `clients` table automatically:
- Regulars: 3+ visits
- Occasional: 1-2 visits
- Lapsed: 45+ days since last visit
- New: First-time contacts
- All: Everyone

**Flow:** Owner picks segment → AI generates personalized broadcast text → Owner approves → Function sends via WA Business App (free, up to 256 contacts) or API (for scale).

---

### F9 — Festival Campaign Calendar

**Data:** `lib/constants/festivals.js` — 40+ Indian festivals with:
- Date (auto-calculated for current year)
- Region (national, north, south, east, west)
- Relevant salon services (mehendi, bridal, facial, hair spa)
- Pre-written offer templates in Hindi + English

**UI:** Calendar grid view in `/calendar`. Each festival card shows:
- Days until festival
- Suggested campaign type
- "Create Campaign" button (opens campaign builder pre-filled)
- Auto-notification 2 weeks before each relevant festival

---

### F10 — Service-Cycle Re-Booking Reminders

**Netlify Function:** `rebooking-check.js` (Scheduled: daily 9:30am IST)

**Logic:**
```
For each client where next_reminder_at <= today AND reminder_sent = false:
  1. Generate personalized reminder via Gemini:
     "Hi Priya! Aapki last facial 6 weeks pehle hui thi. 
      Is week special offer: 20% off facial. Book karein?"
  2. Send via WhatsApp
  3. Update client.reminder_sent = true
  4. Log as broadcast for tracking
```

**Service cycles (configurable per salon):**

| Service | Default Cycle | Reminder Text |
|---|---|---|
| Haircut | 4 weeks | "Time for a trim!" |
| Facial | 6 weeks | "Your skin is calling for care" |
| Hair colour | 8 weeks | "Roots showing? Let's fix that" |
| Threading | 2 weeks | "Quick threading touch-up?" |
| Bridal prep | 3 months before | "Bridal season is coming!" |

---

## 6. Netlify Functions Registry

| Function | Trigger | Calls | Writes To |
|---|---|---|---|
| `save-onboarding.js` | POST /api/onboarding | Meta OAuth API | salons |
| `generate-plan.js` | POST /api/plan | Gemini API | marketing_plans |
| `create-campaign.js` | POST /api/campaign | Gemini + Meta Marketing API | campaigns |
| `generate-creative.js` | POST /api/creative | Gemini API (multimodal) | campaigns (copy_variants) |
| `whatsapp-webhook.js` | GET/POST /webhook/whatsapp | Gemini + WA Cloud API | leads |
| `send-broadcast.js` | POST /api/broadcast | WA Cloud API | broadcasts |
| `get-leads.js` | GET /api/leads | Supabase read | — |
| `get-reports.js` | GET /api/reports | Supabase read | — |
| `daily-report.js` | CRON 9pm IST | Meta Insights + Gemini + WA API | reports, campaigns |
| `budget-monitor.js` | CRON every 6h | Meta Billing API | campaigns |
| `rebooking-check.js` | CRON 9:30am IST | Gemini + WA API | clients, broadcasts |

---

## 7. Meta API Integration

### Required API Calls

| Endpoint | When Used | Feature |
|---|---|---|
| `POST /oauth/access_token` | Onboarding (OAuth) | F1 |
| `GET /me/adaccounts` | Onboarding | F1 |
| `POST /{act}/campaigns` | Campaign launch | F3 |
| `POST /{act}/adsets` | Campaign launch | F3 |
| `POST /{act}/ads` | Campaign launch | F3 |
| `POST /{campaign}/` (status update) | Pause/resume | F7 |
| `GET /{campaign}/insights` | Daily report | F6 |
| `GET /{act}/insights` | Budget monitor | F7 |
| `GET /act_{id}` | Account health check | F7 |

### Meta SDK Alternative

For faster implementation, use the Meta Business SDK for Node.js:

```bash
npm install facebook-nodejs-business-sdk
```

This handles token refresh, pagination, and error handling automatically.

---

## 8. WhatsApp Business API Integration

### Using Meta Cloud API (not BSP)

All WhatsApp functionality goes through Meta's Cloud API directly — no third-party BSP needed for MVP.

| Endpoint | Purpose |
|---|---|
| `POST /{phone_id}/messages` | Send text, template, interactive messages |
| `GET /webhook` (verify) | Webhook registration |
| `POST /webhook` (receive) | Incoming messages, status updates |
| `POST /{phone_id}/register` | Register phone number |

### Message Types Used

- **Text messages:** Bot replies, daily reports, owner alerts
- **Template messages:** Re-booking reminders (requires pre-approved templates)
- **Interactive messages:** Button lists for lead qualification
- **Catalog messages:** Future — send service catalog in chat

### WhatsApp Template Approval (Pre-Launch)

Submit these templates for Meta approval before launch:

1. `daily_report` — "📊 Noor Daily Report · {{date}}..."
2. `hot_lead_alert` — "🔥 New hot lead: {{name}}, {{service}}, {{date}}..."
3. `rebooking_reminder` — "Hi {{name}}! Your last {{service}} was {{weeks}} weeks ago..."
4. `broadcast_offer` — "{{salon_name}} special: {{offer_text}}. Reply to book!"

---

## 9. Gemini AI Integration

### SDK & Model Choice

| Aspect | Decision |
|---|---|
| SDK | `@google/genai` (v1.51+) — latest official Google GenAI SDK |
| Primary Model | `gemini-2.5-flash` — best balance of cost, speed, quality for high-volume use |
| Fallback Model | `gemini-2.5-flash-lite` — for simple tasks (report translation, reminders) at even lower cost |
| JSON Mode | `responseMimeType: 'application/json'` — forces structured JSON output (no parsing errors) |
| Hindi Support | Native — Gemini supports Hindi, Tamil, Bengali, Marathi, Telugu + 40 more Indian languages |
| Multimodal | Built-in — pass salon photos directly for creative analysis (no separate vision API) |

### Installation

```bash
npm install @google/genai
```

### Gemini Wrapper (`lib/ai/gemini.js`)

```javascript
// lib/ai/gemini.js
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate structured JSON response from Gemini
 * @param {string} prompt - User prompt
 * @param {string} systemInstruction - System context
 * @param {object} options - maxOutputTokens, temperature, model override
 * @returns {object} Parsed JSON response
 */
async function generateJSON(prompt, systemInstruction, options = {}) {
  const {
    maxOutputTokens = 2000,
    temperature = 0.7,
    model = 'gemini-2.5-flash'
  } = options;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      maxOutputTokens,
      temperature,
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    // Fallback: strip markdown fences if present
    const cleaned = response.text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

/**
 * Generate plain text response from Gemini (for reports, reminders)
 */
async function generateText(prompt, systemInstruction, options = {}) {
  const {
    maxOutputTokens = 500,
    temperature = 0.7,
    model = 'gemini-2.5-flash'
  } = options;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      maxOutputTokens,
      temperature,
    }
  });

  return response.text;
}

/**
 * Analyze image + generate creative brief (multimodal)
 */
async function analyzeImage(imageBase64, mimeType, prompt, systemInstruction) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { text: prompt },
      { inlineData: { data: imageBase64, mimeType } }
    ],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      maxOutputTokens: 1500,
      temperature: 0.8,
    }
  });

  return JSON.parse(response.text);
}

module.exports = { generateJSON, generateText, analyzeImage, ai };
```

### API Calls Per Feature

| Feature | Prompt Type | Max Tokens | Model | Frequency |
|---|---|---|---|---|
| Marketing Plan Builder | Complex structured JSON | 4000 | gemini-2.5-flash | Per plan (1-2/month/salon) |
| Campaign Copy | 3 copy variants + targeting | 2000 | gemini-2.5-flash | Per campaign (2-5/month) |
| Lead Qualification | Short conversational reply | 300 | gemini-2.5-flash | Per message (10-50/day) |
| Report Translation | Metrics → plain Hindi | 500 | gemini-2.5-flash-lite | Daily per salon |
| Creative Brief | Photo → ad suggestions (multimodal) | 1500 | gemini-2.5-flash | Per campaign |
| Re-booking Message | Personalised reminder | 200 | gemini-2.5-flash-lite | Per client reminder |

### Key Gemini Advantages for Noor

1. **`responseMimeType: 'application/json'`** — Forces valid JSON output. No more regex parsing, no ````json` fences to strip. This is critical for campaign builder and plan builder reliability.

2. **Native multimodal** — Salon owner uploads a phone photo → pass it directly to Gemini as `inlineData` → get creative brief back. No separate vision API call needed.

3. **Hindi is first-class** — Gemini supports Hindi, Hinglish, and 40+ Indian languages natively. Quality of Devanagari script generation is strong.

4. **Free tier for development** — 15 RPM free on Gemini 2.5 Flash. Enough for development and design partner phase without spending anything.

5. **Cost efficiency** — At $0.30/1M input + $2.50/1M output tokens, Gemini 2.5 Flash is significantly cheaper than alternatives for high-volume salon use cases.

### Prompt Library Location

All prompts live in `lib/ai/prompts/`:
- `plan-builder.js` — Marketing plan system prompt + output schema
- `campaign-copy.js` — Ad copy generation for Meta + WA + Instagram
- `lead-qualify.js` — Receptionist bot personality + qualification flow
- `report-translate.js` — Metrics → business outcomes in Hindi/English
- `creative-brief.js` — Photo analysis → creative recommendations (multimodal)

### Cost Estimate (Gemini API)

At ~500 salons with moderate usage:
- Plan generation: 500 × 2/month × ~5K tokens ≈ 5M tokens/month
- Campaign copy: 500 × 4/month × ~3K tokens ≈ 6M tokens/month
- Lead qualification: 500 × 30/month × ~500 tokens ≈ 7.5M tokens/month
- Reports: 500 × 30/month × ~700 tokens ≈ 10.5M tokens/month
- **Total: ~29M tokens/month**
- **Cost: ~$9 input + ~$36 output ≈ $45/month** (Gemini 2.5 Flash pricing)
- With Flash-Lite for simple tasks: **~$25-35/month total**

This is approximately 3x cheaper than equivalent Claude Sonnet usage.

---

## 10. Frontend Page Map

| Route | Component | Data Source | Key Interactions |
|---|---|---|---|
| `/` | Landing page | Static | Sign up CTA → `/login` |
| `/login` | WhatsApp OTP | Supabase Auth | Enter phone → OTP → redirect |
| `/onboarding` | 7-step wizard | Local state → POST /api/onboarding | Step-by-step, photo upload, Meta OAuth |
| `/dashboard` | Home | GET leads, campaigns, reports | Metric cards, shortcuts, plan progress |
| `/plan` | Marketing Plan Builder | POST /api/plan, GET plans | Wizard → AI generation → timeline preview |
| `/campaigns` | Campaign list | GET campaigns | Status badges, spend tracker |
| `/campaigns/new` | Campaign builder wizard | POST /api/campaign | Goal input → creative approval → launch |
| `/campaigns/[id]` | Campaign detail | GET campaign + leads | Live stats, leads, pause/resume |
| `/leads` | Lead inbox | GET /api/leads (realtime) | Chat-list, swipe gestures, score badges |
| `/reports` | Report cards | GET /api/reports | Daily cards, weekly summary, best performer |
| `/broadcasts` | Broadcast composer | POST /api/broadcast | Segment select, message editor, send |
| `/calendar` | Festival calendar | Static festivals.js + campaigns | Grid view, "Create Campaign" per festival |
| `/settings` | Account settings | GET/PUT salon | Language, budget cap, Meta reconnect, billing |

---

## 11. Build Order

### Day 1 — Foundation + Auth + Onboarding

| Time | Task | Gate |
|---|---|---|
| 09:00–10:00 | Next.js init, Tailwind + Noor Luxe tokens, netlify.toml, Supabase project, env vars, first deploy | Netlify live URL works |
| 10:00–11:00 | Supabase migration (all 7 tables + RLS), WhatsApp OTP auth | Login flow works E2E |
| 11:00–13:00 | Onboarding wizard (7 steps), save-onboarding.js function, Meta OAuth | Profile saves to DB |

### Day 2 — Marketing Plan Builder + Campaign Engine

| Time | Task | Gate |
|---|---|---|
| 09:00–11:30 | generate-plan.js function + Gemini prompts, PlanWizard UI, PlanPreview + PlanTimeline components | AI generates valid plan |
| 11:30–14:00 | create-campaign.js function, Meta API integration, campaign builder wizard UI | Real Meta campaign created |
| 14:00–15:30 | generate-creative.js function, copy variant approval UI | 3 copy variants shown |

### Day 3 — WhatsApp Bot + Reports + Broadcasts

| Time | Task | Gate |
|---|---|---|
| 09:00–11:30 | whatsapp-webhook.js, webhook registration, lead qualification bot, lead inbox UI | Bot replies to test message |
| 11:30–13:30 | daily-report.js scheduled function, report cards UI, budget-monitor.js | Report sent to test WA |
| 13:30–15:00 | send-broadcast.js, broadcast composer UI, segment builder | Broadcast delivered |

### Day 4 — Calendar + Re-Booking + Dashboard + Polish

| Time | Task | Gate |
|---|---|---|
| 09:00–10:30 | Festival calendar (40+ events), festival campaign templates | Calendar renders, "Create" works |
| 10:30–12:00 | rebooking-check.js, clients table population, reminder flow | Test reminder sent |
| 12:00–14:00 | Dashboard home (metrics + plan progress + shortcuts), bottom nav, PWA setup | Lighthouse PWA > 85 |
| 14:00–16:00 | Hindi QA pass, mobile testing (Redmi 9A), E2E user journey test, production deploy | Full journey works on mobile |

### Day 5 — Testing + Soft Launch

| Time | Task | Gate |
|---|---|---|
| 09:00–12:00 | Bug fixes from Day 4 testing, edge cases, error states | All critical paths work |
| 12:00–14:00 | PostHog + Sentry setup, funnel tracking, onboarding analytics | Analytics recording |
| 14:00–16:00 | Onboard 3 design partner salons, watch them use it, collect feedback | 3 salons onboarded |

---

## 12. Environment Variables

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Google Gemini AI
GEMINI_API_KEY=AIza...                   # From Google AI Studio (https://aistudio.google.com/apikey)

# Meta
META_APP_ID=1234567890
META_APP_SECRET=abc123...
META_REDIRECT_URI=https://getnoor.in/auth/meta/callback

# WhatsApp
WA_ACCESS_TOKEN=EAAxxxxxxx          # System user token for WA Cloud API
WA_PHONE_NUMBER_ID=1234567890       # Your WA business phone number ID
WA_BUSINESS_ACCOUNT_ID=9876543210
WA_VERIFY_TOKEN=noor_webhook_verify_2026  # Custom string for webhook verification

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Cashfree
CASHFREE_APP_ID=...
CASHFREE_SECRET_KEY=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
SENTRY_DSN=https://...@sentry.io/...

# App
NEXT_PUBLIC_APP_URL=https://getnoor.in
NODE_ENV=production
```

Set all env vars in Netlify dashboard → Site settings → Environment variables.

---

## 13. Deployment & CI/CD

### Automatic Deployment Pipeline

```
GitHub push (main branch)
  → Netlify Build (npm run build)
    → Next.js SSR pages generated
    → Netlify Functions bundled (esbuild)
    → PWA assets generated (next-pwa)
    → Deployed atomically to Netlify CDN
    → Old version serves until new one is healthy
    → Zero downtime. Always.
```

### Deployment Commands

```bash
# Local development
netlify dev                    # Runs Next.js + Functions locally

# Manual deploy (if needed)
netlify deploy --prod          # Deploy current build to production

# Check function logs
netlify functions:list         # List all deployed functions
netlify logs:function daily-report  # Tail logs for specific function
```

### Branch Deploys

Netlify auto-creates preview URLs for every PR:
- `feature/plan-builder` → `https://plan-builder--noor.netlify.app`
- Test without touching production

---

## 14. Testing Strategy

### Critical Path Tests (Manual E2E)

| # | Test | Expected Result |
|---|---|---|
| 1 | Phone OTP login on Android Chrome | Auth succeeds, redirects to onboarding |
| 2 | Complete 7-step onboarding | Salon record created in Supabase |
| 3 | Generate marketing plan | Valid 4-week plan with weekly actions |
| 4 | Launch campaign from plan action | Meta campaign created in PAUSED state |
| 5 | Approve campaign creative | Campaign activated on Meta |
| 6 | Receive WhatsApp message from ad click | Bot responds within 60 seconds |
| 7 | Bot qualifies lead through 3 questions | Lead scored hot, owner notified |
| 8 | Daily report at 9pm | WhatsApp message with correct spend + leads |
| 9 | Budget monitor catches overspend | Campaign auto-paused + owner alerted |
| 10 | Send broadcast to "lapsed" segment | Messages delivered to correct contacts |
| 11 | Festival calendar shows upcoming events | Navratri/Diwali visible with create button |
| 12 | Re-booking reminder sent | Client receives personalized WA message |
| 13 | PWA install on Android | App icon on home screen, offline cache works |
| 14 | Full journey on Redmi 9A (₹7K device) | FCP < 3s on 3G, all interactions responsive |

### Load Testing

- Netlify Functions: 125K invocations/month free → sufficient for 1K salons
- If >1K salons: upgrade to Netlify Pro ($19/month) → 2M invocations
- Supabase free tier: 500MB DB, 50K auth users → sufficient for MVP
- Gemini API: Free tier = 15 RPM; paid tier = 2000 RPM on 2.5 Flash → more than sufficient for 1K salons

---

## 15. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Meta app review takes >1 week | HIGH | Start with test users in dev mode. Submit review on Day 1 of building. Use Meta sandbox for all development. |
| WhatsApp template approval delayed | HIGH | Submit templates on Day 0. Use free-form text messages during design partner phase (only works within 24h window). |
| Gemini generates bad Hindi copy | HIGH | Fine-tune prompts with real salon data from design partners. Use `responseMimeType: 'application/json'` to guarantee structured output. Track approval rate per creative type. A/B test prompt strategies weekly. Target: 65% first-gen approval. Gemini's native Hindi support is strong — test with Tier 2/3 city dialects early. |
| Salon owner won't connect Meta OAuth | HIGH | Make Meta connection optional. Free tier (Chamak) works with WhatsApp broadcasts only — no Meta OAuth needed. Build trust first, then upsell ad buying. |
| Low-end Android performance | MED | SSR all pages. Lazy-load AI components. Target < 3s FCP on 3G. Test every sprint on Redmi 9A. |
| Netlify function cold starts | LOW | Functions boot in < 200ms with esbuild bundler. Keep functions small (< 50KB bundled). |
| Supabase free tier limits | LOW | 500MB DB + 50K users is sufficient for 1K+ salons. Upgrade to Pro ($25/month) when needed. |
| Meta policy changes block click-to-WA | MED | Build fallback: Lead Form ads + Website conversion as alternative objectives. Monitor Meta policy changelog weekly. |
| Owner doesn't check WhatsApp reports | LOW | Also show metrics on dashboard home. Add PWA push notification as backup. Weekly SMS summary for inactive users. |

---

## Summary: What Gets Built

| Feature | Priority | Function(s) | Table(s) |
|---|---|---|---|
| Onboarding (< 10 min) | P0 | save-onboarding | salons |
| Marketing Plan Builder | P0 | generate-plan | marketing_plans |
| Campaign Builder | P0 | create-campaign, generate-creative | campaigns |
| Lead Qualification Bot | P0 | whatsapp-webhook | leads |
| Daily ROI Reports | P0 | daily-report | reports |
| Budget Guardrails | P0 | budget-monitor | campaigns |
| WhatsApp Broadcasts | P1 | send-broadcast | broadcasts |
| Festival Calendar | P1 | — (static data) | — |
| Re-Booking Reminders | P2 | rebooking-check | clients |
| Dashboard + PWA | P0 | — (frontend only) | — |

**Total: 11 Netlify Functions · 7 Supabase Tables · 10 Frontend Pages · 6 Gemini Prompt Templates**

---

*Noor · نور · "Aaj yeh karo. Aise karo. Itna kharch karo. Itne customers aayenge."*
