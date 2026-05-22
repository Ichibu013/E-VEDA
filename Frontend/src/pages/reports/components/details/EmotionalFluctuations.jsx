import React from 'react';

export default function EmotionalFluctuations({ report }) {
  const { analysis_result } = report || {};
  const emotion1Name = analysis_result?.emotion1Name || 'Joy';
  const emotion2Name = analysis_result?.emotion2Name || 'Neutral';
  const emotion1Rating = analysis_result?.emotion1Rating ? Math.round(analysis_result.emotion1Rating * 100) : 72;
  const emotion2Rating = analysis_result?.emotion2Rating ? Math.round(analysis_result.emotion2Rating * 100) : 50;

  // Helper to get a stable, deterministic seed from report ID
  const getSeedFromId = (id) => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  // Helper to generate coordinates based on the rating (and optionally small unique ID noise)
  const getYCoordinate = (rating, index, isPrimary) => {
    // Higher rating means higher on the screen (smaller Y coordinate in SVG)
    const baseY = 240 - (rating / 100) * 160;

    // Use different frequencies and phases for primary and secondary to avoid overlapping too closely
    const freqCoeff = isPrimary ? 0.08 : 0.11;
    const indexCoeff = isPrimary ? 1.8 : 2.2;
    const phaseOffset = isPrimary ? 0.5 : 1.9;

    const ratingAngle = (rating * freqCoeff) + (index * indexCoeff) + phaseOffset;
    const ratingWave = isPrimary
      ? Math.sin(ratingAngle) * 30 + Math.cos(ratingAngle * 1.5) * 10
      : Math.sin(ratingAngle) * 25 + Math.cos(ratingAngle * 1.3) * 8;

    const idSeed = getSeedFromId(report?.report_id || report?.id || 'default');
    const signatureVal = Math.sin(idSeed + index * (isPrimary ? 3.7 : 4.3));
    const signatureWave = signatureVal * 8; // Small variance unique to the report

    const y = baseY + ratingWave + signatureWave;

    // Clamp Y to safe bounds inside the SVG viewBox [30, 270]
    return Math.round(Math.min(270, Math.max(30, y)));
  };

  // Generate coordinates for Emotion 1 (Primary Curve)
  const y0 = getYCoordinate(emotion1Rating, 0, true);
  const yControl = getYCoordinate(emotion1Rating, 0.5, true);
  const y1 = getYCoordinate(emotion1Rating, 1, true);
  const y2 = getYCoordinate(emotion1Rating, 2, true);
  const y3 = getYCoordinate(emotion1Rating, 3, true);
  const y4 = getYCoordinate(emotion1Rating, 4, true);

  // Generate coordinates for Emotion 2 (Secondary Curve)
  const y2_0 = getYCoordinate(emotion2Rating, 0, false);
  const y2_Control = getYCoordinate(emotion2Rating, 0.5, false);
  const y2_1 = getYCoordinate(emotion2Rating, 1, false);
  const y2_2 = getYCoordinate(emotion2Rating, 2, false);
  const y2_3 = getYCoordinate(emotion2Rating, 3, false);

  return (
    <div className="md:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-bold mb-1">Emotional Fluctuations</h3>
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
              d={`M0,${y0} Q100,${yControl} 200,${y1} T400,${y2} T600,${y3} T800,${y4}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="text-secondary opacity-60"
              d={`M0,${y2_0} Q150,${y2_Control} 300,${y2_1} T500,${y2_2} T800,${y2_3}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            />
            {/* Peak Moments */}
            <circle cx={200} cy={y1} fill="white" r={6} stroke="#005cc0" strokeWidth={3} />
            <circle cx={400} cy={y2} fill="white" r={6} stroke="#005cc0" strokeWidth={3} />
          </svg>
          {/* Markers */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-full mb-4 transition-all duration-300"
            style={{ left: '50%', top: `${y2}px` }}
          >
            <div className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
              Peak Resilience
            </div>
          </div>
          <div 
            className="absolute -translate-x-1/2 mt-4 transition-all duration-300"
            style={{ left: '25%', top: `${y1}px` }}
          >
            <div className="bg-surface-container-highest text-on-surface text-[10px] px-2 py-1 rounded-full font-bold whitespace-nowrap">
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
