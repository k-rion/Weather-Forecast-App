import { X } from "lucide-react";

export default function CitySearch({ city, setCity, searchLocation, deleteSearch }) {
  return (
    <div className="relative z-10 flex flex-wrap justify-center pt-4 md:pt-8 px-4">
      <label className="flex items-center gap-2 input input-bordered bg-[rgba(225,225,225,0.2)] w-full max-w-xs h-10 md:h-8 rounded-xl text-sm md:text-base">
        <input
          type="text"
          className=" placeholder-base-content grow placeholder:text-sm md:placeholder:text-base"
          placeholder="Search for city...."
          onKeyDown={searchLocation}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {city && (
          <button className="hover:text-red-400 text-base-content" onClick={deleteSearch}>
            <X size={16} />
          </button>
        )}
      </label>
    </div>
  );
}
