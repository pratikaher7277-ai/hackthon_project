import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type {
  Report,
  RankingResponse,
  SummaryResponse,
  ChartData,
  ChartType,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[API Error]', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  async getReport(days = 14, bucketDays = 1): Promise<Report> {
    const response = await this.client.get<Report>('/api/v1/report', {
      params: { days, bucket_days: bucketDays },
    });
    return response.data;
  }

  async getRanking(days = 14, bucketDays = 1, format: 'json' | 'text' = 'json'): Promise<RankingResponse> {
    const response = await this.client.get('/api/v1/ranking', {
      params: { days, bucket_days: bucketDays, format },
    });
    return response.data;
  }

  async getSummary(days = 14, bucketDays = 1): Promise<SummaryResponse> {
    const response = await this.client.get<SummaryResponse>('/api/v1/summary', {
      params: { days, bucket_days: bucketDays },
    });
    return response.data;
  }

  async getChart(chartId: string, days = 14, bucketDays = 1): Promise<ChartData> {
    const response = await this.client.get<ChartData>(`/api/v1/chart/${chartId}`, {
      params: { days, bucket_days: bucketDays },
    });
    return response.data;
  }

  async getChartTypes(): Promise<ChartType[]> {
    const response = await this.client.get<ChartType[]>('/api/v1/chart-types');
    return response.data;
  }

  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const api = new ApiClient();
export default api;