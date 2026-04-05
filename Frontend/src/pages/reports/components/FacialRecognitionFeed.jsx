import React from 'react';

export default function FacialRecognitionFeed() {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 overflow-hidden relative min-h-[500px] flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">face</span>
          Facial Recognition
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">
            Live Stream
          </span>
        </div>
      </div>
      <div className="flex-1 relative rounded-2xl bg-surface-container-high overflow-hidden">
        <img
          alt="Live video feed showing facial landmarks for clinical analysis"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1n6-kOIvcSsW5R_OJC13M7cbLKjvu7oyM9bHLqEHMzJWNLiu4iKt5cKrTUxI1-JAxhEe7vxjub5O_yXSqn_Awnt_-Fg-uaFmi8mHpwj9l-fspvVj2fNgC5BsiVsidJCgvjZElmF4sgyvzUz7kEjljNfrsBejUTHKV5SRcvF-QhnF9jpmr1JnDVsvGlm3IIyN-j6JKxv2UEGLta9qjgmAmwrpcaHXoskmcSxjHYDdsXuWtUd-nB7ibMtQIJtXfBXKmkuU3BAPLd-o"
        />
        {/* Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-8">
          <div className="flex justify-between items-center">
            <div className="glass-panel px-6 py-3 rounded-full flex gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-lg">visibility</span>
                <span className="text-white text-sm font-medium">Focus: Stable</span>
              </div>
              <div className="flex items-center gap-2 border-l border-white/20 pl-6">
                <span className="material-symbols-outlined text-white text-lg">light_mode</span>
                <span className="text-white text-sm font-medium">Light: Optimal</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                <span className="material-symbols-outlined text-2xl">refresh</span>
              </button>
              <button className="w-14 h-14 rounded-full bg-error text-white flex items-center justify-center shadow-lg shadow-error/30 hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-2xl">stop</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
