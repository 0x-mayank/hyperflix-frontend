import api from "./axios";

export const getMovieStream = (id) =>
  api.get(`/stream/movie/${id}`);

export const getTvStream = (id, season, episode) =>
  api.get(`/stream/tv/${id}/${season}/${episode}`);

export const getAnimeStream = (id, episode, anilistId) =>
  api.get(`/anime/${id}/stream`, { params: { episode, anilistId } });