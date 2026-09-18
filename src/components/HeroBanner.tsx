import React, { useState } from 'react';
import { Play, Info, Heart, Volume2, VolumeX, Flame, Clock } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movie: Movie;
  upNextMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchMovie: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  upNextMovies,
  onSelectMovie,
  onWatchMovie,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-end pb-12 overflow-hidden bg-[#030d1d]">
      {/* Cinematic Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 filter brightness-65 contrast-110"
        />
        {/* Subtle Watermark aesthetic like screenshot 1 */}
        <div className="absolute right-12 bottom-12 text-[140px] md:text-[200px] font-black text-white/[0.04] pointer-events-none select-none tracking-tighter font-['Bebas_Neue',sans-serif]">
          A24
        </div>
        {/* Gradients to blend into background and keep text 100% legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030d1d] via-[#030d1d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030d1d] via-[#030d1d]/85 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
        <div className="max-w-2xl">
          {/* #1 Trending Today Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f6c700] text-slate-950 font-black text-xs uppercase tracking-wider rounded-sm mb-4 shadow-md">
            <Flame className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>#1 TRENDING TODAY</span>
          </div>

          {/* Title */}
          <h1
            id="hero-movie-title"
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase font-['Bebas_Neue',sans-serif] leading-[0.95] drop-shadow-md mb-3"
          >
            {movie.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center flex-wrap gap-2.5 text-xs sm:text-sm font-semibold text-slate-300 mb-4">
            <div className="flex items-center gap-1 text-[#f6c700]">
              <span>★</span>
              <span className="font-bold text-white">{movie.rating}</span>
            </div>
            <span className="text-slate-500">•</span>
            <span>{movie.releaseYear}</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-200">{movie.formattedRuntime || movie.duration}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-mono font-medium flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25">
              <Clock className="w-3 h-3" />
              <span>{movie.releaseTime}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span>{movie.genres.join(' / ') || movie.type}</span>
            <span className="px-1.5 py-0.5 rounded border border-[#f6c700] text-[#f6c700] text-[11px] font-bold tracking-wider">
              {movie.quality}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 max-w-xl font-normal">
            {movie.overview}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="hero-watch-now-btn"
              onClick={() => onWatchMovie(movie)}
              className="group px-6 py-3 bg-[#f6c700] hover:bg-[#ffd700] active:scale-95 text-slate-950 font-bold text-sm sm:text-base rounded-md flex items-center gap-2.5 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950 transition-transform group-hover:scale-110" />
              <span>Watch Now</span>
            </button>

            <button
              id="hero-more-info-btn"
              onClick={() => onWatchMovie(movie)}
              className="px-5 py-3 bg-[#0d1e38]/80 hover:bg-[#142c52] border border-white/15 text-white font-semibold text-sm sm:text-base rounded-md flex items-center gap-2 backdrop-blur-sm transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-300" />
              <span>More Info</span>
            </button>

            <button
              id="hero-toggle-favorite-btn"
              onClick={() => onToggleFavorite(movie)}
              className={`p-3 rounded-md border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-600/20 border-rose-500 text-rose-400 hover:bg-rose-600/30'
                  : 'bg-[#0d1e38]/80 border-white/15 text-slate-300 hover:text-white hover:bg-[#142c52]'
              }`}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Up Next Row & Sound Button at Bottom Right (Screenshot 2) */}
        <div className="mt-12 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold tracking-widest uppercase writing-mode-vertical md:writing-mode-horizontal shrink-0">
              <span className="text-slate-500 uppercase tracking-widest text-[10px] [writing-mode:vertical-lr] rotate-180 md:[writing-mode:horizontal-tb] md:rotate-0 font-bold">
                UP NEXT
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {upNextMovies.map((upNext) => {
                const isCurrent = upNext.id === movie.id;
                return (
                  <button
                    key={upNext.id}
                    onClick={() => onSelectMovie(upNext)}
                    className={`group relative flex-shrink-0 w-28 sm:w-32 rounded-md overflow-hidden text-left transition-all border cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-[#f6c700] border-[#f6c700]'
                        : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[16/9] w-full bg-slate-800 relative">
                      <img
                        src={upNext.posterUrl}
                        alt={upNext.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {isCurrent && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f6c700] animate-pulse" />
                      )}
                    </div>
                    <div className="p-1.5 bg-[#081831]">
                      <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-[#f6c700] transition-colors">
                        {upNext.title}
                      </p>
                      <div className="text-[10px] text-amber-400 font-mono flex items-center justify-between mt-0.5">
                        <span className="truncate">{upNext.releaseTime}</span>
                        <span className="text-slate-400 ml-1 shrink-0">{upNext.formattedRuntime}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            id="hero-sound-toggle-btn"
            onClick={() => setIsMuted(!isMuted)}
            className="self-end md:self-center w-10 h-10 rounded-full bg-[#0d1e38]/80 hover:bg-[#142c52] border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md cursor-pointer shrink-0"
            title={isMuted ? 'Unmute preview' : 'Mute preview'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#f6c700]" />}
          </button>
        </div>
      </div>
    </section>
  );
};
