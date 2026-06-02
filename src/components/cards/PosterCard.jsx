import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

export default function PosterCard({
  item,
  type,
}) {
  const navigate = useNavigate();

  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://placehold.co/500x750";

  const title = item.title || item.name || item.original_name || "Unknown Title";
  const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0] || "N/A";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

  const detailsType = type === "anime" ? "anime" : type === "tv" ? "tv" : "movie";

  const handlePlay = (e) => {
    e.stopPropagation();
    if (type === "movie") {
      navigate(`/watch/movie/${item.id}`);
      return;
    }
    navigate(`/watch/tv/${item.id}/1/1`);
  };

  const handleDetails = (e) => {
    e.stopPropagation();
    navigate(`/details/${detailsType}/${item.id}`);
  };

  return (
    <div
      onClick={handleDetails}
      className="group relative w-43.75 shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20"
    >
      <div className="w-43.75 h-65.5 rounded-xl overflow-hidden shadow-lg border border-white/5">
        <img src={poster} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="absolute inset-0 rounded-xl bg-linear-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-xs font-bold line-clamp-2 mb-1 text-white">{title}</h3>

        <div className="flex items-center gap-2 text-[10px] text-white/70 mb-3">
          <span>⭐ {rating}</span>
          <span>{year}</span>
        </div>

        <div className="flex items-center gap-1.5 w-full">
          <button
            onClick={handlePlay}
            className="flex-1 bg-red-600 hover:bg-red-700 py-1.5 rounded-md text-[11px] font-bold text-white transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <FaPlay className="text-[9px]" /> Play
          </button>

          <button
            onClick={handleDetails}
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 py-1.5 rounded-md text-[11px] font-bold text-white transition-all duration-300"
          >
            Info
          </button>
        </div>
      </div>
    </div>
  );
}