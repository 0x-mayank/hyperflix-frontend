import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isSearchActive) {
      inputRef.current?.focus();
    }
  }, [isSearchActive]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchActive(false);
        setQuery("");
      }
    };

    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchActive(false);
      setQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-[#060608]/95 via-[#060608]/60 to-transparent backdrop-blur-md">
      <div 
        className="w-full mx-auto px-12 md:px-24 h-20 flex items-center justify-between relative"
        style={{ maxWidth: '1440px' }}
      >
        <div className={`flex items-center gap-20 transition-all duration-500 ${isSearchActive ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-[#ff0000] select-none"
          >
            View<span className="text-white font-light italic">Gasm</span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            <Link to="/movies" className={`text-sm tracking-wide ${isActive("/movies") ? "text-white" : "text-white/60 hover:text-white"}`}>Movies</Link>
            <Link to="/tv-shows" className={`text-sm tracking-wide ${isActive("/tv-shows") ? "text-white" : "text-white/60 hover:text-white"}`}>TV Shows</Link>
            <Link to="/anime" className={`text-sm tracking-wide ${isActive("/anime") ? "text-white" : "text-white/60 hover:text-white"}`}>Anime</Link>
          </div>
        </div>

        <div 
          ref={searchContainerRef}
          className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out flex items-center justify-end"
          style={{ width: isSearchActive ? "calc(100% - 12rem)" : "3rem", maxWidth: isSearchActive ? "600px" : "3rem" }}
        >
          <div 
            onClick={() => !isSearchActive && setIsSearchActive(true)}
            className={`relative w-full flex items-center h-12 bg-white/5 border border-white/10 rounded-full shadow-2xl transition-all duration-300 ${isSearchActive ? 'px-5 cursor-text justify-start' : 'cursor-pointer justify-center hover:bg-white/10'}`}
          >
            <FaSearch 
              className={`text-white/80 shrink-0 transition-all duration-200 ${
                isSearchActive ? 'text-white/40 mr-4 text-base' : 'text-lg'
              }`} 
            />
            
            {isSearchActive && (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search titles..."
                  className="bg-transparent outline-none text-white w-full text-base placeholder:text-white/20 font-mono"
                />
                
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsSearchActive(false); setQuery(""); }} 
                  className="ml-4 text-white/40 hover:text-white transition-colors shrink-0 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}