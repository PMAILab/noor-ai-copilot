import { MoreVertical, Phone, Smartphone, CheckCircle, Send, Sparkles, Paperclip } from 'lucide-react';

export default function Inbox() {
  return (
    <div className="flex-1 flex overflow-hidden bg-surface-container-lowest relative h-[calc(100vh-80px)]">
      {/* Left Panel: Lead List */}
      <aside className="w-[360px] bg-surface-container-low border-r border-outline-variant flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
          <h2 className="font-h3 text-[24px] text-primary">Leads</h2>
          <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-sm font-number-data">24 Active</span>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {/* Lead Card: Active */}
          <div className="bg-[#F3EDF8] rounded-[16px] p-4 cursor-pointer border-l-4 border-primary transition-all shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-body-md text-[16px] font-medium text-on-background">Priya Sharma</h3>
                <p className="text-sm text-on-surface-variant">Bridal Makeup Consultation</p>
              </div>
              <span className="bg-[#FFE4E6] text-[#E11D48] text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span> Hot
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant mt-3">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 10 mins ago</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">forum</span> Instagram DM</span>
            </div>
          </div>

          {/* Lead Card: Inactive 1 */}
          <div className="bg-surface-container-lowest rounded-[16px] p-4 cursor-pointer border border-transparent hover:border-outline-variant transition-all hover:bg-surface-container">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-body-md text-[16px] font-medium text-on-background">Aisha Patel</h3>
                <p className="text-sm text-on-surface-variant">Keratin Treatment Query</p>
              </div>
              <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span> Warm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant mt-3">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 1 hr ago</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp</span>
            </div>
          </div>

          {/* Lead Card: Inactive 2 */}
          <div className="bg-surface-container-lowest rounded-[16px] p-4 cursor-pointer border border-transparent hover:border-outline-variant transition-all hover:bg-surface-container">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-body-md text-[16px] font-medium text-on-background">Neha Gupta</h3>
                <p className="text-sm text-on-surface-variant">Pricing info needed</p>
              </div>
              <span className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4B5563]"></span> Cold
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant mt-3">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 3 hrs ago</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span> Email</span>
            </div>
          </div>

          {/* Lead Card: Inactive 3 */}
          <div className="bg-surface-container-lowest rounded-[16px] p-4 cursor-pointer border border-transparent hover:border-outline-variant transition-all hover:bg-surface-container">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-body-md text-[16px] font-medium text-on-background">Simran Kaur</h3>
                <p className="text-sm text-on-surface-variant">Available slots for Saturday</p>
              </div>
              <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span> Warm
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant mt-3">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 4 hrs ago</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Panel: Conversation Transcript & Actions */}
      <section className="flex-1 flex flex-col h-full bg-surface-bright relative">
        {/* Conversation Header / Booking Summary */}
        <div className="p-6 border-b border-outline-variant bg-surface-container-lowest shrink-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-h3 text-xl">
                P
              </div>
              <div>
                <h2 className="font-h3 text-[24px] text-primary m-0">Priya Sharma</h2>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <Smartphone size={16} /> +91 98765 43210
                  <span className="w-1 h-1 rounded-full bg-outline"></span>
                  Instagram DM
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button aria-label="Mark as done" className="bg-surface border border-outline-variant text-on-surface p-2 rounded-full hover:bg-surface-container transition-colors">
                <CheckCircle size={20} />
              </button>
              <button aria-label="More options" className="bg-surface border border-outline-variant text-on-surface p-2 rounded-full hover:bg-surface-container transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
          
          {/* AI Suggested Action / Booking Summary Card */}
          <div className="bg-[#E6F4EA] border-l-4 border-[#1E8E3E] rounded-[16px] p-4 flex items-center justify-between mt-2 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#1E8E3E] mt-0.5">event_available</span>
              <div>
                <h4 className="font-medium text-[#0D5323] text-sm mb-1">High Intent Detected: Ready to Book</h4>
                <p className="text-sm text-[#137333]">Client is asking for slots for Bridal Consultation this weekend.</p>
              </div>
            </div>
            <button className="bg-[#1E8E3E] text-white px-5 py-2.5 rounded-full font-label-sm text-sm hover:bg-[#137333] transition-colors flex items-center gap-2 shadow-sm">
              <Send size={18} />
              WhatsApp pe Reply Karo
            </button>
          </div>
        </div>

        {/* Chat Transcript Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-surface-bright">
          <div className="text-center text-xs text-outline font-medium tracking-wide uppercase my-4">Today, 10:45 AM</div>
          
          {/* Client Message */}
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-surface-container-highest rounded-2xl rounded-tl-sm p-4 text-on-surface shadow-sm">
              <p className="font-body-md text-[15px] leading-relaxed">Hi! I'm getting married in December and looking for a bridal makeup artist. Do you have availability for a consultation this weekend?</p>
              <span className="text-[11px] text-outline mt-2 block text-right">10:45 AM</span>
            </div>
          </div>

          {/* AI Automated Response */}
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-primary-container text-on-primary rounded-2xl rounded-tr-sm p-4 shadow-sm relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#C8922A] rounded-full flex items-center justify-center shadow-sm border-2 border-surface-bright" title="AI Generated Response">
                <Sparkles className="text-white" size={12} />
              </div>
              <p className="font-body-md text-[15px] leading-relaxed">Hello Priya! Congratulations on your upcoming wedding! ✨ Yes, we do offer bridal consultations. We have slots open this Saturday at 11 AM or 3 PM. Would either of those work for you?</p>
              <span className="text-[11px] text-on-primary/70 mt-2 flex items-center justify-end gap-1">
                10:47 AM <span className="material-symbols-outlined text-[12px]">done_all</span>
              </span>
            </div>
          </div>

          {/* Client Message */}
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-surface-container-highest rounded-2xl rounded-tl-sm p-4 text-on-surface shadow-sm">
              <p className="font-body-md text-[15px] leading-relaxed">Saturday 3 PM works perfectly. What are the charges for the trial?</p>
              <span className="text-[11px] text-outline mt-2 block text-right">10:52 AM</span>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex justify-start items-center gap-2 mt-4 text-outline text-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
              <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </div>
            <span className="text-xs">Noor is drafting a reply...</span>
          </div>
        </div>

        {/* Input Area (Drafting) */}
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant shrink-0 z-10">
          <div className="relative flex items-end gap-3 bg-surface border border-[#EDE8E0] rounded-[24px] p-2 pl-4 focus-within:border-primary transition-colors shadow-sm">
            <button className="text-outline hover:text-primary mb-1 p-1" title="Attach file">
              <Paperclip size={20} />
            </button>
            <textarea 
              className="w-full bg-transparent border-none outline-none resize-none font-body-md text-sm py-2 max-h-[120px] min-h-[44px]" 
              placeholder="Type your message or let Noor craft it..." 
              rows={1}
            ></textarea>
            <div className="flex items-center gap-2 mb-1 pr-1">
              <button className="text-[#C8922A] bg-[#FEF3C7] hover:bg-[#FDE68A] p-2 rounded-full transition-colors flex items-center justify-center" title="Ask Noor AI to suggest reply">
                <Sparkles size={20} />
              </button>
              <button className="bg-primary-container text-on-primary p-2 rounded-full hover:bg-primary transition-colors flex items-center justify-center">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
