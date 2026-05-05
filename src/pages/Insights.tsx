import { Download, ArrowUp, ArrowDown } from 'lucide-react';

export default function Insights() {
  return (
    <div className="p-margin-page pb-24 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-section-gap border-l-4 border-secondary-container pl-4">
        <div>
          <h2 className="font-h1 text-[48px] text-on-background mb-2 tracking-tight">Daily ROI Report</h2>
          <p className="font-body-lg text-[18px] text-on-surface-variant">Performance summary for all active campaigns</p>
        </div>
        <button className="flex items-center gap-2 py-2 px-6 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-sm text-[14px]">
          <Download size={18} />
          Export PDF
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-gap">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary bg-surface-container-high p-2 rounded-full">payments</span>
            <span className="font-label-sm text-[14px] text-on-surface-variant">Total Spend</span>
          </div>
          <div>
            <div className="font-number-data text-[32px] font-medium text-on-background">₹12,450</div>
            <div className="font-body-md text-[16px] text-secondary mt-1 flex items-center gap-1">
              <ArrowUp size={16} />
              5% from yesterday
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary bg-surface-container-high p-2 rounded-full">chat_bubble</span>
            <span className="font-label-sm text-[14px] text-on-surface-variant">Total Enquiries</span>
          </div>
          <div>
            <div className="font-number-data text-[32px] font-medium text-on-background">142</div>
            <div className="font-body-md text-[16px] text-primary mt-1 flex items-center gap-1">
              <ArrowUp size={16} />
              12% from yesterday
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary bg-surface-container-high p-2 rounded-full">calendar_month</span>
            <span className="font-label-sm text-[14px] text-on-surface-variant">New Bookings</span>
          </div>
          <div>
            <div className="font-number-data text-[32px] font-medium text-on-background">38</div>
            <div className="font-body-md text-[16px] text-on-surface-variant mt-1">Steady flow</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-4 border-l-4 border-secondary-container">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary bg-surface-container-high p-2 rounded-full">trending_up</span>
            <span className="font-label-sm text-[14px] text-on-surface-variant">Cost per Booking</span>
          </div>
          <div>
            <div className="font-number-data text-[32px] font-medium text-on-background">₹327</div>
            <div className="font-body-md text-[16px] text-primary mt-1 flex items-center gap-1">
              <ArrowDown size={16} />
              Highly efficient
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-surface-container-lowest p-card-padding rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] mb-section-gap">
        <h3 className="font-h3 text-[24px] text-on-background mb-6">Booking Sources</h3>
        <div className="h-64 flex items-end justify-around gap-4 px-4 pb-8 border-b border-outline-variant relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-on-surface-variant font-number-data text-[12px] opacity-50 pb-8">
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Bars */}
          <div className="flex flex-col items-center w-full max-w-[80px] group">
            <div className="w-full bg-primary-container rounded-t-lg transition-all h-[80%] group-hover:bg-primary"></div>
            <div className="mt-4 text-center">
              <div className="font-label-sm text-[14px] text-on-background">Instagram</div>
              <div className="font-hindi-text text-[12px] text-on-surface-variant">इंस्टाग्राम</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-[80px] group">
            <div className="w-full bg-surface-tint rounded-t-lg transition-all h-[60%] group-hover:bg-primary"></div>
            <div className="mt-4 text-center">
              <div className="font-label-sm text-[14px] text-on-background">Facebook</div>
              <div className="font-hindi-text text-[12px] text-on-surface-variant">फेसबुक</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-[80px] group">
            <div className="w-full bg-surface-variant rounded-t-lg transition-all h-[30%] group-hover:bg-outline-variant"></div>
            <div className="mt-4 text-center">
              <div className="font-label-sm text-[14px] text-on-background">SMS</div>
              <div className="font-hindi-text text-[12px] text-on-surface-variant">एसएमएस</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-[80px] group">
            <div className="w-full bg-secondary-fixed-dim rounded-t-lg transition-all h-[45%] group-hover:bg-secondary-container"></div>
            <div className="mt-4 text-center">
              <div className="font-label-sm text-[14px] text-on-background">Referral</div>
              <div className="font-hindi-text text-[12px] text-on-surface-variant">रेफरल</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-DEFAULT shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="p-card-padding border-b border-outline-variant">
          <h3 className="font-h3 text-[24px] text-on-background">Campaign Breakdown</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant">
                <th className="py-4 px-6 font-label-sm text-[14px] text-on-surface-variant font-medium">Campaign</th>
                <th className="py-4 px-6 font-label-sm text-[14px] text-on-surface-variant font-medium text-right">Kharch (Spend)</th>
                <th className="py-4 px-6 font-label-sm text-[14px] text-on-surface-variant font-medium text-right">Enquiries</th>
                <th className="py-4 px-6 font-label-sm text-[14px] text-on-surface-variant font-medium text-right">Bookings</th>
                <th className="py-4 px-6 font-label-sm text-[14px] text-on-surface-variant font-medium text-right">Cost per Booking</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors bg-[#FDFAF6]">
                <td className="py-4 px-6">
                  <div className="font-body-md text-[16px] text-on-background font-medium">Bridal Makeup Promo</div>
                  <div className="font-label-sm text-[14px] text-on-surface-variant">Instagram & FB</div>
                </td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">₹5,000</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">65</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">15</td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-surface-container-high text-primary px-3 py-1 rounded-full font-number-data text-[14px]">₹333</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors">
                <td className="py-4 px-6">
                  <div className="font-body-md text-[16px] text-on-background font-medium">Diwali Special Spa</div>
                  <div className="font-label-sm text-[14px] text-on-surface-variant">SMS Broadcast</div>
                </td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">₹1,500</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">30</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">8</td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-surface-container-high text-primary px-3 py-1 rounded-full font-number-data text-[14px]">₹187</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors bg-[#FDFAF6]">
                <td className="py-4 px-6">
                  <div className="font-body-md text-[16px] text-on-background font-medium">Hair Color Trends</div>
                  <div className="font-label-sm text-[14px] text-on-surface-variant">Instagram Only</div>
                </td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">₹3,200</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">40</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">10</td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-surface-container-high text-primary px-3 py-1 rounded-full font-number-data text-[14px]">₹320</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="py-4 px-6">
                  <div className="font-body-md text-[16px] text-on-background font-medium">Weekday Discount</div>
                  <div className="font-label-sm text-[14px] text-on-surface-variant">Facebook & SMS</div>
                </td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">₹2,750</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">7</td>
                <td className="py-4 px-6 text-right font-number-data text-[16px]">5</td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-number-data text-[14px]">₹550</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
