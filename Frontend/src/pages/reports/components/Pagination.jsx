import React from 'react';

export default function Pagination() {
  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20">
        1
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors font-medium">
        2
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors font-medium">
        3
      </button>
      <span className="text-on-surface-variant px-2">...</span>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors font-medium">
        12
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}
