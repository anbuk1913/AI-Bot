import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          // Redirect to login or show auth error
        }
        
        return Promise.reject({
          message: error.response?.data?.error || error.message || 'An error occurred',
          status: error.response?.status,
        });
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data as T;
  }

  async post<T>(url: string): Promise<T> {
    const response = await this.client.post<T>(url);
    return response.data as T;
  }

  async put<T>(url: string, data?: string): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data as T;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data as T;
  }
}

export const apiService = new ApiService();
