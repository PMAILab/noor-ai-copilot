import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Scissors, Flower2, Droplets,
  Paintbrush, Library, CheckCircle2, Sparkles, Check
} from 'lucide-react';
import Logo from '../components/Logo';
import { isSupabaseConfigured } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────

interface OnboardingData {
  salonType: string;
  salonName: string;
  city: string;
  pinCode: string;
  services: string[];
  targetCustomers: string[];
  monthlyBudget: number;
  waNumber: string;
  language: 'hi' | 'en' | 'hi-en';
}

const TOTAL_STEPS = 7;

// ── Step 1: Salon Type ───────────────────────────────────────────────────────

const SALON_TYPES = [
  { id: 'ladies_parlour', label: 'Ladies Parlour', labelHi: 'महिला पार्लर', icon: <Scissors size={24} /> },
  { id: 'beauty_spa', label: 'Beauty Spa', labelHi: 'ब्यूटी स्पा', icon: <Flower2 size={24} /> },
  { id: 'skin_clinic', label: 'Skin Clinic', labelHi: 'स्किन क्लिनिक', icon: <Droplets size={24} /> },
  { id: 'bridal_studio', label: 'Bridal Studio', labelHi: 'ब्राइडल स्टूडियो', icon: <Paintbrush size={24} /> },
  { id: 'mens_grooming', label: "Men's Grooming", labelHi: 'मेन्स ग्रूमिंग', icon: <Scissors size={24} /> },
  { id: 'other', label: 'Other', labelHi: 'अन्य', icon: <Library size={24} /> },
];

// ── Step 3: Services ─────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { id: 'facial', label: 'Facial / Cleanup', emoji: '✨' },
  { id: 'hair_colour', label: 'Hair Colour', emoji: '🎨' },
  { id: 'bridal_makeup', label: 'Bridal Makeup', emoji: '💄' },
  { id: 'hair_spa', label: 'Hair Spa', emoji: '💆' },
  { id: 'threading', label: 'Threading', emoji: '🧵' },
  { id: 'waxing', label: 'Waxing', emoji: '🌿' },
  { id: 'manicure_pedicure', label: 'Manicure / Pedicure', emoji: '💅' },
  { id: 'haircut_styling', label: 'Haircut & Styling', emoji: '✂️' },
  { id: 'skin_treatment', label: 'Skin Treatment', emoji: '🫧' },
  { id: 'nail_art', label: 'Nail Art', emoji: '💎' },
  { id: 'hair_smoothening', label: 'Smoothening / Keratin', emoji: '🌸' },
  { id: 'saree_draping', label: 'Saree Draping', emoji: '🪡' },
];

// ── Step 4: Target Customers ─────────────────────────────────────────────────

const CUSTOMER_OPTIONS = [
  { id: 'working_women', label: 'Working Women', labelHi: 'कामकाजी महिलाएं', emoji: '👩‍💼' },
  { id: 'homemakers', label: 'Homemakers', labelHi: 'गृहिणी', emoji: '🏠' },
  { id: 'college_students', label: 'College Students', labelHi: 'कॉलेज स्टूडेंट्स', emoji: '🎓' },
  { id: 'brides_to_be', label: 'Brides-to-be', labelHi: 'दुल्हन', emoji: '👰' },
  { id: 'young_girls', label: 'Young Girls (13–19)', labelHi: 'युवा लड़कियां', emoji: '🌺' },
  { id: 'all_women', label: 'All Women', labelHi: 'सभी महिलाएं', emoji: '👩' },
];

// ── Step 5: Budget tiers ──────────────────────────────────────────────────────

