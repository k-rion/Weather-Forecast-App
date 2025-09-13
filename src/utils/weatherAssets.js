import sunny from "../videos/Sunny.mp4";
import rain from "../videos/Rain.mp4";
import night from "../videos/Night.mp4";
import cloudy from "../videos/Cloudy.mp4";
import snow from "../videos/Snow.mp4";
import sunset from "../videos/Sunset.mp4";
import storm from "../videos/Thunderstorm.mp4";

export const weatherVideos = {
  clear: sunny,
  sunny,
  rain,
  drizzle: rain,
  snow,
  clouds: cloudy,
  cloud: cloudy,
  cloudy,
  overcast: cloudy,
  thunder: storm,
  storm,
  mist: cloudy,
  haze: cloudy,
  fog: cloudy,
  night,
  sunset,
  default: sunny,
};

export const weatherIcons = {
  Clouds: "☁️",
  Night: "🌙",
  Clear: "☀️",
  Rain: "🌧️",
  Snow: "❄️",
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Mist: "🌫️",
};
