import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";
import { motion as Motion } from "framer-motion";

import sunny from "./videos/Sunny.mp4";
import rain from "./videos/Rain.mp4";
import night from "./videos/Night.mp4";
import cloudy from "./videos/Cloudy.mp4";
import snow from "./videos/Snow.mp4";
import sunset from "./videos/Sunset.mp4";
import storm from "./videos/Thunderstorm.mp4";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [videoUrl, setVideoUrl] = useState(sunny);

  const fetchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      toast.error("Please enter a city name!");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&units=metric&appid=${API_KEY}`
      );

      const data = await res.json();

      if (Number(data.cod) === 200) {
        setWeather(data);
        toast.success(`Weather for ${data.name} loaded successfully!`);
        const timeOfDay = getTimeOfDay(data);
        changeBackgroundVideo(data.weather[0].main, timeOfDay);
      } else {
        setWeather(null);
        toast.error(data.message || "City not found");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast.error("Network error. Please try again later.");
    }
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };

  const deleteSearch = () => {
    setCity("");
    setWeather(null);
    setVideoUrl(sunny);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (weather) {
        const timeOfDay = getTimeOfDay(weather);
        changeBackgroundVideo(weather.weather[0].main, timeOfDay);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [weather]);

  // Format date and time
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const getCityTime = () => {
    if (!weather) return new Date();
    const utc = Date.now();
    const offset = weather.timezone * 1000;
    const localTime = new Date(utc + offset);
    return localTime;
  };

  const cityTime = getCityTime();

  const getTimeOfDay = (weather) => {
    if (!weather) return "day";
    const now = Date.now();
    const sunrise = weather.sys.sunrise * 1000;
    const sunset = weather.sys.sunset * 1000;
    const sunsetStart = sunset - 30 * 60 * 1000;
    const sunsetEnd = sunset + 30 * 60 * 1000;
    if (now >= sunrise && now <= sunset) return "day";
    if (now >= sunsetStart && now <= sunsetEnd) return "sunset";
    return "night";
  };

  const weatherVideos = {
    clear: sunny,
    sunny: sunny,
    rain: rain,
    drizzle: rain,
    snow: snow,
    clouds: cloudy,
    cloud: cloudy,
    cloudy: cloudy,
    overcast: cloudy,
    thunder: storm,
    storm: storm,
    mist: cloudy,
    haze: cloudy,
    fog: cloudy,
    night: night,
    sunset: sunset,
    default: sunny,
  };

  const weatherIcons = {
    Clouds: "☁️",
    Clear: "☀️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️",
  };

  const changeBackgroundVideo = (weatherCondition, timeOfDay) => {
    let video = sunny; // default
    if (timeOfDay === "night") {
      video = night;
    } else if (timeOfDay === "sunset") {
      video = sunset;
    } else if (weatherCondition) {
      const condition = weatherCondition.toLowerCase();
      const videoKey = Object.keys(weatherVideos).find((key) =>
        condition.includes(key)
      );
      if (videoKey) {
        video = weatherVideos[videoKey];
      }
    }
    setVideoUrl(video);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,.35)",
          zIndex: 0,
        }}
      ></div>

      {/* Search - ADD relative z-10 */}
      <div className="relative z-10 flex flex-wrap justify-start pt-8 mx-4">
        <label className="flex items-center gap-2 input input-bordered bg-[rgba(225,225,225,0.2)] w-60 h-6 rounded-xl text-[10px]">
          <input
            type="text"
            className="text-white placeholder-white grow placeholder:text-[10px]"
            placeholder="Search for city...."
            onKeyDown={searchLocation}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {city && (
            <button className="hover:text-red-400" onClick={deleteSearch}>
              <X size={12} color="white" />
            </button>
          )}
        </label>
      </div>

      {/* Weather Content */}
      {weather && (
        <div className="relative z-10 mx-4 my-4 p-4 rounded-md bg-[rgba(225,225,225,0.2)]">
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-medium text-white ">
                {weather?.name || ""}
                {weather?.sys?.country ? `, ${weather.sys.country}` : ""}
              </h2>
              <div className="date-time">
                <p className="thin-label">{formatDate(cityTime)}</p>
              </div>
            </div>
            <div>
              <Motion.div
                className="text-5xl"
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                  textShadow: [
                    "0px 0px 10px rgba(255,255,255,0.5)",
                    "0px 0px 20px rgba(255,255,255,0.8)",
                    "0px 0px 10px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {weatherIcons[weather?.weather?.[0]?.main] || "🌍"}
              </Motion.div>

              <p className="capitalize thin-label opacity-80">
                {weather?.weather?.[0]?.description}
              </p>
            </div>
          </div>

          {/* 2nd Column */}
          <p className="text-6xl font-medium text-white">
            {weather?.main?.temp ? `${Math.round(weather.main.temp)}°C` : ""}
          </p>

          {/* 3rd Column - Simplified structure */}
          <div className="flex flex-col mt-4">
            <div className="detail-row">
              <p className="detail-label">Feels Like</p>
              <p className="detail-value">
                {Math.round(weather?.main?.feels_like)}°
              </p>
            </div>
            <div className="detail-row">
              <p className="detail-label">Humidity</p>
              <p className="detail-value">{weather?.main?.humidity}%</p>
            </div>
            <div className="detail-row">
              <p className="detail-label">Speed</p>
              <p className="detail-value">
                {weather?.wind?.speed
                  ? `${(weather.wind.speed * 3.6).toFixed(1)} km/h`
                  : ""}
              </p>
            </div>
            <div className="detail-row">
              <p className="detail-label">Pressure</p>
              <p className="detail-value">{weather?.main?.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}

      {!weather && (
        <div className="relative z-10 flex flex-col items-center justify-center mt-20 text-white">
          <div className="mb-4 text-4xl opacity-80">
            <i className="fas fa-cloud-sun"></i>
          </div>
          <h2 className="mb-2 text-xl font-medium">Welcome to Weather App</h2>
          <p className="opacity-80">Search for a city to get started</p>
        </div>
      )}

      {/* Toaster */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "8px", 
            padding: "10px", 
            background: "#333", 
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "green",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "red",
              secondary: "white",
            },
          },
        }}
      />
    </div>
  );
}
