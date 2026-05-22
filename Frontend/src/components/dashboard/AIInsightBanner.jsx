import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

export default function AIInsightBanner({ isLoading, insightData }) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // 'Inhale', 'Hold', 'Exhale'
  const [breathSeconds, setBreathSeconds] = useState(4);

  useEffect(() => {
    let interval = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathSeconds(4);
      setBreathPhase('Inhale');
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  if (isLoading) {
    return <Skeleton height={120} borderRadius={32} className="shadow-sm" />;
  }

  const mainInsight = insightData?.details || insightData?.insight || "Recording your daily updates helps the AI discover unique patterns in your emotional wellbeing.";

  return (
    <div className="bg-[#ccf7e2] text-[#0a472e] rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-[#aae6cb]/50">
      <div className="flex items-start md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#59f2a6] flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[#0a472e] text-3xl">lightbulb</span>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">AI Insight of the Day</h3>
          <p className="text-sm opacity-90 leading-relaxed max-w-4xl font-medium">
            {mainInsight}
          </p>
        </div>
      </div>

      {/* Interactive Breathing Exercise Widget utilizing the empty space */}
      <div className="shrink-0 self-center md:self-auto">
        {!isBreathing ? (
          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-[#aae6cb] hover:shadow-md hover:bg-white/50 transition-all duration-300">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#0a472e]/60 mb-0.5">Quick Calm</span>
              <span className="text-xs font-bold text-[#0a472e]">Need to decompress?</span>
            </div>
            <button 
              onClick={() => setIsBreathing(true)}
              className="bg-[#0a472e] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#073220] transition-colors flex items-center gap-1.5 group shadow-sm"
            >
              <span className="material-symbols-outlined text-sm animate-pulse">spa</span>
              Breathe
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-5 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-[#aae6cb] shadow-sm min-w-[220px] justify-between transition-all duration-500">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#0a472e]/60 mb-0.5">{breathPhase}</span>
              <span className="text-lg font-black text-[#0a472e] tracking-tight">{breathSeconds}s</span>
            </div>
            
            {/* Animated Breathing Bubble */}
            <div className="relative flex items-center justify-center w-12 h-12">
              <div 
                style={{
                  transform: breathPhase === 'Inhale' ? 'scale(1.3)' : 
                             breathPhase === 'Hold' ? 'scale(1.3)' : 'scale(0.8)',
                  transition: 'transform 4000ms ease-in-out, background-color 4000ms ease-in-out'
                }}
                className={`absolute inset-0 rounded-full bg-[#59f2a6]/40 ${
                  breathPhase === 'Hold' ? 'animate-pulse' : ''
                }`}
              />
              <div className="relative w-8 h-8 rounded-full bg-[#0a472e] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-sm">spa</span>
              </div>
            </div>

            {/* Cancel Button */}
            <button 
              onClick={() => setIsBreathing(false)}
              className="text-[#0a472e]/60 hover:text-[#0a472e] p-1 rounded-lg hover:bg-black/5 transition-colors flex items-center justify-center"
              title="Stop exercise"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


