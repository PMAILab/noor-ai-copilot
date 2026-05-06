import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, Lock, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as { phone?: string })?.phone || '+91XXXXXXXXXX';

  const { verifyOTP, signInWithPhone, isMockMode } = useAuth();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError(null);

    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (val && idx === 5 && next.every(d => d)) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      setTimeout(() => handleVerify(pasted), 100);
    }
  };

  const handleVerify = async (code?: string) => {
    const token = code || otp.join('');
    if (token.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: err } = await verifyOTP(phone, token);
    if (err) {
      setError(err.includes('expired') ? 'OTP expired — please resend' : 'Invalid OTP. Try again.');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      setLoading(false);
      return;
    }

    navigate('/dashboard');
  };

  const handleResend = async () => {
    setResending(true);
    await signInWithPhone(phone);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError(null);
    inputs.current[0]?.focus();
    setResending(false);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex items-center justify-center p-4 md:p-0">
      <div className="flex flex-col md:flex-row w-full max-w-7xl h-[85vh] min-h-[600px] bg-surface-container-lowest rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden border border-outline-variant/30">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-[#FDFAF6] p-12 lg:p-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-[#F3EDF8]/40 opacity-50 z-0" />
          <div className="relative z-10">
            <Logo className="h-12 w-auto object-contain mb-16" />
            <h1 className="font-h1 text-[48px] text-on-surface mb-6 leading-tight">Elevate your salon's<br />marketing with AI.</h1>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-md">
              Noor acts as your personal marketing co-pilot, helping you attract more clients while you focus on delivering exceptional service.
            </p>
          </div>
          <div className="relative z-10 mt-12 bg-surface/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#EDE8E0]">
            <div className="flex gap-1 mb-4 text-[#C8922A]">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} className="fill-[#c8922a]" />)}
            </div>
            <p className="font-body-md text-[16px] text-on-surface mb-4 italic">
              "Since using Noor, our salon's bookings have increased by 40%. The automated campaigns feel incredibly personal."
            </p>
            <p className="font-label-sm text-[14px] text-on-surface-variant font-bold uppercase tracking-wider">— Aisha K., Salon Owner</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[55%] flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
          <div className="max-w-md mx-auto w-full">
            <div className="md:hidden flex justify-center mb-12">
              <Logo className="h-10 w-auto object-contain" />
            </div>

            <div className="mb-10 text-center md:text-left">
              <h2 className="font-h2 text-[32px] text-on-surface mb-3">OTP daaliye</h2>
              <p className="font-body-md text-[16px] text-on-surface-variant">
                {isMockMode
                  ? 'Demo mode — enter any 6 digits to continue'
                  : <>Humne ek 6-digit code bheja hai <span className="font-number-data text-on-surface">{phone}</span> par.</>
                }
              </p>
            </div>

            <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleVerify(); }}>
              {/* OTP Digit Inputs */}
              <div className="flex justify-between gap-2 sm:gap-4" onPaste={handlePaste}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el; }}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="\d"
                    value={otp[i]}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    placeholder="—"
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center font-h3 text-[24px] bg-surface rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface border ${
                      error ? 'border-red-400' : otp[i] ? 'border-primary' : 'border-outline-variant'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 font-label-sm text-xs flex items-center gap-1">
                  <AlertCircle size={12} /> {error}
                </p>
              )}

              {/* Resend */}
              <div className="flex items-center justify-between">
                <p className="font-label-sm text-[14px] text-outline">
                  {resendTimer > 0
                    ? <>Dobara bhejo <span className="font-number-data text-primary">({resendTimer}s)</span></>
                    : <button type="button" onClick={handleResend} disabled={resending} className="text-primary hover:underline flex items-center gap-1">
                        {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                        Dobara bhejo
                      </button>
                  }
                </p>
                <button type="button" onClick={() => navigate('/login')} className="font-label-sm text-[14px] text-primary hover:text-primary-container transition-colors">
                  Galat number?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-primary-container text-white font-label-sm text-[14px] font-bold py-4 rounded-full hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Verify Karo'}
              </button>
            </form>

            <div className="mt-8 text-center md:text-left">
              <p className="font-label-sm text-[14px] text-outline flex items-center justify-center md:justify-start gap-2">
                <Lock size={18} />
                Your information is securely encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
