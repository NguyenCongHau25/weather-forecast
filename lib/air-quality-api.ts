import { fetchWeatherApi } from 'openmeteo';

export interface AirQualityData {
  time: string[];
  pm2_5: (number | null)[];
  pm10: (number | null)[];
}

export async function getAirQualityHistory(
  latitude: number,
  longitude: number,
  pollutant: 'pm2_5' | 'pm10',
  timeframe: 'hourly' | 'daily',
  days: number = 7
): Promise<AirQualityData | null> {
  try {
    // Always fetch hourly data and aggregate it manually for daily view
    // This avoids the "invalid String value" error from the SDK when requesting daily variables
    const params = {
      latitude: latitude,
      longitude: longitude,
      hourly: ["pm10", "pm2_5"],
      past_days: timeframe === 'hourly' ? 2 : days, // Fetch 2 days for hourly to ensure 24h coverage
      forecast_days: timeframe === 'daily' ? 5 : 2, // Ensure we have data for the current day
      timezone: 'Asia/Bangkok',
    };

    const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;

    const time = Array.from(
        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    );
    
    const pm10Raw = hourly.variables(0)!.valuesArray()!;
    const pm2_5Raw = hourly.variables(1)!.valuesArray()!;

    // If hourly requested, return last 24 hours from now
    if (timeframe === 'hourly') {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const filteredIndices: number[] = [];
      time.forEach((t, i) => {
        if (t >= twentyFourHoursAgo && t <= now) {
          filteredIndices.push(i);
        }
      });

      return {
        time: filteredIndices.map(i => time[i].toISOString()),
        pm10: filteredIndices.map(i => pm10Raw[i]),
        pm2_5: filteredIndices.map(i => pm2_5Raw[i]),
      };
    }

    // If daily requested, aggregate hourly data by day
    const dailyData: Record<string, { pm10Sum: number, pm2_5Sum: number, count: number }> = {};
    
    time.forEach((t, i) => {
      const dateKey = t.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { pm10Sum: 0, pm2_5Sum: 0, count: 0 };
      }
      
      // Skip null/undefined values if any (though Float32Array usually has 0 or NaN)
      const p10 = pm10Raw[i];
      const p25 = pm2_5Raw[i];
      
      if (!isNaN(p10) && !isNaN(p25)) {
        dailyData[dateKey].pm10Sum += p10;
        dailyData[dateKey].pm2_5Sum += p25;
        dailyData[dateKey].count += 1;
      }
    });

    const dailyTime: string[] = [];
    const dailyPm10: number[] = [];
    const dailyPm2_5: number[] = [];

    Object.keys(dailyData).sort().forEach(date => {
      const day = dailyData[date];
      if (day.count > 0) {
        dailyTime.push(date);
        dailyPm10.push(Number((day.pm10Sum / day.count).toFixed(2)));
        dailyPm2_5.push(Number((day.pm2_5Sum / day.count).toFixed(2)));
      }
    });

    return {
      time: dailyTime,
      pm10: dailyPm10,
      pm2_5: dailyPm2_5
    };

  } catch (error) {
    console.error('Error in getAirQualityHistory:', error);
    return null;
  }
}
