import React from 'react';

export default function VoiceRecognitionFeed() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">mic</span>
          Voice Recognition
        </h2>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-colors">
            START RECORDING
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-colors">
            RESET
          </button>
        </div>
      </div>
      <div className="h-32 bg-surface-container-low rounded-2xl flex items-center justify-center relative overflow-hidden">
        {/* Simulated Waveform */}
        <div className="flex items-end gap-1.5 px-6 h-16">
          <div className="w-1.5 bg-primary rounded-full h-4 opacity-40" />
          <div className="w-1.5 bg-primary rounded-full h-8 opacity-60" />
          <div className="w-1.5 bg-primary rounded-full h-12" />
          <div className="w-1.5 bg-primary rounded-full h-6 opacity-80" />
          <div className="w-1.5 bg-primary rounded-full h-14" />
          <div className="w-1.5 bg-primary rounded-full h-10" />
          <div className="w-1.5 bg-primary rounded-full h-3 opacity-40" />
          <div className="w-1.5 bg-primary rounded-full h-11" />
          <div className="w-1.5 bg-primary rounded-full h-16 opacity-90" />
          <div className="w-1.5 bg-primary rounded-full h-5 opacity-50" />
          <div className="w-1.5 bg-primary rounded-full h-10" />
          <div className="w-1.5 bg-primary rounded-full h-7" />
          <div className="w-1.5 bg-primary rounded-full h-15" />
          <div className="w-1.5 bg-primary rounded-full h-11 opacity-70" />
          <div className="w-1.5 bg-primary rounded-full h-14" />
          <div className="w-1.5 bg-primary rounded-full h-4 opacity-40" />
          <div className="w-1.5 bg-primary rounded-full h-9 opacity-60" />
          <div className="w-1.5 bg-primary rounded-full h-13" />
          <div className="w-1.5 bg-primary rounded-full h-7 opacity-80" />
          <div className="w-1.5 bg-primary rounded-full h-11" />
          <div className="w-1.5 bg-primary rounded-full h-3 opacity-40" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Analysis:
        </span>
        <span className="px-4 py-1.5 bg-tertiary-container/10 text-tertiary font-semibold text-sm rounded-full">
          Calm Tone Detected
        </span>
        <span className="px-4 py-1.5 bg-secondary-container/10 text-secondary font-semibold text-sm rounded-full">
          Consistent Rhythm
        </span>
      </div>
    </section>
  );
}
