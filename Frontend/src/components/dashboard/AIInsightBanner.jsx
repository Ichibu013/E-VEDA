import React from 'react';

export default function AIInsightBanner() {
  return (
    <div className="bg-[#ccf7e2] text-[#0a472e] rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-[#aae6cb]/50">
      <div className="flex items-start md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#59f2a6] flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[#0a472e] text-3xl">lightbulb</span>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">AI Insight of the Day</h3>
          <p className="text-sm opacity-90 leading-relaxed max-w-4xl font-medium">
            High 'Sadness' levels currently correlate with a 15% drop in resting heart rate and reduced social interaction markers. 
            Suggest scheduled mindfulness or a gentle outdoor walk for mood stabilization.
          </p>
        </div>
      </div>
      <div>
        <button className="bg-white text-[#0a472e] px-6 py-2.5 rounded-xl font-bold border border-[#aae6cb] hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
          Details
        </button>
      </div>
    </div>
  );
}
