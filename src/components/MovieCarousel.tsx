import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Play, Clock } from 'lucide-react';
import { Movie } from '../types';

interface MovieCarouselProps {
  title: string;
  subtitle: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  favorites: string[];
  onToggleFavorite: (movie: Movie) => void;
  showRankNumber?: boolean;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  subtitle,
  movies,
  onSelectMovie,
  favorites,
  onToggleFavorite,
  showRankNumber = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase font-['Bebas_Neue',sans-serif] leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">{subtitle}</p>
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#160b2b] hover:bg-[#27134d] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous titles"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#160b2b] hover:bg-[#27134d] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next titles"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
      >
        {movies.map((movie, index) => {
          const isFav = favorites.includes(movie.id);
          return (
            <div
              key={movie.id}
              className="flex-shrink-0 w-36 sm:w-44 md:w-52 group cursor-pointer"
              onClick={() => onSelectMovie(movie)}
            >
              {/* Poster Card Container */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#220f40] to-[#0d061a] border border-white/10 group-hover:border-purple-400 group-hover:shadow-2xl group-hover:shadow-purple-600/25 transition-all duration-300">
                {/* Poster Image */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ imageRendering: '-webkit-optimize-contrast' as React.CSSProperties['imageRendering'] }}
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0617] via-[#0c0617]/20 to-transparent opacity-40 group-hover:opacity-75 transition-opacity" />

                {/* Rating Badge (Top Left) */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#0c0617]/80 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-slate-100 shadow">
                  <span className="text-purple-400 text-xs">★</span>
                  <span>{movie.rating}</span>
                </div>

                {/* 4K UHD Badge */}
                {movie.quality === '4K' && (
                  <div className="absolute top-2.5 right-11 px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-[9px] tracking-wider uppercase shadow-md flex items-center">
                    <span>4K</span>
                  </div>
                )}

                {/* Favorite Heart Button (Top Right) */}
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

                {/* Play Button Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Optional Rank Number for Top 10 */}
                {showRankNumber && (
                  <div className="absolute -bottom-3 -left-2 text-6xl sm:text-7xl font-black text-purple-400/90 font-['Bebas_Neue',sans-serif] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none select-none">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Title & Metadata below card */}
              <div className="mt-2.5 px-0.5">
                <h3
                  title={movie.title}
                  className="text-sm sm:text-base font-bold text-slate-100 truncate group-hover:text-purple-400 transition-colors"
                >
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-0.5">
                  <span>{movie.releaseYear} • {movie.type}</span>
                  <span className="text-slate-300 font-mono text-[11px] font-semibold">{movie.formattedRuntime || movie.duration}</span>
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
    </section>
  );
};
