import { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import CampaignBuilderModal from '../components/CampaignBuilderModal';

export default function Campaigns() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-margin-page grid grid-cols-12 gap-gutter max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="col-span-12 mb-section-gap flex justify-between items-end">
        <div>
          <h1 className="font-h1 text-[48px] text-on-surface mb-2 tracking-tight">WhatsApp Broadcast</h1>
          <p className="font-body-lg text-[18px] text-on-surface-variant">Select a segment and a template recommended by Noor to start your campaign.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container text-on-primary py-2 px-6 rounded-full font-label-sm text-[14px] hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2"
        >
          Open Campaign Builder
        </button>
      </div>

      {/* Left Column: Segments */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
        <h3 className="font-h3 text-[24px] text-on-surface border-b border-[#EDE8E0] pb-2 mb-2">Audience Segment</h3>
        
        <button className="w-full text-left bg-surface-container-highest rounded-lg p-4 flex justify-between items-center shadow-soft border-l-4 border-[#C8922A] transition-all">
          <div>
            <span className="block font-label-sm text-[14px] font-bold text-on-surface mb-1">Regulars</span>
            <span className="block font-body-md text-[16px] text-on-surface-variant">Visited in last 30 days</span>
          </div>
          <span className="bg-white text-primary font-number-data px-3 py-1 rounded-full text-sm shadow-sm">142</span>
        </button>

        <button className="w-full text-left bg-white rounded-lg p-4 flex justify-between items-center shadow-soft hover:bg-surface-container transition-all">
          <div>
            <span className="block font-label-sm text-[14px] font-bold text-on-surface mb-1">Occasional</span>
            <span className="block font-body-md text-[16px] text-on-surface-variant">Visited 2-3 months ago</span>
          </div>
          <span className="bg-surface-container-high text-on-surface font-number-data px-3 py-1 rounded-full text-sm">86</span>
        </button>

        <button className="w-full text-left bg-white rounded-lg p-4 flex justify-between items-center shadow-soft hover:bg-surface-container transition-all">
          <div>
            <span className="block font-label-sm text-[14px] font-bold text-on-surface mb-1">Lapsed</span>
            <span className="block font-body-md text-[16px] text-on-surface-variant">No visit in 6+ months</span>
          </div>
          <span className="bg-surface-container-high text-on-surface font-number-data px-3 py-1 rounded-full text-sm">215</span>
        </button>

        <button className="w-full text-left bg-white rounded-lg p-4 flex justify-between items-center shadow-soft hover:bg-surface-container transition-all">
          <div>
            <span className="block font-label-sm text-[14px] font-bold text-on-surface mb-1">New</span>
            <span className="block font-body-md text-[16px] text-on-surface-variant">First visit this month</span>
          </div>
          <span className="bg-surface-container-high text-on-surface font-number-data px-3 py-1 rounded-full text-sm">34</span>
        </button>
      </div>

      {/* Centre Column: Templates */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <h3 className="font-h3 text-[24px] text-on-surface border-b border-[#EDE8E0] pb-2 mb-2 flex items-center gap-2">
          <Sparkles className="text-[#C8922A]" size={24} />
          Recommended Templates
        </h3>

        {/* Template Card 1 (Active) */}
        <div className="bg-white rounded-[16px] p-card-padding shadow-[0_4px_24px_rgba(200,146,42,0.15)] border border-[#C8922A] relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg">
          <div className="absolute top-0 right-0 bg-[#C8922A] text-white font-label-sm text-[14px] px-4 py-1 rounded-bl-lg">Recommended</div>
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-h3 text-[24px] text-on-surface pr-12">Monsoon Hair Spa Offer</h4>
          </div>
          <div className="bg-surface-container-low p-4 rounded-lg mb-6">
            <p className="font-body-md text-[16px] text-on-surface-variant line-clamp-3">
              "Hi [Name], rainy season taking a toll on your hair? 🌧️ Treat yourself to our rejuvenating Moroccan Spa therapy. Special 20% off for our regular clients this week! Book your slot now: [Link]"
            </p>
          </div>
          <button className="w-full bg-surface-container border border-[#C8922A] text-tertiary-container py-3 rounded-full font-label-sm text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#C8922A] hover:text-white transition-colors">
            <CheckCircle2 size={20} />
            Use This Template
          </button>
        </div>

        {/* Template Card 2 */}
        <div className="bg-white rounded-[16px] p-card-padding shadow-soft border border-transparent hover:border-[#EDE8E0] transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-h3 text-[24px] text-on-surface">Weekend Glow-up</h4>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-lg mb-6 border border-[#EDE8E0]">
            <p className="font-body-md text-[16px] text-on-surface-variant line-clamp-3">
              "Hey [Name]! ✨ Ready for the weekend? Drop by for a quick touch-up and get a complimentary nail art with any service over ₹1500. Valid till Sunday."
            </p>
          </div>
          <button className="w-full bg-white border border-[#EDE8E0] text-on-surface py-3 rounded-full font-label-sm text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
            Preview Template
          </button>
        </div>
      </div>

      {/* Right Column: Preview & Action */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <h3 className="font-h3 text-[24px] text-on-surface border-b border-[#EDE8E0] pb-2 mb-2">Live Preview</h3>
        
        {/* Phone Mockup */}
        <div className="bg-[#ECE5DD] rounded-[2rem] p-4 shadow-xl border-[8px] border-inverse-surface relative overflow-hidden h-[450px] flex flex-col">
          {/* Phone Header */}
          <div className="bg-[#075E54] text-white p-3 rounded-t-xl flex items-center gap-3 shadow-md z-10 -mx-4 -mt-4 mb-4">
            <span className="material-symbols-outlined">arrow_back</span>
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs">A</div>
            <div>
              <div className="font-body-md font-bold text-[15px]">Aura Salon & Spa</div>
              <div className="text-[12px] opacity-80">business account</div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-end gap-2 relative">
            <div className="self-center bg-[#E1F3FB] text-[#4A5568] text-[12px] px-3 py-1 rounded-lg mb-2 shadow-sm">
              TODAY
            </div>
            {/* Message Bubble */}
            <div className="bg-white rounded-lg rounded-tr-none p-3 max-w-[85%] self-end shadow-sm relative text-[#303030]">
              <p className="font-body-md text-[14px] leading-snug mb-1">
                Hi Priya, rainy season taking a toll on your hair? 🌧️ Treat yourself to our rejuvenating Moroccan Spa therapy. 
              </p>
              <p className="font-body-md text-[14px] leading-snug mb-2 font-medium">
                Special 20% off for our regular clients this week!
              </p>
              <a href="#" className="text-[#027EB5] text-[14px] mb-2 block truncate">https://aura.book/spa-offer</a>
              <div className="text-right text-[11px] text-[#999999] mt-1 flex justify-end items-center gap-1">
                10:42 AM <span className="material-symbols-outlined text-[14px]">done_all</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="bg-white rounded-[16px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] mt-auto">
          <div className="bg-secondary-container bg-opacity-20 border-l-4 border-secondary-container p-4 rounded-r-lg mb-6 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary-container mt-1">lightbulb</span>
            <div>
              <span className="block font-label-sm text-[14px] font-bold text-on-surface mb-1">Noor AI Insight</span>
              <p className="font-hindi-text text-on-surface-variant text-sm">
                Kal 10 AM ko bhejne ki salah. (Recommended send time: Tomorrow at 10 AM for highest engagement based on past data).
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#25D366] text-white py-4 rounded-full font-label-sm text-[14px] font-bold shadow-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 text-lg">
              <span className="material-symbols-outlined">send</span>
              Send to 142 Regulars
            </button>
            <button className="w-full bg-white border border-[#EDE8E0] text-on-surface-variant py-3 rounded-full font-label-sm text-[14px] font-bold hover:bg-surface-container transition-colors">
              Schedule for Later
            </button>
          </div>
        </div>
      </div>
      
      {isModalOpen && <CampaignBuilderModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
