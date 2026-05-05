import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight, Star } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify');
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row w-full bg-surface-container-lowest text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Side: Editorial Splash (45%) */}
      <section className="hidden md:flex flex-col w-[45%] bg-surface-container-low p-margin-page relative items-center justify-center border-r border-surface-variant">
        <div className="flex flex-col items-center mb-12 transform -translate-y-12">
          <Logo className="w-[200px] h-[60px] object-contain mb-4" />
          <span className="font-h1 text-h1 text-tertiary-fixed-dim tracking-widest mt-2" style={{fontFamily: "'Cormorant Garamond', serif"}}>نور</span>
        </div>
        
        <div className="absolute bottom-margin-page w-full px-16 text-center">
          <blockquote className="font-h3 text-h3 text-on-surface mb-4 leading-relaxed">
            "Pehle hafte mein 14 enquiries. Sach mein."
          </blockquote>
          <div className="font-body-md text-body-md text-on-surface-variant mb-4">
            — Ritu, Indore
          </div>
          <div className="flex justify-center gap-1 text-secondary-fixed-dim">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={20} className="fill-secondary-fixed-dim" />
            ))}
          </div>
        </div>
      </section>

      {/* Right Side: Login Panel (55%) */}
      <section className="flex-1 flex flex-col relative w-full md:w-[55%] bg-surface-container-lowest">
        {/* Language Toggle */}
        <div className="absolute top-margin-page right-margin-page z-10">
          <div className="flex items-center bg-surface-container-high rounded-full p-1 shadow-sm">
            <button className="px-5 py-2 rounded-full bg-surface-container-lowest shadow-sm font-label-sm text-label-sm text-on-surface transition-all">
              <span className="font-hindi-text text-hindi-text">हिंदी</span>
            </button>
            <button className="px-5 py-2 rounded-full text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors">
              English
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex-1 flex items-center justify-center p-margin-page sm:p-gutter">
          <div className="w-full max-w-[480px] bg-surface-container-lowest p-card-padding sm:p-[48px] rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] relative overflow-hidden">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container pointer-events-none rounded-full blur-[80px] opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h1 className="font-h2 text-[32px] text-on-surface mb-10 text-center tracking-tight">Wapas aaiye</h1>
              
              <form className="space-y-6" onSubmit={handleSendOTP}>
                <div className="space-y-2">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant ml-2" htmlFor="whatsapp-number">
                    WhatsApp Number
                  </label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-number-data text-number-data text-on-surface-variant select-none pointer-events-none">+91</span>
                    <input 
                      id="whatsapp-number" 
                      type="tel" 
                      placeholder="00000 00000"
                      className="w-full pl-[52px] pr-5 py-4 rounded-full border border-outline-variant bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all duration-200 font-number-data text-number-data text-on-surface placeholder:text-outline-variant"
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full py-4 px-6 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm hover:bg-[#5a3586] hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-4 text-white">
                  OTP Bhejo
                  <ArrowRight size={18} />
                </button>
                
                <div className="flex items-center gap-4 py-4 opacity-70">
                  <div className="h-px bg-outline-variant flex-1"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant italic">ya</span>
                  <div className="h-px bg-outline-variant flex-1"></div>
                </div>
                
                <button type="button" className="w-full py-4 px-6 rounded-full border border-outline-variant bg-transparent text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors duration-200">
                  <LogIn size={20} />
                  Google se login karo
                </button>
              </form>
              
              <div className="mt-12 text-center">
                <Link to="/onboarding" className="font-label-sm text-label-sm text-tertiary-fixed-dim hover:text-tertiary-container transition-colors duration-200 inline-flex items-center gap-1">
                  Naya account? Free shuru karo 
                  <ArrowRight size={16} />
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
