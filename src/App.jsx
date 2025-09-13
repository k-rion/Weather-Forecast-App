import { Toaster } from "react-hot-toast";
import ThemeToggle from "./components/ThemeToggle";
import useWeather from "./hooks/useWeather";
import BackgroundVideo from "./components/BackgroundVideo";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";
import WelcomeScreen from "./components/WelcomeScreen";

export default function App() {
  const weatherHook = useWeather();

  return (
    <div className="min-h-screen relative bg-base-100 transition-colors text-base-content">
      <header className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </header>

      <div className="relative w-full min-h-screen overflow-x-hidden">
        <BackgroundVideo {...weatherHook} />
        <CitySearch {...weatherHook} />
        {weatherHook.weather ? (
          <WeatherCard {...weatherHook} />
        ) : (
          <WelcomeScreen />
        )}
        <Toaster
          position="top-left md:bottom-right"
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
            success: { iconTheme: { primary: "green", secondary: "white" } },
            error: { iconTheme: { primary: "red", secondary: "white" } },
          }}
        />
      </div>
    </div>
  );
}
