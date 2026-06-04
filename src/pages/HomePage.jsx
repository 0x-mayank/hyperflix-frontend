import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import HomeHeroSection from "../components/hero/HomeHeroSection";
import ContentRow from "../components/rows/ContentRow";
import { getHomeData } from "../api/homeApi";

export default function HomePage() {
  const [homeData, setHomeData] = useState({
    trendingMovies: [],
    popularMovies: [],
    trendingTV: [],
    popularTV: [],
    trendingAnime: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("hyperflix-home");
    if (cached) {
      setHomeData(JSON.parse(cached));
      setLoading(false);
      return;
    }
    const loadHomeData = async () => {
      try {
        const data = await getHomeData();
        setHomeData(data);
        sessionStorage.setItem("hyperflix-home", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608]">
        <Navbar />
        <div className="fixed top-0 left-0 w-full z-[100]">
          <div className="h-[2px] bg-red-600 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#060608] w-full overflow-x-hidden">
      
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Navbar />
      </div>

      <main className="relative z-10">
        <HomeHeroSection posters={homeData.trendingMovies?.slice(0, 9)} />
        <div 
          className="w-full mx-auto space-y-16 pb-24 relative z-20 px-12 md:px-24"
          style={{ maxWidth: '1440px' }}
        >
          <ContentRow title="Trending Movies" items={homeData.trendingMovies} type="movie" />
          <ContentRow title="Popular Movies" items={homeData.popularMovies} type="movie" />
          <ContentRow title="Trending TV Shows" items={homeData.trendingTV} type="tv" />
          <ContentRow title="Popular TV Shows" items={homeData.popularTV} type="tv" />
          <ContentRow title="Trending Anime" items={homeData.trendingAnime} type="anime" />
        </div>
      </main>
    </div>
  );
}