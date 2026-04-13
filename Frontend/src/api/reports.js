import { apiClient } from './config';

/**
 * Reports Service
 */
export const reportsService = {
  /**
   * Upload audio recording
   * @param {FormData} formData - Contains the 'file' field with audio blob
   * @returns {Promise<Object>} Response containing the S3 URL
   */
  async uploadAudio(formData) {
    return apiClient.post('/report/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Upload video recording
   * @param {FormData} formData - Contains the 'file' field with video blob
   * @returns {Promise<Object>} Response containing the S3 URL
   */
  async uploadVideo(formData) {
    return apiClient.post('/report/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Create final clinical report
   * @param {Object} payload - { report_id, audio_url, video_url }
   * @returns {Promise<Object>}
   */
  async createReport(payload) {
    return apiClient.post('/report/create', payload);
  }
};
