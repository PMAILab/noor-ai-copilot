import { TrendingUp, TrendingDown, Flame, MessageCircle, Calendar, Star } from 'lucide-react';
import { MOCK_REPORTS, MOCK_CAMPAIGNS } from '../lib/mockData';
import { formatCurrencyFull } from '../lib/utils/currency';

const WEEKDAY_LABELS: Record<string, string> = {
  '2024-10-20': 'Sun', '2024-10-19': 'Sat', '2024-10-18': 'Fri',
  '2024-10-17': 'Thu', '2024-10-16': 'Wed',
};

export default function Reports() {
  const totalSpend = MOCK_REPORTS.reduce((s, r) => s + r.totalSpendInr, 0);
  const totalLeads = MOCK_REPORTS.reduce((s, r) => s + r.enquiryCount, 0);
  const totalBookings = MOCK_REPORTS.reduce((s, r) => s + r.bookingCount, 0);
  const avgCPL = totalSpend / Math.max(totalLeads, 1);

  return (
    <div className="p-margin-page max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-h1 text-[42px] text-on-surface mb-2">ROI Reports</h1>
        <p className="font-body-lg text-[18px] text-on-surface-variant">
          Plain-language performance reports — exactly what Noor sends on WhatsApp every night at 9pm.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Spend (5 days)', value: formatCurrencyFull(totalSpend), icon: <TrendingUp size={20} className="text-primary" />, bg: 'bg-primary/5 border-primary/20' },
          { label: 'Total Enquiries', value: totalLeads.toString(), icon: <MessageCircle size={20} className="text-[#25D366]" />, bg: 'bg-[#25D366]/5 border-[#25D366]/20' },
          { label: 'Total Bookings', value: totalBookings.toString(), icon: <Calendar size={20} className="text-[#C8922A]" />, bg: 'bg-[#C8922A]/5 border-[#C8922A]/20' },
          { label: 'Avg Cost/Lead', value: `₹${Math.round(avgCPL)}`, icon: <Flame size={20} className="text-red-500" />, bg: 'bg-red-50 border-red-100' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-5 ${stat.bg}`}>
            <div className="mb-3">{stat.icon}</div>
            <p className="font-number-data text-[28px] font-bold text-on-surface">{stat.value}</p>
            <p className="font-label-sm text-xs text-on-surface-variant mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Best Campaign */}
      <div className="bg-gradient-to-r from-[#C8922A]/10 to-[#F59E0B]/5 border border-[#C8922A]/30 rounded-2xl p-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#C8922A] rounded-2xl flex items-center justify-center flex-shrink-0">
          <Star size={24} className="text-white" />
        </div>
        <div>
          <p className="font-label-sm text-xs text-[#C8922A] mb-1 uppercase tracking-wider">Best Performing Campaign</p>
          <p className="font-h3 text-[18px] text-on-surface">{MOCK_CAMPAIGNS[0].goalText}</p>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            {MOCK_CAMPAIGNS[0].enquiryCount} leads · {MOCK_CAMPAIGNS[0].bookingCount} bookings · ₹{MOCK_CAMPAIGNS[0].costPerLead}/lead
          </p>
        </div>
      </div>

      {/* Daily Report Cards */}
      <h2 className="font-h2 text-[24px] text-on-surface mb-4">Daily Reports</h2>
      <div className="flex flex-col gap-4">
        {MOCK_REPORTS.map((report, i) => {
          const prev = MOCK_REPORTS[i + 1];
          const spendDelta = prev ? ((report.totalSpendInr - prev.totalSpendInr) / prev.totalSpendInr) * 100 : 0;
          const isGoodDay = report.bookingCount > 0 && report.costPerBooking < 400;
          const dateObj = new Date(report.reportDate);
          const dateLabel = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });

          return (
            <div key={report.id} className={`bg-surface-container-lowest rounded-2xl border overflow-hidden ${i === 0 ? 'border-primary/30 shadow-md' : 'border-outline-variant'}`}>
              {/* Card header */}
              <div className="flex items-center justify-between p-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-number-data text-sm font-bold ${
                    isGoodDay ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {dateObj.getDate()}
                  </div>
                  <div>
                    <p className="font-h3 text-[16px] text-on-surface">{dateLabel}</p>
                    {i === 0 && <span className="font-label-sm text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Latest</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {spendDelta !== 0 && (
                    <>
                      {spendDelta > 0 ? <TrendingUp size={14} className="text-red-500" /> : <TrendingDown size={14} className="text-[#22C55E]" />}
                      <span className={`font-label-sm text-xs ${spendDelta > 0 ? 'text-red-500' : 'text-[#22C55E]'}`}>
                        {Math.abs(spendDelta).toFixed(0)}% spend
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-4 gap-px bg-outline-variant mx-5 mb-4 rounded-xl overflow-hidden">
                {[
                  { label: 'Spend', value: formatCurrencyFull(report.totalSpendInr), color: 'text-primary' },
                  { label: 'Enquiries', value: report.enquiryCount.toString(), color: 'text-on-surface' },
                  { label: 'Hot Leads', value: report.hotLeadCount.toString(), color: 'text-red-500' },
                  { label: 'Bookings', value: report.bookingCount.toString(), color: report.bookingCount > 0 ? 'text-[#22C55E]' : 'text-on-surface-variant' },
                ].map(m => (
                  <div key={m.label} className="bg-surface-container-lowest p-3 text-center">
                    <p className={`font-number-data text-[20px] font-bold ${m.color}`}>{m.value}</p>
                    <p className="font-label-sm text-[11px] text-on-surface-variant">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* WA Message preview */}
              <div className="mx-5 mb-5">
                <p className="font-label-sm text-xs text-on-surface-variant mb-2 flex items-center gap-1">
                  <MessageCircle size={12} className="text-[#25D366]" />
                  WhatsApp message sent to you at 9pm:
                </p>
                <div className="bg-[#ECE5DD] rounded-xl p-4">
                  <div className="bg-white rounded-lg rounded-tr-none p-3 max-w-[90%] shadow-sm">
                    <p className="font-hindi-text text-sm text-[#303030] whitespace-pre-line leading-relaxed">
                      {report.waMessageSent}
                    </p>
                    <div className="text-right text-[11px] text-[#999] mt-1">
                      9:00 PM ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
