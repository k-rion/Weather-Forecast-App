import { motion as Motion } from "framer-motion";
import { formatDate, getCityTime } from "../utils/weatherUtils";
import { weatherIcons } from "../utils/weatherAssets";

export default function WeatherCard({ weather, unit, toggleUnit }) {
  const cityTime = getCityTime(weather);

  return (
    <>
      <div className="relative z-10 mx-auto my-10 w-[90%] max-w-2xl p-4 rounded-md bg-[rgba(225,225,225,0.2)] backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-start">
          <div className="flex flex-col mb-2 md:mb-0">
            <h2 className="text-xl md:text-2xl font-medium text-base-content">
              {weather?.name || ""}
              {weather?.sys?.country ? `, ${weather.sys.country}` : ""}
            </h2>
            <div className="date-time">
              <p className="thin-label text-xs md:text-sm">
                {formatDate(cityTime)}
              </p>
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
          <p className="text-4xl md:text-6xl font-medium text-base-content">
            {weather?.main?.temp
              ? `${Math.round(weather.main.temp)}°${unit}`
              : ""}
          </p>

          <button
            onClick={toggleUnit}
            className="px-2 py-1 text-base-content w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] transition-colors"
            aria-label="Toggle temperature unit"
          >
            <span className="font-bold text-sm md:text-base">
              °{unit === "F" ? "C" : "F"}
            </span>
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto my-4 w-[90%] max-w-2xl p-4 rounded-md backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs md:text-sm">
          <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
            <p className="opacity-80">Feels Like</p>
            <p className="text-base-content font-medium">
              {Math.round(weather?.main?.feels_like)}°{unit}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
            <p className="opacity-80">Humidity</p>
            <p className="text-base-content font-medium">
              {weather?.main?.humidity}%
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
            <p className="opacity-80">Wind Speed</p>
            <p className="text-base-content font-medium">
              {(weather?.wind?.speed * 3.6).toFixed(1)} km/h
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-lg">
            <p className="opacity-80">Pressure</p>
            <p className="text-base-content font-medium">
              {weather?.main?.pressure} hPa
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
