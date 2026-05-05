import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scissors, Flower2, Droplets, Paintbrush, Library, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function Onboarding() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen flex flex-col relative selection:bg-primary-container selection:text-on-primary-container">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-variant z-50">
        <div className="h-full bg-primary-container transition-all duration-500 ease-in-out" style={{ width: '14.28%' }}></div>
      </div>

      {/* Header / Nav */}
      <header className="w-full flex justify-between items-center px-margin-page py-6 z-40 relative">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto object-contain" />
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[720px] bg-surface-container-lowest rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-card-padding md:p-[48px] relative overflow-hidden">
          
          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Step 1 of 7</span>
            <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
          </div>

          {/* Header */}
          <div className="mb-section-gap text-center">
            <h1 className="font-h1 text-[48px] text-on-surface mb-2 tracking-tight">Aapka salon kaisa hai?</h1>
            <p className="font-body-lg text-[18px] text-on-surface-variant">
              Select the primary focus of your business to help us tailor Noor to your needs.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-section-gap">
            {/* Option 1: Selected */}
            <button className="flex flex-col items-center text-center p-6 rounded-DEFAULT bg-surface-container border border-primary relative transition-all group overflow-hidden">
              <div className="absolute top-3 right-3 text-secondary-container">
                <CheckCircle2 className="fill-secondary-container text-white" size={20} />
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center mb-4 shadow-sm text-primary">
                <Scissors size={24} />
              </div>
              <span className="font-body-md text-[16px] text-on-surface font-medium">Hair Salon</span>
            </button>

            {/* Option 2 */}
            <button className="flex flex-col items-center text-center p-6 rounded-DEFAULT bg-surface-container-lowest border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-surface-container transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
                <Flower2 size={24} />
              </div>
              <span className="font-body-md text-[16px] text-on-surface font-medium">Beauty Spa</span>
            </button>

            {/* Option 3 */}
            <button className="flex flex-col items-center text-center p-6 rounded-DEFAULT bg-surface-container-lowest border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-surface-container transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
                <Droplets size={24} />
              </div>
              <span className="font-body-md text-[16px] text-on-surface font-medium">Skin Clinic</span>
            </button>

            {/* Option 4 */}
            <button className="flex flex-col items-center text-center p-6 rounded-DEFAULT bg-surface-container-lowest border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-surface-container transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
                <Scissors size={24} />
              </div>
              <span className="font-body-md text-[16px] text-on-surface font-medium">Barbershop</span>
            </button>

            {/* Option 5 */}
            <button className="flex flex-col items-center text-center p-6 rounded-DEFAULT bg-surface-container-lowest border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-surface-container transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
                <Paintbrush size={24} />
              </div>
              <span className="font-body-md text-[16px] text-on-surface font-medium">Makeup Studio</span>
            </button>

            {/* Option 6 */}
            <button className="flex flex-col items-center text-center p-6 rounded-DEFAULT bg-surface-container-lowest border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-surface-container transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary">
                <Library size={24} />
              </div>
              <span className="font-body-md text-[16px] text-on-surface font-medium">Other</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center pt-6 border-t border-surface-variant">
            <button 
              onClick={handleContinue}
              className="bg-primary-container text-on-primary font-label-sm text-[14px] py-3 px-8 rounded-full hover:bg-primary-container/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
