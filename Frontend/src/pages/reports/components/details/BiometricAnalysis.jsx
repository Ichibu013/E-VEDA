import React from 'react';

export default function BiometricAnalysis() {
  return (
    <div className="md:col-span-4 flex flex-col gap-8">
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 flex-1">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">face</span>
          Facial Analysis
        </h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-secondary-container"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                check_circle
              </span>
            </div>
            <div>
              <p className="text-sm font-bold">98.4% Accuracy</p>
              <p className="text-xs text-on-surface-variant">
                Continuous tracking maintained
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span>Engagement</span>
              <span>85%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[85%]" />
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
              Primary Expressions
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-surface-container-lowest text-on-surface text-[10px] font-bold rounded-full">
                Slight Smile
              </span>
              <span className="px-3 py-1 bg-surface-container-lowest text-on-surface text-[10px] font-bold rounded-full">
                Intense Focus
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 flex-1">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">
            record_voice_over
          </span>
          Voice Tone
        </h3>
        <div className="p-4 rounded-2xl bg-tertiary/5 border border-tertiary/10">
          <p className="text-sm font-medium italic text-on-surface mb-4 leading-relaxed">
            "Calm, consistent rhythm detected throughout the verbal assessment
            phase."
          </p>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-tertiary rounded-full" />
              <span className="w-1 h-5 bg-tertiary rounded-full" />
              <span className="w-1 h-2 bg-tertiary rounded-full" />
              <span className="w-1 h-6 bg-tertiary rounded-full" />
              <span className="w-1 h-4 bg-tertiary rounded-full" />
              <span className="w-1 h-5 bg-tertiary rounded-full" />
            </div>
            <span className="text-xs font-bold text-tertiary uppercase">
              Rhythmic Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
