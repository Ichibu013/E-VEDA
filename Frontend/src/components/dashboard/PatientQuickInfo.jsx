import React from 'react';

export default function PatientQuickInfo() {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
          alt="Steven Fernandes"
          className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100"
        />
        <div>
          <h3 className="text-xl font-bold font-headline text-on-surface">Steven Fernandes</h3>
          <p className="text-sm font-medium text-on-surface-variant/80">24 Years Old • Patient</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-50/70 rounded-2xl p-4 border border-slate-100/50">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Height</p>
          <p className="text-xl font-extrabold text-primary">178 cm</p>
        </div>
        <div className="flex-1 bg-slate-50/70 rounded-2xl p-4 border border-slate-100/50">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Weight</p>
          <p className="text-xl font-extrabold text-secondary">68 kg</p>
        </div>
      </div>
    </div>
  );
}
