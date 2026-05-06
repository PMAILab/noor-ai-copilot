import React, { useState } from 'react';
import { CheckCircle2, Zap, Clock, TrendingUp, MessageCircle, Instagram, Target } from 'lucide-react';
import type { MarketingPlan } from '../../lib/mockData';
import { formatCurrencyFull } from '../../lib/utils/currency';

interface PlanPreviewProps {
  plan: MarketingPlan;
  onActivate: () => void;
  isActivating?: boolean;
  goalLabel?: string;
}

const RECIPE_META: Record<string, { label: string; icon: string; effort: string; outcome: string }> = {
  weekday_filler: { label: 'Weekday Filler', icon: '📅', effort: 'Low', outcome: '15–25 extra bookings/month' },
  bridal_season: { label: 'Bridal Season', icon: '💍', effort: 'Medium', outcome: '5–10 bridal inquiries' },
  festival_offer: { label: 'Festival Campaign', icon: '🎊', effort: 'Low', outcome: '30–50% spike in inquiries' },
  win_back: { label: 'Win-Back', icon: '💌', effort: 'Very Low', outcome: 'Reactivate 10–20% lapsed clients' },
  new_service_launch: { label: 'New Service Launch', icon: '🚀', effort: 'Medium', outcome: '20+ first-time bookings' },
};

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  meta_ads: '#1877F2',
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle size={14} />,
  instagram: <Instagram size={14} />,
  meta_ads: <Target size={14} />,
};

export default function PlanPreview({ plan, onActivate, isActivating, goalLabel }: PlanPreviewProps) {
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null);
  const totalAdSpend = plan.budgetAllocation.meta_ads;
  const totalBudget = Object.values(plan.budgetAllocation).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Plan Summary Card */}
      <div className="bg-gradient-to-br from-primary/8 to-primary-container/20 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <Zap size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-label-sm text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                AI Generated Plan
              </span>
              {goalLabel && (
                <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
                  Goal: {goalLabel}
                </span>
              )}
            </div>
            <p className="font-body-md text-on-surface leading-relaxed font-hindi-text">
              {plan.planSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Actions', value: plan.actionsTotal.toString(), icon: <CheckCircle2 size={18} className="text-[#22C55E]" /> },
          { label: 'Duration', value: '4 Weeks', icon: <Clock size={18} className="text-primary" /> },
          { label: 'Ad Spend', value: formatCurrencyFull(totalAdSpend), icon: <TrendingUp size={18} className="text-[#C8922A]" /> },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant text-center">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="font-number-data text-[22px] font-bold text-on-surface">{stat.value}</p>
            <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Channel Split */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant">
        <h3 className="font-h3 text-[18px] text-on-surface mb-4">Channel Mix</h3>
        {/* Visual bar */}
        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {Object.entries(plan.channelSplit).map(([channel, pct]) => (
            <div
              key={channel}
              style={{ width: `${pct}%`, backgroundColor: CHANNEL_COLORS[channel] }}
              className="transition-all duration-700"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(plan.channelSplit).map(([channel, pct]) => (
            <div key={channel} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CHANNEL_COLORS[channel] }} />
              <span className="font-label-sm text-sm text-on-surface flex items-center gap-1.5">
                {CHANNEL_ICONS[channel]}
                {channel === 'whatsapp' ? 'WhatsApp' : channel === 'instagram' ? 'Instagram' : 'Meta Ads'}
              </span>
              <span className="font-number-data text-sm text-on-surface-variant">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Allocation */}
      {totalBudget > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant">
          <h3 className="font-h3 text-[18px] text-on-surface mb-4">Budget Breakdown</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(plan.budgetAllocation).map(([key, value]) => {
              const labels: Record<string, string> = {
                whatsapp_broadcasts: '💬 WhatsApp Broadcasts',
                instagram_content: '📸 Instagram Content',
                meta_ads: '🎯 Meta Ads',
                content_creation: '🎨 Content Creation',
              };
              const percentage = totalBudget > 0 ? (value / totalBudget) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between font-label-sm text-sm mb-1.5">
                    <span className="text-on-surface">{labels[key] || key}</span>
                    <span className="text-on-surface-variant font-number-data">
                      {value === 0 ? 'Free' : formatCurrencyFull(value)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(percentage, value === 0 ? 0 : 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Recipes */}
      {plan.recommendedRecipes.length > 0 && (
        <div>
          <h3 className="font-h3 text-[18px] text-on-surface mb-3">Ready-to-Launch Campaigns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.recommendedRecipes.map(recipeId => {
              const meta = RECIPE_META[recipeId];
              if (!meta) return null;
              return (
                <button
                  key={recipeId}
                  onClick={() => setActiveRecipe(activeRecipe === recipeId ? null : recipeId)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    activeRecipe === recipeId
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{meta.icon}</span>
                    <p className="font-label-sm text-on-surface">{meta.label}</p>
                    <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full ml-auto">
                      {meta.effort} effort
                    </span>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant">{meta.outcome}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activate CTA */}
      <div className="sticky bottom-0 bg-surface/80 backdrop-blur-md pt-4 pb-2 -mx-1 px-1">
        <button
          onClick={onActivate}
          disabled={isActivating}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-label-sm text-[16px] font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isActivating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Activating Plan...
            </>
          ) : (
            <>
              <Zap size={20} />
              Activate This Plan
            </>
          )}
        </button>
        <p className="text-center font-label-sm text-xs text-on-surface-variant mt-2">
          First week's actions will appear on your dashboard
        </p>
      </div>
    </div>
  );
}
