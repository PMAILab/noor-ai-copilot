import { Sparkles } from 'lucide-react';

interface NoorAIBubbleProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'thinking' | 'success' | 'insight';
}

export default function NoorAIBubble({
  message = 'Noor AI is thinking...',
  size = 'md',
  variant = 'thinking',
}: NoorAIBubbleProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = { sm: 16, md: 22, lg: 30 };

  const gradients = {
    thinking: 'from-primary to-primary-container',
    success: 'from-[#22C55E] to-[#16A34A]',
    insight: 'from-[#C8922A] to-[#F59E0B]',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Animated AI orb */}
      <div className="relative flex-shrink-0">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradients[variant]} flex items-center justify-center shadow-lg`}
        >
          <Sparkles size={iconSizes[size]} className="text-white" />
        </div>
        {variant === 'thinking' && (
          <>
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradients[variant]} opacity-40 animate-ping`}
            />
          </>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="bg-surface-container border border-outline-variant rounded-2xl rounded-tl-none px-4 py-2.5 max-w-xs">
          <p className="font-body-md text-sm text-on-surface">{message}</p>
          {variant === 'thinking' && (
            <div className="flex gap-1 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
