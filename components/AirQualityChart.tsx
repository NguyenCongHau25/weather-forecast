'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AirQualityData } from '@/lib/air-quality-api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AirQualityChartProps {
  data: AirQualityData;
  pollutant: 'pm2_5' | 'pm10';
  timeframe: 'hourly' | 'daily';
}

export default function AirQualityChart({ data, pollutant, timeframe }: AirQualityChartProps) {
  const chartData = {
    labels: data.time.map(t => {
      const date = new Date(t);
      return timeframe === 'hourly' ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString('vi-VN');
    }),
    datasets: [
      {
        label: pollutant.toUpperCase(),
        data: data[pollutant],
        backgroundColor: (context: any) => {
          const value = context.dataset.data[context.dataIndex];
          if (value > 50) return 'rgba(255, 99, 132, 0.7)'; // Red
          if (value > 35) return 'rgba(255, 159, 64, 0.7)'; // Orange
          return 'rgba(255, 206, 86, 0.7)'; // Yellow
        },
        borderColor: (context: any) => {
          const value = context.dataset.data[context.dataIndex];
          if (value > 50) return 'rgba(255, 99, 132, 1)';
          if (value > 35) return 'rgba(255, 159, 64, 1)';
          return 'rgba(255, 206, 86, 1)';
        },
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'µg/m³',
          align: 'end' as const,
        },
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  return <Bar data={chartData} options={options} />;
}
