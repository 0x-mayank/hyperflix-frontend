import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBan, FaGlobe, FaLanguage, FaBolt } from "react-icons/fa";

export default function HomeHeroSection({ item, type = "movie" }) {
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroQuery)}`);
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] pt-44 pb-32 overflow-hidden select-none flex flex-col items-center justify-center">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
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

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
            opacity: 0.95,
          }}
        />

        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 70%, #060608 100%)"
          }}
        />
      </div>

      <div className="relative z-10 w-full mb-4 mx-auto px-12 md:px-24 flex flex-col items-center text-center" style={{ maxWidth: '1100px' }}>
        
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-8 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
          <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">
            Stream. Watch. Enjoy.
          </span>
        </div>

        <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6">
          <span className="text-red-600 drop-shadow-[0_0_35px_rgba(200,30,58,0.4)]">View</span>
          <span className="italic font-extralight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">Gasm</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl font-medium max-w-175 leading-relaxed mb-10 italic">
          <span className="text-white/80">Unlimited</span> Movies, TV Shows, and Anime. <br/>
          No Subscriptions. No Ads. Just <span className="text-white/80">Pure Entertainment</span>.
        </p>

        <form 
          onSubmit={handleHeroSearch}
          className="w-full max-w-175 flex items-center 
               bg-white/5 backdrop-blur-md backdrop-saturate-150 
               border border-white/10 rounded-2xl h-16 pl-6 pr-2 
               shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(200,30,58,0.1)] 
               focus-within:border-red-600/50 focus-within:bg-white/10 transition-all duration-500 mb-12"
        >
        <FaSearch className="text-white/40 text-xl mr-4 shrink-0" />
        <input
            type="text"
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            placeholder="Movie? Tv Show? Anime?"
            className="bg-transparent outline-none text-white w-full text-lg placeholder:text-white/30 font-medium"
          />
       <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest px-8 h-12 rounded-xl 
                 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0"
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
    </section>
  );
}