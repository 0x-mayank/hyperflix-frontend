import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa"; 

export default function HeroSection({
  item,
  type = "movie",
}) {
  const navigate = useNavigate();

  if (!item) return null;

  const backdrop = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : "";

  const title = item.title || item.name || item.original_name;
  const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0] || "";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
  const overview = item.overview?.length > 220 ? item.overview.slice(0, 220) + "..." : item.overview;

  const handlePlay = () => {
    if (type === "movie") {
      navigate(`/watch/movie/${item.id}`);
      return;
    }
    navigate(`/watch/tv/${item.id}/1/1`);
  };

  const handleDetails = () => {
    navigate(`/details/${type}/${item.id}`);
  };

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      <img src={backdrop} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/20 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto h-[90vh] flex items-center px-10">
        <div className="max-w-[650px]">
          <p className="text-red-500 uppercase tracking-[4px] font-bold mb-4">Trending #1</p>
          <h1 className="text-7xl font-black leading-none mb-6">{title}</h1>

          <div className="flex items-center gap-6 text-white/80 mb-6 text-lg">
            <span>⭐ {rating}</span>
            <span>{year}</span>
          </div>

          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-[600px]">{overview}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePlay}
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3 text-white"
            >
              <FaPlay className="text-sm" /> Play
            </button>

            <button
              onClick={handleDetails}
              className="bg-white/10 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 text-white"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}