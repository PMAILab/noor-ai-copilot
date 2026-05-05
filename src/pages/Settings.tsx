import { ChevronRight, Star, Camera } from 'lucide-react';

export default function Settings() {
  return (
    <div className="flex-1 p-margin-page max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="font-h1 text-[48px] text-on-surface tracking-tight">Settings & Profile</h1>
        <p className="text-on-surface-variant mt-2 font-body-md text-[16px]">Manage your salon's AI copilot preferences and account details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-section-gap items-start">
        {/* Left Nav List */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <a href="#" className="px-4 py-3 rounded-lg bg-surface-container-high text-primary font-medium flex items-center justify-between transition-colors">
            Profile Details
            <ChevronRight size={16} />
          </a>
          <a href="#" className="px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium flex items-center justify-between">
            Brand Identity
            <ChevronRight size={16} />
          </a>
          <a href="#" className="px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium flex items-center justify-between">
            Billing & Plans
            <ChevronRight size={16} />
          </a>
          <a href="#" className="px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium flex items-center justify-between">
            Notifications
            <ChevronRight size={16} />
          </a>
          <a href="#" className="px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium flex items-center justify-between">
            Integrations
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Right Detail Area */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          {/* Current Plan Card */}
          <div className="bg-surface-container p-card-padding rounded-DEFAULT flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center text-white">
                <Star size={24} />
              </div>
              <div>
                <p className="text-on-surface-variant font-label-sm text-[14px] mb-1">Current Plan</p>
                <h3 className="font-h3 text-[24px] text-primary-container">Noor Luxe Co-pilot</h3>
              </div>
            </div>
            <button className="bg-secondary-container text-secondary font-label-sm text-[14px] font-bold px-6 py-2 rounded-full hover:bg-secondary-fixed transition-colors">
              Upgrade Plan
            </button>
          </div>

          {/* Profile Form Card */}
          <div className="bg-white rounded-DEFAULT p-card-padding shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-surface-variant">
            <h3 className="font-h3 text-[24px] mb-6">Personal Information</h3>
            
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-surface-variant">
              <div className="h-24 w-24 rounded-full bg-surface-container-high overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
                <div className="w-full h-full bg-surface-container flex items-center justify-center text-primary text-[24px] font-h3 font-medium">
                  SJ
                </div>
              </div>
              <div>
                <button className="px-4 py-2 border border-outline-variant text-primary rounded-full hover:bg-surface-container transition-colors font-label-sm text-[14px]">
                  Change Photo
                </button>
                <p className="text-on-surface-variant font-label-sm text-[14px] mt-2">JPG, GIF or PNG. Max size of 5MB.</p>
              </div>
            </div>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-[14px] text-on-surface">First Name</label>
                <input 
                  type="text" 
                  defaultValue="Sarah"
                  className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-[14px] text-on-surface">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Jenkins"
                  className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label-sm text-[14px] text-on-surface">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="sarah@luxe-salon.com"
                  className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label-sm text-[14px] text-on-surface">Salon Name</label>
                <input 
                  type="text" 
                  defaultValue="Luxe Beauty & Spa"
                  className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" 
                />
              </div>
            </form>
            
            <div className="mt-8 flex justify-end gap-4">
              <button className="px-6 py-2 border border-outline-variant text-on-surface rounded-full hover:bg-surface-container transition-colors font-label-sm text-[14px]">
                Cancel
              </button>
              <button className="px-6 py-2 bg-primary-container text-white rounded-full hover:bg-surface-tint transition-colors font-label-sm text-[14px]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
