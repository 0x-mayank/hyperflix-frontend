import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import Navbar from "../components/layout/Navbar";
import { getDetails } from "../api/detailsApi";
import { FaPlay } from "react-icons/fa";

export default function DetailsPage() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const response = await getDetails(type, id);
        setItem(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [type, id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center text-white/40 font-mono text-lg">
        Not Found
      </div>
    );
  }

  const title = item.title || item.name || item.original_name;
  const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0] || "";
  const rating = item.vote_average?.toFixed(1) || "N/A";
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://placehold.co/500x750";
  const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : "";

  const handlePlay = () => {
    if (type === "movie") {
      navigate(`/watch/movie/${id}`);
      return;
    }
    navigate(`/watch/tv/${id}/1/1`);
  };

  return (
    <div className="min-h-screen bg-[#060608] overflow-hidden w-full">
      <Navbar />

      <section className="relative min-h-screen w-full flex items-center overflow-hidden">
        {backdrop && (
          <div className="absolute right-0 top-0 w-2/3 h-full select-none pointer-events-none z-0">
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent" />
          </div>
        )}

        <div 
          className="relative z-10 w-full mx-auto px-12 md:px-24 pt-36 pb-16 flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-16"
          style={{ maxWidth: '1440px' }}
        >
          <div className="w-[260px] md:w-[280px] shrink-0 rounded-2xl overflow-hidden shadow-[0_12px_50px_rgba(0,0,0,0.8)] border border-white/5 aspect-[2/3]">
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 max-w-[750px] text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white leading-tight">
              {title}
            </h1>

            <div className="flex items-center gap-6 text-sm md:text-base text-white/60 mb-6 font-medium font-mono">
              <span className="flex items-center gap-1.5 text-yellow-500">
                ⭐ <span className="text-white font-bold">{rating}</span>
              </span>
              {year && <span>{year}</span>}
            </div>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-[650px]">
              {item.overview || "No overview available."}
            </p>

            <button
              onClick={handlePlay}
              className="inline-flex items-center justify-center bg-[#ff0000] hover:bg-[#cc0000] text-white text-sm md:text-base font-bold px-8 h-12 md:h-14 rounded-xl transition-all duration-300 active:scale-95 shadow-xl shadow-[#ff0000]/10 hover:scale-105 gap-3"
            >
              <FaPlay className="text-xs" /> Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}