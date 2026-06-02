import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import PosterCard from "../components/cards/PosterCard";
import { searchContent } from "../api/searchApi";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await searchContent(query);
        const rawResults = response.data.results || response.data || [];
        
        const filteredResults = rawResults.filter(item => item.poster_path);
        
        setResults(filteredResults); 
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#060608] pb-24 overflow-x-hidden">
      <Navbar />

      <div 
        className="w-full mx-auto px-12 md:px-24 pt-40 relative z-10"
        style={{ maxWidth: '1440px' }}
      >
        <div className="mb-10">
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Search Results For
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono">
            "{query}"
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#ff0000] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            {results.map((item) => (
              <PosterCard 
                key={item.id} 
                item={item} 
                type={item.media_type || "movie"} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/5 bg-white/[0.01] rounded-2xl backdrop-blur-md">
            <p className="text-white/40 text-lg font-mono">
              No titles matched your search. Try another query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}