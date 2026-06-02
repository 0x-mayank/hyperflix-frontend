import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MoviesPage from "../pages/MoviesPage";
import TvShowsPage from "../pages/TvShowsPage";
import AnimePage from "../pages/AnimePage";
import DetailsPage from "../pages/DetailsPage";
import MovieStreamPage from "../pages/MovieStreamPage";
import TvStreamPage from "../pages/TvStreamPage";
import SearchPage from "../pages/SearchPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/tv-shows" element={<TvShowsPage />} />
      <Route path="/anime" element={<AnimePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/details/:type/:id" element={<DetailsPage />} />
      <Route path="/watch/movie/:id" element={<MovieStreamPage />} />
      <Route path="/watch/tv/:id/:season/:episode" element={<TvStreamPage />} />
    </Routes>
  );
}