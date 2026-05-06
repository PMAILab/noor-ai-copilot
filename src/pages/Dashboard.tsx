import { useNavigate } from 'react-router-dom';
import { Eye, Pointer, Sparkles, Megaphone, Users, Pause, Edit2, TrendingUp, Calendar, CheckCircle2, BarChart, Wand2 } from 'lucide-react';
import { MOCK_PLAN } from '../lib/mockData';
import { formatCurrencyFull } from '../lib/utils/currency';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { salon, isMockMode } = useAuth();
  const salonName = salon?.salon_name || 'Ananya';
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-margin-page flex flex-col gap-section-gap max-w-7xl mx-auto w-full">
      {/* Welcome & Quick Actions Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="font-h1 text-[48px] text-on-surface mb-2">{greeting}, {salonName.split(' ')[0]} {isMockMode && <span className="text-base text-amber-500 font-body-md">(Demo)</span>}</h2>
          <p className="font-body-lg text-[18px] text-on-surface-variant">
            Here is a quick overview of your salon's marketing performance.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => navigate('/broadcasts')}
            className="bg-surface-container-lowest border border-[#EDE8E0] text-on-surface font-label-sm text-[14px] px-5 py-2.5 rounded-full hover:bg-surface-container transition-colors shadow-soft flex items-center gap-2"
          >
            <Megaphone className="text-[#C8922A]" size={18} />
            Broadcast
          </button>
          <button 
            onClick={() => navigate('/inbox')}
            className="bg-surface-container-lowest border border-[#EDE8E0] text-on-surface font-label-sm text-[14px] px-5 py-2.5 rounded-full hover:bg-surface-container transition-colors shadow-soft flex items-center gap-2"
          >
            <Users className="text-primary" size={18} />
            Leads
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="bg-surface-container-lowest border border-[#EDE8E0] text-on-surface font-label-sm text-[14px] px-5 py-2.5 rounded-full hover:bg-surface-container transition-colors shadow-soft flex items-center gap-2"
          >
            <BarChart size={18} className="text-primary" />
            Reports
          </button>
          <button 
            onClick={() => navigate('/marketing-plan')}
            className="bg-primary text-white font-label-sm text-[14px] px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
          >
            <Wand2 size={18} />
            Build Plan
          </button>
        </div>
      </div>

      {/* Metric Cards (Bento style row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-full bg-primary-fixed">
              <Eye className="text-primary-container" size={24} />
            </div>
            <span className="font-label-sm text-[14px] text-secondary bg-secondary-fixed px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
            </span>
          </div>
          <div>
            <p className="font-label-sm text-[14px] text-on-surface-variant mb-1">Total Reach</p>
            <p className="font-number-data text-[28px] font-medium text-on-surface">24,500</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-full bg-tertiary-fixed">
              <Pointer className="text-[#C8922A]" size={24} />
            </div>
            <span className="font-label-sm text-[14px] text-secondary bg-secondary-fixed px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 8%
            </span>
          </div>
          <div>
            <p className="font-label-sm text-[14px] text-on-surface-variant mb-1">Engagement Rate</p>
            <p className="font-number-data text-[28px] font-medium text-on-surface">4.2%</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C8922A]"></div>
          <div className="flex justify-between items-start pl-2">
            <div className="p-3 rounded-full bg-surface-variant">
              <Sparkles className="text-primary" size={24} />
            </div>
          </div>
          <div className="pl-2">
            <p className="font-label-sm text-[14px] text-on-surface-variant mb-1">Noor Insight</p>
            <p className="font-body-md text-[16px] text-on-surface">
              Your recent 'Bridal Prep' posts are outperforming usual content by 30%. Consider boosting them.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Progress Card */}
      <div className="bg-gradient-to-r from-primary/8 to-primary-container/20 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <Wand2 size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-xs text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">Active Plan</span>
            </div>
            <p className="font-h3 text-[16px] text-on-surface">{MOCK_PLAN.goal}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-32 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(MOCK_PLAN.actionsCompleted / MOCK_PLAN.actionsTotal) * 100}%` }}
                  />
                </div>
                <span className="font-label-sm text-xs text-on-surface-variant">
                  {MOCK_PLAN.actionsCompleted}/{MOCK_PLAN.actionsTotal} actions done this month
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/marketing-plan')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-label-sm text-sm hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <CheckCircle2 size={16} /> View Full Plan
        </button>
      </div>

      {/* Active Campaign & Lower Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Active Campaign & Chart */}
        <div className="lg:col-span-8 flex flex-col gap-section-gap">
          {/* Active Campaign Card */}
          <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 pl-2">
              <div className="flex items-center gap-3">
                <h3 className="font-h3 text-[24px] text-on-surface">Diwali Glow Up Special</h3>
                <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-full font-label-sm text-[14px]">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></div>
                  Live
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#EDE8E0] rounded-full font-label-sm text-[14px] text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1">
                  <Pause size={16} /> Pause
                </button>
                <button className="px-4 py-2 bg-surface-variant rounded-full font-label-sm text-[14px] text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-1">
                  <Edit2 size={16} /> Edit
                </button>
              </div>
            </div>
            
            <div className="pl-2 mb-6">
              <div className="flex justify-between font-label-sm text-[14px] text-on-surface-variant mb-2">
                <span>Spend: ₹12,000 / ₹20,000</span>
                <span>60%</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary-container w-[60%] rounded-full"></div>
              </div>
            </div>
            
            <div className="pl-2 flex gap-6 border-t border-outline-variant pt-4">
              <div>
                <p className="font-label-sm text-[14px] text-on-surface-variant">Leads Gen</p>
                <p className="font-number-data text-[20px] text-on-surface">145</p>
              </div>
              <div>
                <p className="font-label-sm text-[14px] text-on-surface-variant">Cost per Lead</p>
                <p className="font-number-data text-[20px] text-on-surface">₹82</p>
              </div>
            </div>
          </div>

          {/* Chart Section placeholder */}
          <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <h3 className="font-h3 text-[24px] text-on-surface mb-6">Audience Growth</h3>
            <div className="h-64 flex items-end gap-4 border-b border-l border-outline-variant pb-4 pl-4 pt-4">
              <div className="flex-1 bg-surface-variant hover:bg-primary-container transition-colors rounded-t-sm h-[40%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-label-sm text-[12px] text-on-surface">Mon</span></div>
              <div className="flex-1 bg-surface-variant hover:bg-primary-container transition-colors rounded-t-sm h-[60%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-label-sm text-[12px] text-on-surface">Tue</span></div>
              <div className="flex-1 bg-primary-container rounded-t-sm h-[85%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-sm text-[12px] text-on-surface">Wed</span></div>
              <div className="flex-1 bg-surface-variant hover:bg-primary-container transition-colors rounded-t-sm h-[50%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-label-sm text-[12px] text-on-surface">Thu</span></div>
              <div className="flex-1 bg-surface-variant hover:bg-primary-container transition-colors rounded-t-sm h-[70%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-label-sm text-[12px] text-on-surface">Fri</span></div>
              <div className="flex-1 bg-surface-variant hover:bg-primary-container transition-colors rounded-t-sm h-[90%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-label-sm text-[12px] text-on-surface">Sat</span></div>
              <div className="flex-1 bg-surface-variant hover:bg-primary-container transition-colors rounded-t-sm h-[30%] relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-label-sm text-[12px] text-on-surface">Sun</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Leads */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-[24px] text-on-surface">Recent Leads</h3>
              <a href="#" className="font-label-sm text-[14px] text-primary hover:underline">View All</a>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">SM</div>
                  <div>
                    <p className="font-body-md text-[16px] text-on-surface font-medium">Sara Malik</p>
                    <p className="font-label-sm text-[14px] text-on-surface-variant">Hair Coloring Inquiry</p>
                  </div>
                </div>
                <span className="bg-tertiary-fixed text-tertiary font-label-sm text-[12px] px-2 py-1 rounded-full">New</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">PK</div>
                  <div>
                    <p className="font-body-md text-[16px] text-on-surface font-medium">Priya Kapoor</p>
                    <p className="font-label-sm text-[14px] text-on-surface-variant">Bridal Package</p>
                  </div>
                </div>
                <span className="bg-surface-variant text-on-surface-variant font-label-sm text-[12px] px-2 py-1 rounded-full">Contacted</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">NJ</div>
                  <div>
                    <p className="font-body-md text-[16px] text-on-surface font-medium">Neha Joshi</p>
                    <p className="font-label-sm text-[14px] text-on-surface-variant">Facial Booking</p>
                  </div>
                </div>
                <span className="bg-tertiary-fixed text-tertiary font-label-sm text-[12px] px-2 py-1 rounded-full">New</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold">AS</div>
                  <div>
                    <p className="font-body-md text-[16px] text-on-surface font-medium">Aarti Singh</p>
                    <p className="font-label-sm text-[14px] text-on-surface-variant">General Inquiry</p>
                  </div>
                </div>
                <span className="bg-surface-variant text-on-surface-variant font-label-sm text-[12px] px-2 py-1 rounded-full">Contacted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
