'use client';

import { useState, useEffect } from 'react';
import WeatherCard from '@/components/WeatherCard';
import TemperatureChart from '@/components/TemperatureChart';
import WeeklyForecast from '@/components/WeeklyForecast';
import {
  CloudOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  EyeOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getWeatherCondition,
  getWeatherEmoji,
  type WeatherData,
  type HourlyData,
  type DailyData,
} from '@/lib/weather-api';

// Default location: Ho Chi Minh City
const DEFAULT_LOCATION = {
  name: 'Thành phố Hồ Chí Minh',
  latitude: 10.8231,
  longitude: 106.6297,
};

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const [current, hourly, daily] = await Promise.all([
          getCurrentWeather(location.latitude, location.longitude),
          getHourlyForecast(location.latitude, location.longitude),
          getDailyForecast(location.latitude, location.longitude),
        ]);

        if (current) setCurrentWeather(current);
        if (hourly) setHourlyData(hourly);
        if (daily) setWeeklyData(daily);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [location]);

  if (loading || !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white -mt-20 pt-20 flex items-center justify-center">
        <div className="text-center">
          <LoadingOutlined className="text-6xl text-blue-500 mb-4" />
          <p className="text-xl text-gray-600">Đang tải dữ liệu thời tiết...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white -mt-20 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Background Image Style */}
        <div className="relative bg-gradient-to-br from-teal-400 via-blue-300 to-blue-400 rounded-3xl p-12 mb-8 shadow-2xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
            }}></div>
          </div>
          
          <div className="relative flex items-start justify-between">
            <div className="text-white">
              <div className="flex items-center space-x-2 mb-4">
                <EnvironmentOutlined className="text-xl" />
                <h2 className="text-lg font-medium">{location.name}</h2>
              </div>
              <div className="flex items-baseline space-x-3 mb-2">
                <div className="flex items-center">
                  <span className="text-8xl font-light">{currentWeather.temperature}</span>
                  <span className="text-5xl font-light">°</span>
                </div>
              </div>
            </div>
            <div className="text-right text-white">
              <p className="text-5xl mb-2">{getWeatherEmoji(currentWeather.weatherCode)}</p>
              <p className="text-xl font-medium">
                {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-lg">
                {getWeatherCondition(currentWeather.weatherCode)}, 
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Humidity Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-4xl text-teal-500">💧</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Độ ẩm</p>
                <p className="text-2xl font-bold text-gray-800">{currentWeather.humidity}%</p>
              </div>
            </div>
          </div>

           {/* Wind Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-4xl text-blue-400">💨</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Gió</p>
                <p className="text-2xl font-bold text-gray-800">{currentWeather.windSpeed} km/h</p>
              </div>
            </div>
          </div>

          {/* Sunset Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-4xl text-orange-400">🌅</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Sunset</p>
                <p className="text-2xl font-bold text-gray-800">6:30 pm</p>
              </div>
            </div>
          </div>

          {/* Pressure Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-4xl text-purple-400">🌡️</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Áp suất</p>
                <p className="text-2xl font-bold text-gray-800">{currentWeather.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Temperature Chart */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
            {/* <h3 className="text-lg font-bold text-gray-800 mb-4">Temperature Chart</h3> */}
            <TemperatureChart data={hourlyData} />
          </div>

          {/* Weekly Forecast */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
            {/* <h3 className="text-lg font-bold text-gray-800 mb-4">7 Days Forecast</h3> */}
            <WeeklyForecast data={weeklyData} />
          </div>
        </div>

        {/* Monthly Rainfall Card */}
        <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl p-8 shadow-lg text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Monthly Rainfall</h3>
              <p className="text-5xl font-bold">55mm</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">This Year</p>
              <p className="text-3xl font-light opacity-80">310%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
