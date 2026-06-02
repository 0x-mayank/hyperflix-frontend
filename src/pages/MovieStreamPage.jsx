import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import Navbar from "../components/layout/Navbar";
import { getMovieDetails } from "../api/movieApi";
import { getMovieStream } from "../api/streamApi";

export default function MovieStreamPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movieRes, streamRes] = await Promise.all([
          getMovieDetails(id),
          getMovieStream(id),
        ]);

        setMovie(movieRes.data);
        setStreamUrl(streamRes.data.streamUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  const title = movie?.title || movie?.name || movie?.original_name || "Unknown Title";
  const year = movie?.release_date?.split("-")[0] || movie?.first_air_date?.split("-")[0] || "";

  return (
    <div className="min-h-screen bg-[#060608] overflow-hidden">
      <Navbar />

      <div className="h-28" />

      <main className="w-full mx-auto px-12 md:px-24 h-[calc(100vh-7rem)] flex flex-col justify-center pb-8" style={{ maxWidth: '1440px' }}>
        
        <div className="flex items-baseline gap-4 mb-4 select-none">
          <h1 className="text-white text-2xl md:text-3xl font-black tracking-tight truncate max-w-[80%]">
            {title}
          </h1>
          {year && (
            <span className="text-white/40 text-sm md:text-base font-medium font-mono shrink-0">
              ({year})
            </span>
          )}
        </div>

        <div className="w-full flex-1 max-h-[calc(100%-3rem)] bg-black rounded-xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative">
          <iframe
            src={streamUrl}
            title={title}
            allowFullScreen
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

      </main>
    </div>
  );
}