import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useReport(days = 14, bucketDays = 1) {
  return useQuery({
    queryKey: ['report', days, bucketDays],
    queryFn: () => api.getReport(days, bucketDays),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useRanking(days = 14, bucketDays = 1) {
  return useQuery({
    queryKey: ['ranking', days, bucketDays],
    queryFn: () => api.getRanking(days, bucketDays),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useSummary(days = 14, bucketDays = 1) {
  return useQuery({
    queryKey: ['summary', days, bucketDays],
    queryFn: () => api.getSummary(days, bucketDays),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useChart(chartId: string, days = 14, bucketDays = 1) {
  return useQuery({
    queryKey: ['chart', chartId, days, bucketDays],
    queryFn: () => api.getChart(chartId, days, bucketDays),
    enabled: !!chartId,
    staleTime: 30000,
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.healthCheck(),
    staleTime: 60000,
    refetchInterval: 30000,
  });
}