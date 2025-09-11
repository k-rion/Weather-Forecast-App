import React, { useEffect, useState, useRef } from "react";
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
  const [videoUrl, setVideoUrl] = useState(null);
  const [unit, setUnit] = useState("F"); 
  const videoRef = useRef(null);

  const fetchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      toast.error("Please enter a city name!");
      return;
    }

    try {
      const units = unit === "F" ? "imperial" : "metric";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&units=${units}&appid=${API_KEY}`
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
    setVideoUrl(null);
  };

  const toggleUnit = () => {
    const newUnit = unit === "F" ? "C" : "F";
    setUnit(newUnit);
    if (city.trim()) {
      fetchWeather(); 
    }
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

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
    Night: "🌙",
    Clear: "☀️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️",
  };

  const changeBackgroundVideo = (weatherCondition, timeOfDay) => {
    let video = sunny; 
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
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-full bg-black/40 -z-0"
      ></div>

      <div className="relative z-10 flex flex-wrap justify-center pt-4 md:pt-8 px-4">
        <label className="flex items-center gap-2 input input-bordered bg-[rgba(225,225,225,0.2)] w-full max-w-xs h-10 md:h-8 rounded-xl text-sm md:text-base">
          <input
            type="text"
            className="text-white placeholder-white grow placeholder:text-sm md:placeholder:text-base"
            placeholder="Search for city...."
            onKeyDown={searchLocation}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {city && (
            <button className="hover:text-red-400" onClick={deleteSearch}>
              <X size={16} color="white" />
            </button>
          )}
        </label>
      </div>

      {weather && (
        <div className="relative z-10 mx-auto my-4 w-[90%] max-w-2xl p-4 rounded-md bg-[rgba(225,225,225,0.2)] backdrop-blur-sm">
          <div className="flex flex-wrap justify-between items-start">
            <div className="flex flex-col mb-2 md:mb-0">
              <h2 className="text-xl md:text-2xl font-medium text-white">
                {weather?.name || ""}
                {weather?.sys?.country ? `, ${weather.sys.country}` : ""}
              </h2>
              <div className="date-time">
                <p className="thin-label text-xs md:text-sm">{formatDate(cityTime)}</p>
              </div>
            </div>
            <div className="text-right">
              <Motion.div
                className="text-4xl md:text-5xl"
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
              <p className="capitalize thin-label opacity-80 text-xs md:text-sm mt-1">
                {weather?.weather?.[0]?.description}
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center mt-4">
            <p className="text-4xl md:text-6xl font-medium text-white">
              {weather?.main?.temp
                ? `${Math.round(weather.main.temp)}°${unit}`
                : ""}
            </p>

            <button
              onClick={toggleUnit}
              className="px-2 py-1 text-white w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] transition-colors"
              aria-label="Toggle temperature unit"
            >
              <span className="font-bold text-sm md:text-base">
                °{unit === "F" ? "C" : "F"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs md:text-sm">
            <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="opacity-80">Feels Like</p>
              <p className="text-white font-medium">{Math.round(weather?.main?.feels_like)}°{unit}</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="opacity-80">Humidity</p>
              <p className="text-white font-medium">{weather?.main?.humidity}%</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="opacity-80">Wind Speed</p>
              <p className="text-white font-medium">{(weather?.wind?.speed * 3.6).toFixed(1)} km/h</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="opacity-80">Pressure</p>
              <p className="text-white font-medium">{weather?.main?.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}

      {!weather && (
        <div className="relative z-10 flex flex-col items-center justify-center mt-10 md:mt-20 text-white px-4 text-center">
          <Motion.div
            className="text-5xl md:text-6xl mb-4 md:mb-6"
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
            🌦️
          </Motion.div>
          <h2 className="mb-2 text-lg md:text-xl font-medium">
            Welcome to Weather App
          </h2>
          <p className="opacity-80 text-sm md:text-base max-w-md">
            Search for a city to get started and see the current weather conditions
          </p>
        </div>
      )}

      <Toaster
        position="bottom-center md:bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "14px",
            padding: "12px 16px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            maxWidth: "90vw",
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