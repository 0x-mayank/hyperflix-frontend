import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import Navbar from "../components/layout/Navbar";

import {
  getTvDetails,
  getSeasonDetails,
  getAnimeDetails,
} from "../api/tvApi";

import { getTvStream } from "../api/streamApi";

export default function TvStreamPage() {
  const navigate = useNavigate();
  const { id, season, episode } = useParams();

  const seasonNumber = Number(season);
  const episodeNumber = Number(episode);

  const [show, setShow] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");

  const [loadingShow, setLoadingShow] = useState(true);
  const [loadingSeason, setLoadingSeason] = useState(true);
  const [loadingStream, setLoadingStream] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);

  const hasCheckedResume = useRef(false);

  useEffect(() => {
    if (seasonNumber === 0) {
      navigate(`/watch/tv/${id}/1/1`, {
        replace: true,
      });
    }
  }, [id, seasonNumber, navigate]);

  useEffect(() => {
    let cancelled = false;

    const loadShow = async () => {
      setLoadingShow(true);

      try {
        try {
          const animeResponse = await getAnimeDetails(id);
          const animeData = animeResponse?.data;

          const isAnime =
            animeData?.imdb_id &&
            Array.isArray(animeData?.seasons) &&
            animeData.seasons.some(
              (s) => Number(s.season_number) > 0
            );

          if (isAnime) {
            if (!cancelled) {
              setShow({
                ...animeData,
                __isAnime: true,
              });
            }

            return;
          }
        } catch (error) {
          console.log(
            "Anime endpoint failed. Using normal TV.",
            error?.message
          );
        }

        const tvResponse = await getTvDetails(id);

        if (!cancelled) {
          setShow({
            ...tvResponse.data,
            __isAnime: false,
          });
        }
      } catch (error) {
        console.error("Failed to load show:", error);

        if (!cancelled) {
          setShow(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingShow(false);
        }
      }
    };

    loadShow();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!show) return;

    if (
      !Number.isFinite(seasonNumber) ||
      seasonNumber <= 0
    ) {
      return;
    }

    let cancelled = false;

    const loadSeason = async () => {
      setLoadingSeason(true);
      setSeasonData(null);

      try {
        if (
          show.__isAnime &&
          Array.isArray(show.seasons)
        ) {
          const selectedSeason =
            show.seasons.find(
              (s) =>
                Number(s.season_number) ===
                seasonNumber
            );

          if (!selectedSeason) {
            if (!cancelled) {
              navigate(`/watch/tv/${id}/1/1`, {
                replace: true,
              });
            }

            return;
          }

          const rawEpisodes =
            Array.isArray(selectedSeason.episodes)
              ? selectedSeason.episodes
              : [];

          const episodes = rawEpisodes
            .map((ep) => {
              const number = Number(
                ep.Episode ??
                  ep.episode_number
              );

              return {
                ...ep,
                episode_number: number,
                name:
                  ep.Title ??
                  ep.name ??
                  `Episode ${number}`,
              };
            })
            .filter(
              (ep) =>
                Number.isFinite(
                  ep.episode_number
                ) &&
                ep.episode_number > 0
            )
            .sort(
              (a, b) =>
                a.episode_number -
                b.episode_number
            );

          if (!cancelled) {
            setSeasonData({
              ...selectedSeason,
              season_number: seasonNumber,
              episodes,
            });
          }

          return;
        }

        const response =
          await getSeasonDetails(
            id,
            seasonNumber
          );

        if (!cancelled) {
          setSeasonData(response.data);
        }
      } catch (error) {
        console.error(
          "Failed to load season:",
          error
        );

        if (!cancelled) {
          setSeasonData(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingSeason(false);
        }
      }
    };

    loadSeason();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    seasonNumber,
    show,
    navigate,
  ]);

  useEffect(() => {
    if (!show) return;

    if (
      !Number.isFinite(seasonNumber) ||
      seasonNumber <= 0
    ) {
      return;
    }

    if (
      !Number.isFinite(episodeNumber) ||
      episodeNumber <= 0
    ) {
      return;
    }

    if (!seasonData?.episodes?.length) {
      return;
    }

    const episodeExists =
      seasonData.episodes.some(
        (ep) =>
          Number(ep.episode_number) ===
          episodeNumber
      );

    if (!episodeExists) {
      return;
    }

    let cancelled = false;

    const loadStream = async () => {
      setLoadingStream(true);
      setStreamUrl("");

      try {
        const playerId =
          show.__isAnime &&
          show.imdb_id
            ? show.imdb_id
            : id;

        const response =
          await getTvStream(
            playerId,
            seasonNumber,
            episodeNumber
          );

        const url =
          response?.data?.streamUrl;

        if (!url) {
          throw new Error(
            "No stream URL returned"
          );
        }

        if (!cancelled) {
          setStreamUrl(url);
        }
      } catch (error) {
        console.error(
          "Failed to load stream:",
          error
        );

        if (!cancelled) {
          setStreamUrl("");
        }
      } finally {
        if (!cancelled) {
          setLoadingStream(false);
        }
      }
    };

    loadStream();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    seasonNumber,
    episodeNumber,
    show,
    seasonData,
  ]);

  useEffect(() => {
    if (!id) return;

    if (hasCheckedResume.current) {
      return;
    }

    hasCheckedResume.current = true;

    if (
      seasonNumber !== 1 ||
      episodeNumber !== 1
    ) {
      setIsPlaying(true);
      return;
    }

    const saved = localStorage.getItem(
      `hyperflix-progress-${id}`
    );

    if (!saved) {
      return;
    }

    try {
      const progress =
        JSON.parse(saved);

      const savedSeason =
        Number(progress.season);

      const savedEpisode =
        Number(progress.episode);

      if (
        savedSeason > 0 &&
        savedEpisode > 0 &&
        (
          savedSeason !== 1 ||
          savedEpisode !== 1
        )
      ) {
        navigate(
          `/watch/tv/${id}/${savedSeason}/${savedEpisode}`,
          {
            replace: true,
          }
        );

        setIsPlaying(true);
      }
    } catch (error) {
      console.error(
        "Failed to restore progress:",
        error
      );
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    localStorage.setItem(
      `hyperflix-progress-${id}`,
      JSON.stringify({
        season: String(seasonNumber),
        episode: String(episodeNumber),
        savedAt: Date.now(),
      })
    );
  }, [
    id,
    seasonNumber,
    episodeNumber,
    isPlaying,
  ]);

  const title =
    show?.title ||
    show?.name ||
    show?.original_name ||
    "Unknown Show";

  const seasons = useMemo(() => {
    if (!Array.isArray(show?.seasons)) {
      return [];
    }

    return [...show.seasons]
      .filter(
        (s) =>
          Number(s.season_number) > 0
      )
      .sort(
        (a, b) =>
          Number(a.season_number) -
          Number(b.season_number)
      );
  }, [show]);

  const episodes =
    seasonData?.episodes || [];

  const currentEpisode =
    episodes.find(
      (ep) =>
        Number(
          ep.episode_number
        ) === episodeNumber
    );

  const selectedSeason = seasons.find(
    (s) =>
      Number(s.season_number) ===
      seasonNumber
  );

  if (loadingShow) {
    return <PageLoader />;
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center text-white/40 font-mono">
        Unable to load show.
      </div>
    );
  }

  const SeasonSelector = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setSeasonMenuOpen(
            (open) => !open
          )
        }
        className="w-full flex items-center justify-between gap-3 bg-[#111113] border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white transition-all duration-200"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-left min-w-0">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/30 font-bold">
              Season
            </p>

            <p className="text-sm font-bold text-white truncate">
              {selectedSeason
                ? `Season ${seasonNumber}`
                : `Season ${seasonNumber}`}
            </p>
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-white/40 transition-transform duration-200 ${
            seasonMenuOpen
              ? "rotate-180"
              : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {seasonMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() =>
              setSeasonMenuOpen(false)
            }
          />

          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#111113] border border-white/10 rounded-xl p-2 shadow-2xl shadow-black/50 max-h-64 overflow-y-auto scrollbar-hide">
            {seasons.map((s) => {
              const value =
                Number(
                  s.season_number
                );

              const active =
                value ===
                seasonNumber;

              return (
                <button
                  key={
                    s.id ||
                    s.season_number
                  }
                  type="button"
                  onClick={() => {
                    setSeasonMenuOpen(
                      false
                    );

                    navigate(
                      `/watch/tv/${id}/${value}/1`
                    );
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                    active
                      ? "bg-[#ff0000] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>
                    Season {value}
                  </span>

                  {active && (
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060608] overflow-hidden w-full">
      <Navbar />

      <div className="h-28" />

      <main
        className="w-full mx-auto px-6 md:px-12 lg:px-24 h-[calc(100vh-7rem)] flex flex-col justify-center pb-8"
        style={{
          maxWidth: "1440px",
        }}
      >
        {!isPlaying ? (
          <div className="w-full max-w-[900px] mx-auto flex flex-col h-full justify-center animate-fadeIn">
            <div className="flex items-center justify-between gap-4 mb-8 border-b border-white/5 pb-4">
              <h1 className="text-white text-3xl font-black tracking-tight truncate">
                {title}
              </h1>

              <div className="w-[190px] shrink-0">
                <SeasonSelector />
              </div>
            </div>

            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              Select Episode
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 overflow-y-auto pr-2 max-h-[55vh] scrollbar-hide">
              {loadingSeason ? (
                <div className="col-span-full text-center py-12 text-white/30 font-mono text-sm">
                  Loading episodes...
                </div>
              ) : episodes.length > 0 ? (
                episodes.map((ep) => (
                  <button
                    key={
                      ep.episode_number
                    }
                    onClick={() => {
                      navigate(
                        `/watch/tv/${id}/${seasonNumber}/${ep.episode_number}`
                      );

                      setIsPlaying(true);
                    }}
                    className="aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-white font-mono font-bold hover:bg-[#ff0000] hover:border-[#ff0000] transition-all duration-200 active:scale-95"
                  >
                    <span className="text-lg">
                      {
                        ep.episode_number
                      }
                    </span>
                  </button>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-white/30 font-mono text-sm">
                  No episodes found.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex gap-6 lg:gap-8 items-stretch animate-fadeIn">
            <aside className="w-[220px] lg:w-[260px] shrink-0 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-xl p-4 lg:p-5 flex flex-col gap-5">
              <SeasonSelector />

              <div className="flex flex-col flex-1 min-h-0">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-3">
                  Episodes
                </p>

                <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1">
                  {loadingSeason ? (
                    <div className="col-span-4 text-center py-8 text-white/30 text-xs">
                      Loading...
                    </div>
                  ) : episodes.length > 0 ? (
                    episodes.map((ep) => (
                      <button
                        key={
                          ep.episode_number
                        }
                        onClick={() => {
                          setStreamUrl("");

                          navigate(
                            `/watch/tv/${id}/${seasonNumber}/${ep.episode_number}`
                          );

                          setIsPlaying(
                            true
                          );
                        }}
                        className={`
                          aspect-square
                          rounded-md
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-mono
                          font-bold
                          transition-all
                          ${
                            episodeNumber ===
                            Number(
                              ep.episode_number
                            )
                              ? "bg-[#ff0000] text-white"
                              : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                          }
                        `}
                      >
                        {
                          ep.episode_number
                        }
                      </button>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-white/30 text-xs">
                      No episodes
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() =>
                  setIsPlaying(false)
                }
                className="w-full py-2 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-xs font-bold transition-all tracking-wide uppercase"
              >
                Back to Grid
              </button>
            </aside>

            <section className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-baseline gap-4 mb-4 select-none">
                <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-black tracking-tight truncate max-w-[70%]">
                  {title}
                </h1>

                <span className="text-white/40 text-sm md:text-base font-semibold font-mono shrink-0 truncate">
                  S{seasonNumber} • E
                  {episodeNumber}

                  {currentEpisode?.name
                    ? ` (${currentEpisode.name})`
                    : ""}
                </span>
              </div>

              <div className="w-full flex-1 min-h-0 bg-black rounded-xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative">
                {streamUrl ? (
                  <iframe
                    key={streamUrl}
                    src={streamUrl}
                    title={`${title} S${seasonNumber} E${episodeNumber}`}
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="absolute inset-0 w-full h-full"
                  />
                ) : loadingStream ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 font-mono text-sm">
                    Loading player...
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30 font-mono text-sm">
                    Unable to load player.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}