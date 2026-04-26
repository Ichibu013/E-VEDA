import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';

export default function ReportsTable({ reports }) {
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);

  const handleDownload = (report) => {
    if (downloadingId) return;
    setDownloadingId(report.id);
    const downloadPromise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(downloadPromise, {
      loading: `Generating PDF for ${report.patient_name}...`,
      success: `PDF downloaded successfully!`,
      error: `Failed to download PDF`,
    });
    downloadPromise.then(() => setDownloadingId(null));
  };

  const handleShare = (report) => {
    if (sharingId) return;
    setSharingId(report.id);
    const sharePromise = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(sharePromise, {
      loading: `Preparing share link for ${report.patient_name}...`,
      success: `Share link copied to clipboard!`,
      error: `Failed to generate share link`,
    });
    sharePromise.then(() => setSharingId(null));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <CTable hover responsive className="mb-0 border-transparent align-middle">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col" className="w-[80px] text-center border-b-0 py-4 text-on-surface-variant font-medium text-sm">Type</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="border-b-0 py-4 text-on-surface-variant font-medium text-sm">Patient Name</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="border-b-0 py-4 text-on-surface-variant font-medium text-sm">Date</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="border-b-0 py-4 text-on-surface-variant font-medium text-sm">Report Type</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-right border-b-0 py-4 text-on-surface-variant font-medium text-sm pr-6">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {reports.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan="5" className="text-center py-10 text-on-surface-variant italic">
                No reports found in history.
              </CTableDataCell>
            </CTableRow>
          ) : reports.map((report) => (
            <CTableRow key={report.id} className="group transition-all hover:bg-slate-50/50">
              <CTableDataCell className="text-center py-4 border-slate-100">
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-[20px]">
                    {report.report_type?.includes('Facial') ? 'face' : 'description'}
                  </span>
                </div>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                <p className="text-base font-bold text-on-surface mb-0">
                  {report.patient_name}
                </p>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                <p className="text-sm text-on-surface mb-0">{formatDate(report.date)}</p>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container-high rounded-full text-on-surface-variant">
                  {report.report_type}
                </span>
              </CTableDataCell>
              <CTableDataCell className="py-4 text-right pr-6 border-slate-100">
                <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/dashboard/reports/${encodeURIComponent(report.id)}`)}
                    className="px-4 py-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    View Details
                  </button>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
}
