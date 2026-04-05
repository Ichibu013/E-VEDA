import React from 'react';

export default function WellnessPreferences() {
  return (
    <section className="md:col-span-6 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-secondary-container/10">
          <span className="material-symbols-outlined text-secondary">spa</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-on-surface">
          Wellness Preferences
        </h2>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface">Email Notifications</p>
            <p className="text-sm text-on-surface-variant">Weekly health summaries</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface">Push Alerts</p>
            <p className="text-sm text-on-surface-variant">Immediate medical alerts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input defaultChecked className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-on-surface">Daily Wellness Tips</p>
            <p className="text-sm text-on-surface-variant">Personalized clinical insights</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
          </label>
        </div>
      </div>
    </section>
  );
}
