import React, { useState } from 'react';
import { toast } from 'sonner';

export default function VoiceRecognitionFeed() {
  const [isRecording, setIsRecording] = useState(false);
  const [toastId, setToastId] = useState(null);

  const bars = [
    { h: 'h-4', op: 'opacity-40' },
    { h: 'h-8', op: 'opacity-60' },
    { h: 'h-12', op: '' },
    { h: 'h-6', op: 'opacity-80' },
    { h: 'h-14', op: '' },
    { h: 'h-10', op: '' },
    { h: 'h-3', op: 'opacity-40' },
    { h: 'h-11', op: '' },
    { h: 'h-16', op: 'opacity-90' },
    { h: 'h-5', op: 'opacity-50' },
    { h: 'h-10', op: '' },
    { h: 'h-7', op: '' },
    { h: 'h-15', op: '' },
    { h: 'h-11', op: 'opacity-70' },
    { h: 'h-14', op: '' },
    { h: 'h-4', op: 'opacity-40' },
    { h: 'h-9', op: 'opacity-60' },
    { h: 'h-13', op: '' },
    { h: 'h-7', op: 'opacity-80' },
    { h: 'h-11', op: '' },
    { h: 'h-3', op: 'opacity-40' },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <style>{`
        @keyframes sound-wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: sound-wave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">mic</span>
          Voice Recognition
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (!isRecording) {
                 setIsRecording(true);
                 const id = toast.loading('Voice recording in progress...', { duration: Infinity });
                 setToastId(id);
              } else {
                 setIsRecording(false);
                 if (toastId) toast.dismiss(toastId);
                 setToastId(null);
                 toast.success('Voice recording complete');
              }
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
            }`}
          >
            {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
          </button>
          <button 
            onClick={() => {
              setIsRecording(false);
              if (toastId) toast.dismiss(toastId);
              setToastId(null);
              toast.info('Voice Recognition logic reset');
            }}
            className="px-5 py-2.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-colors active:scale-[0.98]"
          >
            RESET
          </button>
        </div>
      </div>
      <div className="h-32 bg-surface-container-low rounded-2xl flex items-center justify-center relative overflow-hidden">
        {/* Simulated Waveform */}
        <div className="flex items-end gap-1.5 px-6 h-16">
          {bars.map((bar, i) => (
            <div
              key={i}
              className={`w-1.5 bg-primary rounded-full transition-transform ${isRecording ? 'animate-wave' : ''} ${bar.h} ${bar.op}`}
              style={{
                animationDelay: `${(i % 5) * 0.15}s`,
                animationDuration: `${0.8 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
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
