import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Users, Send, Sparkles, Clock, Check, Loader2 } from 'lucide-react';
import { MOCK_BROADCASTS } from '../lib/mockData';
import { formatDate } from '../lib/utils/currency';
import { sendBroadcast } from '../lib/whatsapp';
import { insertBroadcast, updateBroadcastStatus, isSupabaseConfigured } from '../lib/supabase';

const SEGMENTS = [
  { id: 'regulars', label: 'Regulars', labelHi: 'नियमित ग्राहक', count: 142, desc: '3+ visits', color: 'text-primary bg-primary/10' },
  { id: 'occasional', label: 'Occasional', labelHi: 'कभी-कभार', count: 86, desc: '1-2 visits', color: 'text-[#C8922A] bg-[#C8922A]/10' },
  { id: 'lapsed', label: 'Lapsed', labelHi: 'लंबे समय से नहीं आए', count: 215, desc: '45+ days away', color: 'text-red-500 bg-red-50' },
  { id: 'new', label: 'New', labelHi: 'नए ग्राहक', count: 34, desc: 'First visit this month', color: 'text-[#22C55E] bg-[#22C55E]/10' },
  { id: 'all', label: 'All Clients', labelHi: 'सभी ग्राहक', count: 477, desc: 'Everyone in your database', color: 'text-on-surface bg-surface-container' },
];

const AI_TEMPLATES: Record<string, string> = {
  regulars: 'Hi [Name]! 💄 Aap hamare special clients mein se hain. Is week ke liye ek khaas offer: koi bhi 2 services lo aur paao FREE eyebrow threading. Slots limited hain — ab book karo! 😊',
  occasional: 'Hi [Name]! ✨ Kuch din ho gaye the — hum aapko yaad kar rahe the! Is week hamare paas special midweek offers hain. Kab aa rahi hain? Reply karein ya call karein! 📞',
  lapsed: 'Arre [Name], bahut din ho gaye! 🥺 Hum miss kar rahe hain aapko. Wapas aayein aur paayen 30% off kisi bhi service par. Offer sirf is week valid hai — kal mat karna! 💕',
  new: 'Hi [Name]! 🌸 Pehli visit ke baad aap kaise hain? Humein khushi hogi agar aap dobara aayein! Hamare loyalty card mein 3rd visit FREE hai. Details ke liye reply karein!',
  all: 'Hi [Name]! 🎊 Khaas khabar hai! Is week hamara anniversary offer chal raha hai — har service par 20% off. Celebrate karo hamare saath! Booking ke liye reply karein.',
};

