import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles, ChevronRight, Check, Target, Zap, Heart,
  ImageIcon, RefreshCw, ExternalLink, Loader2, AlertCircle
} from 'lucide-react';
import NoorAIBubble from '../components/shared/NoorAIBubble';
import { generateJSON, isGeminiConfigured } from '../lib/gemini';
import { CAMPAIGN_COPY_SYSTEM_PROMPT, buildCampaignCopyPrompt } from '../lib/prompts/campaignCopy';
import { type CopyVariant } from '../lib/mockData';
import { generateAdImages, getPlaceholderImage, isImageGenConfigured } from '../lib/imageGen';
import { createMetaCampaign } from '../lib/metaAds';
import { insertCampaign, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Stage = 'input' | 'generating' | 'generating_images' | 'select_copy' | 'launching' | 'launched';

interface CopyResult {
  headline: string;
  copies: CopyVariant[];
  targeting_summary: string;
  expected_reach: string;
  expected_leads: string;
}

const MOCK_COPIES: CopyResult = {
  headline: 'Salon Special Offer This Week!',
  targeting_summary: 'Women aged 22–45 within 5km of your salon in Jaipur',
  expected_reach: '8,000–15,000',
  expected_leads: '20–40',
  copies: [
    {
      variant: 1, style: 'Urgency', platform: 'meta_ads', emoji_hook: '🔥',
      headline: 'Sirf 3 slots bacha hain!',
      body: 'Is week ka special offer abhi book karo — facial + hair wash sirf ₹599 mein. Limited slots available! Jaipur mein best salon experience.',
      cta: 'Abhi Book Karo',
      wa_prefill: 'Hi! Mujhe is week ka facial + hair wash offer book karna hai.',
    },
    {
      variant: 2, style: 'Value', platform: 'whatsapp', emoji_hook: '✨',
      headline: 'Sasta, Sundar, Satisfying!',
      body: 'Ananya Beauty Studio mein aao aur apni skin ko pamper karo. Facial + hair wash = ₹599 only. Jaipur ki best quality service, aapke budget mein.',
      cta: 'WhatsApp pe Book Karo',
      wa_prefill: 'Namaste! Main offer ke baare mein jaanna chahti hoon.',
    },
    {
      variant: 3, style: 'Emotional', platform: 'instagram', emoji_hook: '💖',
      headline: 'Khud ko special feel karao ✨',
      body: 'Aap din-raat sab ke liye karti hain — ab apne liye bhi waqt nikalo. Ek relaxing facial + fresh hair wash = naya josh, naya confidence! 💆‍♀️',
      cta: 'Book Your Me-Time',
      wa_prefill: 'Hello! Book karna chahti hoon facial appointment.',
    },
  ],
};

const STYLE_ICONS: Record<string, React.ReactNode> = {
  Urgency: <Zap size={16} className="text-red-500" />,
  Value: <Target size={16} className="text-blue-500" />,
  Emotional: <Heart size={16} className="text-pink-500" />,
};

const STYLE_GRADIENT: Record<string, string> = {
  Urgency: 'from-red-500/20 to-orange-500/20',
  Value: 'from-blue-500/20 to-purple-500/20',
  Emotional: 'from-pink-500/20 to-rose-500/20',
};


export default function CampaignBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { salon, user } = useAuth();
  const prefill = (location.state as { prefill?: string; goal?: string; occasion?: string })?.prefill || '';
  const prefillGoal = (location.state as { goal?: string })?.goal || '';

  const salonName = salon?.salon_name || 'My Salon';
  const salonCity = salon?.city || 'India';
  const salonServices = salon?.top_services || [];
  const salonId = user?.id || salon?.id || '';

  const [stage, setStage] = useState<Stage>('input');
  const [goalText, setGoalText] = useState(prefillGoal || prefill);
  const [budget, setBudget] = useState(300);
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const [adImages, setAdImages] = useState<(string | null)[]>([null, null, null]);
  const [loadingImages, setLoadingImages] = useState<boolean[]>([false, false, false]);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [launchResult, setLaunchResult] = useState<{ status: string; campaign_id?: string | null } | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // ── Generate Copies ──────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!goalText.trim()) return;
    setStage('generating');
    setGenError(null);

    let result: CopyResult;
    try {
      if (!isGeminiConfigured()) throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env');
      const prompt = buildCampaignCopyPrompt({
        goal: goalText,
        salonName,
        salonType: salon?.salon_type || 'beauty_salon',
        city: salonCity,
        services: salonServices,
        budget,
      });
      result = await generateJSON<CopyResult>(prompt, CAMPAIGN_COPY_SYSTEM_PROMPT, {
        maxOutputTokens: 2000,
        temperature: 0.85,
      });
    } catch (err: any) {
      setGenError(err?.message || 'Failed to generate. Check your Gemini API key.');
      setStage('input');
      return;
    }

    setCopyResult(result);

    // ── Generate Images ──────────────────────────────────────────────────
    setStage('generating_images');
    setAdImages([null, null, null]);
    setLoadingImages([true, true, true]);

    if (isImageGenConfigured()) {
      try {
        const imagePromises = result.copies.map((copy, i) =>
          generateAdImages(
            [{ style: copy.style, headline: copy.headline }],
            { salonName, city: salonCity, services: salonServices }
          ).then(([img]) => {
            setAdImages(prev => { const n = [...prev]; n[i] = img; return n; });
            setLoadingImages(prev => { const n = [...prev]; n[i] = false; return n; });
            return img;
          })
        );
        await Promise.all(imagePromises);
      } catch {
        setLoadingImages([false, false, false]);
      }
    } else {
      setLoadingImages([false, false, false]);
    }

    setStage('select_copy');
  };

  // ── Regenerate single image ──────────────────────────────────────────────
  const regenerateImage = useCallback(async (index: number) => {
    if (!copyResult) return;
    const copy = copyResult.copies[index];
    setLoadingImages(prev => { const n = [...prev]; n[index] = true; return n; });
    const [img] = await generateAdImages(
      [{ style: copy.style, headline: copy.headline }],
      { salonName, city: salonCity, services: salonServices }
    );
    setAdImages(prev => { const n = [...prev]; n[index] = img; return n; });
    setLoadingImages(prev => { const n = [...prev]; n[index] = false; return n; });
  }, [copyResult, salonName, salonCity, salonServices]);

  // ── Launch Campaign ──────────────────────────────────────────────────────
  const handleLaunch = async () => {
    if (!selectedVariant || !copyResult) return;
    setStage('launching');

    const copy = copyResult.copies[selectedVariant - 1];
    const imageUrl = adImages[selectedVariant - 1];

    try {
      const metaResult = await createMetaCampaign({
        goalText,
        dailyBudgetInr: budget,
        copyBody: copy.body,
        copyHeadline: copy.headline,
        adImageUrl: imageUrl || undefined,
      });

      if (isSupabaseConfigured() && salonId) {
        await insertCampaign({
          salon_id: salonId,
          plan_id: null,
          goal_text: goalText,
          recipe_type: 'custom',
          meta_campaign_id: metaResult.campaign_id || null,
          meta_adset_id: metaResult.adset_id || null,
          meta_ad_id: metaResult.ad_id || null,
          daily_budget_inr: budget,
          total_budget_inr: budget * 30,
          total_spent_inr: 0,
          radius_km: 5,
          target_age_min: 18,
          target_age_max: 55,
          target_gender: 'all',
          copy_variants: copyResult.copies,
          selected_copy_index: selectedVariant - 1,
          creative_url: null,
          ad_image_url: imageUrl || null,
          status: metaResult.status,
          paused_reason: null,
          enquiry_count: 0,
          hot_lead_count: 0,
          booking_count: 0,
          cost_per_lead: null,
          launched_at: new Date().toISOString(),
        });
      }

      setLaunchResult({ status: metaResult.status, campaign_id: metaResult.campaign_id });
    } catch (err) {
      console.error('Launch error:', err);
      setLaunchResult({ status: 'pending_meta' });
    }

    setStage('launched');
  };

  return (
    <div className="p-margin-page max-w-3xl mx-auto w-full">

      {/* ── INPUT ── */}
      {stage === 'input' && (
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="font-label-sm text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">AI Campaign Builder</span>
            </div>
            <h1 className="font-h1 text-[38px] text-on-surface mb-3">
              Apna campaign goal<br />
              <span className="text-primary">Hindi mein batao</span>
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              Noor AI 3 ready-to-use ad copies + visuals generate karega — bas ek approve karo aur launch!
            </p>
          </div>

          {genError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="font-label-sm text-xs text-red-600">{genError}</p>
            </div>
          )}

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 mb-5">
            <label className="font-label-sm text-sm text-on-surface-variant block mb-3">
              Is campaign ka goal kya hai? (Hindi ya English mein likho)
            </label>
            <textarea
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              rows={4}
              className="w-full border border-outline-variant rounded-xl px-4 py-3 font-hindi-text text-[16px] text-on-surface bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none mb-3"
              placeholder="Example: Is Diwali pe facial + makeup special offer launch karna hai. Budget ₹500/day. Jaipur ki working women ko target karna hai..."
            />
            <div className="flex flex-wrap gap-2">
              {['Diwali pe bridal bookings badhao', 'Weekday slots fill karo — 30% off offer', 'Win back lapsed clients — special message', 'New hair colour service launch karo'].map(s => (
                <button key={s} onClick={() => setGoalText(s)} className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full hover:border-primary/40 hover:text-primary border border-outline-variant transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 mb-6">
            <label className="font-label-sm text-sm text-on-surface-variant block mb-4">
              Daily budget (Meta Ads):
            </label>
            <div className="flex items-center gap-4">
              <span className="font-number-data text-[32px] text-primary font-bold">₹{budget}</span>
              <span className="font-body-md text-sm text-on-surface-variant">/day</span>
            </div>
            <input
              type="range" min={100} max={2000} step={100} value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-primary mt-3 h-2 rounded-full"
            />
            <div className="flex justify-between font-label-sm text-xs text-on-surface-variant mt-2">
              <span>₹100</span><span>₹1,000</span><span>₹2,000</span>
            </div>
            <p className="font-label-sm text-xs text-on-surface-variant mt-3 bg-surface-container rounded-lg px-3 py-2">
              💡 ₹{budget * 30}/month total · Est. {Math.round(budget * 30 / 65)}–{Math.round(budget * 30 / 40)} leads at ₹40–65/lead
            </p>
          </div>

          {isImageGenConfigured() && (
            <div className="flex items-center gap-2 mb-5 bg-primary/5 rounded-xl px-4 py-3 border border-primary/20">
              <ImageIcon size={16} className="text-primary" />
              <p className="font-label-sm text-xs text-primary">
                ✨ AI will generate a unique visual ad for each copy variant using Gemini Imagen 3
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!goalText.trim()}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-label-sm text-[16px] font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
          >
            <Sparkles size={20} /> Generate 3 Ad Copy + Visuals <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── GENERATING COPIES ── */}
      {stage === 'generating' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-container rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles size={40} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-h2 text-[26px] text-on-surface mb-3">3 ad copies ban rahi hain...</h2>
            <NoorAIBubble message="Aapke goal ke liye best copy style choose kar raha hoon..." />
          </div>
        </div>
      )}

      {/* ── GENERATING IMAGES ── */}
      {stage === 'generating_images' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <ImageIcon size={40} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="font-h2 text-[26px] text-on-surface mb-3">Ad visuals generate ho rahi hain...</h2>
            <NoorAIBubble message="Gemini Imagen 3 se har variant ke liye unique ad creative ban rahi hai..." />
            <div className="flex gap-3 mt-6 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-20 h-20 rounded-xl bg-gradient-to-br ${['from-red-400 to-orange-400', 'from-blue-400 to-purple-400', 'from-pink-400 to-rose-400'][i]} animate-pulse flex items-center justify-center`}>
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SELECT COPY ── */}
      {stage === 'select_copy' && copyResult && (
        <div>
          <div className="mb-6">
            <h1 className="font-h1 text-[32px] text-on-surface mb-2">3 Ad Variants Ready! 🎨</h1>
            <p className="font-body-md text-on-surface-variant">
              {copyResult.targeting_summary} · Reach: {copyResult.expected_reach} · Est. leads: {copyResult.expected_leads}
            </p>
          </div>

          <div className="flex flex-col gap-5 mb-6">
            {copyResult.copies.map((copy, i) => (
              <div
                key={copy.variant}
                onClick={() => setSelectedVariant(copy.variant)}
                className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                  selectedVariant === copy.variant
                    ? 'border-primary shadow-lg'
                    : 'border-outline-variant'
                }`}
              >
                {/* ── Ad Image ── */}
                <div className="relative w-full aspect-square bg-surface-container overflow-hidden">
                  {loadingImages[i] ? (
                    <div className={`w-full h-full bg-gradient-to-br ${STYLE_GRADIENT[copy.style]} flex flex-col items-center justify-center gap-3`}>
                      <Loader2 size={32} className="text-primary animate-spin" />
                      <p className="font-label-sm text-xs text-on-surface-variant">Generating visual...</p>
                    </div>
                  ) : adImages[i] ? (
                    <img
                      src={adImages[i]!}
                      alt={`${copy.style} ad creative`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${STYLE_GRADIENT[copy.style]} flex flex-col items-center justify-center gap-2`}>
                      <span className="text-5xl">{copy.emoji_hook}</span>
                      <p className="font-label-sm text-xs text-on-surface-variant">No image generated</p>
                    </div>
                  )}
                  {/* Overlay: style badge + regenerate */}
                  <div className="absolute top-2 left-2 flex items-center gap-2">
                    <span className="font-label-sm text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {copy.emoji_hook} {copy.style}
                    </span>
                  </div>
                  {isImageGenConfigured() && (
                    <button
                      onClick={e => { e.stopPropagation(); regenerateImage(i); }}
                      disabled={loadingImages[i]}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-50"
                      title="Regenerate image"
                    >
                      <RefreshCw size={14} className="text-white" />
                    </button>
                  )}
                  {/* Selection indicator */}
                  <div className="absolute bottom-2 right-2">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg ${
                      selectedVariant === copy.variant ? 'bg-primary border-primary' : 'bg-white/80 border-outline-variant'
                    }`}>
                      {selectedVariant === copy.variant && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </div>

                {/* ── Copy content ── */}
                <div className={`p-5 bg-surface-container-lowest ${selectedVariant === copy.variant ? 'bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {STYLE_ICONS[copy.style]}
                    <span className="font-label-sm text-sm text-on-surface font-bold">Variant {copy.variant}: {copy.style}</span>
                    <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full capitalize ml-auto">
                      {copy.platform.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-h3 text-[18px] text-on-surface mb-2">{copy.headline}</p>
                  <p className="font-hindi-text text-sm text-on-surface-variant leading-relaxed mb-3">{copy.body}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-label-sm text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                      CTA: {copy.cta}
                    </span>
                    <span className="font-label-sm text-xs text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-full">
                      💬 WA Pre-fill Ready
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setStage('input'); setSelectedVariant(null); setAdImages([null, null, null]); }}
              className="px-5 py-3 border border-outline-variant rounded-xl font-label-sm text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              ← Regenerate
            </button>
            <button
              onClick={handleLaunch}
              disabled={!selectedVariant}
              className="flex-1 py-3.5 bg-primary text-white rounded-xl font-label-sm text-[15px] font-bold hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg"
            >
              🚀 Launch Campaign {selectedVariant ? `(Variant ${selectedVariant})` : ''}
            </button>
          </div>
        </div>
      )}

      {/* ── LAUNCHING ── */}
      {stage === 'launching' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-container rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
            <Loader2 size={40} className="text-white animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="font-h2 text-[26px] text-on-surface mb-3">Campaign launch ho rahi hai...</h2>
            <NoorAIBubble message="Meta pe campaign set kar raha hoon, database mein save kar raha hoon..." />
          </div>
        </div>
      )}

      {/* ── LAUNCHED ── */}
      {stage === 'launched' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl">
            <Check size={40} className="text-white" />
          </div>
          <div>
            <h2 className="font-h1 text-[32px] text-on-surface mb-3">Campaign Launch Ho Gayi! 🎉</h2>
            <p className="font-body-lg text-on-surface-variant max-w-sm mx-auto">
              {launchResult?.status === 'pending_meta'
                ? 'Campaign saved. Meta Ads account connect karo Settings mein to launch karo.'
                : 'Noor ne campaign Meta pe set kar diya hai. Leads 1–2 ghante mein aane shuru honge.'}
            </p>
          </div>
          <div className="bg-surface-container rounded-2xl p-5 text-left w-full max-w-sm">
            <div className="flex flex-col gap-3">
              {[
                { icon: '🎯', label: 'Campaign Status', value: launchResult?.status === 'pending_meta' ? 'Saved — Awaiting Meta Connection' : 'Live on Meta (pending review)' },
                { icon: '💰', label: 'Daily Budget', value: `₹${budget}/day` },
                { icon: '🔔', label: 'Lead Alerts', value: 'WhatsApp pe aayenge' },
                { icon: '📊', label: 'Reports', value: 'Roz raat 9 baje' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-label-sm text-xs text-on-surface-variant">{item.label}</p>
                    <p className="font-body-md text-sm text-on-surface">{item.value}</p>
                  </div>
                </div>
              ))}
              {launchResult?.campaign_id && !launchResult.campaign_id.startsWith('mock') && (
                <a
                  href={`https://www.facebook.com/adsmanager/manage/campaigns?act=${META_AD_ACCOUNT_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary font-label-sm text-xs hover:underline mt-1"
                >
                  <ExternalLink size={12} /> View in Meta Ads Manager
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/campaigns')} className="px-6 py-3 border border-outline-variant rounded-full font-label-sm text-sm text-on-surface hover:bg-surface-container transition-colors">
              View All Campaigns
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-primary text-white rounded-full font-label-sm text-sm hover:bg-primary/90 transition-colors">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Need for the Meta link
const META_AD_ACCOUNT_ID = (import.meta as any).env?.META_AD_ACCOUNT_ID || '';
