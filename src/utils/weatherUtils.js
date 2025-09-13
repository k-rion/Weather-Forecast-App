export const getTimeOfDay = (weather) => {
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

export const formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

export const getCityTime = (weather) => {
  if (!weather) return new Date();
  const utc = Date.now();
  const offset = weather.timezone * 1000;
  return new Date(utc + offset);
};
