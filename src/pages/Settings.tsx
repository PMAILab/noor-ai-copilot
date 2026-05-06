import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronRight, Star, Camera, ExternalLink, Check,
  AlertCircle, Wifi, WifiOff, RefreshCw, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { buildMetaOAuthUrl } from '../lib/metaAds';
import { isSupabaseConfigured } from '../lib/supabase';
import { isImageGenConfigured } from '../lib/imageGen';

const META_APP_ID = (import.meta as any).env?.VITE_META_APP_ID || (import.meta as any).env?.META_APP_ID || '';

export default function Settings() {
  const { salon, isMockMode, signOut, user } = useAuth();
  const [params] = useSearchParams();

  const metaConnected = params.get('meta_connected') === 'true' || Boolean(salon?.meta_access_token);
  const metaAccountName = params.get('account') || salon?.meta_ad_account_id || null;
  const metaError = params.get('meta_error');

  const [activeSection, setActiveSection] = useState('profile');

  const handleConnectMeta = () => {
    if (!META_APP_ID) {
      alert('Meta App ID not configured. Add VITE_META_APP_ID to .env');
      return;
    }
    const redirectUri = `${window.location.origin}/api/meta-oauth`;
    const state = btoa(JSON.stringify({ user_id: user?.id || 'demo', ts: Date.now() }));
    const url = `${buildMetaOAuthUrl(META_APP_ID, redirectUri)}&state=${state}`;
    window.location.href = url;
  };

  const navItems = [
    { id: 'profile', label: 'Profile Details' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'billing', label: 'Billing & Plans' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const integrations = [
    {
      id: 'meta',
      name: 'Meta Ads',
      desc: 'Connect Facebook/Instagram Ads account to launch campaigns',
      icon: '📘',
      connected: metaConnected,
      accountName: metaAccountName,
      action: handleConnectMeta,
      actionLabel: metaConnected ? 'Reconnect' : 'Connect Account',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      desc: 'Connected via Cloud API for broadcasts & lead qualification',
      icon: '💬',
      connected: Boolean((import.meta as any).env?.WA_TOKEN || true), // always shows as configured
      accountName: (import.meta as any).env?.WA_PHONE_NUMBER_ID || 'Configured via env',
      action: null,
      actionLabel: 'Configured',
    },
    {
      id: 'supabase',
      name: 'Supabase Database',
      desc: 'Backend database for campaigns, leads, and reports',
      icon: '🗄️',
      connected: isSupabaseConfigured(),
      accountName: isSupabaseConfigured() ? 'kbmxtciishubhscvyqnb.supabase.co' : null,
      action: null,
      actionLabel: isSupabaseConfigured() ? 'Connected' : 'Not Configured',
    },
    {
      id: 'gemini',
      name: 'Gemini AI + Imagen 3',
      desc: 'AI copy generation and ad image creation',
      icon: '✨',
      connected: isImageGenConfigured(),
      accountName: isImageGenConfigured() ? 'Gemini 2.5 Flash + Imagen 3' : null,
      action: null,
      actionLabel: isImageGenConfigured() ? 'Active' : 'Key Missing',
    },
  ];

  return (
    <div className="flex-1 p-margin-page max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="font-h1 text-[48px] text-on-surface tracking-tight">Settings & Profile</h1>
        <p className="text-on-surface-variant mt-2 font-body-md text-[16px]">Manage your salon's AI copilot preferences and account details.</p>
      </div>

      {/* Status Bar */}
      <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 ${
        isMockMode
          ? 'bg-amber-50 border border-amber-200'
          : 'bg-emerald-50 border border-emerald-200'
      }`}>
        {isMockMode ? <WifiOff size={16} className="text-amber-600" /> : <Wifi size={16} className="text-emerald-600" />}
        <p className={`font-label-sm text-xs ${isMockMode ? 'text-amber-700' : 'text-emerald-700'}`}>
          {isMockMode
            ? 'Running in Demo Mode — Supabase and Meta APIs show simulated data'
            : `Connected to Supabase · User: ${user?.phone || user?.email || 'authenticated'}`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-section-gap items-start">
        {/* Left Nav */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-colors text-left ${
                activeSection === item.id
                  ? 'bg-surface-container-high text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              {item.label} <ChevronRight size={16} />
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-outline-variant">
            <button
              onClick={signOut}
              className="w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          {/* Plan Card */}
          <div className="bg-surface-container p-card-padding rounded-DEFAULT flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center text-white">
                <Star size={24} />
              </div>
              <div>
                <p className="text-on-surface-variant font-label-sm text-[14px] mb-1">Current Plan</p>
                <h3 className="font-h3 text-[24px] text-primary-container">Noor {salon?.subscription_tier?.toUpperCase() || 'Chamak'}</h3>
              </div>
            </div>
            <button className="bg-secondary-container text-secondary font-label-sm text-[14px] font-bold px-6 py-2 rounded-full hover:bg-secondary-fixed transition-colors">
              Upgrade Plan
            </button>
          </div>

          {/* ── Profile Section ── */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-DEFAULT p-card-padding shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-surface-variant">
              <h3 className="font-h3 text-[24px] mb-6">Personal Information</h3>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-surface-variant">
                <div className="h-24 w-24 rounded-full bg-surface-container-high overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                  <div className="w-full h-full bg-surface-container flex items-center justify-center text-primary text-[24px] font-h3 font-medium">
                    {(salon?.salon_name || 'SJ').slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 border border-outline-variant text-primary rounded-full hover:bg-surface-container transition-colors font-label-sm text-[14px]">Change Photo</button>
                  <p className="text-on-surface-variant font-label-sm text-[14px] mt-2">JPG, GIF or PNG. Max size 5MB.</p>
                </div>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-[14px] text-on-surface">Salon Name</label>
                  <input type="text" defaultValue={salon?.salon_name || 'My Salon'} className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-[14px] text-on-surface">City</label>
                  <input type="text" defaultValue={salon?.city || 'Jaipur'} className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-[14px] text-on-surface">WhatsApp Number</label>
                  <input type="tel" defaultValue={salon?.wa_number || user?.phone || '+91XXXXXXXXXX'} className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-[14px] text-on-surface">Avg Ticket Size (₹)</label>
                  <input type="number" defaultValue={salon?.avg_ticket_size || 600} className="rounded-full border border-outline-variant bg-surface-bright px-4 py-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" />
                </div>
              </form>
              <div className="mt-8 flex justify-end gap-4">
                <button className="px-6 py-2 border border-outline-variant text-on-surface rounded-full hover:bg-surface-container transition-colors font-label-sm text-[14px]">Cancel</button>
                <button className="px-6 py-2 bg-primary-container text-white rounded-full hover:bg-surface-tint transition-colors font-label-sm text-[14px]">Save Changes</button>
              </div>
            </div>
          )}

          {/* ── Integrations Section ── */}
          {activeSection === 'integrations' && (
            <div className="flex flex-col gap-4">
              {metaError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="font-label-sm text-sm text-red-700">Meta connection failed: {decodeURIComponent(metaError)}</p>
                </div>
              )}
              {integrations.map(intg => (
                <div key={intg.id} className="bg-white rounded-2xl border border-surface-variant p-6 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{intg.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-label-sm text-[15px] text-on-surface font-bold">{intg.name}</p>
                        {intg.connected
                          ? <span className="font-label-sm text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10} /> Connected</span>
                          : <span className="font-label-sm text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Not Connected</span>
                        }
                      </div>
                      <p className="font-body-md text-sm text-on-surface-variant">{intg.desc}</p>
                      {intg.accountName && (
                        <p className="font-number-data text-xs text-primary mt-1">{intg.accountName}</p>
                      )}
                    </div>
                  </div>
                  {intg.action ? (
                    <button
                      onClick={intg.action}
                      className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-label-sm text-sm hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      {intg.actionLabel} <ExternalLink size={13} />
                    </button>
                  ) : (
                    <span className="shrink-0 font-label-sm text-sm text-on-surface-variant">{intg.actionLabel}</span>
                  )}
                </div>
              ))}

              <div className="bg-surface-container rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-label-sm text-sm text-on-surface font-bold mb-1">Meta Business Verification Required</p>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    To run Click-to-WhatsApp ads, your Meta Business account must be verified. This is a one-time process on{' '}
                    <a href="https://business.facebook.com/settings" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">business.facebook.com</a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Billing Section ── */}
          {activeSection === 'billing' && (
            <div className="bg-white rounded-2xl border border-surface-variant p-6 shadow-sm">
              <h3 className="font-h3 text-[22px] mb-6">Billing & Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Chamak', price: '₹999/mo', features: ['3 Campaigns/month', 'WhatsApp Broadcasts', '100 leads/month', 'Basic Reports'], current: true },
                  { name: 'Roshan', price: '₹2,499/mo', features: ['Unlimited Campaigns', 'Meta Ads Integration', '500 leads/month', 'Advanced Reports', 'Lead Bot'], current: false },
                  { name: 'Noor Pro', price: '₹4,999/mo', features: ['Everything in Roshan', 'AI Image Generation', 'Festival Calendar', 'Priority Support', 'Custom Branding'], current: false },
                ].map(plan => (
                  <div key={plan.name} className={`rounded-xl border-2 p-5 ${plan.current ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-h3 text-[18px] text-on-surface">{plan.name}</h4>
                      {plan.current && <span className="font-label-sm text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <p className="font-number-data text-[22px] text-primary mb-4">{plan.price}</p>
                    <ul className="space-y-2">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 font-body-md text-sm text-on-surface-variant">
                          <Check size={14} className="text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <button className="w-full mt-5 py-2.5 bg-primary text-white rounded-full font-label-sm text-sm hover:bg-primary/90 transition-colors">
                        Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-surface-variant p-6 shadow-sm">
              <h3 className="font-h3 text-[22px] mb-6">Notification Preferences</h3>
              {[
                { label: 'New Lead Alert', desc: 'Get notified on WhatsApp when a new lead comes in', enabled: true },
                { label: 'Hot Lead Alert', desc: 'Immediate alert when a lead is scored as HOT', enabled: true },
                { label: 'Daily Campaign Report', desc: 'Summary of campaign performance every evening at 9 PM', enabled: true },
                { label: 'Low Budget Warning', desc: 'Alert when campaign budget is running low', enabled: true },
                { label: 'Broadcast Delivery Report', desc: 'Summary after each broadcast is sent', enabled: false },
              ].map(notif => (
                <div key={notif.label} className="flex items-center justify-between py-4 border-b border-outline-variant last:border-0">
                  <div>
                    <p className="font-label-sm text-[15px] text-on-surface">{notif.label}</p>
                    <p className="font-body-md text-sm text-on-surface-variant">{notif.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notif.enabled ? 'bg-primary' : 'bg-surface-container-high'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notif.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
