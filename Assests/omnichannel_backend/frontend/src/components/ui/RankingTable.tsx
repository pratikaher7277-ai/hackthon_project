import type { RankingData } from '../../types/api';
import {
  formatPercent,
  getTrendColor,
  getTrendIcon,
  getSampleSizeColor,
  getEligibleBadge,
  getChannelColor,
} from '../../lib/utils';

interface RankingTableProps {
  ranking: RankingData[];
}

export function RankingTable({ ranking }: RankingTableProps) {
  const eligibleChannels = ranking.filter(c => c.eligible).sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const ineligibleChannels = ranking.filter(c => !c.eligible);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Channel</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Raw %</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Adjusted %</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">95% CI</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Quality</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Power</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Sample</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {eligibleChannels.map((channel) => (
            <tr key={channel.channel} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                #{channel.rank}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: getChannelColor(channel.channel_code as any) }}
                  >
                    {channel.channel_code}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{channel.label}</p>
                    <p className="text-xs text-gray-500">{channel.channel}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-900">
                {formatPercent(channel.raw_satisfaction_pct)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                {formatPercent(channel.adjusted_satisfaction_pct)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-gray-600">
                {channel.ci_low_pct !== null && channel.ci_high_pct !== null
                  ? `[${formatPercent(channel.ci_low_pct)}, ${formatPercent(channel.ci_high_pct)}]`
                  : 'N/A'}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                {formatPercent(channel.quality_score_pct / 100)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex items-center justify-center gap-1 text-sm font-medium ${getTrendColor(channel.trend_direction)}`}>
                  {getTrendIcon(channel.trend_direction)} {channel.trend_direction || '—'}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-900">
                {channel.statistical_power_pct !== null
                  ? formatPercent(channel.statistical_power_pct / 100)
                  : 'N/A'}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-0.5 text-xs rounded ${getSampleSizeColor(channel.sample_size_category)}`}>
                  {channel.sample_size_category}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-0.5 text-xs rounded ${getEligibleBadge(channel.eligible)}`}>
                  {channel.eligible ? 'Eligible' : 'Ineligible'}
                </span>
              </td>
            </tr>
          ))}
          {ineligibleChannels.length > 0 && (
            <>
              <tr>
                <td colSpan={10} className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  Ineligible Channels
                </td>
              </tr>
              {ineligibleChannels.map((channel) => (
                <tr key={channel.channel} className="bg-gray-50/50 opacity-60">
                  <td className="px-4 py-3 text-sm text-gray-400">—</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm opacity-50"
                        style={{ backgroundColor: getChannelColor(channel.channel_code as any) }}
                      >
                        {channel.channel_code}
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">{channel.label}</p>
                        <p className="text-xs text-gray-400">{channel.channel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">
                    {formatPercent(channel.raw_satisfaction_pct)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">
                    {formatPercent(channel.adjusted_satisfaction_pct)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">
                    {channel.ci_low_pct !== null && channel.ci_high_pct !== null
                      ? `[${formatPercent(channel.ci_low_pct)}, ${formatPercent(channel.ci_high_pct)}]`
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400">
                    {formatPercent(channel.quality_score_pct / 100)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {channel.trend_direction ? (
                      <span className={`text-sm ${getTrendColor(channel.trend_direction)}`}>
                        {getTrendIcon(channel.trend_direction)} {channel.trend_direction}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-400">
                    {channel.statistical_power_pct !== null
                      ? formatPercent(channel.statistical_power_pct / 100)
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded ${getSampleSizeColor(channel.sample_size_category)}`}>
                      {channel.sample_size_category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 text-xs rounded bg-danger-100 text-danger-700">
                      Ineligible
                    </span>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}