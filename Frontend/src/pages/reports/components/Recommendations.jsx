import React from 'react';

export default function Recommendations({ isLocked }) {
  return (
    <div className="mt-8">
      <section className="bg-green-50/80 rounded-3xl p-10 shadow-sm border border-green-100 relative overflow-hidden group">
        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-30 backdrop-blur-[4px] bg-green-900/5 flex items-center justify-center p-6 text-center">
            <div className="bg-white/95 shadow-lg border border-outline/10 px-8 py-10 rounded-[2.5rem] flex flex-col items-center gap-4 max-w-[320px] transform transition-transform group-hover:scale-[1.02]">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <p className="text-on-surface font-extrabold text-base leading-relaxed tracking-tight">
                Analysis available only after report generation
              </p>
            </div>
          </div>
        )}

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
