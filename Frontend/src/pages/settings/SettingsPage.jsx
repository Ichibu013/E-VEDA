import React from 'react';
import PersonalProfile from './components/PersonalProfile';
import SecuritySettings from './components/SecuritySettings';
import WellnessPreferences from './components/WellnessPreferences';
import HealthPrivacy from './components/HealthPrivacy';

export default function SettingsPage() {
  return (
    <div className="w-full">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
          Account Settings
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-body leading-relaxed">
          Manage your personal health profile, security preferences, and data
          privacy to ensure your digital sanctuary remains yours.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <PersonalProfile />
        <SecuritySettings />
        <WellnessPreferences />
        <HealthPrivacy />
      </div>

      <div className="mt-16 flex flex-col sm:flex-row justify-end gap-4 border-t border-surface-variant pt-10">
        <button className="px-10 py-4 rounded-xl border border-outline-variant font-bold text-on-surface hover:bg-surface-container-high transition-colors">
          Discard changes
        </button>
        <button className="px-10 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
          Save All Preferences
        </button>
      </div>
    </div>
  );
}
