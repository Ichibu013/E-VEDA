import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { User } from 'lucide-react';

// Helper to strip localhost so Vite can proxy the MinIO request
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  return url.replace('http://localhost:9000', '');
};

export default function PatientQuickInfo({ isLoading, data }) {
  if (isLoading) {
    return <Skeleton height={180} borderRadius={24} className="shadow-sm" />;
  }

  // PatientQuickInfo implementation

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden">
      <div className="flex items-center gap-4 mb-6">
        {data?.profile_picture ? (
          <img
            src={getProxiedImageUrl(data.profile_picture)}
            alt={data?.name || "Patient"}
            className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-100 text-slate-400">
            <User size={28} />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold font-headline text-on-surface">{data?.name || "Patient"}</h3>
          <p className="text-sm font-medium text-on-surface-variant/80">{data?.age || "--"} Years Old • Patient</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-50/70 rounded-2xl p-4 border border-slate-100/50">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Height</p>
          <p className="text-xl font-extrabold text-primary">{data?.height || "--"} cm</p>
        </div>
        <div className="flex-1 bg-slate-50/70 rounded-2xl p-4 border border-slate-100/50">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Weight</p>
          <p className="text-xl font-extrabold text-secondary">{data?.weight || "--"} kg</p>
        </div>
      </div>
    </div>
  );
}