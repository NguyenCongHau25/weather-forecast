// Weather types
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  location: string;
  timestamp: Date;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    max: number;
    min: number;
  };
  condition: string;
  precipitation: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Forum types
export interface ForumPost {
  id: string;
  author: User;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
}

// Product types for Ads
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  link: string;
  category: string;
}
