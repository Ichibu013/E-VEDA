import React from 'react';

export default function BiometricAnalysis({ report }) {
  const { accuracy_result, analysis_result } = report || {};
  const accuracyPercentage = accuracy_result ? (accuracy_result * 100).toFixed(1) : 98.4;
  
  const { voiceTension, emotion1Name, emotion2Name, eyeMovement } = analysis_result || {};

  return (
    <div className="md:col-span-4 flex flex-col gap-4 md:gap-8">
      <div className="bg-surface-container-lowest rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 flex-1">
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
              <p className="text-sm font-bold">{accuracyPercentage}% Accuracy</p>
              <p className="text-xs text-on-surface-variant">
                Continuous tracking maintained
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span>Eye Movement: {eyeMovement || 'Steady'}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>Blink Frequency: {analysis_result?.blinkFrequency || 'Normal'}</span>
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
              {emotion1Name && (
                <span className="px-3 py-1 bg-surface-container-lowest text-on-surface text-[10px] font-bold rounded-full">
                  {emotion1Name}
                </span>
              )}
              {emotion2Name && (
                <span className="px-3 py-1 bg-surface-container-lowest text-on-surface text-[10px] font-bold rounded-full">
                  {emotion2Name}
                </span>
              )}
              {!emotion1Name && !emotion2Name && (
                <>
                  <span className="px-3 py-1 bg-surface-container-lowest text-on-surface text-[10px] font-bold rounded-full">
                    Slight Smile
                  </span>
                  <span className="px-3 py-1 bg-surface-container-lowest text-on-surface text-[10px] font-bold rounded-full">
                    Intense Focus
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
