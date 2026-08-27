import api from "./axios";

export const getTrendingTv = () =>
  api.get("/tv/trending");

export const getPopularTv = () =>
  api.get("/tv/popular");

export const getTvDetails = (id) =>
  api.get(`/tv/${id}`);

export const getSeasonDetails = (id, season) =>
  api.get(`/tv/${id}/season/${season}`);

// Anime details with corrected IMDb/OMDb season structure
export const getAnimeDetails = (id) =>
  api.get(`/anime/${id}`);