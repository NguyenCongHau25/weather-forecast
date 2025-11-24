// Open Meteo API functions

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  weatherCode: number;
  precipitation: number;
  cloudCover: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  visibility: number;
  windDirection: number;
}

export interface HourlyData {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
}

export interface DailyData {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitation: number;
}

// Weather code to condition mapping
const weatherCodeToCondition: { [key: number]: string } = {
  0: 'Trời quang',
  1: 'Ít mây',
  2: 'Nhiều mây',
  3: 'U ám',
  45: 'Sương mù',
  48: 'Sương mù kết băng',
  51: 'Mưa phùn nhẹ',
  53: 'Mưa phùn vừa',
  55: 'Mưa phùn nặng',
  61: 'Mưa nhẹ',
  63: 'Mưa vừa',
  65: 'Mưa lớn',
  71: 'Tuyết nhẹ',
  73: 'Tuyết vừa',
  75: 'Tuyết lớn',
  80: 'Mưa rào nhẹ',
  81: 'Mưa rào vừa',
  82: 'Mưa rào lớn',
  95: 'Giông bão',
  96: 'Giông bão có mưa đá nhẹ',
  99: 'Giông bão có mưa đá lớn',
};

export function getWeatherCondition(code: number): string {
  return weatherCodeToCondition[code] || 'Không xác định';
}

export function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '🌤️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌧️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

// Get current weather data
export async function getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,precipitation&daily=sunrise,sunset,uv_index_max&timezone=Asia/Bangkok&forecast_days=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    
    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: Math.round(current.surface_pressure),
      weatherCode: current.weather_code,
      precipitation: current.precipitation || 0,
      cloudCover: current.cloud_cover,
      uvIndex: Math.round(current.uv_index || daily.uv_index_max?.[0] || 0),
      sunrise: daily.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      sunset: daily.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      visibility: 10, // Open Meteo doesn't provide visibility, default to 10km
      windDirection: current.wind_direction_10m || 0,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Get hourly forecast
export async function getHourlyForecast(latitude: number, longitude: number): Promise<HourlyData[]> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation&timezone=Asia/Bangkok&forecast_days=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch hourly data');
    }
    
    const data = await response.json();
    const hourly = data.hourly;
    
    // Get data for every 3 hours
    const hourlyData: HourlyData[] = [];
    for (let i = 0; i < hourly.time.length; i += 3) {
      const time = new Date(hourly.time[i]);
      hourlyData.push({
        time: time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(hourly.temperature_2m[i]),
        humidity: hourly.relative_humidity_2m[i],
        precipitation: hourly.precipitation[i] || 0,
      });
    }
    
    return hourlyData;
  } catch (error) {
    console.error('Error fetching hourly data:', error);
    return [];
  }
}

// Get daily forecast
export async function getDailyForecast(latitude: number, longitude: number): Promise<DailyData[]> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=Asia/Bangkok&forecast_days=7`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch daily data');
    }
    
    const data = await response.json();
    const daily = data.daily;
    
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    return daily.time.map((time: string, index: number) => {
      const date = new Date(time);
      return {
        day: daysOfWeek[date.getDay()],
        date: time,
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        weatherCode: daily.weather_code[index],
        precipitation: Math.round(daily.precipitation_sum[index]),
      };
    });
  } catch (error) {
    console.error('Error fetching daily data:', error);
    return [];
  }
}

// Get location by city name (using geocoding)
export async function getLocationByCity(cityName: string): Promise<{ latitude: number; longitude: number; name: string } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=vi&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}
