import React from 'react';

export default function DoctorAnalysis({ isLocked }) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex-1 relative overflow-hidden group">
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-30 backdrop-blur-[4px] bg-white/20 flex items-center justify-center p-6 text-center">
          <div className="bg-white/95 shadow-lg border border-outline/10 px-6 py-8 rounded-[2rem] flex flex-col items-center gap-4 max-w-[280px] transform transition-transform group-hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <p className="text-on-surface font-extrabold text-sm leading-relaxed tracking-tight">
              Analysis available only after report generation
            </p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">edit_note</span>
        Doctor's Analysis
      </h2>
      <div className="bg-surface-container-low rounded-2xl p-6  text-on-surface leading-relaxed text-base">
        <p>
          Patient exhibits excellent emotional stability. Facial analysis
          confirms a high degree of congruence between verbal sentiment
          and physical cues.
        </p>
      </div>
    </section>

  );
}
