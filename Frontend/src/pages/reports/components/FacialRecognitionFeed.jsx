import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { reportsService } from '../../../api/reports';

export default function FacialRecognitionFeed({ onUploadSuccess }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [s3Url, setS3Url] = useState(null);
  const [toastId, setToastId] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleToggleRecord = async () => {
    if (isUploading) return;

    if (!isRecording) {
      await startCaptureAndRecording();
    } else {
      stopRecording();
    }
  };

  const startCaptureAndRecording = async () => {
    try {
      // 1. Initialize camera exactly when starting
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: true 
      });
      streamRef.current = stream;
      
      // Update ref immediately if possible, but we need to wait for state to render the video tag
      setIsCameraReady(true);
      setIsRecording(true);
      
      const id = toast.loading('Facial recording in progress...', { duration: Infinity });
      setToastId(id);

      // Start MediaRecorder
      chunksRef.current = [];
      let options = { mimeType: 'video/mp4' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8,opus' };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        await processAndUpload(options.mimeType);
      };

      recorder.start();
    } catch (error) {
      console.error('Error starting facial recording:', error);
      toast.error('Could not access camera for recording.');
      setIsCameraReady(false);
      setIsRecording(false);
    }
  };

  // Sync video ref when isRecording changes
  React.useEffect(() => {
    if (isRecording && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isRecording]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Cleanup stream immediately to stop camera light
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      setIsCameraReady(false);
      
      if (toastId) toast.dismiss(toastId);
      setToastId(null);
    }
  };

  const processAndUpload = async (mimeType) => {
    const loadingToast = toast.loading('Processing and uploading video...');
    setIsUploading(true);

    try {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const formData = new FormData();
      formData.append('file', blob, `facial_analysis_${Date.now()}.mp4`);

      const response = await reportsService.uploadVideo(formData);
      const url = response.message;
      
      setS3Url(url);
      if (onUploadSuccess) onUploadSuccess(url);
      toast.success('Video analysis synced successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Video upload failed:', error);
      toast.error('Failed to sync video data.', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const resetSession = () => {
    stopRecording();
    setS3Url(null);
    if (onUploadSuccess) onUploadSuccess(null);
  };

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 overflow-hidden relative min-h-[500px] flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">face</span>
          Facial Recognition
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-outline'} `} />
          <span className={`text-xs font-bold uppercase tracking-widest ${isRecording ? 'text-red-500' : 'text-outline/80'}`}>
            {isRecording ? 'Live Recording' : 'Idle'}
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative rounded-2xl bg-surface-container-high overflow-hidden">
        {/* Placeholder UI shown when NOT recording */}
        {!isRecording && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-low/50">
            <div className="w-20 h-20 rounded-3xl bg-surface-container-high flex items-center justify-center mb-4 shadow-sm border border-outline/10">
              <span className="material-symbols-outlined text-4xl text-outline/40">videocam_off</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-outline/30" />
              <span className="text-sm font-bold text-on-surface-variant/40 uppercase tracking-widest font-headline">Live Preview</span>
            </div>
          </div>
        )}

        {/* Real-time Video Preview shown ONLY when recording */}
        {isRecording && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror the preview
          />
        )}


        {/* Sync Status Overlay */}
        {s3Url && (
          <div className="absolute top-6 left-6 z-10">
            <div className="bg-primary px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-sm">cloud_done</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Analysis Stream Synced</span>
            </div>
          </div>
        )}

        {/* Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-8">
          <div className="flex justify-between items-center">
            <div className="glass-panel px-6 py-3 rounded-full flex gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-lg">visibility</span>
                <span className="text-white text-sm font-medium">
                  {isRecording ? 'Tracking: Active' : 'Status: Ready'}
                </span>
              </div>
            </div>
            <div className="flex gap-3 ml-5">
              <button 
                onClick={handleToggleRecord}
                disabled={isUploading}
                className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all disabled:opacity-50 ${
                  isRecording ? 'bg-red-500 shadow-red-500/30' : 'bg-primary shadow-primary/30'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{isRecording ? 'stop' : 'videocam'}</span>
              </button>
              <button 
                onClick={resetSession}
                className="w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-2xl">refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <span className={`px-4 py-1.5 font-semibold text-sm rounded-full transition-colors ${
            s3Url ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
        }`}>
          {s3Url ? 'Data Stored Locally' : 'Awaiting Input'}
        </span>
        {s3Url && (
            <span className="text-[10px] text-on-surface-variant/60 font-mono truncate max-w-[200px]" title={s3Url}>
                ID: {s3Url.split('/').pop()}
            </span>
        )}
      </div>
    </section>
  );
}



