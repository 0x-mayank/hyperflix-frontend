import api from "./axios";

export const searchContent = (
  query
) =>
  api.get(`/search?q=${query}`);