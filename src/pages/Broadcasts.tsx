import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageCircle, Users, Send, Sparkles, Loader2, Plus, Upload,
  Phone, Trash2, CheckSquare, Square, X, Download, AlertCircle, CheckCircle2,
  UserPlus, Search
} from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { sendBroadcast } from '../lib/whatsapp';

interface Contact {
  id: string;
  name: string;
  wa_number: string;
  tags: string[];
  created_at: string;
}

const AI_TEMPLATES: Record<string, string> = {
  offer:      'Hi [Name]! 💄 Apka din special banana chahte hain hum! Is hafte ek khaas offer: koi bhi 2 services lo aur paao FREE eyebrow threading. Slots limited hain — ab book karo! 😊',
  reminder:   'Hi [Name]! ✨ Kuch din ho gaye the — hum aapko yaad kar rahe the! Is week hamare paas special midweek offers hain. Kab aa rahi hain? Reply karein ya call karein! 📞',
  winback:    'Arre [Name], bahut din ho gaye! 🥺 Hum miss kar rahe hain aapko. Wapas aayein aur paayen 30% off kisi bhi service par. Offer sirf is week valid hai! 💕',
  new:        'Hi [Name]! 🌸 Pehli visit ke baad aap kaise hain? Humein khushi hogi agar aap dobara aayein! Hamare loyalty card mein 3rd visit FREE hai. Details ke liye reply karein!',
  festive:    'Hi [Name]! 🎊 Khaas khabar hai! Is week hamara anniversary offer chal raha hai — har service par 20% off. Celebrate karo hamare saath! Booking ke liye reply karein.',
};

