import React, { useRef } from 'react';
import { toast } from 'sonner';
import { userService } from '../../../api/user';

// Helper to strip localhost so Vite can proxy the MinIO request
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  return url.replace('http://localhost:9000', '');
};

export default function PersonalProfile({ data, onChange, isSaving }) {
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Basic client-side validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    const uploadPromise = userService.uploadProfilePicture(formData);

    toast.promise(uploadPromise, {
      loading: 'Uploading photo...',
      success: (res) => {
        onChange({ profile_picture: res.image_url });
        return 'Photo updated successfully!';
      },
      error: (err) => err.message || 'Failed to upload photo',
    });
  };

  const defaultImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"; // Replaced broken googleusercontent link with a working placeholder

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
               alt="Profile photo"
               className="w-36 h-36 rounded-full object-cover border-4 border-surface-container"
               // APPLIED THE HELPER HERE
               src={data?.profile_picture ? getProxiedImageUrl(data.profile_picture) : defaultImage}
             />
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               className="hidden" 
               accept="image/*"
             />
             <button 
               onClick={handlePhotoClick}
               className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
             >
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
                 value={data.name || ''}
                 onChange={(e) => onChange({ name: e.target.value })}
                 disabled={isSaving}
               />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Preferred Name
              </label>
               <input
                 className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface"
                 type="text"
                 value={data.nickname || ''}
                 onChange={(e) => onChange({ nickname: e.target.value })}
                 disabled={isSaving}
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
                 value={data.gender || ''}
                 onChange={(e) => onChange({ gender: e.target.value })}
                 disabled={isSaving}
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
                 value={data.age || ''}
                 onChange={(e) => onChange({ age: e.target.value })}
                 disabled={isSaving}
               />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Height (cm)
              </label>
               <input
                 className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60"
                 type="text"
                 placeholder="175"
                 value={data.height || ''}
                 onChange={(e) => onChange({ height: e.target.value })}
                 disabled={isSaving}
               />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
                Weight (kg)
              </label>
               <input
                 className="w-full bg-surface-container p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface placeholder:text-on-surface-variant/60"
                 type="text"
                 placeholder="70"
                 value={data.weight || ''}
                 onChange={(e) => onChange({ weight: e.target.value })}
                 disabled={isSaving}
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}