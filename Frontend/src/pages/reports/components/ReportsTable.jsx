import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell 
} from '@coreui/react';

export default function ReportsTable() {
  const navigate = useNavigate();
  const reports = [
    {
      id: 1,
      icon: 'description',
      name: 'Srushti Shinde',
      date: 'Oct 24, 2023',
      type: 'Full Analysis',
      status: 'Completed',
    },
    {
      id: 2,
      icon: 'face',
      name: 'Steven Fernandes',
      date: 'Oct 23, 2023',
      type: 'Facial Only',
      status: 'Processing',
    },
    {
      id: 3,
      icon: 'description',
      name: 'Priya Kapur',
      date: 'Oct 21, 2023',
      type: 'Full Analysis',
      status: 'Completed',
    },
    {
      id: 4,
      icon: 'vital_signs',
      name: 'Rahul Varma',
      date: 'Oct 20, 2023',
      type: 'Full Analysis',
      status: 'Completed',
    }
  ];

  const renderStatus = (status) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5" />
          Completed
        </span>
      );
    }
    if (status === 'Processing') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-container/20 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
          Processing
        </span>
      );
    }
    return null;
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
            <CTableHeaderCell scope="col" className="border-b-0 py-4 text-on-surface-variant font-medium text-sm">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col" className="text-right border-b-0 py-4 text-on-surface-variant font-medium text-sm pr-6">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {reports.map((report) => (
            <CTableRow key={report.id} className="group transition-all hover:bg-slate-50/50">
              <CTableDataCell className="text-center py-4 border-slate-100">
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-[20px]" data-icon={report.icon}>
                    {report.icon}
                  </span>
                </div>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                <p className="text-base font-bold text-on-surface mb-0">
                  {report.name}
                </p>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                <p className="text-sm text-on-surface mb-0">{report.date}</p>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container-high rounded-full text-on-surface-variant">
                  {report.type}
                </span>
              </CTableDataCell>
              <CTableDataCell className="py-4 border-slate-100">
                {renderStatus(report.status)}
              </CTableDataCell>
              <CTableDataCell className="py-4 text-right pr-6 border-slate-100">
                <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                    className="p-2 text-slate-400 hover:text-primary transition-colors" 
                    title="View Details"
                  >
                    <span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Download PDF">
                    <span className="material-symbols-outlined text-[20px]" data-icon="download">download</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Share">
                    <span className="material-symbols-outlined text-[20px]" data-icon="share">share</span>
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
