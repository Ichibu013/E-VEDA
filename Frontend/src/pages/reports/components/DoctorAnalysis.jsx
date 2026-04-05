import React from 'react';

export default function DoctorAnalysis() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex-1">
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
