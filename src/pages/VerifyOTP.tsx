import { useNavigate } from 'react-router-dom';
import { Star, Lock } from 'lucide-react';
import Logo from '../components/Logo';

export default function VerifyOTP() {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex items-center justify-center p-4 md:p-0">
      <div className="flex flex-col md:flex-row w-full max-w-7xl h-[85vh] min-h-[600px] bg-surface-container-lowest rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden border border-outline-variant/30">
        
        {/* Left Panel: Brand & Testimonial (45%) */}
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-[#FDFAF6] p-12 lg:p-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-[#F3EDF8]/40 opacity-50 z-0"></div>
          
          <div className="relative z-10">
            <Logo className="h-12 w-auto object-contain mb-16" />
            <h1 className="font-h1 text-[48px] text-on-surface mb-6 leading-tight">Elevate your salon's<br/>marketing with AI.</h1>
            <p className="font-body-lg text-[18px] text-on-surface-variant max-w-md">
              Noor acts as your personal marketing co-pilot, helping you attract more clients while you focus on delivering exceptional service.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 bg-surface/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#EDE8E0]">
            <div className="flex gap-1 mb-4 text-[#C8922A]">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={24} className="fill-[#c8922a]" />
              ))}
            </div>
            <p className="font-body-md text-[16px] text-on-surface mb-4 italic">
              "Since using Noor, our salon's bookings have increased by 40%. The automated campaigns feel incredibly personal to our clients."
            </p>
            <p className="font-label-sm text-[14px] text-on-surface-variant font-bold uppercase tracking-wider">
              — Aisha K., Salon Owner
            </p>
          </div>
        </div>

        {/* Right Panel: OTP Verification (55%) */}
        <div className="w-full md:w-[55%] flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-surface-container-lowest">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-12">
              <Logo className="h-10 w-auto object-contain" />
            </div>
            
            <div className="mb-10 text-center md:text-left">
              <h2 className="font-h2 text-[32px] text-on-surface mb-3">OTP daaliye</h2>
              <p className="font-body-md text-[16px] text-on-surface-variant">
                Humne ek 6-digit code bheja hai <span className="font-number-data text-on-surface">+91 ••••• ••456</span> par.
              </p>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
              {/* OTP Input Group */}
              <div className="flex justify-between gap-2 sm:gap-4 mb-2">
                {[1,2,3,4,5,6].map((i) => (
                  <input 
                    key={i}
                    maxLength={1} 
                    placeholder="-" 
                    type="text"
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center font-h3 text-[24px] bg-surface rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface 
                      ${i === 3 ? 'border-primary ring-1 ring-primary/20' : 'border-[#EDE8E0]'}`}
                  />
                ))}
              </div>
              
              {/* Resend Section */}
              <div className="flex items-center justify-between mt-4">
                <p className="font-label-sm text-[14px] text-outline">Dobara bhejo <span className="font-number-data text-primary">(28s)</span></p>
                <a href="#" className="font-label-sm text-[14px] text-primary hover:text-primary-container transition-colors">Galat number?</a>
              </div>
              
              {/* Action Button */}
              <button type="submit" className="w-full bg-primary-container text-white font-label-sm text-[14px] font-bold py-4 rounded-full hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md mt-8">
                Verify Karo
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
