import { Construction } from 'lucide-react';

export default function SocialMedia() {
  return (
    <div className="flex flex-col items-center justify-center p-32 text-center max-w-2xl mx-auto">
      <div className="bg-surface-container w-24 h-24 rounded-full flex items-center justify-center mb-6 text-primary">
        <Construction size={48} />
      </div>
      <h1 className="font-h1 text-[40px] text-on-surface mb-4">Social Media</h1>
      <p className="font-body-lg text-on-surface-variant text-[18px]">
        This feature is under development. Soon, you will be able to manage your Instagram and Facebook posts directly from Noor.
      </p>
    </div>
  );
}
