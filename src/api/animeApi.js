import api from "./axios";

export const getTrendingAnime = () =>
  api.get("/anime/trending");

export const getPopularAnime = () =>
  api.get("/anime/popular");

export const getTopRatedAnime = () =>
  api.get("/anime/top-rated");

export const getAnimeDetails = (id) =>
  api.get(`/anime/${id}`);

export const getAnimeSeasons = (id) =>
  api.get(`/anime/${id}/seasons`);