import React from 'react';
import { CChart } from '@coreui/react-chartjs';

export default function EmotionalTrendsChart() {
  const bgColors = [
    '#C1D9EE', // Mon
    '#C5D9CE', // Tue 
    '#D4D3ED', // Wed
    '#E6D4D3', // Thu
    '#C1D9EE', // Fri
    '#C5D9CE', // Sat
    '#C1D9EE', // Sun
  ];

  const borderColors = [
    '#136ac1', // Mon (Joy)
    '#156c4d', // Tue (Neutral/Focus)
    '#6b5dd3', // Wed (Anxious)
    '#c0392b', // Thu (Anger)
    '#136ac1', // Fri (Joy)
    '#156c4d', // Sat 
    '#136ac1', // Sun
  ];

  const data = {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    datasets: [
      {
        label: 'Emotional Intensity',
        data: [60, 45, 75, 38, 85, 55, 70],
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: { top: 4, right: 0, bottom: 0, left: 0 },
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40 // Guarantees room so the tooltip doesn't flip downwards
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        yAlign: 'bottom',
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '600'
          },
          color: '#64748b'
        }
      },
      y: {
        display: false, // hide entirely to match the clean mockup design
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-1">Emotional Trends</h2>
          <p className="text-sm font-medium text-on-surface-variant/80">Real-time sentiment analysis over the last 7 days</p>
        </div>
        
        {/* Custom Legend to match design */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs font-bold text-primary">Joy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c0392b]" />
            <span className="text-xs font-bold text-[#c0392b]">Anger</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[250px]">
        <CChart
          type="bar"
          data={data}
          options={options}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}
