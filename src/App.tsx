import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MovieCarousel } from './components/MovieCarousel';
import { BrowseByGenre } from './components/BrowseByGenre';
import { TrendingTabs } from './components/TrendingTabs';
import { WatchPage } from './components/WatchPage';
import { Footer } from './components/Footer';
import { MOVIES_DATA } from './data/movies';
import { Movie, NavTab, FilterTab, Genre } from './types';
import { Heart, Film, Tv, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('Trending');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('Trending');

  // Currently focused / watching movie
  const [heroMovie, setHeroMovie] = useState<Movie>(MOVIES_DATA[0]);
  const [watchingMovie, setWatchingMovie] = useState<Movie | null>(null);

  // Favorites state persisted to local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fypflix_favorites');
      return saved ? JSON.parse(saved) : ['you-can-see-everything', 'the-runner', 'reacher'];
    } catch {
      return ['you-can-see-everything', 'the-runner', 'reacher'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fypflix_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore storage errors
    }
  }, [favorites]);

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) =>
      prev.includes(movie.id) ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
    );
  };

  // Up next list for hero banner (first 6 featured items)
  const upNextMovies = useMemo(() => {
    return MOVIES_DATA.slice(0, 6);
  }, []);

  // Sections matching screenshots
  const top10ThisWeek = useMemo(() => {
    return [
      MOVIES_DATA.find((m) => m.id === 'the-last') || MOVIES_DATA[16],
      MOVIES_DATA.find((m) => m.id === 'playtime-with-buddy') || MOVIES_DATA[17],
      MOVIES_DATA.find((m) => m.id === 'love-island-usa') || MOVIES_DATA[18],
      MOVIES_DATA.find((m) => m.id === 'the-runner') || MOVIES_DATA[3],
      MOVIES_DATA.find((m) => m.id === 'lanterns') || MOVIES_DATA[19],
      MOVIES_DATA.find((m) => m.id === 'moana-2') || MOVIES_DATA[2],
      MOVIES_DATA.find((m) => m.id === 'coyote-vs-acme') || MOVIES_DATA[6],
      MOVIES_DATA.find((m) => m.id === 'the-odyssey') || MOVIES_DATA[5],
      MOVIES_DATA.find((m) => m.id === 'mutiny') || MOVIES_DATA[7],
      MOVIES_DATA.find((m) => m.id === 'shape-of-my-heart') || MOVIES_DATA[8],
    ].filter(Boolean) as Movie[];
  }, []);

  const popularMovies = useMemo(() => {
    return [
      MOVIES_DATA.find((m) => m.id === 'spiderman-brand-new-day')!,
      MOVIES_DATA.find((m) => m.id === 'the-odyssey')!,
      MOVIES_DATA.find((m) => m.id === 'coyote-vs-acme')!,
      MOVIES_DATA.find((m) => m.id === 'mutiny')!,
      MOVIES_DATA.find((m) => m.id === 'the-runner')!,
      MOVIES_DATA.find((m) => m.id === 'shape-of-my-heart')!,
    ].filter(Boolean);
  }, []);

  const bingeWorthySeries = useMemo(() => {
    return [
      MOVIES_DATA.find((m) => m.id === 'reacher')!,
      MOVIES_DATA.find((m) => m.id === 'watch-what-happens-live')!,
      MOVIES_DATA.find((m) => m.id === 'the-mentalist')!,
      MOVIES_DATA.find((m) => m.id === 'lioness')!,
      MOVIES_DATA.find((m) => m.id === 'el-conquistador')!,
      MOVIES_DATA.find((m) => m.id === 'silo')!,
    ].filter(Boolean);
  }, []);

  const newReleases = useMemo(() => {
    return [
      MOVIES_DATA.find((m) => m.id === 'spiderman-brand-new-day')!,
      MOVIES_DATA.find((m) => m.id === 'the-odyssey')!,
      MOVIES_DATA.find((m) => m.id === 'coyote-vs-acme')!,
      MOVIES_DATA.find((m) => m.id === 'mutiny')!,
      MOVIES_DATA.find((m) => m.id === 'the-runner')!,
      MOVIES_DATA.find((m) => m.id === 'colony')!,
    ].filter(Boolean);
  }, []);

  // Filtered titles for the "Trending This Week" section / Tab Filter
  const filteredTabMovies = useMemo(() => {
    let list = [...MOVIES_DATA];

    if (activeFilterTab === 'Movies') {
      list = list.filter((m) => m.type === 'Movie');
    } else if (activeFilterTab === 'Series') {
      list = list.filter((m) => m.type === 'Series');
    } else if (activeFilterTab === 'Top Rated') {
      list = [...list].sort((a, b) => {
        const rA = typeof a.rating === 'number' ? a.rating : 0;
        const rB = typeof b.rating === 'number' ? b.rating : 0;
        return rB - rA;
      });
    } else if (activeFilterTab === 'Favorites') {
      list = list.filter((m) => favorites.includes(m.id));
    }

    if (selectedGenre) {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }

    return list;
  }, [activeFilterTab, selectedGenre, favorites]);

  // Global search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return MOVIES_DATA.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Dedicated Nav view filter
  const isNavSpecific = activeNavTab !== 'Trending';
  const navFilteredMovies = useMemo(() => {
    if (activeNavTab === 'Movies') {
      return MOVIES_DATA.filter((m) => m.type === 'Movie');
    }
    if (activeNavTab === 'TV Series') {
      return MOVIES_DATA.filter((m) => m.type === 'Series');
    }
    if (activeNavTab === 'Favorites') {
      return MOVIES_DATA.filter((m) => favorites.includes(m.id));
    }
    return MOVIES_DATA;
  }, [activeNavTab, favorites]);

  // If user is currently in watch page mode (Screenshot 8 & 9)
  if (watchingMovie) {
    return (
      <WatchPage
        movie={watchingMovie}
        allMovies={MOVIES_DATA}
        onBack={() => setWatchingMovie(null)}
        onSelectMovie={(movie) => setWatchingMovie(movie)}
        isFavorite={favorites.includes(watchingMovie.id)}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030d1d] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Top Navbar */}
      <Header
        activeTab={activeNavTab}
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'Favorites') {
            setActiveFilterTab('Favorites');
          }
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenHome={() => {
          setActiveNavTab('Trending');
          setSearchQuery('');
          setSelectedGenre(null);
          setWatchingMovie(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* If Search is Active, display Search Results */}
      {searchResults !== null ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide uppercase font-['Bebas_Neue',sans-serif]">
                SEARCH RESULTS FOR &ldquo;{searchQuery}&rdquo;
              </h1>
              <p className="text-sm text-slate-400">Found {searchResults.length} matching titles</p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear search</span>
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-24 text-center bg-[#081831]/40 border border-white/5 rounded-2xl">
              <Film className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-lg font-bold text-slate-200">No movies or series found</p>
              <p className="text-sm text-slate-400 mt-1">Try searching by genre, title, or keyword</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setWatchingMovie(movie)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0a1b36] border border-white/10 group-hover:border-[#f6c700] transition-all">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#030d1d]/80 border border-white/10 text-[11px] font-bold text-slate-100 flex items-center gap-1">
                      <span className="text-[#f6c700]">★</span>
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-[#f6c700]">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {movie.releaseYear} • {movie.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : isNavSpecific ? (
        /* Dedicated Category Views (Movies, TV Series, Favorites) */
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center gap-3 mb-6">
            {activeNavTab === 'Movies' && <Film className="w-6 h-6 text-[#f6c700]" />}
            {activeNavTab === 'TV Series' && <Tv className="w-6 h-6 text-[#f6c700]" />}
            {activeNavTab === 'Favorites' && <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />}
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide uppercase font-['Bebas_Neue',sans-serif]">
                {activeNavTab.toUpperCase()}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {activeNavTab === 'Favorites'
                  ? 'All your saved titles in one personal collection'
                  : `Browse all available ${activeNavTab.toLowerCase()} in high definition`}
              </p>
            </div>
          </div>

          {navFilteredMovies.length === 0 ? (
            <div className="py-20 text-center bg-[#081831]/50 border border-white/5 rounded-2xl">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-lg font-bold text-slate-200">Your favorites list is empty</p>
              <p className="text-sm text-slate-400 mt-1">
                Click the heart icon on any title to save it for later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {navFilteredMovies.map((movie) => {
                const isFav = favorites.includes(movie.id);
                return (
                  <div
                    key={movie.id}
                    onClick={() => setWatchingMovie(movie)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0a1b36] border border-white/10 group-hover:border-[#f6c700] transition-all">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#030d1d]/80 border border-white/10 text-[11px] font-bold text-slate-100 flex items-center gap-1">
                        <span className="text-[#f6c700]">★</span>
                        <span>{movie.rating}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(movie);
                        }}
                        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border ${
                          isFav
                            ? 'bg-rose-500/80 border-rose-400 text-white'
                            : 'bg-[#030d1d]/60 border-white/10 text-slate-300'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-[#f6c700]">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {movie.releaseYear} • {movie.type}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      ) : (
        /* Full Main Landing Page matching Screenshots 1 to 6 */
        <main className="flex-1 pb-12">
          {/* 1. Hero Banner (Screenshots 1 & 2) */}
          <HeroBanner
            movie={heroMovie}
            upNextMovies={upNextMovies}
            onSelectMovie={(movie) => setHeroMovie(movie)}
            onWatchMovie={(movie) => setWatchingMovie(movie)}
            isFavorite={favorites.includes(heroMovie.id)}
            onToggleFavorite={toggleFavorite}
          />

          {/* 2. TOP 10 THIS WEEK (Screenshot 2) */}
          <MovieCarousel
            title="TOP 10 THIS WEEK"
            subtitle="Ranked by what everyone is streaming"
            movies={top10ThisWeek}
            onSelectMovie={(movie) => setWatchingMovie(movie)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            showRankNumber={true}
          />

          {/* 3. POPULAR MOVIES (Screenshot 3) */}
          <MovieCarousel
            title="POPULAR MOVIES"
            subtitle="Big titles, watching now"
            movies={popularMovies}
            onSelectMovie={(movie) => setWatchingMovie(movie)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />

          {/* 4. BINGE-WORTHY SERIES (Screenshot 4) */}
          <MovieCarousel
            title="BINGE-WORTHY SERIES"
            subtitle="Full seasons, ready to play"
            movies={bingeWorthySeries}
            onSelectMovie={(movie) => setWatchingMovie(movie)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />

          {/* 5. NEW RELEASES (Screenshot 5) */}
          <MovieCarousel
            title="NEW RELEASES"
            subtitle="Fresh in theaters and streaming"
            movies={newReleases}
            onSelectMovie={(movie) => setWatchingMovie(movie)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />

          {/* 6. BROWSE BY GENRE (Screenshot 6) */}
          <BrowseByGenre
            selectedGenre={selectedGenre}
            onSelectGenre={(genre) => setSelectedGenre(genre)}
          />

          {/* 7. TRENDING THIS WEEK Tabs & Grid (Screenshot 6) */}
          <TrendingTabs
            activeFilter={activeFilterTab}
            onSelectFilter={(tab) => setActiveFilterTab(tab)}
            movies={filteredTabMovies}
            onSelectMovie={(movie) => setWatchingMovie(movie)}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </main>
      )}

      {/* Footer (Screenshot 7) */}
      <Footer
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHome={() => {
          setActiveNavTab('Trending');
          setSearchQuery('');
          setSelectedGenre(null);
          setWatchingMovie(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
