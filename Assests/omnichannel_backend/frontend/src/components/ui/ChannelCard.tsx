import type { ChannelData } from '../../types/api';
import {
  formatPercent,
  formatNumber,
  getTrendColor,
  getTrendIcon,
  getSampleSizeColor,
  getEligibleBadge,
  getStatusColor,
  getChannelColor,
} from '../../lib/utils';

interface ChannelCardProps {
  channel: ChannelData;
  isBest?: boolean;
}

export function ChannelCard({ channel, isBest }: ChannelCardProps) {
  const adjusted = channel.adjusted_satisfaction_pct;
  const raw = channel.raw_satisfaction_pct;
  const ciLow = channel.ci_low_pct;
  const ciHigh = channel.ci_high_pct;

  return (
    <div
      className={`relative rounded-xl border p-5 transition-all ${
        isBest
          ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-200'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${!channel.eligible && 'opacity-60'}`}
    >
      {isBest && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            BEST
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: getChannelColor(channel.code as any) }}
          >
            {channel.code}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{channel.label}</h3>
            <p className="text-sm text-gray-500">{channel.key}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getEligibleBadge(channel.eligible)}`}
          >
            {channel.eligible ? 'Eligible' : 'Ineligible'}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(channel.status)}`}
          >
            {channel.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {adjusted !== null ? `${adjusted.toFixed(1)}%` : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Adjusted</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {raw !== null ? `${raw.toFixed(1)}%` : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Raw</p>
        </div>
      </div>

      {(ciLow !== null && ciHigh !== null) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">95% Confidence Interval</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{formatPercent(ciLow)}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded mx-2 relative">
              <div
                className="absolute h-full rounded bg-primary-500"
                style={{
                  left: `${((adjusted || 0) - ciLow) / (ciHigh - ciLow) * 100}%`,
                  width: `${(ciHigh - ciLow) / 100 * 100}%`,
                }}
              />
              <div
                className="absolute top-1/2 w-1 h-1 -translate-y-1/2 bg-primary-600 rounded-full"
                style={{ left: `${((adjusted || 0) - ciLow) / (ciHigh - ciLow) * 100}%` }}
              />
            </div>
            <span className="text-gray-600">{formatPercent(ciHigh)}</span>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Responses</span>
          <span className="font-medium">{formatNumber(channel.scored_responses)} / {formatNumber(channel.responses)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Quality Score</span>
          <span className="font-medium">{formatPercent(channel.data_quality.score_pct / 100)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Trend</span>
          <span className={`font-medium flex items-center gap-1 ${getTrendColor(channel.trend_direction)}`}>
            {getTrendIcon(channel.trend_direction)} {channel.trend_direction || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Sample Size</span>
          <span className={`px-2 py-0.5 text-xs rounded ${getSampleSizeColor(channel.sample_size_category)}`}>
            {channel.sample_size_category}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Statistical Power</span>
          <span className="font-medium">
            {channel.statistical_power_pct !== null ? formatPercent(channel.statistical_power_pct / 100) : 'N/A'}
          </span>
        </div>
      </div>

      {channel.reasons.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Exclusion Reasons:</p>
          <ul className="space-y-1">
            {channel.reasons.map((reason, i) => (
              <li key={i} className="text-xs text-danger-600 flex items-center gap-1">
                <span>•</span> {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {channel.like_for_like_effect_pts !== null && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Like-for-Like Effect:</p>
          <p className={`text-sm font-medium ${channel.like_for_like_effect_pts > 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {channel.like_for_like_effect_pts > 0 ? '+' : ''}{channel.like_for_like_effect_pts.toFixed(1)} pts
          </p>
        </div>
      )}
    </div>
  );
}