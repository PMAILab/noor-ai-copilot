import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Instagram, Target, Clock, CheckCircle2, Play } from 'lucide-react';
import type { MarketingPlan, PlanAction } from '../../lib/mockData';
import { formatCurrencyFull } from '../../lib/utils/currency';
import { useNavigate } from 'react-router-dom';

interface PlanTimelineProps {
  plan: MarketingPlan;
  onActionComplete?: (weekIdx: number, actionIdx: number) => void;
}

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle size={16} className="text-[#25D366]" />,
  instagram: <Instagram size={16} className="text-pink-500" />,
  meta_ads: <Target size={16} className="text-blue-500" />,
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  meta_ads: 'Meta Ads',
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  broadcast: 'Broadcast',
  campaign: 'Ad Campaign',
  story: 'Story',
  reel: 'Reel',
};

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ActionCard({ action, onComplete, onDoNow }: {
  action: PlanAction;
  onComplete: () => void;
  onDoNow: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(action.copy_suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
      action.completed
        ? 'border-[#22C55E]/30 bg-[#22C55E]/5'
        : 'border-outline-variant bg-surface-container-lowest hover:border-primary/30 hover:shadow-sm'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-number-data text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              {action.day}
            </span>
            <div className="flex items-center gap-1.5 font-label-sm text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
              {CHANNEL_ICONS[action.channel]}
              {CHANNEL_LABELS[action.channel]}
            </div>
            <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {ACTION_TYPE_LABELS[action.action_type]}
            </span>
            {action.estimated_cost > 0 && (
              <span className="font-label-sm text-xs text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">
                {formatCurrencyFull(action.estimated_cost)}
              </span>
            )}
            {action.time_needed_minutes && (
              <span className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1">
                <Clock size={11} /> {action.time_needed_minutes}m
              </span>
            )}
          </div>
          <button
            onClick={onComplete}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              action.completed
                ? 'bg-[#22C55E] border-[#22C55E]'
                : 'border-outline-variant hover:border-[#22C55E]'
            }`}
          >
            {action.completed && <CheckCircle2 size={14} className="text-white" />}
          </button>
        </div>

        {/* Description */}
        <p className={`font-body-md text-sm mb-3 ${action.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
          {action.description}
        </p>

        {/* Copy suggestion */}
        {!action.completed && (
          <div className="bg-surface-container rounded-lg p-3 mb-3 relative group cursor-pointer" onClick={handleCopy}>
            <p className="font-hindi-text text-sm text-on-surface-variant leading-relaxed line-clamp-3">
              "{action.copy_suggestion}"
            </p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-label-sm text-xs bg-surface-container-high text-on-surface px-2 py-1 rounded-md">
                {copied ? '✓ Copied!' : 'Copy'}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        {!action.completed && (
          <div className="flex gap-2">
            <button
              onClick={onDoNow}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full font-label-sm text-xs hover:bg-primary/90 transition-colors"
            >
              <Play size={12} /> Do it now
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant text-on-surface rounded-full font-label-sm text-xs hover:bg-surface-container transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy Text'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlanTimeline({ plan, onActionComplete }: PlanTimelineProps) {
  const navigate = useNavigate();
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  const currentWeek = plan.weeklyActions.find(w =>
    w.actions.some(a => !a.completed)
  )?.week || 1;

  const handleDoNow = (action: PlanAction) => {
    if (action.action_type === 'campaign') {
      navigate('/campaigns/new', { state: { prefill: action.copy_suggestion, goal: action.description } });
    } else if (action.action_type === 'broadcast') {
      navigate('/broadcasts', { state: { prefill: action.copy_suggestion } });
    } else {
      navigator.clipboard.writeText(action.copy_suggestion);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {plan.weeklyActions.map((week, weekIdx) => {
        const isExpanded = expandedWeek === week.week;
        const weekCompleted = week.actions.filter(a => a.completed).length;
        const weekTotal = week.actions.length;
        const isCurrent = week.week === currentWeek;

        return (
          <div
            key={week.week}
            className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
              isCurrent ? 'border-primary/40 shadow-md' : 'border-outline-variant'
            }`}
          >
            {/* Week Header */}
            <button
              onClick={() => setExpandedWeek(isExpanded ? 0 : week.week)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-number-data font-bold text-sm flex-shrink-0 ${
                  weekCompleted === weekTotal
                    ? 'bg-[#22C55E] text-white'
                    : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}>
                  W{week.week}
                </div>
                <div>
                  <p className="font-h3 text-[16px] text-on-surface flex items-center gap-2">
                    {week.theme}
                    {isCurrent && (
                      <span className="font-label-sm text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(weekCompleted / weekTotal) * 100}%` }}
                        />
                      </div>
                      <span className="font-label-sm text-xs text-on-surface-variant">
                        {weekCompleted}/{weekTotal} done
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {isExpanded ? <ChevronUp size={20} className="text-on-surface-variant flex-shrink-0" /> : <ChevronDown size={20} className="text-on-surface-variant flex-shrink-0" />}
            </button>

            {/* Week Actions */}
            {isExpanded && (
              <div className="px-5 pb-5 flex flex-col gap-3 border-t border-outline-variant pt-4">
                {week.actions
                  .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
                  .map((action, actionIdx) => (
                  <div key={`${week.week}-${actionIdx}`}>
                    <ActionCard
                      action={action}
                      onComplete={() => onActionComplete?.(weekIdx, actionIdx)}
                      onDoNow={() => handleDoNow(action)}
                    />
                  </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
