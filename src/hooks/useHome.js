import { useEffect, useState } from "react";

import { getHomeData } from "../api/homeApi";

export default function useHome() {
  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response =
          await getHomeData();

        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return {
    data,
    loading,
    error,
  };
}