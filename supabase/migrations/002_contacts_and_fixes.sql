-- ============================================================
-- NOOR AI COPILOT — Migration 002: Contacts + Schema Fixes
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- ============================================================

-- ── FIX: Make wa_number optional (email-auth users have no phone) ────────────
ALTER TABLE salons ALTER COLUMN wa_number SET DEFAULT '';
ALTER TABLE salons ALTER COLUMN wa_number DROP NOT NULL;

-- ── TABLE: contacts (salon's client address book for broadcasts) ─────────────
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  wa_number TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  last_messaged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(salon_id, wa_number)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS contacts_salon_id_idx ON contacts(salon_id);
CREATE INDEX IF NOT EXISTS contacts_wa_number_idx ON contacts(wa_number);

-- RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contacts_owner" ON contacts;
CREATE POLICY "contacts_owner" ON contacts
  FOR ALL USING (auth.uid() = salon_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contacts_updated_at ON contacts;
CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_contacts_updated_at();

-- ── FIX campaigns: ensure salon_id uses auth.users UUID ─────────────────────
-- (No changes needed if campaigns.salon_id already stores user.id)

-- ── VERIFY: Check RLS on campaigns ──────────────────────────────────────────
DROP POLICY IF EXISTS "campaigns_owner" ON campaigns;
CREATE POLICY "campaigns_owner" ON campaigns
  FOR ALL USING (auth.uid() = salon_id);

-- ── VERIFY: Check RLS on leads ───────────────────────────────────────────────
-- Leads are created by the webhook (service role), viewable by salon owner
DROP POLICY IF EXISTS "leads_salon_view" ON leads;
CREATE POLICY "leads_salon_view" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns c
      WHERE c.id = leads.campaign_id
      AND c.salon_id = auth.uid()
    )
  );

-- ── VERIFY: broadcasts RLS ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "broadcasts_owner" ON broadcasts;
CREATE POLICY "broadcasts_owner" ON broadcasts
  FOR ALL USING (auth.uid() = salon_id);
