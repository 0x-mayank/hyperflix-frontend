import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import ContentRow from "../components/rows/ContentRow";

import {
  getTrendingTv,
  getPopularTv,
} from "../api/tvApi";

export default function TvShowsPage() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const cached =
      sessionStorage.getItem(
        "hyperflix-tv"
      );

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [
          trending,
          popular,
        ] = await Promise.all([
          getTrendingTv(),
          getPopularTv(),
        ]);

        const pageData = {
          trending:
            trending.data.results ||
            trending.data,

          popular:
            popular.data.results ||
            popular.data,
        };

        setData(pageData);

        sessionStorage.setItem(
          "hyperflix-tv",
          JSON.stringify(pageData)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="fixed top-20 left-0 w-full z-50">
          <div className="h-[3px] bg-red-600 animate-pulse" />
        </div>

        <div className="min-h-screen bg-[#0B0B0B]" />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <HeroSection
        item={data.trending?.[0]}
        type="tv"
      />

      <div
        className="
        max-w-350
        mx-auto
        py-10
        space-y-14
        "
      >
        <ContentRow
          title="Trending TV Shows"
          items={data.trending}
          type="tv"
        />

        <ContentRow
          title="Popular TV Shows"
          items={data.popular}
          type="tv"
        />
      </div>
    </>
  );
}