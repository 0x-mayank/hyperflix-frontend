import api from "./axios";

export const getMovieStream = (id) =>
  api.get(`/stream/movie/${id}`);

export const getTvStream = (
  id,
  season,
  episode
) =>
  api.get(
    `/stream/tv/${id}/${season}/${episode}`
  );