'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import type { ChartData } from '../../types/api';
import { getChannelColor } from '../../lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: ChartData;
  height?: number;
}

export function SatisfactionBarChart({ data, height = 300 }: ChartProps) {
  const chartData = {
    labels: data.x,
    datasets: data.series.map((series: any) => ({
      label: series.name,
      data: series.data,
      backgroundColor: data.x.map((_: string, idx: number) =>
        data.eligible?.[idx] ? getChannelColor(data.x[idx] as any) : 'rgba(156, 163, 175, 0.5)'
      ),
      borderColor: data.x.map((_: string, idx: number) =>
        data.eligible?.[idx] ? getChannelColor(data.x[idx] as any) : 'rgba(156, 163, 175, 1)'
      ),
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    })),
  };

  return (
    <div style={{ height }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: data.title,
              font: { size: 14, weight: 600 },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => `${context.dataset.label}: ${context.parsed.y?.toFixed(1) || 'N/A'}%`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: data.unit },
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
            },
            x: {
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
}

export function GroupedBarChart({ data, height = 300 }: ChartProps) {
  const chartData = {
    labels: data.x,
    datasets: data.series.map((series: any, i: number) => ({
      label: series.name,
      data: series.data,
      backgroundColor: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
      borderColor: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
      borderWidth: 1,
      borderRadius: 4,
    })),
  };

  return (
    <div style={{ height }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
            title: {
              display: true,
              text: data.title,
              font: { size: 14, weight: 600 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: data.unit },
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
            },
            x: {
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
}

export function TrendLineChart({ data, height = 300 }: ChartProps) {
  const chartData = {
    labels: data.x,
    datasets: data.series.map((series: any, i: number) => ({
      label: series.name,
      data: series.data,
      borderColor: getChannelColor(data.x[i] as any),
      backgroundColor: `${getChannelColor(data.x[i] as any)}20`,
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      spanGaps: true,
    })),
  };

  return (
    <div style={{ height }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
            title: {
              display: true,
              text: data.title,
              font: { size: 14, weight: 600 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: data.unit },
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
            },
            x: {
              grid: { display: false },
            },
          },
          interaction: {
            mode: 'index' as const,
            intersect: false,
          },
        }}
      />
    </div>
  );
}

const CHANNEL_COLORS = [
  '#0ea5e9',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

export function ChartRenderer({ data, height = 300 }: ChartProps) {
  switch (data.type) {
    case 'bar':
      return <SatisfactionBarChart data={data} height={height} />;
    case 'grouped_bar':
      return <GroupedBarChart data={data} height={height} />;
    case 'line':
      return <TrendLineChart data={data} height={height} />;
    default:
      return <div style={{ height }}>Unknown chart type: {data.type}</div>;
  }
}