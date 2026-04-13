import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { CTooltip } from '@coreui/react';

export default function AIInsightBanner({ isLoading, insightData }) {
  if (isLoading) {
    return <Skeleton height={120} borderRadius={32} className="shadow-sm" />;
  }

  const mainInsight = insightData?.insight || "Recording your daily updates helps the AI discover unique patterns in your emotional wellbeing.";
  const detailInsight = insightData?.details || "Log your mood updates to unlock deeper analysis.";

  return (
    <div className="bg-[#ccf7e2] text-[#0a472e] rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-[#aae6cb]/50">
      <div className="flex items-start md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#59f2a6] flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[#0a472e] text-3xl">lightbulb</span>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">AI Insight of the Day</h3>
          <p className="text-sm opacity-90 leading-relaxed max-w-4xl font-medium">
            {mainInsight}
          </p>
        </div>
      </div>
      <div>
        <CTooltip
          content={detailInsight}
          placement="top"
        >
          <button className="bg-white text-[#0a472e] px-6 py-2.5 rounded-xl font-bold border border-[#aae6cb] hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
            Details
          </button>
        </CTooltip>
      </div>
    </div>
  );
}