const BUDGET_OPTIONS = [
  { value: 1000, label: '₹1,000/month', desc: 'Starter — WhatsApp only' },
  { value: 3000, label: '₹3,000/month', desc: 'Chamak — WA + Instagram' },
  { value: 5000, label: '₹5,000/month', desc: 'Roshan — WA + Meta Ads' },
  { value: 10000, label: '₹10,000/month', desc: 'Noor Pro — Full funnel' },
  { value: 20000, label: '₹20,000+/month', desc: 'Power — Multi-channel' },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    salonType: '',
    salonName: '',
    city: '',
    pinCode: '',
    services: [],
    targetCustomers: [],
    monthlyBudget: 3000,
    waNumber: '',
    language: 'hi-en',
  });
  const [saving, setSaving] = useState(false);

  const progress = (step / TOTAL_STEPS) * 100;

  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => {
    if (step === 1) navigate('/');
    else setStep(s => s - 1);
  };

  const toggleItem = (field: 'services' | 'targetCustomers', id: string) => {
    setData(prev => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
      };
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    if (isSupabaseConfigured()) {
      // In a real app, call save-onboarding netlify function here
      await new Promise(r => setTimeout(r, 1000));
    }
    navigate('/dashboard');
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return Boolean(data.salonType);
      case 2: return data.salonName.trim().length >= 2 && data.city.trim().length >= 2;
      case 3: return data.services.length >= 1;
      case 4: return data.targetCustomers.length >= 1;
      case 5: return true;
      case 6: return data.waNumber.replace(/\D/g, '').length === 10;
      case 7: return true;
      default: return true;
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-variant z-50">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-5 z-40">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <Logo className="h-8 w-auto object-contain" />
        <div className="w-10" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[680px] bg-surface-container-lowest rounded-2xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] p-8 md:p-12">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
              Step {step} of {TOTAL_STEPS}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 < step ? 'bg-primary w-4' :
                    i + 1 === step ? 'bg-primary w-6' :
                    'bg-outline-variant w-4'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── STEP 1: Salon Type ── */}
          {step === 1 && (
            <div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-2 tracking-tight">Aapka salon kaisa hai?</h1>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Select your primary business type — Noor will tailor everything to it.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SALON_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setData(d => ({ ...d, salonType: type.id }))}
                    className={`relative flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all group ${
                      data.salonType === type.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-outline-variant hover:border-primary/40 hover:bg-surface-container'
                    }`}
                  >
                    {data.salonType === type.id && (
                      <div className="absolute top-2.5 right-2.5 text-primary">
                        <CheckCircle2 size={18} className="fill-primary text-white" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                      data.salonType === type.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
                    }`}>
                      {type.icon}
                    </div>
                    <span className="font-label-sm text-sm text-on-surface font-medium">{type.label}</span>
                    <span className="font-hindi-text text-xs text-on-surface-variant mt-0.5">{type.labelHi}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Salon Details ── */}
          {step === 2 && (
            <div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-2 tracking-tight">Salon ki details</h1>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Noor will use this to personalise your campaigns and find local customers.
              </p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-label-sm text-sm text-on-surface-variant block mb-2">Salon Name *</label>
                  <input
                    type="text"
                    value={data.salonName}
                    onChange={e => setData(d => ({ ...d, salonName: e.target.value }))}
                    placeholder="e.g. Ananya Beauty Studio"
                    className="w-full border border-outline-variant bg-surface rounded-xl px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-sm text-sm text-on-surface-variant block mb-2">City *</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={e => setData(d => ({ ...d, city: e.target.value }))}
                      placeholder="e.g. Jaipur"
                      className="w-full border border-outline-variant bg-surface rounded-xl px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-sm text-on-surface-variant block mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={data.pinCode}
                      onChange={e => setData(d => ({ ...d, pinCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      placeholder="e.g. 302001"
                      inputMode="numeric"
                      className="w-full border border-outline-variant bg-surface rounded-xl px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Services ── */}
          {step === 3 && (
            <div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-2 tracking-tight">Kaunsi services dete hain?</h1>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Select all that apply — Noor will tailor your campaigns to highlight these.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_OPTIONS.map(svc => {
                  const selected = data.services.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      onClick={() => toggleItem('services', svc.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant hover:border-primary/40'
                      }`}
                    >
                      <span className="text-xl">{svc.emoji}</span>
                      <span className="font-label-sm text-sm text-on-surface">{svc.label}</span>
                      {selected && <Check size={14} className="text-primary ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {data.services.length > 0 && (
                <p className="font-label-sm text-xs text-primary mt-4">{data.services.length} services selected</p>
              )}
            </div>
          )}

          {/* ── STEP 4: Target Customers ── */}
          {step === 4 && (
            <div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-2 tracking-tight">Aapke ideal customers kaun hain?</h1>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Select all that apply — Noor will target ads to these audiences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CUSTOMER_OPTIONS.map(c => {
                  const selected = data.targetCustomers.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleItem('targetCustomers', c.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant hover:border-primary/40'
                      }`}
                    >
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex-1">
                        <span className="font-label-sm text-sm text-on-surface block">{c.label}</span>
                        <span className="font-hindi-text text-xs text-on-surface-variant">{c.labelHi}</span>
                      </div>
                      {selected && <Check size={16} className="text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 5: Budget ── */}
          {step === 5 && (
            <div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-2 tracking-tight">Monthly marketing budget?</h1>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Noor will allocate this across WhatsApp, Instagram, and Meta Ads automatically.
              </p>
              <div className="flex flex-col gap-3">
                {BUDGET_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setData(d => ({ ...d, monthlyBudget: opt.value }))}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      data.monthlyBudget === opt.value
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-outline-variant hover:border-primary/40'
                    }`}
                  >
                    <div>
                      <span className="font-number-data text-[18px] text-on-surface font-bold">{opt.label}</span>
                      <span className="font-body-md text-sm text-on-surface-variant block mt-0.5">{opt.desc}</span>
                    </div>
                    {data.monthlyBudget === opt.value && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="font-label-sm text-xs text-on-surface-variant mt-4">
                💡 You can change this anytime in Settings. Start small and scale as you see results.
              </p>
            </div>
          )}

          {/* ── STEP 6: WhatsApp + Language ── */}
          {step === 6 && (
            <div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-2 tracking-tight">WhatsApp number?</h1>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Noor will send you lead alerts, daily reports, and campaign updates here.
              </p>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="font-label-sm text-sm text-on-surface-variant block mb-2">WhatsApp Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-number-data text-on-surface-variant select-none">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={data.waNumber}
                      onChange={e => setData(d => ({ ...d, waNumber: e.target.value.replace(/\D/g, '') }))}
                      placeholder="00000 00000"
                      className="w-full pl-14 pr-4 py-3.5 border border-outline-variant bg-surface rounded-xl font-number-data text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-sm text-on-surface-variant block mb-3">
                    Language Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'hi-en', label: 'Hinglish', desc: 'Hindi + English' },
                      { id: 'hi', label: 'Hindi', desc: 'हिंदी में' },
                      { id: 'en', label: 'English', desc: 'English only' },
                    ].map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => setData(d => ({ ...d, language: lang.id as OnboardingData['language'] }))}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          data.language === lang.id
                            ? 'border-primary bg-primary/5'
                            : 'border-outline-variant hover:border-primary/40'
                        }`}
                      >
                        <span className="font-label-sm text-sm text-on-surface block font-medium">{lang.label}</span>
                        <span className="font-body-md text-xs text-on-surface-variant">{lang.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: All Set! ── */}
          {step === 7 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-container rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Sparkles size={40} className="text-white" />
              </div>
              <h1 className="font-h1 text-[36px] text-on-surface mb-3">Sab set ho gaya! 🎉</h1>
              <p className="font-body-lg text-on-surface-variant mb-8 max-w-sm mx-auto">
                Noor ab taiyaar hai aapka marketing co-pilot banne ke liye. Let's see your dashboard!
              </p>

              <div className="bg-surface-container rounded-2xl p-5 text-left mb-8 max-w-sm mx-auto">
                <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-4">Your Profile Summary</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Salon', value: data.salonName || 'My Salon' },
                    { label: 'City', value: data.city || 'Not set' },
                    { label: 'Services', value: `${data.services.length} services` },
                    { label: 'Monthly Budget', value: `₹${data.monthlyBudget.toLocaleString('en-IN')}` },
                    { label: 'Language', value: data.language === 'hi-en' ? 'Hinglish' : data.language === 'hi' ? 'Hindi' : 'English' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-outline-variant last:border-0">
                      <span className="font-label-sm text-sm text-on-surface-variant">{item.label}</span>
                      <span className="font-label-sm text-sm text-on-surface font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={saving}
                className="w-full max-w-sm mx-auto py-4 bg-primary text-white rounded-xl font-label-sm text-[16px] font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
              >
                {saving ? 'Setting up...' : '🚀 Dashboard Kholein'}
              </button>
            </div>
          )}

          {/* ── Footer buttons (steps 1–6) ── */}
          {step < 7 && (
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-outline-variant">
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface-variant rounded-full font-label-sm text-sm hover:bg-surface-container transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-full font-label-sm text-sm font-bold hover:bg-primary/90 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
