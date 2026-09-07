import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api';

export const apiClient = axios.create({
  baseURL: typeof window === 'undefined'
    ? (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000')
    : getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Client Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
