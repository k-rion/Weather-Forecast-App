import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import bgImage from "./bg_img/sarmat-batagov-Fttb8XbdJls-unsplash.jpg";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

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

      // OpenWeather sometimes returns cod as string
      if (Number(data.cod) === 200) {
        setWeather(data);
        toast.success(`Weather for ${data.name} loaded successfully!`);
      } else {
        setWeather(null);
        toast.error(data.message || "City not found");
      }

      console.log(data);
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
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Search */}
      <div className="flex justify-start pt-8 mx-4">
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

      <Toaster position="top-center" reverseOrder={false} />

      {/* First Column */}
      {weather && (
        <div className="flex mx-4 my-4 p-4 rounded-md bg-[rgba(225,225,225,0.2)] grid-rows-3 justify-between">
          <div>
            <h2 className=" text-2xl font-medium text-white">
              {weather?.name || ""}
              {weather?.sys?.country ? `, ${weather.sys.country}` : ""}
            </h2>
            <div className="date-time">
              <p className="thin-label">{formatDate(currentTime)}</p>
              <p className="thin-label">{formatTime(currentTime)}</p>
            </div>
          </div>

          {/* 2nd Column */}
          <p className="font-medium text-white text-6xl">
            {weather?.main?.temp ? `${Math.round(weather.main.temp)}°C` : ""}
          </p>

          {/* 3rd Column */}
          <div className="flex">
            <div className="z-10 flex flex-col flex-wrap detail-row:last-child">
              <div className="detail-row">
                <p className="detail-label">Feels Like</p>
                <p className="detail-value">
                  {Math.round(weather?.main?.feels_like)}°
                </p>
              </div>
              <div className="detail-row detail-row:last-child">
                <p className="detail-label ">Humidity</p>
                <p className="detail-value">{weather?.main?.humidity}%</p>
              </div>
              <div className="detail-row detail-row:last-child">
                <p className="detail-label">Speed</p>
                <p className="detail-value">{weather?.wind?.speed} km/h</p>
              </div>
              <div className="detail-row detail-row:last-child">
                <p className="detail-label">Pressure</p>
                <p className="detail-value">{weather?.main?.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!weather && (
        <div className="flex flex-col items-center justify-center mt-20 text-white">
          <div className="text-4xl mb-4 opacity-80">
            <i className="fas fa-cloud-sun"></i>
          </div>
          <h2 className="text-xl font-medium mb-2">Welcome to Weather App</h2>
          <p className="opacity-80">Search for a city to get started</p>
        </div>
      )}
    </div>
  );
}
