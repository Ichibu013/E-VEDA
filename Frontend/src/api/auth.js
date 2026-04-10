import { apiClient } from './config';
import { setCookie } from '../utils/cookies';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login user and store token in cookies
   */
  async login(email, password) {
    const data = await apiClient('/login', {
      body: { email, password },
    });

    if (data.token) {
      setCookie('auth_token', data.token);
    }

    return data;
  },

  /**
   * Register a new user
   */
  async signup(name, email, password) {
    return apiClient('/signup', {
      body: { name, email, password },
    });
  },
};
