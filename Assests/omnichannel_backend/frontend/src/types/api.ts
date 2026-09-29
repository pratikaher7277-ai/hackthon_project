export interface Channel {
  key: string;
  code: string;
  label: string;
}

export interface DataQuality {
  reliability_pct: number;
  freshness_pct: number;
  completeness_pct: number;
  score_pct: number;
}

export interface ChannelData {
  key: string;
  code: string;
  label: string;
  status: 'ok' | 'failed';
  eligible: boolean;
  rank: number | null;
  responses: number;
  scored_responses: number;
  raw_satisfaction_pct: number | null;
  adjusted_satisfaction_pct: number | null;
  ci_low_pct: number | null;
  ci_high_pct: number | null;
  like_for_like_effect_pts: number | null;
  data_quality: DataQuality;
  sample_size_category: 'small' | 'medium' | 'large';
  trend_direction: 'improving' | 'declining' | 'stable' | null;
  statistical_power_pct: number | null;
  reasons: string[];
}

export interface Summary {
  best_channel: {
    key: string;
    code: string;
    label: string;
  } | null;
  significant_lead: boolean | null;
  channel_gap_points: number | null;
  pooled_satisfaction_pct: number | null;
  notes: string[];
}

export interface ChartData {
  id: string;
  type: 'bar' | 'grouped_bar' | 'line';
  title: string;
  unit: string;
  x: string[];
  series: Array<{
    name: string;
    data: (number | null)[];
  }>;
  error?: {
    low: (number | null)[];
    high: (number | null)[];
  };
  eligible?: boolean[];
  highlight?: number | null;
}

export interface Report {
  schema_version: string;
  generated_at: string;
  window: {
    start: string;
    end: string;
  };
  summary: Summary;
  channels: ChannelData[];
  charts: ChartData[];
}

export interface RankingData {
  rank: number | null;
  channel: string;
  channel_code: string;
  label: string;
  responses: number;
  scored_responses: number;
  raw_satisfaction_pct: number | null;
  adjusted_satisfaction_pct: number | null;
  ci_low_pct: number | null;
  ci_high_pct: number | null;
  reliability_pct: number;
  freshness_pct: number;
  completeness_pct: number;
  quality_score_pct: number;
  sample_size_category: 'small' | 'medium' | 'large';
  trend_direction: 'improving' | 'declining' | 'stable' | null;
  statistical_power_pct: number | null;
  like_for_like_effect_pts: number | null;
  eligible: boolean;
  reasons: string[];
  status: 'ok' | 'failed';
}

export interface RankingResponse {
  ranking: RankingData[];
  summary: Summary;
}

export interface SummaryResponse {
  best_channel: Summary['best_channel'];
  significant_lead: boolean | null;
  channel_gap_points: number | null;
  pooled_satisfaction_pct: number | null;
  window: Report['window'];
  generated_at: string;
  alert: boolean;
  notes: string[];
}

export interface ChartType {
  id: string;
  type: string;
  description: string;
}