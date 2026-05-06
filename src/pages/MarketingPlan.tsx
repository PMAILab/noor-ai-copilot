import { useState, useCallback } from 'react';
import { Sparkles, LayoutList, Eye, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';
import PlanWizard from '../components/plan/PlanWizard';
import PlanPreview from '../components/plan/PlanPreview';
import PlanTimeline from '../components/plan/PlanTimeline';
import NoorAIBubble from '../components/shared/NoorAIBubble';
import { generateJSON, isGeminiConfigured } from '../lib/gemini';
import { PLAN_BUILDER_SYSTEM_PROMPT, buildPlanPrompt } from '../lib/prompts/planBuilder';
import { MOCK_PLAN, MOCK_SALON, type MarketingPlan } from '../lib/mockData';

type Stage = 'wizard' | 'generating' | 'preview' | 'timeline';

// Mock plan generator when Gemini isn't configured
async function generateMockPlan(params: {
  goal: string; goalLabel: string; monthlyBudget: number;
  upcomingOccasion: string; channels: string[];
}): Promise<MarketingPlan> {
  await new Promise(r => setTimeout(r, 2500)); // Simulate AI delay
  return {
    ...MOCK_PLAN,
    id: `plan-${Date.now()}`,
    goal: params.goalLabel,
    monthlyBudget: params.monthlyBudget,
    status: 'draft',
    actionsCompleted: 0,
    createdAt: new Date().toISOString(),
  };
}

export default function MarketingPlan() {
  const [stage, setStage] = useState<Stage>('wizard');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [wizardParams, setWizardParams] = useState<{
    goal: string; goalLabel: string; monthlyBudget: number;
    upcomingOccasion: string; channels: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'timeline'>('preview');
  const [isActivating, setIsActivating] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleGenerate = useCallback(async (params: typeof wizardParams) => {
    if (!params) return;
    setWizardParams(params);
    setIsLoading(true);
    setStage('generating');

    try {
      let generatedPlan: MarketingPlan;

      if (isGeminiConfigured()) {
        const prompt = buildPlanPrompt({
          salonName: MOCK_SALON.name,
          salonType: MOCK_SALON.type,
          city: MOCK_SALON.city,
          topServices: MOCK_SALON.topServices,
          targetCustomers: MOCK_SALON.targetCustomers,
          avgTicket: MOCK_SALON.avgTicket,
          hasMetaAds: MOCK_SALON.hasMetaConnected,
          goal: params.goalLabel,
          monthlyBudget: params.monthlyBudget,
          upcomingOccasion: params.upcomingOccasion,
          channels: params.channels,
        });

        const rawPlan = await generateJSON<{
          plan_summary: string;
          channel_split: { whatsapp: number; instagram: number; meta_ads: number };
          budget_allocation: { whatsapp_broadcasts: number; instagram_content: number; meta_ads: number; content_creation: number };
          recommended_recipes: string[];
          weekly_actions: MarketingPlan['weeklyActions'];
        }>(prompt, PLAN_BUILDER_SYSTEM_PROMPT, {
          maxOutputTokens: 4000,
          temperature: 0.7,
        });

        const totalActions = rawPlan.weekly_actions.reduce((sum, w) => sum + w.actions.length, 0);
        generatedPlan = {
          id: `plan-${Date.now()}`,
          goal: params.goalLabel,
          monthlyBudget: params.monthlyBudget,
          planSummary: rawPlan.plan_summary,
          channelSplit: rawPlan.channel_split,
          budgetAllocation: rawPlan.budget_allocation,
          recommendedRecipes: rawPlan.recommended_recipes,
          weeklyActions: rawPlan.weekly_actions,
          status: 'draft',
          actionsCompleted: 0,
          actionsTotal: totalActions,
          createdAt: new Date().toISOString(),
        };
      } else {
        generatedPlan = await generateMockPlan(params);
      }

      setPlan(generatedPlan);
      setStage('preview');
    } catch (err) {
      console.error('Plan generation error:', err);
      // Fallback to mock on error
      const fallback = await generateMockPlan(params);
      setPlan(fallback);
      setStage('preview');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleActivate = async () => {
    if (!plan) return;
    setIsActivating(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlan(prev => prev ? { ...prev, status: 'active' } : prev);
    setIsActive(true);
    setIsActivating(false);
    setActiveTab('timeline');
  };

  const handleActionComplete = (weekIdx: number, actionIdx: number) => {
    setPlan(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.weeklyActions = [...prev.weeklyActions];
      updated.weeklyActions[weekIdx] = { ...prev.weeklyActions[weekIdx] };
      updated.weeklyActions[weekIdx].actions = [...prev.weeklyActions[weekIdx].actions];
      const wasCompleted = updated.weeklyActions[weekIdx].actions[actionIdx].completed;
      updated.weeklyActions[weekIdx].actions[actionIdx] = {
        ...updated.weeklyActions[weekIdx].actions[actionIdx],
        completed: !wasCompleted,
      };
      updated.actionsCompleted = updated.weeklyActions
        .flatMap(w => w.actions)
        .filter(a => a.completed).length;
      return updated;
    });
  };

  return (
    <div className="p-margin-page max-w-7xl mx-auto w-full">

      {/* ── STAGE: WIZARD ── */}
      {stage === 'wizard' && (
        <div>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="font-label-sm text-sm text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                AI Marketing Planner
              </span>
            </div>
            <h1 className="font-h1 text-[42px] text-on-surface mb-3 leading-tight">
              Apna marketing plan<br />
              <span className="text-primary">banao minutes mein</span>
            </h1>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-xl">
              4 simple sawaal — aur Noor banayega aapka complete 4-week marketing strategy. WhatsApp, Instagram, Meta Ads — sab kuch.
            </p>
          </div>
          <PlanWizard
            onGenerate={handleGenerate}
            isLoading={isLoading}
            defaultBudget={MOCK_SALON.budgetTier}
          />
        </div>
      )}

      {/* ── STAGE: GENERATING ── */}
      {stage === 'generating' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-container rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles size={48} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping" />
          </div>
          <div className="text-center">
            <h2 className="font-h2 text-[28px] text-on-surface mb-3">Noor plan bana raha hai...</h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              Aapke salon profile aur goal ko analyze karke<br />4-week strategy generate ho rahi hai
            </p>
            <NoorAIBubble message="Market trends + festival calendar + aapka budget — sab dekh raha hoon..." />
          </div>
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            {['Salon profile analyze kar raha hoon', 'Festival calendar check kar raha hoon', 'Best channels select kar raha hoon', 'Daily actions plan kar raha hoon'].map((msg, i) => (
              <div key={i} className="flex items-center gap-3 w-full" style={{ animationDelay: `${i * 600}ms` }}>
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
                <span className="font-body-md text-sm text-on-surface-variant">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STAGE: PREVIEW / TIMELINE ── */}
      {(stage === 'preview' || stage === 'timeline') && plan && (
        <div>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-label-sm text-xs px-3 py-1 rounded-full ${
                  isActive ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isActive ? '✓ Active Plan' : 'Draft Plan'}
                </span>
                <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                  Goal: {plan.goal}
                </span>
              </div>
              <h1 className="font-h1 text-[36px] text-on-surface">4-Week Marketing Plan</h1>
              {isActive && plan.actionsTotal > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-48 h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${(plan.actionsCompleted / plan.actionsTotal) * 100}%` }}
                    />
                  </div>
                  <span className="font-label-sm text-sm text-on-surface-variant">
                    {plan.actionsCompleted}/{plan.actionsTotal} actions done
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setPlan(null); setStage('wizard'); setIsActive(false); }}
                className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant text-on-surface rounded-full font-label-sm text-sm hover:bg-surface-container transition-colors"
              >
                <RefreshCw size={16} /> New Plan
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-surface-container rounded-xl mb-6 w-fit">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-sm text-sm transition-all ${
                activeTab === 'preview'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Eye size={16} /> Plan Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-label-sm text-sm transition-all ${
                activeTab === 'timeline'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutList size={16} /> Week-by-Week Actions
              {plan.actionsCompleted > 0 && (
                <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{plan.actionsCompleted}</span>
              )}
            </button>
          </div>

          {/* Tab content */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className={activeTab === 'preview' ? 'lg:col-span-7' : 'lg:col-span-12'}>
              {activeTab === 'preview' ? (
                <PlanPreview
                  plan={plan}
                  onActivate={handleActivate}
                  isActivating={isActivating}
                  goalLabel={wizardParams?.goalLabel}
                />
              ) : (
                <div>
                  {isActive && (
                    <div className="flex items-center gap-3 p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl mb-6">
                      <CheckCircle2 size={20} className="text-[#22C55E]" />
                      <div>
                        <p className="font-label-sm text-sm text-on-surface">Plan is active! Tick off each action as you complete it.</p>
                        <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Tap "Do it now" to open the campaign builder or broadcast composer.</p>
                      </div>
                    </div>
                  )}
                  <PlanTimeline plan={plan} onActionComplete={handleActionComplete} />
                </div>
              )}
            </div>

            {/* Right sidebar — quick stats */}
            {activeTab === 'preview' && (
              <div className="lg:col-span-5 mt-6 lg:mt-0 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-primary" />
                    <h3 className="font-h3 text-[16px] text-on-surface">Expected Outcomes</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Est. Enquiries', value: '40–80', unit: 'this month' },
                      { label: 'Est. Bookings', value: '12–25', unit: 'conversions' },
                      { label: 'Cost per Lead', value: '₹38–₹75', unit: 'avg estimated' },
                      { label: 'WhatsApp Reach', value: '400+', unit: 'contacts' },
                    ].map(stat => (
                      <div key={stat.label} className="flex justify-between items-center py-2 border-b border-outline-variant last:border-0">
                        <span className="font-label-sm text-sm text-on-surface-variant">{stat.label}</span>
                        <div className="text-right">
                          <p className="font-number-data text-sm font-bold text-on-surface">{stat.value}</p>
                          <p className="font-label-sm text-xs text-on-surface-variant">{stat.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!isGeminiConfigured() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="font-label-sm text-sm text-amber-800 font-bold mb-1">Demo Mode</p>
                    <p className="font-body-md text-xs text-amber-700">
                      Add <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY</code> to your .env file to generate real AI plans with Gemini 2.5 Flash.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