export default function Broadcasts() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = (location.state as { prefill?: string })?.prefill;

  const [selectedSegment, setSelectedSegment] = useState('regulars');
  const [message, setMessage] = useState(prefill || AI_TEMPLATES.regulars);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendStats, setSendStats] = useState<{ sent: number; failed: number } | null>(null);
  const [sent, setSent] = useState(false);

  const segment = SEGMENTS.find(s => s.id === selectedSegment)!;

  const handleSelectSegment = (id: string) => {
    setSelectedSegment(id);
    if (!prefill) setMessage(AI_TEMPLATES[id] || AI_TEMPLATES.all);
  };

  const handleSend = async () => {
    setIsSending(true);
    setSendProgress(0);

    // Build mock recipients (in production, fetch from Supabase clients table)
    const recipients = Array.from({ length: Math.min(segment.count, 5) }, (_, i) => ({
      wa_number: `+9198765${String(i).padStart(5, '0')}`,
      name: ['Priya', 'Sunita', 'Neha', 'Kavita', 'Ritu'][i] || 'ji',
    }));

    // Save broadcast record to Supabase
    let broadcastId: string | null = null;
    if (isSupabaseConfigured()) {
      const record = await insertBroadcast({
        salon_id: 'mock-salon-id',
        plan_id: null,
        segment: selectedSegment as any,
        message_body: message,
        recipients,
        total_recipients: segment.count,
        sent_count: 0,
        read_count: 0,
        replied_count: 0,
        scheduled_at: null,
        sent_at: null,
        status: 'sending',
      });
      broadcastId = record?.id || null;
    }

    // Send via WhatsApp API
    const result = await sendBroadcast(
      recipients,
      message,
      (done, total) => setSendProgress(Math.round((done / total) * 100))
    );

    setSendStats({ sent: result.sent, failed: result.failed });

    // Update Supabase status
    if (broadcastId && isSupabaseConfigured()) {
      await updateBroadcastStatus(broadcastId, {
        status: 'sent',
        sent_count: result.sent,
        sent_at: new Date().toISOString(),
      });
    }

    setIsSending(false);
    setSent(true);
  };

  return (
    <div className="p-margin-page max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-h1 text-[42px] text-on-surface mb-2">WhatsApp Broadcasts</h1>
        <p className="font-body-lg text-[18px] text-on-surface-variant">
          Apne clients ko segment karke personalized messages bhejo — bilkul free.
        </p>
      </div>

      {sent ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
          <div className="w-20 h-20 bg-[#25D366] rounded-3xl flex items-center justify-center shadow-xl">
            <Check size={40} className="text-white" />
          </div>
          <div className="text-center">
            <h2 className="font-h2 text-[28px] text-on-surface mb-2">
              Broadcast bhej diya! 🎉
            </h2>
            <p className="font-body-md text-on-surface-variant">
              {sendStats ? `${sendStats.sent} sent · ${sendStats.failed} failed` : `${segment.count} clients ko message bheja gaya.`} Noor track karega replies.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setSent(false); setSendStats(null); setSendProgress(0); }} className="px-6 py-3 border border-outline-variant rounded-full font-label-sm text-on-surface hover:bg-surface-container transition-colors">
              New Broadcast
            </button>
            <button onClick={() => navigate('/reports')} className="px-6 py-3 bg-primary text-white rounded-full font-label-sm hover:bg-primary/90 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Segment picker */}
          <div className="lg:col-span-4">
            <h2 className="font-h3 text-[18px] text-on-surface mb-4 flex items-center gap-2">
              <Users size={18} /> Audience Segment
            </h2>
            <div className="flex flex-col gap-3">
              {SEGMENTS.map(seg => (
                <button
                  key={seg.id}
                  onClick={() => handleSelectSegment(seg.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedSegment === seg.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-sm text-sm text-on-surface">{seg.label}</p>
                      <p className="font-label-sm text-xs text-on-surface-variant font-hindi-text">{seg.labelHi}</p>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1">{seg.desc}</p>
                    </div>
                    <span className={`font-number-data text-[20px] font-bold px-3 py-1 rounded-full ${seg.color}`}>
                      {seg.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Past broadcasts */}
            <div className="mt-6">
              <h3 className="font-h3 text-[16px] text-on-surface mb-3">Past Broadcasts</h3>
              {MOCK_BROADCASTS.map(bc => (
                <div key={bc.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${
                      SEGMENTS.find(s => s.id === bc.segment)?.color || 'bg-surface-container text-on-surface'
                    }`}>{SEGMENTS.find(s => s.id === bc.segment)?.label}</span>
                    <span className="font-label-sm text-xs text-on-surface-variant">{formatDate(new Date(bc.sentAt || bc.createdAt))}</span>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">{bc.messageBody}</p>
                  <div className="flex gap-3 mt-2 font-number-data text-xs text-on-surface-variant">
                    <span>📤 {bc.sentCount}</span>
                    <span>👁️ {bc.readCount}</span>
                    <span>💬 {bc.repliedCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Composer + Preview */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Message Editor */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-h3 text-[18px] text-on-surface flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#25D366]" /> Message
                </h2>
                <button
                  onClick={() => setMessage(AI_TEMPLATES[selectedSegment] || AI_TEMPLATES.all)}
                  className="flex items-center gap-1.5 text-primary font-label-sm text-xs hover:bg-primary/5 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Sparkles size={13} /> AI Draft
                </button>
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                className="w-full border border-outline-variant rounded-xl px-4 py-3 font-hindi-text text-sm text-on-surface bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                placeholder="Apna message yahan likhein..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className="font-label-sm text-xs text-on-surface-variant">{message.length} chars</span>
                <span className="font-label-sm text-xs text-on-surface-variant">
                  Use <code className="bg-surface-container px-1 rounded">[Name]</code> for personalization
                </span>
              </div>
            </div>

            {/* Phone Preview */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
              <h2 className="font-h3 text-[18px] text-on-surface mb-4">Preview</h2>
              <div className="bg-[#ECE5DD] rounded-2xl p-4 max-w-sm mx-auto">
                <div className="bg-[#075E54] text-white p-3 rounded-t-xl -mx-4 -mt-4 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">A</div>
                  <div>
                    <div className="font-label-sm text-sm">Ananya Beauty Studio</div>
                    <div className="text-xs opacity-75">business account</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg rounded-tr-none p-3 shadow-sm">
                  <p className="font-hindi-text text-sm text-[#303030] leading-relaxed whitespace-pre-line">
                    {message.replace('[Name]', 'Priya')}
                  </p>
                  <div className="text-right text-[11px] text-[#999] mt-1">10:42 AM ✓✓</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6">
              <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-4 mb-4 flex items-center gap-3">
                <Sparkles size={16} className="text-[#C8922A]" />
                <p className="font-body-md text-sm text-on-surface">
                  <span className="font-bold">Noor Tip:</span> Subah 10–11 AM ya shaam 7–8 PM ko bhejne se zyada response milta hai.
                </p>
              </div>
              {isSending && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-label-sm text-xs text-on-surface-variant">Sending...</span>
                    <span className="font-number-data text-xs text-primary">{sendProgress}%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#25D366] transition-all duration-300 rounded-full"
                      style={{ width: `${sendProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleSend}
                  disabled={isSending || !message.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-xl font-label-sm text-[15px] font-bold hover:bg-[#128C7E] transition-colors disabled:opacity-60 shadow-lg"
                >
                  {isSending ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending {sendProgress}%...</>
                  ) : (
                    <><Send size={18} /> Send to {segment.count} {segment.label}</>
                  )}
                </button>
                <button className="flex items-center gap-2 px-5 py-4 border border-outline-variant rounded-xl font-label-sm text-sm text-on-surface hover:bg-surface-container transition-colors">
                  <Clock size={16} /> Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
