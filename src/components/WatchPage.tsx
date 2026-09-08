import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Heart,
  Share2,
  Download,
  Search,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Movie } from '../types';

interface WatchPageProps {
  movie: Movie;
  allMovies: Movie[];
  onBack: () => void;
  onSelectMovie: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  movie,
  allMovies,
  onBack,
  onSelectMovie,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(174); // 2h 54m = 174m simulated
  const videoRef = useRef<HTMLVideoElement>(null);

  // More like this recommendations
  const moreLikeThis = allMovies
    .filter(
      (m) =>
        m.id !== movie.id &&
        (m.type === movie.type || m.genres.some((g) => movie.genres.includes(g)))
    )
    .slice(0, 5);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#030d1d] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Top Bar matching screenshot 8 */}
      <header className="sticky top-0 z-40 bg-[#030d1d]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            id="watch-back-button"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold py-1 px-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="h-5 w-[1px] bg-white/20" />

          {/* FYPFLIX Logo */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#f6c700] flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950 ml-0.5" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-white font-['Bebas_Neue',sans-serif] leading-none pt-0.5">
              FYPFLIX
            </span>
          </button>
        </div>

        {/* Browse Button on right */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#081831] hover:bg-[#122b52] border border-white/10 text-xs sm:text-sm font-semibold text-slate-200 transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Browse</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
        {/* Video Player Section */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
          {movie.videoUrl ? (
            <video
              ref={videoRef}
              src={movie.videoUrl}
              poster={movie.backdropUrl}
              className="w-full h-full object-cover"
              playsInline
              onTimeUpdate={(e) => {
                const vid = e.currentTarget;
                if (vid.duration) {
                  setCurrentTime((vid.currentTime / vid.duration) * 100);
                }
              }}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover brightness-75"
            />
          )}

          {/* Central Play Button Overlay (when paused) */}
          {!isPlaying && (
            <button
              id="video-player-center-play"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-2xl cursor-pointer z-20 group/btn"
              aria-label="Play Video"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-[#f6c700] transition-colors">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white group-hover/btn:fill-slate-950 group-hover/btn:text-slate-950 ml-1 transition-colors" />
              </div>
            </button>
          )}

          {/* Custom Player Controls Bar (Bottom Overlay) */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 opacity-90 group-hover:opacity-100 transition-opacity z-20">
            {/* Timeline Bar */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (videoRef.current && videoRef.current.duration) {
                  videoRef.current.currentTime = pos * videoRef.current.duration;
                  setCurrentTime(pos * 100);
                }
              }}
            >
              <div
                className="h-full bg-[#f6c700] rounded-full transition-all"
                style={{ width: `${currentTime}%` }}
              />
            </div>

            {/* Controls flex row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-[#f6c700] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Replay"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    } else {
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="text-white hover:text-[#f6c700] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <span className="text-xs text-slate-300 font-medium">
                  {movie.duration} • {movie.quality}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-slate-200">
                  {movie.language}
                </span>
                <button
                  onClick={() => {
                    if (videoRef.current?.requestFullscreen) {
                      videoRef.current.requestFullscreen().catch(() => {});
                    }
                  }}
                  className="text-slate-300 hover:text-white cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Now & Download Action Buttons (Screenshot 9) */}
        <div className="flex items-center gap-4">
          <button
            id="watch-player-play-btn"
            onClick={togglePlay}
            className="group px-8 py-3.5 bg-[#f6c700] hover:bg-[#ffd700] active:scale-95 text-slate-950 font-bold text-sm sm:text-base rounded-md flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer min-w-[160px]"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>{isPlaying ? 'Pause Stream' : 'Watch Now'}</span>
          </button>

          <button
            id="watch-download-btn"
            onClick={handleDownload}
            className="px-8 py-3.5 bg-[#081831] hover:bg-[#112a52] border border-white/15 text-slate-100 font-semibold text-sm sm:text-base rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer min-w-[140px]"
          >
            {isDownloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Ready</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-300" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {/* Details & Sidebar Grid (Matching Screenshot 9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Movie Poster on Left Column */}
          <div className="lg:col-span-3">
            <div className="aspect-[2/3] max-w-[240px] rounded-xl overflow-hidden bg-[#081831] border border-white/10 shadow-2xl relative">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-sm font-black text-white uppercase tracking-wider font-['Bebas_Neue',sans-serif]">
                  {movie.title}
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Title, Metadata, Synopsis, and Details Table */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase font-['Bebas_Neue',sans-serif] leading-tight mb-2">
                {movie.title}
              </h1>

              {/* Badges: 4K, Rating, Duration */}
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300 mb-4">
                <span className="px-2 py-0.5 rounded bg-[#f6c700] text-slate-950 text-xs font-black tracking-wider">
                  {movie.quality}
                </span>
                <div className="flex items-center gap-1 text-[#f6c700]">
                  <span>★</span>
                  <span className="text-white">{movie.rating}</span>
                </div>
                <span className="text-slate-400">{movie.duration}</span>
              </div>

              {/* Synopsis */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {movie.overview}
              </p>
            </div>

            {/* List and Share Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                id="watch-list-toggle-btn"
                onClick={() => onToggleFavorite(movie)}
                className={`px-5 py-2.5 rounded-lg border text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-[#081831] border-white/15 text-slate-200 hover:bg-[#112a52]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? 'In List' : 'List'}</span>
              </button>

              <button
                id="watch-share-btn"
                onClick={handleShare}
                className="px-5 py-2.5 rounded-lg bg-[#081831] border border-white/15 hover:bg-[#112a52] text-sm font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider and Metadata Table (Matching Screenshot 9) */}
            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    RELEASE
                  </span>
                  <span className="text-slate-100 font-semibold">{movie.releaseDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    STATUS
                  </span>
                  <span className="text-slate-100 font-semibold">{movie.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    LANGUAGE
                  </span>
                  <span className="text-slate-100 font-semibold">{movie.language}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    GENRE
                  </span>
                  <span className="text-slate-100 font-semibold">
                    {movie.genres.join(', ') || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: MORE LIKE THIS (Screenshot 9) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2 mb-4">
              MORE LIKE THIS
            </h3>
            <div className="space-y-3">
              {moreLikeThis.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectMovie(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex gap-3 p-2 rounded-lg bg-[#081831]/60 hover:bg-[#0c2448] border border-white/5 hover:border-[#f6c700]/40 transition-all cursor-pointer"
                >
                  <div className="w-14 h-20 rounded-md overflow-hidden bg-slate-800 flex-shrink-0">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-[#f6c700] truncate transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.releaseYear} • {item.type}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#f6c700] mt-1">
                      <span>★</span>
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
