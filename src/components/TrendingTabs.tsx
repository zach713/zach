import React from 'react';
import { FilterTab, Movie } from '../types';
import { Heart, Play, Clock } from 'lucide-react';

interface TrendingTabsProps {
  activeFilter: FilterTab;
  onSelectFilter: (filter: FilterTab) => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  favorites: string[];
  onToggleFavorite: (movie: Movie) => void;
}

export const TrendingTabs: React.FC<TrendingTabsProps> = ({
  activeFilter,
  onSelectFilter,
  movies,
  onSelectMovie,
  favorites,
  onToggleFavorite,
}) => {
  const tabs: FilterTab[] = ['Trending', 'Movies', 'Series', 'Top Rated', 'Favorites'];

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase font-['Bebas_Neue',sans-serif] leading-tight">
            TRENDING THIS WEEK
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            What everyone is watching right now
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#160b2b] border border-purple-500/20 rounded-full overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                id={`tab-filter-${tab.toLowerCase().replace(' ', '-')}`}
                onClick={() => onSelectFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
                {tab === 'Favorites' && favorites.length > 0 && (
                  <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-white">
                    {favorites.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Movie Cards */}
      {movies.length === 0 ? (
        <div className="py-16 text-center bg-[#160b2b]/50 border border-purple-500/10 rounded-2xl">
          <p className="text-slate-300 text-base font-semibold">No titles found in this category.</p>
          <p className="text-slate-500 text-xs mt-1">
            {activeFilter === 'Favorites'
              ? 'Click the heart icon on any movie card to add it to your favorites.'
              : 'Try selecting another category or clear your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {movies.map((movie) => {
            const isFav = favorites.includes(movie.id);
            return (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => onSelectMovie(movie)}
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#220f40] to-[#0d061a] border border-white/10 group-hover:border-purple-400 group-hover:shadow-xl group-hover:shadow-purple-600/25 transition-all duration-300">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ imageRendering: '-webkit-optimize-contrast' as React.CSSProperties['imageRendering'] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0617] via-[#0c0617]/20 to-transparent opacity-40 group-hover:opacity-75 transition-opacity" />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#0c0617]/85 backdrop-blur-md border border-white/15 flex items-center gap-1 text-[11px] font-bold text-slate-100 shadow">
                    <span className="text-purple-400 text-xs">★</span>
                    <span>{movie.rating}</span>
                  </div>

                  {/* 4K UHD Badge */}
                  {movie.quality === '4K' && (
                    <div className="absolute top-2.5 right-11 px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-[9px] tracking-wider uppercase shadow-md flex items-center gap-0.5">
                      <span>4K UHD</span>
                    </div>
                  )}

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(movie);
                    }}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                      isFav
                        ? 'bg-rose-500/80 border-rose-400 text-white'
                        : 'bg-[#0c0617]/60 border-white/10 text-slate-300 hover:text-white hover:bg-[#0c0617]/90 opacity-0 group-hover:opacity-100'
                    }`}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                  </button>

                  {/* Play Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 px-0.5">
                  <h3
                    title={movie.title}
                    className="text-sm font-bold text-slate-100 truncate group-hover:text-purple-400 transition-colors"
                  >
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-0.5">
                    <span className="flex items-center gap-1.5 truncate">
                      <span>{movie.releaseYear} • {movie.type}</span>
                      {movie.quality === '4K' && (
                        <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">4K</span>
                      )}
                    </span>
                    <span className="text-slate-300 font-mono text-[11px] font-semibold flex-shrink-0">{movie.formattedRuntime || movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-purple-400 font-mono mt-0.5">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{movie.releaseTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
