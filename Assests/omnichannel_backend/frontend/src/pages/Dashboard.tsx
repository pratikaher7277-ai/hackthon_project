'use client';

import { useState } from 'react';
import { useReport, useRanking, useSummary, useChart, useHealthCheck } from '../hooks/useApi';
import { SummaryCards } from '../components/ui/SummaryCards';
import { ChannelCard } from '../components/ui/ChannelCard';
import { RankingTable } from '../components/ui/RankingTable';
import { ChartRenderer } from '../components/charts/ChartComponents';
import { formatDate } from '../lib/utils';

interface DashboardProps {
  defaultDays?: number;
  defaultBucketDays?: number;
}

export function Dashboard({ defaultDays = 14, defaultBucketDays = 1 }: DashboardProps) {
  const [days, setDays] = useState(defaultDays);
  const [bucketDays, setBucketDays] = useState(defaultBucketDays);
  const [activeTab, setActiveTab] = useState<'overview' | 'ranking' | 'charts'>('overview');

  const { data: report, isLoading: reportLoading, error: reportError, refetch: refetchReport } = useReport(days, bucketDays);
  const { data: ranking, isLoading: rankingLoading, error: rankingError } = useRanking(days, bucketDays);
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useSummary(days, bucketDays);
  const { data: health } = useHealthCheck();

  const satisfactionChart = useChart('satisfaction_by_channel', days, bucketDays);
  const qualityChart = useChart('data_quality_breakdown', days, bucketDays);
  const trendChart = useChart('satisfaction_trend', days, bucketDays);

  const isLoading = reportLoading || rankingLoading || summaryLoading;
  const isError = reportError || rankingError || summaryError;

  const handleRefresh = () => {
    refetchReport();
  };

  if (isLoading && !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-danger-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-500 mb-4">Unable to connect to the backend API</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const channels = report?.channels || [];
  const bestChannelKey = summary?.best_channel?.key;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Omnichannel Satisfaction</h1>
                <p className="text-sm text-gray-500">Customer satisfaction across all channels</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Health indicator */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-success-500' : 'bg-danger-500'}`}></span>
                <span className="text-sm text-gray-500">
                  {health?.status === 'ok' ? 'Backend Connected' : 'Backend Disconnected'}
                </span>
              </div>

              {/* Time range selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Time Range:</label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              {/* Bucket days selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Granularity:</label>
                <select
                  value={bucketDays}
                  onChange={(e) => setBucketDays(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>Daily</option>
                  <option value={7}>Weekly</option>
                  <option value={14}>Bi-weekly</option>
                  <option value={30}>Monthly</option>
                </select>
              </div>

              <button
                onClick={handleRefresh}
                disabled={reportLoading}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${reportLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-t border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Tabs">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('ranking')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'ranking'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rankings
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'charts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Charts
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Last updated info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Data as of {report ? formatDate(report.generated_at) : 'loading...'}
            <span className="mx-2">•</span>
            Window: {report ? `${formatDate(report.window.start)} - ${formatDate(report.window.end)}` : 'loading...'}
          </p>
        </div>

        {/* Summary Cards */}
        {summary && <SummaryCards summary={summary} />}

        {/* Tab Content */}
        <div className="mt-6 animate-slide-in">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Channel Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {channels.map((channel: any) => (
                  <ChannelCard
                    key={channel.key}
                    channel={channel}
                    isBest={channel.key === bestChannelKey}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Channel Rankings</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sorted by adjusted satisfaction (Bayesian shrinkage)</span>
                </div>
              </div>
              {ranking && <RankingTable ranking={ranking.ranking} />}
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Visualizations</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {satisfactionChart.data && (
                  <div className="bg-white rounded-xl border p-5">
                    <ChartRenderer data={satisfactionChart.data} height={350} />
                  </div>
                )}
                {qualityChart.data && (
                  <div className="bg-white rounded-xl border p-5">
                    <ChartRenderer data={qualityChart.data} height={350} />
                  </div>
                )}
              </div>

              {trendChart.data && (
                <div className="bg-white rounded-xl border p-5">
                  <ChartRenderer data={trendChart.data} height={400} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            Omnichannel Satisfaction Backend v1.0.0 | 
            Schema v1.0 | 
            <a href="/api/v1/report?days=14" target="_blank" className="text-primary-600 hover:underline">Raw API</a>
          </p>
        </div>
      </footer>
    </div>
  );
}