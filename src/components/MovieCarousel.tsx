import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#081831] hover:bg-[#122a50] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous titles"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#081831] hover:bg-[#122a50] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
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
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#0a1b36] border border-white/10 group-hover:border-[#f6c700]/60 group-hover:shadow-xl group-hover:shadow-amber-500/10 transition-all duration-300">
                {/* Poster Image */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030d1d] via-transparent to-transparent opacity-40 group-hover:opacity-75 transition-opacity" />

                {/* Rating Badge (Top Left) */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#030d1d]/80 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-slate-100 shadow">
                  <span className="text-[#f6c700] text-xs">★</span>
                  <span>{movie.rating}</span>
                </div>

                {/* Favorite Heart Button (Top Right) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(movie);
                  }}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    isFav
                      ? 'bg-rose-500/80 border-rose-400 text-white'
                      : 'bg-[#030d1d]/60 border-white/10 text-slate-300 hover:text-white hover:bg-[#030d1d]/90 opacity-0 group-hover:opacity-100'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                </button>

                {/* Play Button Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#f6c700] text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  </div>
                </div>

                {/* Optional Rank Number for Top 10 */}
                {showRankNumber && (
                  <div className="absolute -bottom-3 -left-2 text-6xl sm:text-7xl font-black text-[#f6c700]/90 font-['Bebas_Neue',sans-serif] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none select-none">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Title & Metadata below card */}
              <div className="mt-2.5 px-0.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate group-hover:text-[#f6c700] transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {movie.releaseYear} • {movie.type}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
