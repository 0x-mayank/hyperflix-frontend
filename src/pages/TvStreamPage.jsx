import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import Navbar from "../components/layout/Navbar";
import { getTvDetails, getSeasonDetails } from "../api/tvApi";
import { getTvStream, getAnimeStream } from "../api/streamApi";

export default function TvStreamPage() {
  const navigate = useNavigate();
  const { id, season, episode } = useParams();

  const [show, setShow] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnime, setIsAnime] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`hyperflix-progress-${id}`);
    if (!saved) return;

    const progress = JSON.parse(saved);
    if (
      season === "1" &&
      episode === "1" &&
      (progress.season !== "1" || progress.episode !== "1")
    ) {
      navigate(`/watch/tv/${id}/${progress.season}/${progress.episode}`, {
        replace: true,
      });
      setIsPlaying(true);
    } else if (season !== "1" || episode !== "1") {
      setIsPlaying(true);
    }
  }, [id]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      localStorage.setItem(
        `hyperflix-progress-${id}`,
        JSON.stringify({ season, episode, savedAt: Date.now() })
      );
    }, 30000);

    return () => clearTimeout(timer);
  }, [id, season, episode, isPlaying]);

  useEffect(() => {
    const loadShow = async () => {
      try {
        const response = await getTvDetails(id);
        const data = response.data;
        setShow(data);

        // detect anime: Japanese language + Animation genre (id 16)
        const genreIds = data.genres?.map((g) => g.id) || [];
        if (data.original_language === "ja" && genreIds.includes(16)) {
          setIsAnime(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadShow();
  }, [id]);

  useEffect(() => {
    const loadSeason = async () => {
      try {
        const response = await getSeasonDetails(id, season);
        setSeasonData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadSeason();
  }, [id, season]);

  useEffect(() => {
    // wait until isAnime is resolved (show has loaded)
    if (!show) return;

    const loadStream = async () => {
      try {
        setLoading(true);
        let response;

        if (isAnime) {
          response = await getAnimeStream(id, season, episode);
        } else {
          response = await getTvStream(id, season, episode);
        }

        setStreamUrl(response.data.streamUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStream();
  }, [id, season, episode, show, isAnime]);

  if (loading && !streamUrl) {
    return <PageLoader />;
  }

  const title = show?.name || show?.original_name || "Unknown Show";
  const currentEpisode = seasonData?.episodes?.find(
    (ep) => ep.episode_number === Number(episode)
  );

  return (
    <div className="min-h-screen bg-[#060608] overflow-hidden w-full">
      <Navbar />
      <div className="h-28" />

      <main
        className="w-full mx-auto px-12 md:px-24 h-[calc(100vh-7rem)] flex flex-col justify-center pb-8"
        style={{ maxWidth: "1440px" }}
      >
        {!isPlaying ? (
          <div className="w-full max-w-[800px] mx-auto flex flex-col h-full justify-center animate-fadeIn">
            <div className="flex items-baseline justify-between mb-8 border-b border-white/5 pb-4">
              <h1 className="text-white text-3xl font-black tracking-tight">
                {title}
              </h1>

              <select
                value={season}
                onChange={(e) =>
                  navigate(`/watch/tv/${id}/${e.target.value}/1`)
                }
                className="bg-[#111113] border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm outline-none cursor-pointer hover:bg-[#161619] transition-colors"
              >
                {show?.seasons
                  ?.filter((s) => s.season_number > 0)
                  .map((s) => (
                    <option key={s.id} value={s.season_number}>
                      Season {s.season_number}
                    </option>
                  ))}
              </select>
            </div>

            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              Select Episode
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 overflow-y-auto pr-2 max-h-[50vh] scrollbar-hide">
              {seasonData?.episodes?.map((ep) => (
                <button
                  key={ep.episode_number}
                  onClick={() => {
                    navigate(
                      `/watch/tv/${id}/${season}/${ep.episode_number}`
                    );
                    setIsPlaying(true);
                  }}
                  className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-white font-mono font-bold hover:bg-[#ff0000] hover:border-[#ff0000] transition-all duration-200 active:scale-95"
                >
                  <span className="text-lg">{ep.episode_number}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex gap-8 items-stretch animate-fadeIn">
            <div className="w-[260px] shrink-0 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-xl p-5 flex flex-col justify-start gap-6">
              <div className="w-full">
                <select
                  value={season}
                  onChange={(e) =>
                    navigate(`/watch/tv/${id}/${e.target.value}/1`)
                  }
                  className="w-full bg-[#111113] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs outline-none cursor-pointer"
                >
                  {show?.seasons
                    ?.filter((s) => s.season_number > 0)
                    .map((s) => (
                      <option key={s.id} value={s.season_number}>
                        Season {s.season_number}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Episodes
                </p>
                <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 scrollbar-hide max-h-[calc(100vh-26rem)]">
                  {seasonData?.episodes?.map((ep) => (
                    <button
                      key={ep.episode_number}
                      onClick={() =>
                        navigate(
                          `/watch/tv/${id}/${season}/${ep.episode_number}`
                        )
                      }
                      className={`aspect-square rounded-md flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        Number(episode) === ep.episode_number
                          ? "bg-[#ff0000] text-white"
                          : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {ep.episode_number}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsPlaying(false)}
                className="w-full py-2 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-xs font-bold transition-all tracking-wide uppercase mt-auto"
              >
                Back to Grid
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-baseline gap-4 mb-4 select-none">
                <h1 className="text-white text-2xl md:text-3xl font-black tracking-tight truncate max-w-[70%]">
                  {title}
                </h1>
                <span className="text-white/40 text-sm md:text-base font-semibold font-mono shrink-0">
                  S{season} • E{episode}{" "}
                  {currentEpisode?.name && `(${currentEpisode.name})`}
                </span>
              </div>

              <div className="w-full flex-1 max-h-[calc(100%-3rem)] bg-black rounded-xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative">
                <iframe
                  src={streamUrl}
                  title={title}
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  referrerPolicy="origin"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}