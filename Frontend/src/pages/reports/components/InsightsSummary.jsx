import React from 'react';

export default function InsightsSummary() {
  return (
    <section className="px-8 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <span className="material-symbols-outlined">trending_up</span>
          </span>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Activity
          </span>
        </div>
        <p className="text-3xl font-extrabold text-blue-900 mb-1">
          14% Increase
        </p>
        <p className="text-sm text-blue-700/70 font-medium">
          In reports processed this week compared to last week.
        </p>
      </div>

      <div className="bg-secondary-container/20 p-6 rounded-3xl border border-secondary-fixed-dim/20">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-secondary-container text-secondary rounded-xl">
            <span className="material-symbols-outlined">check_circle</span>
          </span>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Efficiency
          </span>
        </div>
        <p className="text-3xl font-extrabold text-on-secondary-container mb-1">
          99.2%
        </p>
        <p className="text-sm text-on-secondary-container/70 font-medium">
          Accuracy rate maintained across automated analyses.
        </p>
      </div>

      <div className="bg-tertiary-container/10 p-6 rounded-3xl border border-tertiary-dim/10">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-tertiary-container text-on-tertiary rounded-xl">
            <span className="material-symbols-outlined">psychology</span>
          </span>
          <span className="text-xs font-bold text-tertiary-dim uppercase tracking-wider">
            Insights
          </span>
        </div>
        <p className="text-3xl font-extrabold text-on-tertiary-fixed-variant mb-1">
          24 New
        </p>
        <p className="text-sm text-tertiary-dim/70 font-medium">
          Emotional trend anomalies flagged for clinical review.
        </p>
      </div>
    </section>
  );
}
