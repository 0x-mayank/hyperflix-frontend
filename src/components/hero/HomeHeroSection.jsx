import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBan,
  FaGlobe,
  FaLanguage,
  FaBolt,
} from "react-icons/fa";
export default function HomeHeroSection({ posters = [] }) {
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState("");
  const gridRef = useRef(null);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroQuery)}`);
    }
  };

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridRef.current.style.setProperty("--mx", `${x}px`);
    gridRef.current.style.setProperty("--my", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!gridRef.current) return;
    gridRef.current.style.setProperty("--mx", `50%`);
    gridRef.current.style.setProperty("--my", `50%`);
  };

  const rotations = [-6, 4, -2, 5, -4, 3, -5, 4, -3];
  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[90vh] pt-40 pb-24 overflow-hidden"
    >
      <div ref={gridRef} className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,38,38,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,38,38,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Mouse-follow glow layer on top of the grid — brighter grid lines revealed near the cursor */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,38,38,0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,38,38,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 80%)`,
          }}
        />
        <div className="absolute right-[-250px] top-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-red-600/10 blur-[180px]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 70%, #060608 100%)",
          }}
        />
      </div>
      <div className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center min-h-[75vh]">
          <div className="text-left">
            <h1 className="leading-[0.9] mb-6">
              <span className="text-red-600 text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
                View
              </span>
              <span className="italic text-white font-thin text-6xl md:text-7xl lg:text-8xl tracking-tight">
                Gasm
              </span>
            </h1>
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Find Your Next
              <br />
              Obsession.
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
              Discover trending movies, binge-worthy TV shows and
              unforgettable anime all in one place.
            </p>
            <form
              onSubmit={handleHeroSearch}
              className="w-full max-w-2xl flex items-center bg-white/5 backdrop-blur-md backdrop-saturate-150 border border-white/10 rounded-2xl h-16 pl-6 pr-2 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(200,30,58,0.1)] focus-within:border-red-600/50 focus-within:bg-white/10 transition-all duration-500 mb-10"
            >
              <FaSearch className="text-white/40 text-xl mr-4 shrink-0" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Movie? TV Show? Anime?"
                className="bg-transparent outline-none text-white w-full text-lg placeholder:text-white/30"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0"
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 pt-8 border-t border-white/5 w-full">
              <span className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]"><FaBan className="text-red-600/50" /> No Ads</span>
              <span className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]"><FaGlobe className="text-red-600/50" /> 4K Content</span>
              <span className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]"><FaLanguage className="text-red-600/50" /> Multi Audio</span>
              <span className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]"><FaBolt className="text-red-600/50" /> Fast Load</span>
            </div>
          </div>
          <div className="hidden lg:flex justify-center relative -mt-18">
            <div className="grid grid-cols-3 gap-5">
              {posters.map((movie, index) => (
                <div
                  key={movie.id}
                  className="poster-float overflow-hidden rounded-3xl border border-red-500/20 shadow-[0_0_60px_rgba(220,38,38,0.15)] hover:scale-105 transition-all duration-500"
                  style={{
                    transform: `rotate(${rotations[index] || 0}deg)`,
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-[170px] h-[245px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}