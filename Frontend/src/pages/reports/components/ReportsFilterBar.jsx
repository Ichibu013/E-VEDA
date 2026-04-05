import React from 'react';

export default function ReportsFilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-xl text-sm text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-sm mr-2" data-icon="calendar_today">
            calendar_today
          </span>
          Date Range: Last 30 Days
        </div>
        <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-xl text-sm text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-sm mr-2" data-icon="filter_list">
            filter_list
          </span>
          All Statuses
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-on-surface-variant">
          Showing 12 of 148 reports
        </span>
      </div>
    </div>
  );
}
