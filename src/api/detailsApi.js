import api from "./axios";

export const getDetails = async (
  type,
  id
) => {
  switch (type) {
    case "movie":
      return api.get(`/movies/${id}`);

    case "tv":
      return api.get(`/tv/${id}`);

    case "anime":
      return api.get(`/anime/${id}`);

    default:
      throw new Error(
        "Invalid content type"
      );
  }
};