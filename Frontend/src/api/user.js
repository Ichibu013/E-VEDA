import { apiClient } from './config';

/**
 * User Service
 */
export const userService = {
  /**
   * Get user profile completion status
   */
  async getCompletionStatus() {
    return apiClient.get('/user/completion');
  },

  /**
   * Get user profile details
   */
  async getProfile() {
    return apiClient.get('/user');
  },

  /**
   * Update user profile details
   */
  async updateProfile(profileData) {
    return apiClient.put('/user', profileData);
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(formData) {
    return apiClient.post('/user/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
