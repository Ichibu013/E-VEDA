import React from 'react';

export default function HealthPrivacy() {
  return (
    <section className="md:col-span-6 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-error-container/10">
          <span className="material-symbols-outlined text-error">lock</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-on-surface">
          Health Privacy
        </h2>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <p className="font-bold text-on-surface">Share data with doctor</p>
            <p className="text-sm text-on-surface-variant">
              Enable live sync for practitioners
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <p className="font-bold text-on-surface">
              Anonymize clinical records
            </p>
            <p className="text-sm text-on-surface-variant">
              Remove identity from research sets
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
        <div className="p-5 bg-surface-container rounded-xl">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">
            Data usage transparency
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your health records are stored with military-grade AES-256
            encryption. We never sell your personal data to third parties.
          </p>
        </div>
      </div>
    </section>
  );
}
