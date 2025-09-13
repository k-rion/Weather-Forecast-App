import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { weatherVideos } from "../utils/weatherAssets";
import { getTimeOfDay } from "../utils/weatherUtils";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function useWeather() {
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
    if (city.trim()) fetchWeather();
  };

  const changeBackgroundVideo = (weatherCondition, timeOfDay) => {
    let video = weatherVideos.default;
    if (timeOfDay === "night") video = weatherVideos.night;
    else if (timeOfDay === "sunset") video = weatherVideos.sunset;
    else if (weatherCondition) {
      const condition = weatherCondition.toLowerCase();
      const videoKey = Object.keys(weatherVideos).find((key) =>
        condition.includes(key)
      );
      if (videoKey) video = weatherVideos[videoKey];
    }
    setVideoUrl(video);
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
    if (videoRef.current) videoRef.current.load();
  }, [videoUrl]);

  return {
    weather,
    city,
    setCity,
    videoUrl,
    videoRef,
    unit,
    fetchWeather,
    searchLocation,
    deleteSearch,
    toggleUnit,
  };
}
