import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Scissors } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'signin' | 'signup';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [tab, setTab] = useState<Tab>('signin');
  const [salonName, setSalonName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Please enter your email and password.');
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) return setError(error);
    navigate('/dashboard');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!salonName.trim()) return setError('Please enter your salon name.');
    if (!email || !password) return setError('Email and password are required.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setLoading(true);
    const { error, needsVerification } = await signUpWithEmail(email, password, salonName);
    setLoading(false);

    if (error) return setError(error);

    if (needsVerification) {
      setSuccess(`Account created! Check your inbox at ${email} to verify, then sign in.`);
      setTab('signin');
    } else {
      navigate('/dashboard');
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-surface flex items-stretch">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[#6750A4] via-[#7B61D9] to-[#9C88F0] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Noor AI Copilot</span>
          </div>

          <h1 className="text-white font-bold text-[42px] leading-tight mb-6">
            Your salon's<br />
            <span className="text-white/70">AI marketing</span><br />
            team
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Generate ad copies, launch Meta campaigns, and broadcast to your clients — all in one place.
          </p>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: '🤖', text: 'AI-generated Hindi + English ad copy' },
            { icon: '📸', text: 'Beautiful ad images with Imagen 3' },
            { icon: '📲', text: 'WhatsApp broadcasts to your clients' },
            { icon: '📊', text: 'Live campaign performance tracking' },
          ].map(f => (
            <div key={f.icon} className="flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-white/80 text-sm font-medium">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Sparkles size={22} className="text-primary" />
            <span className="font-bold text-lg text-on-surface">Noor AI Copilot</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-surface-container rounded-xl p-1 mb-8 gap-1">
            <button
              onClick={() => switchTab('signin')}
              className={`flex-1 py-2.5 rounded-lg font-label-sm text-sm font-semibold transition-all ${
                tab === 'signin'
                  ? 'bg-surface shadow-sm text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={`flex-1 py-2.5 rounded-lg font-label-sm text-sm font-semibold transition-all ${
                tab === 'signup'
                  ? 'bg-surface shadow-sm text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ── SIGN IN FORM ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <h2 className="font-h3 text-[26px] text-on-surface mb-1">Welcome back</h2>
                <p className="text-on-surface-variant text-sm mb-6">Sign in to your Noor account</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 mt-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-center text-xs text-on-surface-variant mt-4">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchTab('signup')} className="text-primary font-semibold hover:underline">
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <h2 className="font-h3 text-[26px] text-on-surface mb-1">Create your account</h2>
                <p className="text-on-surface-variant text-sm mb-6">Start growing your salon with AI</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Salon Name</label>
                  <div className="relative">
                    <Scissors size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type="text"
                      value={salonName}
                      onChange={e => setSalonName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Priya Beauty Parlour"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-surface focus:outline-none focus:ring-1 ${
                        confirm && password !== confirm
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                          : 'border-outline-variant focus:border-primary focus:ring-primary'
                      }`}
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (confirm.length > 0 && password !== confirm)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 mt-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-center text-xs text-on-surface-variant mt-4">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('signin')} className="text-primary font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
