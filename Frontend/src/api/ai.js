import { apiClient } from './config';

/**
 * AI Service
 */
export const aiService = {
  /**
   * Get global emotional trends
   * @returns {Promise<Array>} List of daily emotional trends
   */
  async getTrends() {
    return apiClient.get('/ai/global-trends');
  },

  /**
   * Get AI insights based on records
   * @returns {Promise<Object>} Insights and recommendations
   */
  async getInsights() {
    return apiClient.get('/ai/insight');
  }

};
