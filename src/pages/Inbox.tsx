import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Phone, Smartphone, CheckCircle, Send, Sparkles, Paperclip, Loader2, MessageCircle } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Lead {
  id: string;
  name: string | null;
  wa_number: string;
  source: string;
  intent_score: number;
  last_message: string | null;
  last_message_at: string | null;
  status: 'new' | 'hot' | 'warm' | 'cold' | 'booked' | 'lost';
  notes: string | null;
}

const STATUS_BADGE: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  hot:    { label: 'Hot',    bg: 'bg-[#FFE4E6]', text: 'text-[#E11D48]', dot: 'bg-[#E11D48]' },
  warm:   { label: 'Warm',   bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#D97706]' },
  new:    { label: 'New',    bg: 'bg-blue-50',   text: 'text-blue-600',  dot: 'bg-blue-500' },
  cold:   { label: 'Cold',   bg: 'bg-[#F3F4F6]', text: 'text-[#4B5563]', dot: 'bg-[#4B5563]' },
  booked: { label: 'Booked', bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', dot: 'bg-[#10B981]' },
  lost:   { label: 'Lost',   bg: 'bg-[#F3F4F6]', text: 'text-[#9CA3AF]', dot: 'bg-[#D1D5DB]' },
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function Inbox() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }

    // Load all leads — filter by campaign's salon_id via join, or directly if leads has salon_id
    (sb.from as any)('leads')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(50)
      .then(({ data, error }: { data: any; error: any }) => {
        if (!error && data) {
          setLeads(data as Lead[]);
          if (data.length > 0) setSelectedLead(data[0]);
        }
        setLoading(false);
      });

    // Realtime subscription for new leads
    const channel = sb.channel('leads-inbox')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'leads' }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setLeads(prev => [payload.new as Lead, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setLeads(prev => prev.map(l => l.id === payload.new.id ? payload.new as Lead : l));
        }
      })
      .subscribe();

    return () => { sb.removeChannel(channel); };
  }, [user?.id]);

  const handleSend = async () => {
    if (!draft.trim() || !selectedLead) return;
    const msg = draft.trim();
    setDraft('');
    // TODO: call /api/whatsapp/send with the selectedLead.wa_number and msg
    console.log('Sending WA message to', selectedLead.wa_number, ':', msg);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-container-lowest relative h-[calc(100vh-80px)]">
      {/* ── Left: Lead List ── */}
      <aside className="w-[360px] bg-surface-container-low border-r border-outline-variant flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
          <h2 className="font-h3 text-[24px] text-primary">Leads</h2>
          <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-sm font-number-data">
            {leads.length} Active
          </span>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-on-surface-variant">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="font-body-md text-sm">Loading leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <MessageCircle size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-body-md text-sm">No leads yet.</p>
              <p className="font-label-sm text-xs mt-1 opacity-70">Leads appear here when people message via your campaigns.</p>
            </div>
          ) : leads.map(lead => {
            const badge = STATUS_BADGE[lead.status] || STATUS_BADGE.new;
            const isSelected = selectedLead?.id === lead.id;
            return (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left rounded-[16px] p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F3EDF8] border-l-4 border-primary shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
                    : 'bg-surface-container-lowest border border-transparent hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-body-md text-[16px] font-medium text-on-background">
                      {lead.name || lead.wa_number}
                    </h3>
                    <p className="text-sm text-on-surface-variant truncate max-w-[180px]">
                      {lead.last_message || 'No messages yet'}
                    </p>
                  </div>
                  <span className={`${badge.bg} ${badge.text} text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 flex-shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-on-surface-variant mt-3">
                  <span>{timeAgo(lead.last_message_at)}</span>
                  <span className="capitalize">{lead.source}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Right: Conversation ── */}
      <section className="flex-1 flex flex-col h-full bg-surface-bright relative">
        {!selectedLead ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-body-md">Select a lead to view conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-outline-variant bg-surface-container-lowest shrink-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-h3 text-xl">
                    {(selectedLead.name || selectedLead.wa_number)[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-h3 text-[24px] text-primary m-0">{selectedLead.name || 'Unknown'}</h2>
                    <p className="text-on-surface-variant text-sm flex items-center gap-2">
                      <Smartphone size={16} /> {selectedLead.wa_number}
                      <span className="w-1 h-1 rounded-full bg-outline" />
                      <span className="capitalize">{selectedLead.source}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${selectedLead.wa_number.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#128C7E] transition-colors"
                    title="Open in WhatsApp"
                  >
                    <Phone size={18} />
                  </a>
                  <button className="bg-surface border border-outline-variant text-on-surface p-2 rounded-full hover:bg-surface-container transition-colors">
                    <CheckCircle size={20} />
                  </button>
                  <button className="bg-surface border border-outline-variant text-on-surface p-2 rounded-full hover:bg-surface-container transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* AI intent card */}
              {selectedLead.status === 'hot' && (
                <div className="bg-[#E6F4EA] border-l-4 border-[#1E8E3E] rounded-[16px] p-4 flex items-center justify-between mt-2 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles size={18} className="text-[#1E8E3E] mt-0.5" />
                    <div>
                      <h4 className="font-medium text-[#0D5323] text-sm mb-1">High Intent Detected — Ready to Book</h4>
                      <p className="text-sm text-[#137333]">{selectedLead.last_message || 'This lead is showing high interest.'}</p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${selectedLead.wa_number.replace('+', '')}?text=Namaste! Kya aap appointment book karna chahenge?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1E8E3E] text-white px-5 py-2.5 rounded-full font-label-sm text-sm hover:bg-[#137333] transition-colors flex items-center gap-2 shadow-sm flex-shrink-0 ml-4"
                  >
                    <Send size={18} /> Reply on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-surface-bright">
              <div className="text-center text-xs text-outline font-medium tracking-wide uppercase my-4">
                Lead since {selectedLead.last_message_at ? new Date(selectedLead.last_message_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'recently'}
              </div>

              {selectedLead.last_message && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-surface-container-highest rounded-2xl rounded-tl-sm p-4 text-on-surface shadow-sm">
                    <p className="font-body-md text-[15px] leading-relaxed">{selectedLead.last_message}</p>
                    <span className="text-[11px] text-outline mt-2 block text-right">{timeAgo(selectedLead.last_message_at)}</span>
                  </div>
                </div>
              )}

              {selectedLead.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  <span className="font-medium">Note: </span>{selectedLead.notes}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant shrink-0 z-10">
              <div className="relative flex items-end gap-3 bg-surface border border-[#EDE8E0] rounded-[24px] p-2 pl-4 focus-within:border-primary transition-colors shadow-sm">
                <button className="text-outline hover:text-primary mb-1 p-1" title="Attach file">
                  <Paperclip size={20} />
                </button>
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  className="w-full bg-transparent border-none outline-none resize-none font-body-md text-sm py-2 max-h-[120px] min-h-[44px]"
                  placeholder="Type your message or let Noor craft it..."
                  rows={1}
                />
                <div className="flex items-center gap-2 mb-1 pr-1">
                  <button className="text-[#C8922A] bg-[#FEF3C7] hover:bg-[#FDE68A] p-2 rounded-full transition-colors" title="Ask Noor AI to suggest reply">
                    <Sparkles size={20} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="bg-primary-container text-on-primary p-2 rounded-full hover:bg-primary transition-colors disabled:opacity-40"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