export default function Broadcasts() {
  const location = useLocation();
  const { user } = useAuth();
  const prefill = (location.state as { prefill?: string })?.prefill;

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  // Add contact panel
  const [showAddContact, setShowAddContact] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addTags, setAddTags] = useState('');
  const [addingContact, setAddingContact] = useState(false);

  // CSV import
  const [importError, setImportError] = useState<string | null>(null);

  // Broadcast message
  const [message, setMessage] = useState(prefill || AI_TEMPLATES.offer);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);
  const [waNotConfigured, setWaNotConfigured] = useState(false);

  // Fetch contacts
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !user?.id) { setLoadingContacts(false); return; }

    (sb.from as any)('contacts')
      .select('*')
      .eq('salon_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }: { data: any; error: any }) => {
        if (!error && data) setContacts(data as Contact[]);
        setLoadingContacts(false);
      });
  }, [user?.id]);

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.wa_number.includes(search)
  );

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  // ── Add Contact ─────────────────────────────────────────────────────────────
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addPhone.trim()) return;
    const sb = getSupabase();
    if (!sb || !user?.id) return;
    setAddingContact(true);

    const phone = addPhone.trim().replace(/\s+/g, '');
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/^0/, '')}`;
    const tags = addTags.split(',').map(t => t.trim()).filter(Boolean);

    const { data, error } = await (sb.from as any)('contacts').insert({
      salon_id: user.id,
      name: addName.trim(),
      wa_number: formattedPhone,
      tags,
    }).select().single();

    if (!error && data) {
      setContacts(prev => [data as Contact, ...prev]);
      setSelectedIds(prev => new Set([...prev, (data as Contact).id]));
    }
    setAddName(''); setAddPhone(''); setAddTags('');
    setShowAddContact(false);
    setAddingContact(false);
  };

  // ── CSV Import ───────────────────────────────────────────────────────────────
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const sb = getSupabase();
      if (!sb || !user?.id) return;

      const newContacts: Contact[] = [];
      for (const line of lines.slice(1)) { // skip header
        const [name, phone] = line.split(',').map(s => s.replace(/"/g, '').trim());
        if (!name || !phone) continue;
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/^0/, '')}`;
        const { data } = await (sb.from as any)('contacts').insert({
          salon_id: user.id,
          name,
          wa_number: formattedPhone,
          tags: [],
        }).select().single();
        if (data) newContacts.push(data as Contact);
      }
      setContacts(prev => [...newContacts, ...prev]);
      setSelectedIds(prev => new Set([...prev, ...newContacts.map(c => c.id)]));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Delete contact ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    const sb = getSupabase();
    if (!sb) return;
    await (sb.from as any)('contacts').delete().eq('id', id);
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  // ── Send Broadcast ───────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (selectedIds.size === 0 || !message.trim()) return;
    setIsSending(true);
    setSendResult(null);

    const recipients = contacts
      .filter(c => selectedIds.has(c.id))
      .map(c => ({ wa_number: c.wa_number, name: c.name }));

    let sent = 0, failed = 0;
    let notConfigured = false;

    for (const r of recipients) {
      const personalised = message.replace(/\[Name\]/g, r.name.split(' ')[0]);
      try {
        const result = await sendBroadcast([r], personalised);
        if ((result as any)?.mock) {
          notConfigured = true;
          sent += 1; // counted as sent in mock mode
        } else {
          sent += result.sent ?? 1;
          failed += result.failed ?? 0;
        }
      } catch {
        failed += 1;
      }
    }

    setWaNotConfigured(notConfigured);
    setSendResult({ sent, failed });
    setIsSending(false);
  };

  const selectedContacts = contacts.filter(c => selectedIds.has(c.id));

  return (
    <div className="p-margin-page max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-h1 text-[42px] text-on-surface mb-2">Broadcasts</h1>
        <p className="font-body-lg text-[18px] text-on-surface-variant">
          Send personalised WhatsApp messages to your clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* ── LEFT: Contacts ── */}
        <div className="space-y-4">
          {/* Contacts header */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-h3 text-[20px] text-on-surface flex items-center gap-2">
                <Users size={20} className="text-primary" /> Contacts
                <span className="ml-1 text-xs font-normal text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                  {contacts.length}
                </span>
              </h2>
              <div className="flex gap-2">
                {/* CSV Import */}
                <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 border border-outline-variant rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors font-medium">
                  <Upload size={14} /> Import CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
                </label>
                <button
                  onClick={() => setShowAddContact(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  <UserPlus size={14} /> Add Contact
                </button>
              </div>
            </div>

            {/* CSV format hint */}
            <p className="text-xs text-on-surface-variant mb-3">
              CSV format: <span className="font-mono bg-surface-container px-1 py-0.5 rounded">Name, Phone Number</span> (one per line, header row optional)
            </p>

            {importError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                <AlertCircle size={13} /> {importError}
              </div>
            )}

            {/* Add Contact form */}
            {showAddContact && (
              <form onSubmit={handleAddContact} className="bg-surface-container rounded-xl p-4 mb-4 border border-outline-variant">
                <h3 className="font-label-sm text-sm font-semibold text-on-surface mb-3">New Contact</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1">Name *</label>
                    <input
                      type="text" value={addName} onChange={e => setAddName(e.target.value)}
                      className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:border-primary"
                      placeholder="Priya Sharma" required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1">WhatsApp Number *</label>
                    <input
                      type="tel" value={addPhone} onChange={e => setAddPhone(e.target.value)}
                      className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:border-primary"
                      placeholder="9876543210" required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-on-surface-variant mb-1">Tags (comma-separated)</label>
                  <input
                    type="text" value={addTags} onChange={e => setAddTags(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:outline-none focus:border-primary"
                    placeholder="regular, bridal"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={addingContact}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center gap-1.5">
                    {addingContact ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Save
                  </button>
                  <button type="button" onClick={() => setShowAddContact(false)}
                    className="px-4 py-2 border border-outline-variant rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Search + Select All */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface focus:outline-none focus:border-primary"
                  placeholder="Search by name or number..."
                />
              </div>
              {filteredContacts.length > 0 && (
                <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors font-medium whitespace-nowrap">
                  {selectedIds.size === filteredContacts.length ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
                  {selectedIds.size === filteredContacts.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {/* Contact list */}
            {loadingContacts ? (
              <div className="flex items-center justify-center py-10 text-on-surface-variant">
                <Loader2 size={24} className="animate-spin mr-2" />
                <span className="text-sm">Loading contacts...</span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <Phone size={36} className="mx-auto mb-3 opacity-20" />
                <p className="font-body-md text-sm font-medium mb-1">
                  {contacts.length === 0 ? 'No contacts yet' : 'No matches'}
                </p>
                <p className="text-xs opacity-70">
                  {contacts.length === 0
                    ? 'Add contacts manually or import a CSV to get started.'
                    : 'Try a different search term.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {filteredContacts.map(c => {
                  const selected = selectedIds.has(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleSelect(c.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                        selected
                          ? 'bg-primary/5 border-primary/30'
                          : 'bg-surface border-transparent hover:bg-surface-container hover:border-outline-variant'
                      }`}
                    >
                      {selected ? (
                        <CheckSquare size={16} className="text-primary shrink-0" />
                      ) : (
                        <Square size={16} className="text-outline shrink-0" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{c.name}</p>
                        <p className="text-xs text-on-surface-variant">{c.wa_number}</p>
                      </div>
                      {c.tags.map(t => (
                        <span key={t} className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full shrink-0">{t}</span>
                      ))}
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(c.id); }}
                        className="p-1.5 text-outline hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Compose ── */}
        <div className="space-y-4">
          {/* Quick templates */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5">
            <h2 className="font-h3 text-[16px] text-on-surface mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" /> Quick Templates
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries({ offer: '🎁 Offer', reminder: '🔔 Reminder', winback: '💕 Win-Back', new: '🌸 New Client', festive: '🎊 Festive' }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMessage(AI_TEMPLATES[key])}
                  className="text-xs px-3 py-1.5 bg-surface-container border border-outline-variant rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Message composer */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5">
            <h2 className="font-h3 text-[16px] text-on-surface mb-3 flex items-center gap-2">
              <MessageCircle size={16} className="text-primary" /> Message
            </h2>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={7}
              className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Type your message... Use [Name] for personalisation"
            />
            <p className="text-xs text-on-surface-variant mt-2">
              Use <span className="font-mono bg-surface-container px-1 rounded">[Name]</span> — auto-replaced with each contact's first name
            </p>
          </div>

          {/* Summary + Send */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-label-sm text-xs text-on-surface-variant">Recipients</p>
                <p className="font-number-data text-[28px] font-bold text-on-surface">{selectedIds.size}</p>
              </div>
              <div className="text-right">
                <p className="font-label-sm text-xs text-on-surface-variant">Message length</p>
                <p className="font-number-data text-[28px] font-bold text-on-surface">{message.length}</p>
              </div>
            </div>

            {selectedIds.size === 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                <AlertCircle size={13} /> Select at least one contact to send.
              </div>
            )}

            {/* Send result */}
            {sendResult && (
              <div className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2.5 mb-3 border ${
                sendResult.failed > 0
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-green-700 bg-green-50 border-green-200'
              }`}>
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Broadcast sent!</p>
                  <p>✅ {sendResult.sent} sent · {sendResult.failed > 0 ? `❌ ${sendResult.failed} failed` : ''}</p>
                  {waNotConfigured && (
                    <p className="mt-1 text-amber-600">⚠️ WhatsApp not connected — go to Settings → Connect WhatsApp to send real messages.</p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={isSending || selectedIds.size === 0 || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {isSending ? (
                <><Loader2 size={16} className="animate-spin" /> Sending to {selectedIds.size} contacts...</>
              ) : (
                <><Send size={16} /> Send to {selectedIds.size} Contact{selectedIds.size !== 1 ? 's' : ''}</>
              )}
            </button>
          </div>

          {/* Download template */}
          <button
            onClick={() => {
              const csv = 'Name,Phone Number\nPriya Sharma,9876543210\nAnanya Gupta,9123456789';
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'contacts_template.csv'; a.click();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-xl text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <Download size={13} /> Download CSV Template
          </button>
        </div>
      </div>
    </div>
  );
}
