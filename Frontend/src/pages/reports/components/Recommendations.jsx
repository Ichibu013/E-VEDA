import React from 'react';

export default function Recommendations() {
  return (
    <div className="mt-8">
      <section className="bg-green-50/80 rounded-3xl p-10 shadow-sm border border-green-100">
        <h2 className="text-2xl font-bold text-on-surface mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-3xl">verified</span>
          Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ul className="space-y-6">
            <li className="flex items-start gap-5">
              <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-on-surface">Cognitive Vitality</span>
                <p className="text-base text-on-surface-variant mt-1">
                  Recommended 15-minute mindfulness session before next assessment.
                </p>
              </div>
            </li>
            
            <li className="flex items-start gap-5">
              <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-on-surface">Heart Rate Coherence</span>
                <p className="text-base text-on-surface-variant mt-1">
                  Breath-work exercises to maintain current stable heart rate variability.
                </p>
              </div>
            </li>
          </ul>
          
          <div className="flex flex-col justify-between">
            <p className="text-on-surface-variant text-lg leading-relaxed">
              The patient's progress remains consistent with health objectives. 
              The integration of mindfulness and rhythmic breathing is advised to further 
              stabilize autonomic nervous system responses during future evaluations. 
              Continuous monitoring is essential for data-driven adjustment of the care plan.
            </p>
            <div className="mt-8 md:mt-0">
              <button className="text-secondary font-bold text-base flex items-center gap-1 hover:underline">
                View Comprehensive Health Plan
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
