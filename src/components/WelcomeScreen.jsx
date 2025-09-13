import { motion as Motion } from "framer-motion";

export default function WelcomeScreen() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center mt-10 md:mt-20 text-base-content px-4 text-center">
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
  );
}
