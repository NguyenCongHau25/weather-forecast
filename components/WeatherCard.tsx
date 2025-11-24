'use client';

import {
  CloudOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  EyeOutlined,
  CompassOutlined,
} from '@ant-design/icons';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export default function WeatherCard({ title, value, unit, icon, trend }: WeatherCardProps) {
  const trendColors = {
    up: 'text-red-500',
    down: 'text-blue-500',
    neutral: 'text-gray-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl text-blue-500">{icon}</div>
        {trend && (
          <div className={`text-sm font-medium ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        {unit && <span className="text-xl text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}
