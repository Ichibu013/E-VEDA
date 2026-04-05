import React from 'react';

export default function PersonalProfile() {
  return (
    <section className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-transparent shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary-container/10">
          <span className="material-symbols-outlined text-primary">person</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Personal Profile</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              alt="Profile photo upload"
              className="w-36 h-36 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDVj9mAaWvn8SRJjPm6NrULSrWexCr99MHlhvMFBlIpyJFBDvpsT-jB6nKwaY9Ufh-U4hxOgpTy_XS5Fg0B9a4qzSlMfI0UTxkwxTTAt5_rDzpCw-RKlGA9OuhwX_xW7hrupS-txUDPivVRnSiHYVdGlQyLNeVS99mIjjVw5ErmLmRM2ub9YzQMOeggkXMQiDnZDmgOWTGMs2Q0Eet6M12TaAXMPgQc4cgzlNRq1bPqKw-ALtyYQtFgwjVBdlrbcfj0In8XkAQgQ8"
            />
            <button className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-base">photo_camera</span>
            </button>
          </div>
          <p className="text-xs text-on-surface-variant font-semibold tracking-wider uppercase">
            Update Photo
          </p>
        </div>
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Full Name
              </label>
              <input
                className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface"
                type="text"
                defaultValue="Srushti Deshmukh"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Preferred Name
              </label>
              <input
                className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface"
                type="text"
                defaultValue="Srushti"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Gender
              </label>
              <input
                className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60"
                type="text"
                placeholder="Enter gender"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Age
              </label>
              <input
                className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60"
                type="text"
                placeholder="Enter age"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
