'use client';

import { useState, useEffect } from 'react';
import { getAirQualityHistory, AirQualityData } from '@/lib/air-quality-api';
import AirQualityChart from '@/components/AirQualityChart';
import { EnvironmentOutlined, LoadingOutlined } from '@ant-design/icons';

// Location: Thu Duc, Ho Chi Minh City
const LOCATION = {
  name: 'Thủ Đức',
  latitude: 10.85,
  longitude: 106.75,
};

type Pollutant = 'pm2_5' | 'pm10';
type Timeframe = 'hourly' | 'daily';

export default function Home() {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollutant, setPollutant] = useState<Pollutant>('pm2_5');
  const [timeframe, setTimeframe] = useState<Timeframe>('hourly');

  useEffect(() => {
    const fetchAirQuality = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAirQualityHistory(
          LOCATION.latitude,
          LOCATION.longitude,
          pollutant,
          timeframe
        );
        setAirQualityData(data);
      } catch (err) {
        setError('Không thể tải dữ liệu chất lượng không khí.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, [pollutant, timeframe]);

  const getAverage = () => {
    if (!airQualityData || !airQualityData[pollutant]) return 0;
    const values = airQualityData[pollutant].filter(v => v !== null) as number[];
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(2);
  };

  const getAQILevel = (value: number) => {
    if (value <= 12) return { label: 'Tốt', color: 'text-green-500', bgColor: 'bg-green-100' };
    if (value <= 35.4) return { label: 'Trung bình', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    if (value <= 55.4) return { label: 'Không lành mạnh cho nhóm nhạy cảm', color: 'text-orange-500', bgColor: 'bg-orange-100' };
    if (value <= 150.4) return { label: 'Không lành mạnh', color: 'text-red-500', bgColor: 'bg-red-100' };
    if (value <= 250.4) return { label: 'Rất không lành mạnh', color: 'text-purple-500', bgColor: 'bg-purple-100' };
    return { label: 'Nguy hiểm', color: 'text-red-800', bgColor: 'bg-red-200' };
  };

  const averageValue = parseFloat(String(getAverage()));
  const aqiInfo = getAQILevel(averageValue);

  return (
    <div className="min-h-screen bg-gray-50 -mt-20 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Chất lượng không khí</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <EnvironmentOutlined className="mr-2" />
                <span>{LOCATION.name}, TP. Hồ Chí Minh</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              {/* Timeframe Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTimeframe('hourly')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeframe === 'hourly' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Giờ
                </button>
                <button
                  onClick={() => setTimeframe('daily')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeframe === 'daily' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Ngày
                </button>
              </div>
              {/* Pollutant Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPollutant('pm2_5')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    pollutant === 'pm2_5' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  PM2.5
                </button>
                <button
                  onClick={() => setPollutant('pm10')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    pollutant === 'pm10' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  PM10
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <LoadingOutlined className="text-4xl text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-80 text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : airQualityData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Average Info */}
              <div className="lg:col-span-1 flex flex-col justify-center items-center bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 font-medium">Chỉ số {pollutant.toUpperCase()} trung bình</p>
                <p className={`text-6xl font-bold my-2 ${aqiInfo.color}`}>{averageValue}</p>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${aqiInfo.bgColor} ${aqiInfo.color}`}>
                  {aqiInfo.label}
                </span>
              </div>
              {/* Chart */}
              <div className="lg:col-span-2 h-80">
                <AirQualityChart data={airQualityData} pollutant={pollutant} timeframe={timeframe} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
