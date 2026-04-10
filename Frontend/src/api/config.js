export const BASE_URL = 'http://localhost:8080/api';

/**
 * Base fetch wrapper to handle JSON and errors
 */
export const apiClient = async (endpoint, options = {}) => {
  const { body, headers, ...customConfig } = options;
  
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Request failed');
  }
};
