import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import ContentRow from "../components/rows/ContentRow";
import { getTrendingMovies, getPopularMovies } from "../api/movieApi";

export default function MoviesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("hyperflix-movies");

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [trending, popular] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
        ]);

        const pageData = {
          trending: trending.data.results || trending.data,
          popular: popular.data.results || popular.data,
        };

        setData(pageData);
        sessionStorage.setItem("hyperflix-movies", JSON.stringify(pageData));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-[2px] bg-[#ff0000] animate-pulse" />
        </div>
        <div className="min-h-screen bg-[#060608]" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#060608] pb-24 w-full contain-inline-size overflow-x-hidden">
      <Navbar />

      <HeroSection item={data.trending?.[0]} type="movie" />

      <div 
        className="w-full mx-auto space-y-16 mt-12 relative z-10"
        style={{ maxWidth: '1400px' }}
      >
        <div className="px-12 md:px-24 lg:px-0">
          <ContentRow
            title="Trending Movies"
            items={data.trending}
            type="movie"
          />
        </div>

        <div className="px-12 md:px-24 lg:px-0">
          <ContentRow
            title="Popular Movies"
            items={data.popular}
            type="movie"
          />
        </div>
      </div>
    </div>
  );
}