import React from 'react';

export default function Recommendations({ isLocked, data }) {
  const recommendations = data ? [
    { title: data.point_1_title, description: data.point_1_description },
    { title: data.point_2_title, description: data.point_2_description }
  ].filter(r => r.title) : [];

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
        <div className="flex flex-col gap-10">
          {/* Recommendations Points - Side by Side */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {recommendations.length > 0 ? recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-5">
                <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-base">check</span>
                </div>
                <div>
                  <span className="block font-bold text-lg text-on-surface">{rec.title}</span>
                  <p className="text-base text-on-surface-variant mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </li>
            )) : (
              <p className="text-on-surface-variant col-span-2">No recommendations available yet.</p>
            )}
          </ul>
          
          {/* Disclaimer Section */}
          <div className="pt-8 border-t border-green-200/30">
            <div className="flex items-start gap-3 text-on-surface-variant/60 italic text-sm leading-relaxed max-w-4xl">
              <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">info</span>
              <p>
                Disclaimer: This AI-generated analysis is provided for clinical decision support only and does not constitute a final medical diagnosis. All findings should be reviewed and verified by a qualified healthcare professional before determining a treatment plan.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
