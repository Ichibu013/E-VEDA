import React, { useRef, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'sonner';
import { 
  CDropdown, 
  CDropdownToggle, 
  CDropdownMenu, 
  CDropdownItem,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge
} from '@coreui/react';
import { reportsService } from '../../api/reports';
import FacialRecognitionFeed from './components/FacialRecognitionFeed';
import VoiceRecognitionFeed from './components/VoiceRecognitionFeed';
import EmotionalStateMetrics from './components/EmotionalStateMetrics';
import DoctorAnalysis from './components/DoctorAnalysis';
import Recommendations from './components/Recommendations';

export default function NewReportPage() {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fileAccept, setFileAccept] = useState("video/*,audio/*");
  const [mediaList, setMediaList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [liveFacialUrl, setLiveFacialUrl] = useState(null);
  const [liveVoiceUrl, setLiveVoiceUrl] = useState(null);
  const [draftInfo, setDraftInfo] = useState({ patient_name: 'Patient', projected_next_id: '#EV-00000' });

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const data = await reportsService.getDraftInfo();
        setDraftInfo(data);
      } catch (error) {
        console.error("Failed to fetch draft info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraft();
  }, []);

  const handleAddMediaClick = (type = 'all') => {
    let acceptValue = "video/*,audio/*";
    if (type === 'video') acceptValue = "video/*";
    if (type === 'audio') acceptValue = "audio/*";
    
    setFileAccept(acceptValue);
    
    // Use a slight delay to ensure the 'accept' attribute is updated before the dialog opens
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 10);
  };

  const performUpload = async (tempId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    // Update status to uploading immediately
    setMediaList(prev => prev.map(item => 
      item.id === tempId ? { ...item, status: 'uploading' } : item
    ));

    try {
      const response = type === 'video' 
        ? await reportsService.uploadVideo(formData)
        : await reportsService.uploadAudio(formData);

      const s3Url = response.message;
      
      setMediaList(prev => prev.map(item => 
        item.id === tempId 
          ? { ...item, status: 'ready', s3Url, s3Id: s3Url.split('/').pop() }
          : item
      ));
    } catch (error) {
      console.error("Upload failed for", file.name, error);
      setMediaList(prev => prev.map(item => 
        item.id === tempId ? { ...item, status: 'error' } : item
      ));
      throw error; // Re-throw for batch handler to catch if needed
    }
  };

  const handleUploadAll = async () => {
    const pendingItems = mediaList.filter(item => item.status === 'local' || item.status === 'error');
    if (pendingItems.length === 0) {
      toast.info("No pending files to submit");
      return;
    }

    const toastId = toast.loading(`Submitting ${pendingItems.length} media file(s) to backend...`);
    
    try {
      // Parallel execution
      await Promise.all(pendingItems.map(item => 
        performUpload(item.id, item.fileObject, item.type)
      ));
      
      toast.success("Session media synchronized successfully!", { id: toastId });
    } catch (error) {
      toast.error("Batch submission partially failed. Please check individual status in Library.", { id: toastId });
    }
  };

  const handleDeleteMedia = (id) => {
    setMediaList(prev => prev.filter(item => item.id !== id));
    toast.error('File removed from session');
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    // Check for uploaded media
    const manualVideo = mediaList.find(m => m.type === 'video' && m.status === 'ready');
    const manualAudio = mediaList.find(m => m.type === 'audio' && m.status === 'ready');
    
    // Priority: Live feeds > Manual uploads
    const videoUrl = liveFacialUrl || manualVideo?.s3Url;
    const audioUrl = liveVoiceUrl || manualAudio?.s3Url;
    
    if (!videoUrl || !audioUrl) {
      toast.warning("Please record a session OR upload media before generating the report.");
      return;
    }

    setIsSaving(true);
    
    const payload = {
      report_id: draftInfo.projected_next_id,
      audio_url: audioUrl,
      video_url: videoUrl
    };

    try {
      const response = await reportsService.createReport(payload);
      toast.success(response.message);
      setReportData(response);
      setIsReportGenerated(true);
      
      // Clear session data after successful generation
      setMediaList([]);
      setLiveFacialUrl(null);
      setLiveVoiceUrl(null);
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error('Failed to generate clinical report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen transition-opacity duration-500 ease-in-out opacity-100">
      <main className="flex-1  mx-auto max-w-screen-2xl">
        {/* Header Section */}
        {isLoading ? (
          <Skeleton height={100} borderRadius={16} className="mb-10" />
        ) : (
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight font-headline">
                New Analysis
              </h1>
              <p className="text-on-surface-variant font-body mt-2 text-lg">
                Patient: <span className="font-semibold text-primary">{draftInfo.patient_name}</span> • Case {draftInfo.projected_next_id}
              </p>
            </div>
            <div className="flex gap-3 mb-3">
              {/* Hidden Input for Media Files */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept={fileAccept}
                multiple 
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length) {
                    const newMedia = files.map(file => ({
                      id: Math.random().toString(36).substr(2, 9),
                      name: file.name,
                      type: file.type.startsWith('video') ? 'video' : 'audio',
                      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'local',
                      fileObject: file
                    }));
                    setMediaList(prev => [...prev, ...newMedia]);
                    toast.success(`${files.length} file(s) added to session queue`);
                  }
                }}
              />
              
              {/* Media Library Trigger */}
              {mediaList.length > 0 && (
                <button 
                  onClick={() => setIsModalVisible(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/20 font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">folder_open</span>
                  Library
                  <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                    {mediaList.length}
                  </span>
                </button>
              )}

                <CDropdown variant="btn-group" className="flex items-stretch shadow-sm rounded-r-xl" direction="dropstart">
                
                <CDropdownToggle  
                split 
                  className="!flex !items-center !justify-center !px-3 !py-0 !text-primary hover:!bg-primary/5 !m-0 !shadow-none after:!hidden "
                />
                  <CButton
                    onClick={handleUploadAll}
                    disabled={!mediaList.some(m => m.status === 'local' || m.status === 'error')}
                    className="!flex !items-center !gap-2 !px-5 !py-0 !font-semibold !text-primary hover:!bg-primary/5 !transition-all !m-0 !shadow-none !text-sm disabled:!opacity-30 disabled:!cursor-not-allowed !rounded-r-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">upload_file</span>
                    Submit Media
                  </CButton>
                
                <CDropdownMenu className="!shadow-2xl !border-0 !rounded-2xl !p-2 !bg-white/90 !backdrop-blur-xl mt-1 min-w-[200px] !animate-in !fade-in !slide-in-from-top-1 !duration-200">

                  <div className="px-3 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                    Upload Source
                  </div>
                  <CDropdownItem 
                    onClick={() => handleAddMediaClick('video')}
                    className="!rounded-xl !flex !items-center !gap-3 !text-sm !font-bold !p-3 !text-on-surface hover:!bg-primary/5 !transition-all !cursor-pointer border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px] text-primary">videocam</span>
                    </div>
                    Upload Video
                  </CDropdownItem>
                  <CDropdownItem 
                    onClick={() => handleAddMediaClick('audio')}
                    className="!rounded-xl !flex !items-center !gap-3 !text-sm !font-bold !p-3 !text-on-surface hover:!bg-primary/5 !transition-all !cursor-pointer border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px] text-secondary">mic</span>
                    </div>
                    Upload Audio
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>



              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold transition-all shadow-md ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dim hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'progress_activity' : 'save'}</span>
                {isSaving ? 'Generating...' : 'Generate Report'}
              </button>

            </div>
          </header>
        )}

        {/* Recording Hub & Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-on-surface">
          
          {/* Left Area (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {isLoading ? (
              <>
                <Skeleton height={500} borderRadius={24} />
                <Skeleton height={400} borderRadius={24} />
              </>
            ) : (
              <>
                <FacialRecognitionFeed onUploadSuccess={(url) => setLiveFacialUrl(url)} />
                <DoctorAnalysis isLocked={!isReportGenerated} data={reportData?.ai_summary} />
              </>
            )}
          </div>

          {/* Right Area (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {isLoading ? (
              <>
                <Skeleton height={252} borderRadius={24} />
                <Skeleton height={280} borderRadius={24} />
              </>
            ) : (
              <>
                <VoiceRecognitionFeed onUploadSuccess={(url) => setLiveVoiceUrl(url)} />
                <EmotionalStateMetrics isLocked={!isReportGenerated} data={reportData?.result_analysis} />
              </>
            )}
          </div>

        </div>


        {/* Full-Width Recommendations */}
        {isLoading ? (
          <div className="mt-8">
            <Skeleton height={150} borderRadius={24} />
          </div>
        ) : (
          <div className="mt-8">
            <Recommendations isLocked={!isReportGenerated} data={reportData?.ai_recommendations} />
          </div>
        )}



        {/* Footer Spacer */}
        <div className="h-16" />
      </main>

      {/* Media Library Modal */}
      <CModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)}
        size="lg"
        alignment="center"
        className="backdrop-blur-sm"
        contentClassName="rounded-[2.5rem] border-0 shadow-2xl overflow-hidden"
      >
        <CModalHeader className="border-b border-outline/10 p-8 bg-surface-container-low">
          <CModalTitle className="flex items-center gap-3 text-2xl font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-3xl">library_music</span>
            Session Media Library
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="p-8 bg-surface-container-lowest max-h-[60vh] overflow-y-auto">
          {mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/40">
              <span className="material-symbols-outlined text-7xl mb-4">inventory_2</span>
              <p className="text-lg font-medium">No media added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaList.map((media) => (
                <div key={media.id} className={`group relative flex items-center gap-4 p-4 rounded-3xl bg-surface-container-low border border-outline/5 transition-all ${
                    media.status === 'ready' ? 'hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5' : ''
                  }`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    media.status === 'uploading' ? 'bg-surface-container-high' :
                    media.status === 'local' ? 'bg-orange-50 text-orange-600' :
                    media.status === 'error' ? 'bg-red-50 text-red-600' :
                    media.type === 'video' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                  }`}>
                    {media.status === 'uploading' ? (
                      <span className="material-symbols-outlined text-2xl animate-spin text-primary">progress_activity</span>
                    ) : media.status === 'local' ? (
                      <span className="material-symbols-outlined text-2xl">pending</span>
                    ) : media.status === 'error' ? (
                      <span className="material-symbols-outlined text-2xl">error</span>
                    ) : (
                      <span className="material-symbols-outlined text-2xl">
                        {media.type === 'video' ? 'videocam' : 'mic'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate text-sm transition-colors ${
                      media.status === 'error' ? 'text-red-600' : 'text-on-surface'
                    }`} title={media.name}>
                        {media.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-black text-on-surface-variant/60 tracking-wider">
                        {media.status === 'uploading' ? 'Uploading...' : 
                         media.status === 'local' ? 'Pending' : media.size}
                      </span>
                      {media.status === 'ready' && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-outline/20" />
                          <span className="text-[10px] font-bold text-primary truncate max-w-[100px]" title={media.s3Url}>
                            ID: {media.s3Id}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteMedia(media.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete Media"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </CModalBody>

        <CModalFooter className="border-t border-outline/10 p-8 bg-surface-container-low">
          <CButton 
            onClick={() => setIsModalVisible(false)}
            className="px-8 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors border-0"
          >
            Close Library
          </CButton>
          <CButton 
            onClick={() => {
              setIsModalVisible(false);
              handleAddMediaClick('all');
            }}
            className="px-8 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dim transition-all shadow-md active:scale-95 border-0"
          >
            Add More Media
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

