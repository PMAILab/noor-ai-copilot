import { useState } from 'react';
import { ChevronRight, Target, Wallet, Calendar, Radio } from 'lucide-react';
import { GOAL_OPTIONS, CHANNEL_OPTIONS, GoalOption } from '../../lib/constants/serviceCycles';
import { FESTIVALS, getNextFestivalDate, getDaysUntil } from '../../lib/constants/festivals';

interface PlanWizardProps {
  onGenerate: (data: {
    goal: string;
    goalLabel: string;
    monthlyBudget: number;
    upcomingOccasion: string;
    channels: string[];
  }) => void;
  isLoading: boolean;
  defaultBudget?: number;
}

const STEPS = [
  { id: 1, label: 'Goal', icon: Target },
  { id: 2, label: 'Budget', icon: Wallet },
  { id: 3, label: 'Occasion', icon: Calendar },
  { id: 4, label: 'Channels', icon: Radio },
];

export default function PlanWizard({ onGenerate, isLoading, defaultBudget = 3000 }: PlanWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [budget, setBudget] = useState(defaultBudget);
  const [occasion, setOccasion] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [channels, setChannels] = useState<string[]>(['whatsapp', 'instagram']);

  // Get upcoming festivals (next 60 days)
  const upcomingFestivals = FESTIVALS.filter(f => {
    const days = getDaysUntil(getNextFestivalDate(f.date));
    return days >= 0 && days <= 60;
  }).sort((a, b) => getDaysUntil(getNextFestivalDate(a.date)) - getDaysUntil(getNextFestivalDate(b.date))).slice(0, 4);

  const toggleChannel = (id: string) => {
    if (id === 'whatsapp') return; // WhatsApp always on
    setChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    const finalOccasion = occasion === 'custom' ? customOccasion : occasion;
    onGenerate({
      goal: selectedGoal?.id || '',
      goalLabel: selectedGoal?.label || '',
      monthlyBudget: budget,
      upcomingOccasion: finalOccasion,
      channels,
    });
  };

  const canProceed = () => {
    if (step === 1) return !!selectedGoal;
    if (step === 2) return budget >= 500;
    if (step === 3) return true;
    if (step === 4) return channels.length > 0;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Progress */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone ? 'bg-primary text-white' :
                  isActive ? 'bg-primary-container text-primary border-2 border-primary' :
                  'bg-surface-container text-on-surface-variant'
                }`}>
                  {isDone ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <span className={`font-label-sm text-xs ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${isDone ? 'bg-primary' : 'bg-outline-variant'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div>
          <h2 className="font-h2 text-[28px] text-on-surface mb-2">
            Is mahine ka main goal kya hai?
          </h2>
          <p className="font-body-md text-on-surface-variant mb-8">Select one goal — Noor will build your entire plan around it.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GOAL_OPTIONS.map(goal => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                  selectedGoal?.id === goal.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-3">{goal.icon}</div>
                <p className="font-h3 text-[18px] text-on-surface mb-1">{goal.label}</p>
                <p className="font-label-sm text-on-surface-variant text-sm">{goal.labelHi}</p>
                <p className="font-body-md text-on-surface-variant text-sm mt-2 opacity-75">{goal.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div>
          <h2 className="font-h2 text-[28px] text-on-surface mb-2">
            Marketing pe kitna kharch kar sakte ho?
          </h2>
          <p className="font-body-md text-on-surface-variant mb-8">Monthly budget — WhatsApp broadcasts FREE, Meta ads optional.</p>
          
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant mb-6">
            <div className="text-center mb-6">
              <span className="font-h1 text-[56px] text-primary">₹{budget.toLocaleString('en-IN')}</span>
              <p className="font-body-md text-on-surface-variant mt-1">per month</p>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full accent-primary h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between font-label-sm text-on-surface-variant text-xs mt-2">
              <span>₹500</span><span>₹5,000</span><span>₹10,000</span>
            </div>
          </div>

          {/* Budget tier indicators */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { range: '₹500–1,500', label: 'Starter', desc: 'WhatsApp + Instagram only', color: 'bg-tertiary-fixed text-tertiary' },
              { range: '₹2,000–4,000', label: 'Growth', desc: 'WA + Insta + ₹500/day Meta ads', color: 'bg-primary-fixed text-primary' },
              { range: '₹5,000+', label: 'Accelerate', desc: 'Full multi-channel blitz', color: 'bg-secondary-container text-secondary' },
            ].map(tier => (
              <div key={tier.label} className="text-center p-3 rounded-xl bg-surface-container">
                <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${tier.color} mb-2 inline-block`}>{tier.label}</span>
                <p className="font-number-data text-sm text-on-surface font-medium">{tier.range}</p>
                <p className="font-label-sm text-xs text-on-surface-variant mt-1">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Occasion */}
      {step === 3 && (
        <div>
          <h2 className="font-h2 text-[28px] text-on-surface mb-2">
            Koi upcoming occasion hai?
          </h2>
          <p className="font-body-md text-on-surface-variant mb-8">
            Noor will build festival-specific campaigns around it.
          </p>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <button
              onClick={() => setOccasion('')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                occasion === '' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
              }`}
            >
              <p className="font-label-sm text-on-surface">Koi specific occasion nahi hai</p>
              <p className="font-body-md text-sm text-on-surface-variant">General marketing plan generate karein</p>
            </button>

            {upcomingFestivals.map(fest => {
              const days = getDaysUntil(getNextFestivalDate(fest.date));
              return (
                <button
                  key={fest.id}
                  onClick={() => setOccasion(fest.name)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                    occasion === fest.name ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
                  }`}
                >
                  <div>
                    <p className="font-label-sm text-on-surface flex items-center gap-2">
                      <span>{fest.emoji}</span> {fest.name} — <span className="font-hindi-text">{fest.nameHi}</span>
                    </p>
                    <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                      Services: {fest.relevantServices.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <span className="font-number-data text-sm text-primary bg-primary/10 px-3 py-1 rounded-full flex-shrink-0">
                    {days === 0 ? 'Today' : `${days}d`}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setOccasion('custom')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                occasion === 'custom' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
              }`}
            >
              <p className="font-label-sm text-on-surface">✏️ Custom occasion type karein</p>
            </button>
          </div>
          {occasion === 'custom' && (
            <input
              type="text"
              placeholder="e.g., My salon's anniversary, New year, Local Mela..."
              value={customOccasion}
              onChange={e => setCustomOccasion(e.target.value)}
              className="w-full border border-outline-variant rounded-xl px-4 py-3 font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          )}
        </div>
      )}

      {/* Step 4: Channels */}
      {step === 4 && (
        <div>
          <h2 className="font-h2 text-[28px] text-on-surface mb-2">
            Kaunse channels use karna chahte ho?
          </h2>
          <p className="font-body-md text-on-surface-variant mb-8">
            WhatsApp is always on (free). Add more channels anytime.
          </p>
          <div className="flex flex-col gap-4">
            {CHANNEL_OPTIONS.map(channel => {
              const isSelected = channels.includes(channel.id);
              const isLocked = channel.id === 'whatsapp';
              return (
                <button
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id)}
                  disabled={isLocked}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                  } ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{channel.icon}</span>
                    <div>
                      <p className="font-label-sm text-on-surface">
                        {channel.name}
                        {isLocked && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Always On</span>}
                        {channel.free && !isLocked && <span className="ml-2 text-xs bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded-full">Free</span>}
                        {!channel.free && <span className="ml-2 text-xs bg-secondary-fixed text-secondary px-2 py-0.5 rounded-full">Paid</span>}
                      </p>
                      <p className="font-body-md text-sm text-on-surface-variant mt-0.5 font-hindi-text">
                        {channel.nameHi}
                        {channel.requiresMeta && !isSelected && ' — Meta account required'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? 'bg-primary border-primary' : 'border-outline-variant'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-6 py-3 border border-outline-variant rounded-full font-label-sm text-on-surface hover:bg-surface-container transition-colors"
          >
            ← Back
          </button>
        ) : <div />}

        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-label-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isLoading || !canProceed()}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Generating...' : '✨ Generate My Plan'}
          </button>
        )}
      </div>
    </div>
  );
}
