import React from 'react';

export default function EmotionalFluctuations({ report }) {
  const { analysis_result } = report || {};
  const emotion1Name = analysis_result?.emotion1Name || 'Joy';
  const emotion2Name = analysis_result?.emotion2Name || 'Neutral';
  const emotion1Rating = analysis_result?.emotion1Rating ? Math.round(analysis_result.emotion1Rating * 100) : 72;
  const emotion2Rating = analysis_result?.emotion2Rating ? Math.round(analysis_result.emotion2Rating * 100) : 50;

  return (
    <div className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-bold mb-1">Emotional Fluctuations</h3>
          <p className="text-sm text-on-surface-variant">
            Session duration tracking: 45 minutes
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs font-semibold">{emotion1Name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-xs font-semibold">{emotion2Name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-tertiary" />
            <span className="text-xs font-semibold">Focus</span>
          </div>
        </div>
      </div>
      {/* Stylized Graph Placeholder */}
      <div className="relative h-[300px] w-full bg-surface-container-low/30 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 flex items-end px-4 pb-2">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
            <path
              className="text-primary opacity-80"
              d="M0,250 Q100,100 200,180 T400,80 T600,150 T800,50"
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="text-secondary opacity-60"
              d="M0,200 Q150,180 300,220 T500,190 T800,180"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            />
            {/* Peak Moments */}
            <circle cx={200} cy={180} fill="white" r={6} stroke="#005cc0" strokeWidth={3} />
            <circle cx={400} cy={80} fill="white" r={6} stroke="#005cc0" strokeWidth={3} />
          </svg>
          {/* Markers */}
          <div className="absolute top-[80px] left-[400px] -translate-x-1/2 -translate-y-full mb-4">
            <div className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg">
              Peak Resilience
            </div>
          </div>
          <div className="absolute top-[180px] left-[200px] -translate-x-1/2 mt-4">
            <div className="bg-surface-container-highest text-on-surface text-[10px] px-2 py-1 rounded-full font-bold">
              Emotional Trigger
            </div>
          </div>
        </div>
        {/* Time Labels */}
        <div className="absolute bottom-4 w-full px-8 flex justify-between text-[10px] font-bold text-on-surface-variant opacity-40">
          <span>0 MIN</span>
          <span>15 MIN</span>
          <span>30 MIN</span>
          <span>45 MIN</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Average {emotion1Name}
          </p>
          <p className="text-2xl font-black text-primary">{emotion1Rating}%</p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Stability
          </p>
          <p className="text-2xl font-black text-secondary">High</p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Session Depth
          </p>
          <p className="text-2xl font-black text-tertiary">B+</p>
        </div>
      </div>
    </div>
  );
}
