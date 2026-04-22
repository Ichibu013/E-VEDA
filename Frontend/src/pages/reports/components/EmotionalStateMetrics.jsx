import React, { useState, useEffect } from 'react';

export default function EmotionalStateMetrics({ isLocked, data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format ratings to percentages
  const rating1 = data?.emotion_1_rating ? Math.round(data.emotion_1_rating * 100) : 0;
  const rating2 = data?.emotion_2_rating ? Math.round(data.emotion_2_rating * 100) : 0;

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm relative overflow-hidden group">
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
        <span className="material-symbols-outlined text-tertiary">psychology</span>
        Emotional State
      </h2>
      <div className="space-y-8">
        {/* Progress Bar: Emotion 1 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-base">
            <span className="font-medium text-on-surface">{data?.emotion_1_name || "Primary State"}</span>
            <span className="font-bold text-secondary">{rating1}%</span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: animated ? `${rating1}%` : "0%" }} 
            />
          </div>
        </div>


        {/* Progress Bar: Emotion 2 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-base">
            <span className="font-medium text-on-surface">{data?.emotion_2_name || "Secondary State"}</span>
            <span className="font-bold text-primary">{rating2}%</span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
              style={{ width: animated ? `${rating2}%` : "0%" }} 
            />
          </div>
        </div>

      </div>

      {/* Detected Features */}
      <div className=" pt-4 border-t border-outline-variant/10">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
          Detected Facial Features
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-xl">visibility</span>
              <span className="text-base font-medium text-on-surface">Eye Movement</span>
            </div>
            <span className="text-xs font-bold text-secondary border border-secondary/20 px-2 py-1 rounded uppercase">
              {data?.eye_movement || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-xl">mood</span>
              <span className="text-base font-medium text-on-surface">Muscle Tension</span>
            </div>
            <span className="text-xs font-bold text-secondary border border-secondary/20 px-2 py-1 rounded uppercase">
              {data?.voice_tension || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-xl">speed</span>
              <span className="text-base font-medium text-on-surface">Blink Frequency</span>
            </div>
            <span className="text-xs font-bold text-tertiary border border-tertiary/20 px-2 py-1 rounded uppercase">
              {data?.blink_frequency || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
