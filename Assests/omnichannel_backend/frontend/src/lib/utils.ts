import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString();
}

export function getTrendColor(trend: string | null): string {
  switch (trend) {
    case 'improving':
      return 'text-success-600';
    case 'declining':
      return 'text-danger-600';
    case 'stable':
      return 'text-primary-600';
    default:
      return 'text-gray-400';
  }
}

export function getTrendIcon(trend: string | null): string {
  switch (trend) {
    case 'improving':
      return '↗';
    case 'declining':
      return '↘';
    case 'stable':
      return '→';
    default:
      return '—';
  }
}

export function getSampleSizeColor(category: string): string {
  switch (category) {
    case 'large':
      return 'bg-success-100 text-success-700';
    case 'medium':
      return 'bg-warning-100 text-warning-700';
    case 'small':
      return 'bg-danger-100 text-danger-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function getEligibleBadge(eligible: boolean): string {
  return eligible
    ? 'bg-success-100 text-success-700'
    : 'bg-danger-100 text-danger-700';
}

export function getStatusColor(status: string): string {
  return status === 'ok' ? 'text-success-600' : 'text-danger-600';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export const CHANNEL_COLORS = [
  '#0ea5e9', // primary
  '#22c55e', // success
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
];

export const CHANNEL_CODES = ['A', 'B', 'C', 'D', 'E'] as const;
export type ChannelCode = typeof CHANNEL_CODES[number];

export function getChannelColor(code: ChannelCode): string {
  const index = CHANNEL_CODES.indexOf(code);
  return CHANNEL_COLORS[index] || CHANNEL_COLORS[0];
}