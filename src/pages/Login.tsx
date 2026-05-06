import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Loader2, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithPhone, isMockMode } = useAuth();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
    // On success, Supabase redirects browser to /dashboard — no navigate() needed
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setError('Please enter a valid 10-digit number'); return; }
    setLoading(true);
    const { error: err } = await signInWithPhone(digits);
    if (err) { setError(err); setLoading(false); return; }
    navigate('/verify', { state: { phone: `+91${digits}` } });
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row w-full bg-surface-container-lowest text-on-surface">
      {/* ── Left: Brand Panel ── */}
      <section className="hidden md:flex flex-col w-[45%] bg-[#FDFAF6] p-16 relative items-center justify-center border-r border-surface-variant overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#C8922A]/10 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center mb-16">
          <Logo className="w-[180px] object-contain mb-3" />
          <span className="text-5xl text-tertiary-fixed-dim tracking-widest mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>نور</span>
          <p className="mt-4 font-body-md text-sm text-on-surface-variant text-center max-w-[220px]">
            AI Marketing Copilot for Indian Beauty Salons
          </p>
        </div>

        <div className="relative z-10 bg-white/70 backdrop-blur-sm border border-[#EDE8E0] rounded-2xl p-6 max-w-[300px]">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-[#C8922A] text-[#C8922A]" />)}
          </div>
          <p className="font-body-md text-[15px] text-on-surface italic leading-relaxed mb-3">
            "Pehle hafte mein 14 enquiries. Sach mein. Noor ne sab handle kar liya."
          </p>
          <p className="font-label-sm text-xs text-on-surface-variant">— Ritu Sharma, Indore</p>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 text-center">
          {[['₹63', 'Avg Cost/Lead'], ['48hrs', 'Campaign Live'], ['40%', 'Avg Bookings ↑']].map(([val, label]) => (
            <div key={label}>
              <p className="font-number-data text-xl text-primary font-bold">{val}</p>
              <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Right: Auth Panel ── */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-10">
            <Logo className="w-[140px] object-contain" />
          </div>

          <h1 className="font-h2 text-[32px] text-on-surface mb-2 text-center">Wapas aaiye 👋</h1>
          <p className="text-center font-body-md text-sm text-on-surface-variant mb-8">
            Apni salon ki marketing AI ke haath mein dein
          </p>

          {isMockMode && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="font-label-sm text-xs text-amber-700">
                <strong>Setup required:</strong> Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env — then set up Google OAuth in Supabase Dashboard → Authentication → Providers.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="font-label-sm text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-outline-variant hover:border-primary/40 text-on-surface font-label-sm text-[15px] py-4 px-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md mb-4 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {googleLoading ? (
              <Loader2 size={20} className="animate-spin text-primary" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{googleLoading ? 'Redirecting to Google...' : 'Google se Login Karo'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-outline-variant flex-1" />
            <span className="font-body-md text-sm text-on-surface-variant">ya</span>
            <div className="h-px bg-outline-variant flex-1" />
          </div>

          {/* Phone OTP Toggle */}
          {!showPhone ? (
            <button
              onClick={() => setShowPhone(true)}
              className="w-full text-center font-label-sm text-sm text-primary hover:text-primary/80 transition-colors py-2"
            >
              📱 WhatsApp Number se Login Karo
            </button>
          ) : (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant mb-2 ml-1">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-number-data text-sm text-on-surface-variant pointer-events-none">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(null); }}
                    placeholder="00000 00000"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-outline-variant bg-surface-bright focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-number-data text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3.5 px-6 rounded-2xl bg-primary text-white font-label-sm text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>OTP Bhejo <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          <p className="text-center font-label-sm text-xs text-on-surface-variant mt-8">
            New hain?{' '}
            <Link to="/onboarding" className="text-primary hover:underline">
              Free mein shuru karein →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
