import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users } from 'lucide-react';
import Logo from '../components/Logo';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen relative flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full px-margin-page py-6 flex justify-between items-center bg-surface sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Logo className="h-10 w-auto" />
          <span className="font-h1 text-h1 text-tertiary-fixed-dim tracking-widest mt-2">نور</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-on-surface-variant font-medium">
          <a href="#" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-primary font-medium hover:text-primary-container transition-colors">Login</Link>
          <Link to="/onboarding" className="bg-primary-container text-on-primary px-6 py-2 rounded-full font-medium hover:bg-primary transition-colors shadow-sm">
            Free Mein Shuru Karo
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col lg:flex-row items-center px-margin-page py-section-gap gap-12 bg-surface">
        <div className="w-full lg:w-[55%] flex flex-col gap-6 pt-10">
          <h1 className="font-h1 text-[#2D1B4E] tracking-tight leading-[1.1] max-w-2xl text-[52px]">
            Salon bhari rahe. Aap sirf kaam karein.
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-xl">
            AI se campaigns launch karo, leads qualify karo, bookings pao. Hindi mein, apne phone se. Set your salon on autopilot with Noor's intelligent marketing tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/onboarding" className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-medium text-lg hover:bg-primary transition-colors shadow-sm flex items-center justify-center gap-2">
              Free Mein Shuru Karo
              <ArrowRight size={20} />
            </Link>
            <button className="bg-transparent border-2 border-primary-container text-primary-container px-8 py-3 rounded-full font-medium text-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
              Demo Dekho
              <Play size={20} />
            </button>
          </div>
          
          <div className="mt-8 flex items-center gap-3 text-on-surface-variant text-sm bg-surface-container-low w-max px-4 py-2 rounded-full border border-surface-variant">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-tertiary-container border border-surface flex items-center justify-center">
                <Users size={14} className="text-on-primary" />
              </div>
              <div className="w-6 h-6 rounded-full bg-secondary-container border border-surface flex items-center justify-center">
                <Users size={14} className="text-on-primary" />
              </div>
              <div className="w-6 h-6 rounded-full bg-primary-container border border-surface flex items-center justify-center">
                <Users size={14} className="text-on-primary" />
              </div>
            </div>
            <span>Loved by 500+ salon owners in BLR · JAI · IND · SUR</span>
          </div>
        </div>
        
        <div className="w-full lg:w-[45%] relative h-[500px] flex justify-center items-center">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-surface-container-high rounded-full blur-3xl opacity-50 transform scale-75 translate-x-10 translate-y-10"></div>
          
          {/* Mockup container */}
          <div className="relative w-full max-w-md aspect-[3/4] bg-surface-container-lowest rounded-[2rem] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out border border-outline-variant/30 flex flex-col">
            {/* Browser Bar */}
            <div className="w-full flex items-center gap-2 pb-4 border-b border-surface-variant">
              <div className="w-3 h-3 rounded-full bg-error/50"></div>
              <div className="w-3 h-3 rounded-full bg-secondary-container/50"></div>
              <div className="w-3 h-3 rounded-full bg-surface-tint/50"></div>
              <div className="mx-auto bg-surface-container px-4 py-1 rounded-full text-xs text-on-surface-variant font-number-data">noor.ai/dashboard</div>
            </div>
            
            {/* Mockup Content */}
            <div className="flex-1 overflow-hidden pt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 bg-surface-container-high rounded-md"></div>
                <div className="w-8 h-8 rounded-full bg-primary-container/20"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-3 rounded-xl h-24 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-secondary-container/20 flex items-center justify-center"></div>
                  <div className="h-4 w-16 bg-surface-variant rounded"></div>
                  <div className="h-6 w-12 bg-surface-variant rounded"></div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl h-24 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-full bg-primary-container/20 flex items-center justify-center"></div>
                  <div className="h-4 w-16 bg-surface-variant rounded"></div>
                  <div className="h-6 w-12 bg-surface-variant rounded"></div>
                </div>
              </div>
              
              <div className="bg-surface-container-low flex-1 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container"></div>
                <div className="h-4 w-24 bg-tertiary-container/30 rounded"></div>
                <div className="h-3 w-full bg-surface-variant rounded mt-2"></div>
                <div className="h-3 w-4/5 bg-surface-variant rounded"></div>
                <div className="mt-auto h-8 w-full bg-primary-container/10 rounded-full border border-primary-container/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-margin-page py-section-gap bg-surface-container-low flex-1">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-h2 text-primary mb-4 text-[32px]">Marketing simplified for beauty professionals</h2>
          <p className="text-body-md text-on-surface-variant">Focus on your craft while Noor handles the heavy lifting of customer acquisition and retention.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_2px_16px_rgba(0,0,0,0.06)] relative overflow-hidden group">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container transition-all group-hover:w-2"></div>
             <h3 className="font-h3 text-on-surface mb-3 text-[24px]">Launch Campaigns Instantly</h3>
             <p className="text-body-md text-on-surface-variant">Pre-built, festival-ready templates that go live on WhatsApp and Instagram in two clicks.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_2px_16px_rgba(0,0,0,0.06)] relative overflow-hidden group">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container transition-all group-hover:w-2"></div>
             <h3 className="font-h3 text-on-surface mb-3 text-[24px]">Smart Lead Qualification</h3>
             <p className="text-body-md text-on-surface-variant">AI chats with incoming queries, answering basic questions and qualifying serious bookings.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-card-padding shadow-[0_2px_16px_rgba(0,0,0,0.06)] relative overflow-hidden group">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container transition-all group-hover:w-2"></div>
             <h3 className="font-h3 text-on-surface mb-3 text-[24px]">Hindi Language Native</h3>
             <p className="text-body-md text-on-surface-variant">Operate the entire dashboard and send communications in perfectly natural Hindi.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
