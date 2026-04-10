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
};
