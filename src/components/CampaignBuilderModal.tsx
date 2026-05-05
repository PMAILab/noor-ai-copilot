import { X, Check } from 'lucide-react';
import Logo from './Logo';

export default function CampaignBuilderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-[#2d1b4e]/40 flex items-center justify-center p-gutter z-50 overflow-y-auto backdrop-blur-sm">
      {/* Modal Content (820px) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] w-full max-w-[820px] my-auto overflow-hidden relative">
        {/* Header area */}
        <div className="px-margin-page py-gutter border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="h-[40px] w-auto object-contain" />
            <h2 className="font-h3 text-[24px] text-h3 text-on-surface ml-4 border-l border-outline-variant pl-4">Campaign Builder</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-highest"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="bg-surface-container px-margin-page py-6">
          <div className="flex items-center justify-between relative max-w-lg mx-auto">
            {/* Progress Line Background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant z-0"></div>
            {/* Active Progress Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3/4 h-1 bg-secondary-container z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
                <Check size={18} />
              </div>
              <span className="font-label-sm text-[14px] text-on-surface-variant hidden md:block">Goal</span>
            </div>
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
                <Check size={18} />
              </div>
              <span className="font-label-sm text-[14px] text-on-surface-variant hidden md:block">Media</span>
            </div>
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
                <Check size={18} />
              </div>
              <span className="font-label-sm text-[14px] text-on-surface-variant hidden md:block">Budget</span>
            </div>
            {/* Step 4 (Active) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm ring-4 ring-primary-container/20">
                <span className="font-number-data text-[16px]">4</span>
              </div>
              <span className="font-label-sm text-[14px] text-primary font-bold hidden md:block">Creative</span>
            </div>
            {/* Step 5 */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center text-outline-variant">
                <span className="font-number-data text-[16px]">5</span>
              </div>
              <span className="font-label-sm text-[14px] text-outline-variant hidden md:block">Review</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-margin-page pb-0 pt-12">
          <div className="mb-8">
            <h3 className="font-h2 text-[32px] text-on-surface mb-2 tracking-tight">Review Generated Creatives</h3>
            <p className="font-body-md text-[16px] text-on-surface-variant">Select the ad variant that best matches your salon's voice. These were generated based on your goal to increase bookings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Variant 1 (Selected) */}
            <div className="bg-surface-container-lowest rounded-lg border-2 border-primary shadow-[0_4px_24px_rgba(82,37,135,0.12)] p-card-padding relative cursor-pointer overflow-hidden group">
              <div className="absolute top-4 right-4 z-10 text-secondary">
                <Check size={28} className="text-[#C8922A] fill-[#FEF3C7] bg-[#C8922A] text-white rounded-full p-1" />
              </div>
              <div className="aspect-[4/5] bg-surface-container-highest rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <img 
                  alt="Spa Treatment Variant 1" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                />
              </div>
              <h4 className="text-label-sm text-primary mb-2 uppercase tracking-wider font-number-data text-[14px]">Option 1: Direct & Elegant</h4>
              <p className="font-body-md text-[16px] text-on-surface italic line-clamp-3">"Experience tranquility. Book your signature facial this weekend and receive a complimentary scalp massage."</p>
            </div>

            {/* Variant 2 */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-card-padding relative cursor-pointer hover:border-primary-container transition-all group opacity-80 hover:opacity-100">
              <div className="aspect-[4/5] bg-surface-container-highest rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <img 
                  alt="Spa Treatment Variant 2" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                />
              </div>
              <h4 className="text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider font-number-data text-[14px]">Option 2: Playful & Engaging</h4>
              <p className="font-body-md text-[16px] text-on-surface italic line-clamp-3">"Glow up for the weekend! ✨ Treat yourself to our new rejuvenating spa package. Limited spots available!"</p>
            </div>

            {/* Variant 3 */}
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-card-padding relative cursor-pointer hover:border-primary-container transition-all group opacity-80 hover:opacity-100">
              <div className="aspect-[4/5] bg-surface-container-highest rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <img 
                  alt="Spa Treatment Variant 3" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  src="https://images.unsplash.com/photo-1629367305988-cb941e779a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                />
              </div>
              <h4 className="text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider font-number-data text-[14px]">Option 3: Product Focused</h4>
              <p className="font-body-md text-[16px] text-on-surface italic line-clamp-3">"Our premium botanicals wait for you. Elevate your skincare routine with a bespoke consultation today."</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-surface-container-lowest px-margin-page py-6 border-t border-surface-variant flex items-center justify-between rounded-b-xl">
          <button 
            onClick={onClose}
            className="font-label-sm text-[14px] text-on-surface-variant py-3 px-6 rounded-full hover:bg-surface-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back to Budget
          </button>
          <button 
            onClick={onClose}
            className="font-label-sm text-[14px] bg-secondary-container text-on-secondary-container py-3 px-8 rounded-full shadow-sm hover:bg-secondary-fixed-dim transition-all flex items-center gap-2 font-bold"
          >
            Continue to Summary
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
