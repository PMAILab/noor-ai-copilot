import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pause, Play, Edit2, TrendingUp, Flame, Target, CheckCircle2,
  Sparkles, BarChart2, Loader2
} from 'lucide-react';
import { formatCurrencyFull } from '../lib/utils/currency';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft' | 'pending_meta' | 'pending_approval' | 'failed';

interface CampaignRow {
  id: string;
  goal_text: string;
  recipe_type: string;
  status: CampaignStatus;
  daily_budget_inr: number;
  total_budget_inr: number;
  total_spent_inr: number;
  enquiry_count: number;
  hot_lead_count: number;
  booking_count: number;
  cost_per_lead: number | null;
  launched_at: string | null;
  meta_campaign_id: string | null;
  ad_image_url: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active:           { label: 'Live',             color: 'bg-[#22C55E]/15 text-[#22C55E]',    dot: 'bg-[#22C55E]' },
  paused:           { label: 'Paused',            color: 'bg-amber-100 text-amber-700',        dot: 'bg-amber-500' },
  completed:        { label: 'Completed',         color: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline' },
  draft:            { label: 'Draft',             color: 'bg-blue-50 text-blue-600',           dot: 'bg-blue-400' },
  pending_meta:     { label: 'Pending Setup',     color: 'bg-purple-50 text-purple-700',       dot: 'bg-purple-400' },
  pending_approval: { label: 'Pending Approval',  color: 'bg-purple-50 text-purple-700',       dot: 'bg-purple-400' },
  failed:           { label: 'Failed',            color: 'bg-red-50 text-red-600',             dot: 'bg-red-500' },
};

const RECIPE_LABELS: Record<string, string> = {
  festival_offer: 'Festival Offer', weekday_filler: 'Weekday Filler',
  win_back: 'Win-Back', bridal_season: 'Bridal Season',
  new_service: 'New Service', custom: 'Custom',
};

function CampaignCard({ campaign }: { campaign: CampaignRow }) {
  const status = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.draft;
  const spendPercent = campaign.total_budget_inr > 0
    ? Math.min(100, (campaign.total_spent_inr / campaign.total_budget_inr) * 100) : 0;
  const launchDate = campaign.launched_at
    ? new Date(campaign.launched_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden hover:shadow-md transition-all">
      {campaign.status === 'active' && <div className="h-1 bg-gradient-to-r from-primary to-primary-container" />}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1.5 font-label-sm text-xs px-2.5 py-1 rounded-full ${status.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${campaign.status === 'active' ? 'animate-pulse' : ''}`} />
                {status.label}
              </span>
              <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                {RECIPE_LABELS[campaign.recipe_type] || campaign.recipe_type}
              </span>
            </div>
            <h3 className="font-h3 text-[17px] text-on-surface leading-snug pr-4 truncate" title={campaign.goal_text}>
              {campaign.goal_text}
            </h3>
            {launchDate && <p className="font-label-sm text-xs text-on-surface-variant mt-1">Launched {launchDate}</p>}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {campaign.status === 'active' && (
              <button className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors" title="Pause">
                <Pause size={15} />
              </button>
            )}
            {campaign.status === 'paused' && (
              <button className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors" title="Resume">
                <Play size={15} />
              </button>
            )}
            <button className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors" title="Edit">
              <Edit2 size={15} />
            </button>
          </div>
        </div>

        {campaign.ad_image_url && (
          <div className="mb-4 rounded-xl overflow-hidden h-32">
            <img src={campaign.ad_image_url} alt="Ad creative" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between font-label-sm text-xs text-on-surface-variant mb-1.5">
            <span>Spend: {formatCurrencyFull(campaign.total_spent_inr)} / {formatCurrencyFull(campaign.total_budget_inr)}</span>
            <span>{Math.round(spendPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${spendPercent >= 90 ? 'bg-red-400' : spendPercent >= 70 ? 'bg-amber-400' : 'bg-primary'}`}
              style={{ width: `${spendPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-px bg-outline-variant rounded-xl overflow-hidden">
          {[
            { icon: <Target size={13} />, label: 'Enquiries', value: campaign.enquiry_count, color: 'text-primary' },
            { icon: <Flame size={13} />, label: 'Hot Leads', value: campaign.hot_lead_count, color: 'text-red-500' },
            { icon: <CheckCircle2 size={13} />, label: 'Bookings', value: campaign.booking_count, color: campaign.booking_count > 0 ? 'text-[#22C55E]' : 'text-on-surface-variant' },
            { icon: <TrendingUp size={13} />, label: '₹/Lead', value: campaign.cost_per_lead ? `₹${campaign.cost_per_lead}` : '—', color: 'text-on-surface' },
          ].map(m => (
            <div key={m.label} className="bg-surface-container-lowest p-3 text-center">
              <div className={`flex items-center justify-center gap-1 mb-1 ${m.color}`}>{m.icon}</div>
              <p className={`font-number-data text-[18px] font-bold ${m.color}`}>{m.value}</p>
              <p className="font-label-sm text-[10px] text-on-surface-variant">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | CampaignStatus>('all');
  const [allCampaigns, setAllCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !user?.id) { setLoading(false); return; }

    (sb.from as any)('campaigns')
      .select('*')
      .eq('salon_id', user.id)
      .order('launched_at', { ascending: false })
      .then(({ data, error }: { data: any; error: any }) => {
        if (!error && data) setAllCampaigns(data as CampaignRow[]);
        setLoading(false);
      });
  }, [user?.id]);

  const campaigns = filter === 'all' ? allCampaigns : allCampaigns.filter(c => c.status === filter);
  const totalSpend = allCampaigns.reduce((s, c) => s + (c.total_spent_inr || 0), 0);
  const totalLeads = allCampaigns.reduce((s, c) => s + (c.enquiry_count || 0), 0);
  const totalBookings = allCampaigns.reduce((s, c) => s + (c.booking_count || 0), 0);
  const activeCampaigns = allCampaigns.filter(c => c.status === 'active').length;

  return (
    <div className="p-margin-page max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-8">
        <div>
          <h1 className="font-h1 text-[42px] text-on-surface mb-2">Campaigns</h1>
          <p className="font-body-lg text-[18px] text-on-surface-variant">
            Meta Ads campaigns managed by Noor — launch, monitor, and optimise.
          </p>
        </div>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-label-sm text-sm font-bold hover:bg-primary/90 transition-all shadow-lg flex-shrink-0"
        >
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Spend', value: formatCurrencyFull(totalSpend), icon: <BarChart2 size={18} className="text-primary" />, bg: 'bg-primary/5 border-primary/20' },
          { label: 'Active Campaigns', value: `${activeCampaigns}`, icon: <Sparkles size={18} className="text-[#22C55E]" />, bg: 'bg-[#22C55E]/5 border-[#22C55E]/20' },
          { label: 'Total Enquiries', value: `${totalLeads}`, icon: <Target size={18} className="text-[#C8922A]" />, bg: 'bg-[#C8922A]/5 border-[#C8922A]/20' },
          { label: 'Total Bookings', value: `${totalBookings}`, icon: <CheckCircle2 size={18} className="text-primary" />, bg: 'bg-primary/5 border-primary/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <div className="mb-2">{s.icon}</div>
            <p className="font-number-data text-[28px] font-bold text-on-surface">{s.value}</p>
            <p className="font-label-sm text-xs text-on-surface-variant mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: '🟢 Live' },
          { id: 'paused', label: '⏸ Paused' },
          { id: 'completed', label: '✓ Completed' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-full font-label-sm text-sm transition-all ${
              filter === f.id ? 'bg-primary text-white shadow-sm' : 'border border-outline-variant text-on-surface-variant hover:border-primary/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <Loader2 size={32} className="animate-spin mr-3" />
          <span className="font-body-md">Loading campaigns...</span>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {campaigns.map(c => <div key={c.id}><CampaignCard campaign={c} /></div>)}
        </div>
      ) : (
        <div className="text-center py-20 text-on-surface-variant">
          <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-h3 text-[18px] mb-2">No campaigns yet</p>
          <p className="font-body-md text-sm mb-6">Launch your first campaign and Noor will manage the rest.</p>
          <button onClick={() => navigate('/campaigns/new')} className="px-6 py-3 bg-primary text-white rounded-xl font-label-sm text-sm hover:bg-primary/90 transition-colors">
            <Plus size={16} className="inline mr-2" /> New Campaign
          </button>
        </div>
      )}

      {activeCampaigns > 0 && (
        <div className="mt-8 bg-gradient-to-r from-primary/8 to-primary-container/15 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="font-label-sm text-sm text-primary font-bold mb-1">Noor Suggestion</p>
            <p className="font-body-md text-sm text-on-surface">
              Your active campaigns are running. Consider A/B testing a second ad variant to reduce your cost per lead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
