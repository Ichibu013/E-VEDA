import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { reportsService } from '../../../api/reports';
import { encodeWAV } from '../../../utils/wavEncoder';

export default function VoiceRecognitionFeed({ onUploadSuccess }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [s3Url, setS3Url] = useState(null);
  
  // Recording references to avoid re-renders and keep data consistent
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext({ sampleRate: 44100 });
      audioContextRef.current = audioContext;

      const input = audioContext.createMediaStreamSource(stream);
      // Using 4096 buffer size, 1 input channel, 1 output channel
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      chunksRef.current = [];
      processor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(data));
      };

      input.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      const id = toast.loading('Voice recording in progress...', { duration: Infinity });
      setToastId(id);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    if (toastId) toast.dismiss(toastId);
    setToastId(null);

    const loadingToast = toast.loading('Processing and uploading audio...');
    setIsUploading(true);

    try {
      // Disconnect and stop tracks
      if (processorRef.current) processorRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const chunks = chunksRef.current;
      if (chunks.length === 0) {
        toast.error('No audio captured', { id: loadingToast });
        return;
      }

      // Combine chunks into a single Float32Array
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combinedBuffer = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combinedBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      // Create an AudioBuffer to pass to the encoder
      const finalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = finalAudioContext.createBuffer(1, totalLength, 44100);
      audioBuffer.getChannelData(0).set(combinedBuffer);

      // Encode to WAV
      const wavBlob = encodeWAV(audioBuffer);
      
      // Prepare FormData for upload
      const formData = new FormData();
      formData.append('file', wavBlob, `recording_${Date.now()}.wav`);

      // Upload to API
      const response = await reportsService.uploadAudio(formData);
      const url = response.message; // From API docs: body contains message with S3 URL
      
      setS3Url(url);
      if (onUploadSuccess) onUploadSuccess(url);
      toast.success('Audio uploaded successfully!', { id: loadingToast });
      console.log('Stored Audio S3 URL:', url);

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload audio. Please try again.', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const resetSession = () => {
    setIsRecording(false);
    setS3Url(null);
    if (onUploadSuccess) onUploadSuccess(null);
    if (toastId) toast.dismiss(toastId);
    setToastId(null);
    
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
    }
    
    toast.info('Voice Recognition session reset');
  };

  const bars = [
    { h: 'h-4', op: 'opacity-40' },
    { h: 'h-8', op: 'opacity-60' },
    { h: 'h-12', op: '' },
    { h: 'h-6', op: 'opacity-80' },
    { h: 'h-14', op: '' },
    { h: 'h-10', op: '' },
    { h: 'h-3', op: 'opacity-40' },
    { h: 'h-11', op: '' },
    { h: 'h-16', op: 'opacity-90' },
    { h: 'h-5', op: 'opacity-50' },
    { h: 'h-10', op: '' },
    { h: 'h-7', op: '' },
    { h: 'h-15', op: '' },
    { h: 'h-11', op: 'opacity-70' },
    { h: 'h-14', op: '' },
    { h: 'h-4', op: 'opacity-40' },
    { h: 'h-9', op: 'opacity-60' },
    { h: 'h-13', op: '' },
    { h: 'h-7', op: 'opacity-80' },
    { h: 'h-11', op: '' },
    { h: 'h-3', op: 'opacity-40' },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
      <style>{`
        @keyframes sound-wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: sound-wave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">mic</span>
          Voice Recognition
        </h2>
        <div className="flex gap-2">
          <button
            onClick={resetSession}
            title="Reset Session"
            className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          <button 
            disabled={isUploading}
            onClick={() => isRecording ? stopRecording() : startRecording()}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
            }`}
          >
            {isRecording ? 'STOP' : 'START'}
          </button>
        </div>

      </div>
      <div className="h-32 bg-surface-container-low rounded-2xl flex items-center justify-center relative overflow-hidden">
        {/* Simulated Waveform */}
        <div className="flex items-end gap-1.5 px-6 h-16">
          {bars.map((bar, i) => (
            <div
              key={i}
              className={`w-1.5 bg-primary rounded-full transition-transform ${isRecording ? 'animate-wave' : ''} ${bar.h} ${bar.op}`}
              style={{
                animationDelay: `${(i % 5) * 0.15}s`,
                animationDuration: `${0.8 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Status Overlay */}
        {s3Url && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">cloud_done</span>
              <span className="text-[10px] font-bold text-primary uppercase">Audio Sync Complete</span>
            </div>
          </div>
        )}
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

