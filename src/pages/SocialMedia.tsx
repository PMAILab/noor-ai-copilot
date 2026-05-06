import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FESTIVALS, getNextFestivalDate, getDaysUntil, type Festival } from '../lib/constants/festivals';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function FestivalCard({ festival, onClick }: { festival: Festival; onClick: () => void }) {
  const nextDate = getNextFestivalDate(festival.date);
  const daysUntil = getDaysUntil(nextDate);
  const isPast = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil <= 14;
  const isSoon = daysUntil >= 0 && daysUntil <= 30;

  return (
    <div className={`relative rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
      isPast ? 'opacity-50 grayscale' : isUrgent ? 'border-[#C8922A]/50 shadow-md' : 'border-outline-variant'
    }`} onClick={onClick}>
      {isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8922A] to-[#F59E0B]" />
      )}
      <div className="p-5 bg-surface-container-lowest">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{festival.emoji}</span>
            <div>
              <p className="font-h3 text-[16px] text-on-surface">{festival.name}</p>
              <p className="font-hindi-text text-sm text-on-surface-variant">{festival.nameHi}</p>
            </div>
          </div>
          {!isPast && (
            <div className={`text-center px-3 py-1.5 rounded-xl flex-shrink-0 ${
              daysUntil === 0 ? 'bg-red-500 text-white' :
              isUrgent ? 'bg-[#C8922A]/15 text-[#C8922A]' :
              isSoon ? 'bg-primary/10 text-primary' :
              'bg-surface-container text-on-surface-variant'
            }`}>
              <p className="font-number-data text-[20px] font-bold leading-none">{daysUntil === 0 ? 'TODAY' : daysUntil}</p>
              {daysUntil !== 0 && <p className="font-label-sm text-[10px]">days</p>}
            </div>
          )}
          {isPast && (
            <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">Passed</span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full capitalize ${
            festival.region === 'national' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {festival.region === 'national' ? '🇮🇳 National' : `📍 ${festival.region}`}
          </span>
          <span className="font-label-sm text-xs text-on-surface-variant">
            {nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {festival.relevantServices.slice(0, 3).map(svc => (
            <span key={svc} className="font-label-sm text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full capitalize">
              {svc.replace(/_/g, ' ')}
            </span>
          ))}
          {festival.relevantServices.length > 3 && (
            <span className="font-label-sm text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              +{festival.relevantServices.length - 3}
            </span>
          )}
        </div>

        {!isPast && (
          <button className={`w-full py-2.5 rounded-xl font-label-sm text-sm font-bold transition-all ${
            isUrgent
              ? 'bg-[#C8922A] text-white hover:bg-[#A0751E]'
              : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
          }`}>
            {isUrgent ? '🔥 Create Campaign Now' : '+ Create Campaign'}
          </button>
        )}
      </div>
    </div>
  );
}

function OfferPreview({ festival, onClose }: { festival: Festival; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{festival.emoji}</span>
          <div>
            <h3 className="font-h2 text-[22px] text-on-surface">{festival.name} Campaign</h3>
            <p className="font-hindi-text text-sm text-on-surface-variant">{festival.nameHi}</p>
          </div>
        </div>
        <div className="bg-surface-container rounded-xl p-4 mb-4">
          <p className="font-label-sm text-xs text-on-surface-variant mb-2">AI-generated offer template:</p>
          <p className="font-hindi-text text-sm text-on-surface leading-relaxed">{festival.offerTemplateHi}</p>
          <div className="border-t border-outline-variant my-3" />
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{festival.offerTemplate}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/campaigns/new', { state: { prefill: festival.offerTemplate, occasion: festival.name } })}
            className="w-full py-3.5 bg-primary text-white rounded-xl font-label-sm text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            🎯 Create Meta Ad Campaign
          </button>
          <button
            onClick={() => navigate('/broadcasts', { state: { prefill: festival.offerTemplateHi } })}
            className="w-full py-3 border border-[#25D366] text-[#25D366] rounded-xl font-label-sm text-sm font-bold hover:bg-[#25D366]/5 transition-colors"
          >
            💬 Send WhatsApp Broadcast
          </button>
          <button onClick={onClose} className="w-full py-2.5 text-on-surface-variant font-label-sm text-sm hover:text-on-surface transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SocialMedia() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'national'>('upcoming');

  const now = new Date();
  const currentMonth = now.getMonth();

  const filteredFestivals = FESTIVALS.filter(f => {
    const days = getDaysUntil(getNextFestivalDate(f.date));
    if (filter === 'upcoming') return days >= -1 && days <= 90;
    if (filter === 'national') return f.region === 'national';
    return true;
  }).sort((a, b) => {
    const da = getDaysUntil(getNextFestivalDate(a.date));
    const db = getDaysUntil(getNextFestivalDate(b.date));
    if (da < 0 && db < 0) return db - da;
    if (da < 0) return 1;
    if (db < 0) return -1;
    return da - db;
  });

  const upcomingCount = FESTIVALS.filter(f => {
    const d = getDaysUntil(getNextFestivalDate(f.date));
    return d >= 0 && d <= 30;
  }).length;

  return (
    <div className="p-margin-page max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-h1 text-[42px] text-on-surface mb-2">Festival Campaign Calendar</h1>
        <p className="font-body-lg text-[18px] text-on-surface-variant">
          40+ Indian festivals — auto-detected, offer templates ready, campaigns launch in 1 tap.
        </p>
      </div>

      {/* Upcoming alert */}
      {upcomingCount > 0 && (
        <div className="bg-[#C8922A]/10 border border-[#C8922A]/30 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <span className="text-2xl">🔔</span>
          <div>
            <p className="font-label-sm text-sm text-[#C8922A] font-bold">
              {upcomingCount} festival{upcomingCount > 1 ? 's' : ''} in the next 30 days!
            </p>
            <p className="font-body-md text-sm text-on-surface-variant">
              Plan ahead and launch campaigns 2 weeks early for best results.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'upcoming', label: '📅 Next 90 Days' },
          { id: 'national', label: '🇮🇳 National Festivals' },
          { id: 'all', label: '🗓️ All Festivals' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-full font-label-sm text-sm transition-all ${
              filter === f.id
                ? 'bg-primary text-white'
                : 'border border-outline-variant text-on-surface hover:border-primary/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Festival Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFestivals.map(festival => (
          <div key={festival.id}>
            <FestivalCard
              festival={festival}
              onClick={() => setSelectedFestival(festival)}
            />
          </div>
        ))}
      </div>

      {filteredFestivals.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-body-lg">No festivals match this filter</p>
        </div>
      )}

      {selectedFestival && (
        <OfferPreview festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
      )}
    </div>
  );
}
