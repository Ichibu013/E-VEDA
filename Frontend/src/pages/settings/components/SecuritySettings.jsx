import React from 'react';

export default function SecuritySettings() {
  return (
    <section className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-tertiary-container/10">
          <span className="material-symbols-outlined text-tertiary">security</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Security</h2>
      </div>
      <div className="space-y-4">
        <button className="w-full flex items-center justify-between p-5 rounded-xl bg-surface hover:bg-surface-container-high transition-colors group">
          <span className="font-semibold text-on-surface">Change Password</span>
          <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
        <button className="w-full flex items-center justify-between p-5 rounded-xl bg-surface hover:bg-surface-container-high transition-colors group">
          <span className="font-semibold text-on-surface">Setup 2FA</span>
          <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
        <div className="pt-6">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Last login: 2 hours ago from Mumbai, IN
          </p>
        </div>
      </div>
    </section>
  );
}
