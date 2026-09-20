import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  Calendar,
  Tv,
  Lock,
  Unlock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Movie, Episode } from '../types';
import { formatVideoTime, formatReleaseDate } from '../utils/timeFormat';
import { EpisodesList } from './EpisodesList';

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
  const LOCKER_URL = 'https://appcomplete.org/cl/i/e6q64q';

  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(
    movie.episodes && movie.episodes.length > 0 ? movie.episodes[0] : null
  );

  // Real full runtime is ALWAYS preserved for movies and series
  const totalDurationSeconds = selectedEpisode
    ? selectedEpisode.runtimeSeconds
    : (movie.runtimeSeconds || 6420);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number>(0);

  // Intro and Content Locker state
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);
  const [showLocker, setShowLocker] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const introVideoSrc = movie.introVideoUrl || '/videos/universal_intro_3sec.mp4';
  const mainVideoSrc = selectedEpisode
    ? (movie.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4')
    : (movie.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');

  const currentVideoSrc = (!isUnlocked && isPlayingIntro) ? introVideoSrc : mainVideoSrc;

  // Reset elapsed time and selected episode when movie changes
  useEffect(() => {
    setElapsedSeconds(0);
    setIsPlaying(false);
    setIsPlayingIntro(true);
    setShowLocker(false);
    setIsUnlocked(false);
    if (movie.episodes && movie.episodes.length > 0) {
      setSelectedEpisode(movie.episodes[0]);
    } else {
      setSelectedEpisode(null);
    }
  }, [movie.id]);

  // Real-time second-by-second playback clock
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !showLocker) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (!isUnlocked && isPlayingIntro) {
            if (prev >= 3) {
              if (videoRef.current) videoRef.current.pause();
              setIsPlaying(false);
              setShowLocker(true);
              return 3;
            }
            return prev + 1;
          }
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return totalDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, showLocker, isUnlocked, isPlayingIntro, totalDurationSeconds]);

  // More like this recommendations
  const moreLikeThis = allMovies
    .filter(
      (m) =>
        m.id !== movie.id &&
        (m.type === movie.type || m.genres.some((g) => movie.genres.includes(g)))
    )
    .slice(0, 5);

  const togglePlay = () => {
    if (showLocker) return;

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!isUnlocked && isPlayingIntro && elapsedSeconds >= 3) {
          setShowLocker(true);
          return;
        }
        if (elapsedSeconds >= totalDurationSeconds) {
          setElapsedSeconds(0);
          videoRef.current.currentTime = 0;
        }
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      if (elapsedSeconds >= totalDurationSeconds) {
        setElapsedSeconds(0);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (pos: number) => {
    const clampedPos = Math.max(0, Math.min(1, pos));
    const targetSeconds = Math.round(clampedPos * totalDurationSeconds);

    if (!isUnlocked && targetSeconds >= 3) {
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
      setShowLocker(true);
      return;
    }

    setElapsedSeconds(targetSeconds);

    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = clampedPos * videoRef.current.duration;
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    setShowLocker(false);
    setIsPlayingIntro(false);
    setElapsedSeconds(3);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 3;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 150);
  };

  const handleReplayIntro = () => {
    setShowLocker(false);
    setIsPlayingIntro(true);
    setIsUnlocked(false);
    setElapsedSeconds(0);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 150);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    handleSeek(pos);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPos(pos);
    setHoverTime(Math.round(pos * totalDurationSeconds));
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

  const handleSelectEpisode = (ep: Episode) => {
    setSelectedEpisode(ep);
    setElapsedSeconds(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const progressPercent = totalDurationSeconds > 0
    ? (elapsedSeconds / totalDurationSeconds) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#0c0617] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0617]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
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

          {/* Reelora Logo */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-purple-600/30">
              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-white font-['Bebas_Neue',sans-serif] leading-none pt-0.5">
              REELORA
            </span>
          </button>
        </div>

        {/* Browse Button on right */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180d2f] hover:bg-[#28134d] border border-white/10 text-xs sm:text-sm font-semibold text-slate-200 transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Browse</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
        {/* Video Player Section */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group select-none">
          {currentVideoSrc ? (
            <video
              ref={videoRef}
              src={currentVideoSrc}
              poster={movie.backdropUrl}
              className="w-full h-full object-cover"
              playsInline
              onTimeUpdate={(e) => {
                const cur = e.currentTarget.currentTime;
                if (!isUnlocked && isPlayingIntro) {
                  const rounded = Math.min(3, Math.floor(cur));
                  setElapsedSeconds(rounded);
                  if (cur >= 2.95) {
                    if (videoRef.current) videoRef.current.pause();
                    setIsPlaying(false);
                    setShowLocker(true);
                  }
                } else {
                  setElapsedSeconds(Math.floor(cur));
                }
              }}
              onEnded={() => {
                if (!isUnlocked && isPlayingIntro) {
                  setIsPlaying(false);
                  setShowLocker(true);
                } else {
                  setIsPlaying(false);
                  setElapsedSeconds(totalDurationSeconds);
                }
              }}
            />
          ) : (
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-75"
            />
          )}

          {/* Central Play Button Overlay (when paused & not showing locker) */}
          {!isPlaying && !showLocker && (
            <button
              id="video-player-center-play"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-2xl cursor-pointer z-20 group/btn"
              aria-label="Play Video"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-gradient-to-r group-hover/btn:from-purple-600 group-hover/btn:to-fuchsia-600 transition-colors">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white ml-1 transition-colors" />
              </div>
            </button>
          )}

          {/* Interactive Content Locker Overlay (at 3 seconds) */}
          {showLocker && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md">
              <div className="relative w-full max-w-2xl bg-[#130924] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96%]">
                {/* Locker Iframe Container */}
                <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-slate-950">
                  <iframe
                    src={LOCKER_URL}
                    title="Verification Locker"
                    className="w-full h-full min-h-[340px] sm:min-h-[420px] border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>

                {/* Locker Footer Actions */}
                <div className="p-3 sm:p-4 bg-[#160b2b] border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReplayIntro}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Replay Intro (3s)</span>
                    </button>
                    <a
                      href={LOCKER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-purple-300 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Open in New Tab</span>
                      <span className="sm:hidden">New Tab</span>
                    </a>
                  </div>

                  <button
                    id="unlock-full-movie-btn"
                    onClick={handleUnlock}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>I've Completed Verification • Unlock Movie</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Episode Title Indicator if series */}
          {selectedEpisode && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2">
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold text-slate-200">
                S{selectedEpisode.seasonNumber} E{selectedEpisode.episodeNumber}: {selectedEpisode.title}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-purple-300 font-mono text-[11px] font-bold">
                {selectedEpisode.releaseTime}
              </span>
            </div>
          )}

          {/* Custom Player Controls Bar (Bottom Overlay - Matching Screenshot image_2.png) */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-4 sm:px-6 pt-8 pb-4 opacity-95 group-hover:opacity-100 transition-opacity z-20">
            {/* Timeline Scrubber Bar */}
            <div
              ref={timelineRef}
              className="w-full py-2 cursor-pointer relative group/scrubber"
              onClick={handleTimelineClick}
              onMouseMove={handleTimelineMouseMove}
              onMouseLeave={() => setHoverTime(null)}
            >
              {/* Background Track */}
              <div className="w-full h-1.5 bg-white/25 rounded-full relative overflow-visible">
                {/* Purple Progress Fill */}
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-none"
                  style={{ width: `${progressPercent}%` }}
                />

                {/* Purple Circular Scrubber Playhead Knob */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] border border-white/30 pointer-events-none transition-none"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* Hover Time Tooltip */}
              {hoverTime !== null && (
                <div
                  className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[11px] font-mono text-purple-300 pointer-events-none shadow"
                  style={{ left: `${hoverPos * 100}%` }}
                >
                  {formatVideoTime(hoverTime, totalDurationSeconds)}
                </div>
              )}
            </div>

            {/* Controls Row (Matching Screenshot image_2.png) */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Play / Pause Toggle Button */}
                <button
                  id="video-player-toggle-play"
                  onClick={togglePlay}
                  className="text-white hover:text-purple-400 transition-colors cursor-pointer p-1"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                </button>

                {/* Replay 10s / Reset */}
                <button
                  onClick={() => {
                    const nextSec = Math.max(0, elapsedSeconds - 10);
                    setElapsedSeconds(nextSec);
                    if (videoRef.current && videoRef.current.duration) {
                      videoRef.current.currentTime = (nextSec / totalDurationSeconds) * videoRef.current.duration;
                    }
                  }}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer p-1"
                  title="Rewind 10 seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Volume / Mute Button */}
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                    }
                    setIsMuted(!isMuted);
                  }}
                  className="text-white hover:text-purple-400 transition-colors cursor-pointer p-1"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* Real-time Dynamic Playback Clock (e.g. '0:00 / 1:47:00' - Matching image_2.png) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-white font-mono tracking-wide tabular-nums">
                    {formatVideoTime(elapsedSeconds, totalDurationSeconds)} / {formatVideoTime(totalDurationSeconds)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-slate-200">
                  {movie.language}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/80 text-purple-300 text-[10px] font-black tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{movie.quality === '4K' ? '4K ULTRA HD' : movie.quality}</span>
                </span>

                <button
                  onClick={() => {
                    if (videoRef.current?.requestFullscreen) {
                      videoRef.current.requestFullscreen().catch(() => {});
                    }
                  }}
                  className="text-slate-300 hover:text-white cursor-pointer p-1"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Now & Download Action Buttons with Exact Real Time Info */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              id="watch-player-play-btn"
              onClick={togglePlay}
              className="group px-8 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 active:scale-95 text-white font-bold text-sm sm:text-base rounded-md flex items-center justify-center gap-2.5 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all cursor-pointer min-w-[160px]"
            >
              <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>{isPlaying ? 'Pause Stream' : 'Watch Now'}</span>
            </button>

            <button
              id="watch-download-btn"
              onClick={handleDownload}
              className="px-8 py-3.5 bg-[#180d2f] hover:bg-[#28134d] border border-white/15 text-slate-100 font-semibold text-sm sm:text-base rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer min-w-[140px]"
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

          {/* Real Time Release Highlight Pill */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#160b2b] border border-purple-500/30 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">
              Specific Release Time:
            </span>
            <span className="font-bold text-purple-300 font-mono">
              {movie.releaseTime}
            </span>
            {movie.episodeReleaseTime && (
              <span className="text-slate-400 hidden md:inline border-l border-white/10 pl-3">
                Schedule: {movie.episodeReleaseTime}
              </span>
            )}
          </div>
        </div>

        {/* Series Episodes & Specific Release Times Section - Recreated matching user screenshot */}
        {movie.episodes && movie.episodes.length > 0 && (
          <EpisodesList
            episodes={movie.episodes}
            selectedEpisode={selectedEpisode}
            isPlaying={isPlaying}
            onSelectEpisode={handleSelectEpisode}
            onTogglePlay={togglePlay}
            defaultSeason={movie.id === 'love-island-usa' ? 1 : undefined}
          />
        )}

        {/* Details & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Movie Poster on Left Column */}
          <div className="lg:col-span-3">
            <div className="aspect-[2/3] max-w-[240px] rounded-xl overflow-hidden bg-gradient-to-b from-[#220f40] to-[#0d061a] border border-white/15 shadow-2xl relative group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ imageRendering: '-webkit-optimize-contrast' as React.CSSProperties['imageRendering'] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
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

              {/* Badges: 4K Ultra HD, HDR10+, 60 FPS, Rating, Duration, Exact Release Time */}
              <div className="flex items-center flex-wrap gap-2.5 text-sm font-semibold text-slate-300 mb-4">
                <span className="px-2.5 py-0.5 rounded bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-black tracking-wider shadow-sm">
                  {movie.quality === '4K' ? '4K ULTRA HD' : movie.quality}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-slate-200 text-xs font-bold border border-white/15">
                  HDR10+
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/10 text-slate-200 text-xs font-bold border border-white/15">
                  60 FPS
                </span>
                <div className="flex items-center gap-1 text-purple-400 ml-1">
                  <span>★</span>
                  <span className="text-white">{movie.rating}</span>
                </div>
                <span className="text-slate-400 font-mono">
                  {selectedEpisode ? `${selectedEpisode.duration} • ` : `${movie.duration} • `}
                  {formatVideoTime(totalDurationSeconds)}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <span>{movie.releaseTime}</span>
                </div>
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
                    : 'bg-[#180d2f] border-white/15 text-slate-200 hover:bg-[#28134d]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? 'In List' : 'List'}</span>
              </button>

              <button
                id="watch-share-btn"
                onClick={handleShare}
                className="px-5 py-2.5 rounded-lg bg-[#180d2f] border border-white/15 hover:bg-[#28134d] text-sm font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
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

            {/* Divider and Metadata Table with Specific Real Times */}
            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    RELEASE DATE
                  </span>
                  <span className="text-slate-100 font-semibold">
                    {formatReleaseDate(movie.releaseDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    RELEASE TIME
                  </span>
                  <span className="text-purple-300 font-semibold font-mono">
                    {movie.releaseTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    REAL RUNTIME
                  </span>
                  <span className="text-slate-100 font-semibold font-mono">
                    {movie.formattedRuntime || movie.duration}
                  </span>
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
                    QUALITY
                  </span>
                  <span className="text-slate-100 font-semibold">{movie.quality} Ultra HD</span>
                </div>
                <div className="sm:col-span-2">
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

          {/* Right Column: MORE LIKE THIS */}
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
                  className="flex items-center gap-3 p-2 rounded-lg bg-[#160b2b]/70 hover:bg-[#261247] border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer group"
                >
                  <div className="w-14 h-20 rounded-md overflow-hidden bg-slate-800 flex-shrink-0 relative">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.releaseYear} • {item.type}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <div className="flex items-center gap-1 text-purple-400">
                        <span>★</span>
                        <span>{item.rating}</span>
                      </div>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-mono">{item.formattedRuntime}</span>
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
