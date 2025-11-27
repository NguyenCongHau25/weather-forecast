import { AirQualityData } from './air-quality-api';

// Định nghĩa các loại model được hỗ trợ
export type ModelType = 'api' | 'model1' | 'model2';

/**
 * Interface cho kết quả dự đoán
 * Cấu trúc giống với AirQualityData để tái sử dụng biểu đồ
 */
export interface PredictionResult extends AirQualityData {
  modelUsed: string;
  confidence?: number;
}

/**
 * Hàm giả lập chạy inference model
 * Sau này bạn sẽ thay thế phần này bằng code load model thực tế (VD: TensorFlow.js, ONNX, Python shell...)
 */
export async function runModelInference(
  modelId: string,
  latitude: number,
  longitude: number,
  pollutant: 'pm2_5' | 'pm10',
  timeframe: 'hourly' | 'daily'
): Promise<PredictionResult | null> {
  console.log(`Running inference with model: ${modelId} for ${pollutant} (${timeframe})`);

  // TODO: Tích hợp model thực tế ở đây
  // Ví dụ:
  // 1. Load file model từ thư mục /public/models/ hoặc /models/
  // 2. Chuẩn bị input tensor từ latitude, longitude, time
  // 3. Run inference
  // 4. Format output

  // Giả lập độ trễ của việc chạy model
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Tạo dữ liệu giả lập để hiển thị lên biểu đồ
  // Logic này chỉ để demo UI, bạn sẽ thay thế bằng output thực của model
  const now = new Date();
  const dataPoints = timeframe === 'hourly' ? 24 : 7; // 24 giờ hoặc 7 ngày
  const timeArray: string[] = [];
  const pm10Array: number[] = [];
  const pm2_5Array: number[] = [];

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(now);
    if (timeframe === 'hourly') {
      date.setHours(now.getHours() - (dataPoints - 1) + i);
    } else {
      date.setDate(now.getDate() - (dataPoints - 1) + i);
    }
    timeArray.push(date.toISOString());

    // Tạo giá trị ngẫu nhiên khác nhau cho từng model để thấy sự khác biệt
    const baseValue = modelId === 'model1' ? 30 : 60; 
    const randomVariation = Math.random() * 20 - 10;
    
    pm10Array.push(Math.max(0, baseValue + randomVariation + 10));
    pm2_5Array.push(Math.max(0, baseValue + randomVariation));
  }

  return {
    time: timeArray,
    pm10: pm10Array,
    pm2_5: pm2_5Array,
    modelUsed: modelId,
    confidence: 0.85 + Math.random() * 0.1 // Giả lập độ tin cậy
  };
}
