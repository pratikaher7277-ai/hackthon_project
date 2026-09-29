import type { SummaryResponse } from '../../types/api';
import { formatRelativeTime } from '../../lib/utils';

interface SummaryCardsProps {
  summary: SummaryResponse;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Best Channel</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {summary.best_channel?.label || 'None'}
            </p>
            {summary.best_channel && (
              <span className="inline-flex items-center gap-1 mt-1 text-sm">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    summary.significant_lead ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                  }`}
                >
                  {summary.significant_lead ? 'Significant Lead' : 'Within Noise'}
                </span>
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">
            🏆
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-gray-500">Pooled Satisfaction</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {summary.pooled_satisfaction_pct !== null
            ? `${summary.pooled_satisfaction_pct.toFixed(1)}%`
            : 'N/A'}
        </p>
        <p className="text-xs text-gray-400 mt-2">Average across all channels</p>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-gray-500">Channel Gap</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          {summary.channel_gap_points !== null
            ? `${summary.channel_gap_points.toFixed(1)} pts`
            : 'N/A'}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {summary.channel_gap_points !== null && summary.channel_gap_points > 10
            ? '⚠️ Inconsistent experience'
            : 'Experience is consistent'}
        </p>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-gray-500">Last Updated</p>
        <p className="text-lg font-medium text-gray-900 mt-1">
          {formatRelativeTime(summary.generated_at)}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Window: {new Date(summary.window.start).toLocaleDateString()} -{' '}
          {new Date(summary.window.end).toLocaleDateString()}
        </p>
      </div>

      {summary.alert && (
        <div className="lg:col-span-4 bg-danger-50 border-danger-200 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-danger-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-danger-800">Channel Gap Alert</p>
              <p className="text-sm text-danger-700">
                Experience is inconsistent across channels (gap: {summary.channel_gap_points?.toFixed(1)} pts).
                Focus improvement efforts on underperforming channels.
              </p>
            </div>
            {summary.notes.map((note, i) => (
              <p key={i} className="text-sm text-danger-700 ml-11 flex items-center gap-1">
                <span>•</span> {note}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}