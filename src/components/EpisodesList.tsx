import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, ChevronDown, Check, Clock } from 'lucide-react';
import { Episode } from '../types';

interface EpisodesListProps {
  episodes: Episode[];
  selectedEpisode: Episode | null;
  isPlaying: boolean;
  onSelectEpisode: (episode: Episode) => void;
  onTogglePlay: () => void;
  defaultSeason?: number;
}

export const EpisodesList: React.FC<EpisodesListProps> = ({
  episodes,
  selectedEpisode,
  isPlaying,
  onSelectEpisode,
  onTogglePlay,
  defaultSeason,
}) => {
  // Available seasons in ascending order
  const seasons = useMemo(() => {
    const s = Array.from(new Set<number>(episodes.map((ep) => ep.seasonNumber))).sort((a, b) => a - b);
    return s.length > 0 ? s : [1];
  }, [episodes]);

  const [activeSeason, setActiveSeason] = useState<number>(() => {
    if (defaultSeason && seasons.includes(defaultSeason)) return defaultSeason;
    if (selectedEpisode) return selectedEpisode.seasonNumber;
    return seasons[0] || 1;
  });

  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchronize season when selectedEpisode changes
  useEffect(() => {
    if (selectedEpisode && selectedEpisode.seasonNumber !== activeSeason) {
      setActiveSeason(selectedEpisode.seasonNumber);
    }
  }, [selectedEpisode?.id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSeasonDropdownOpen(false);
      }
    };
    if (isSeasonDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSeasonDropdownOpen]);

  // Episodes for active season
  const currentSeasonEpisodes = useMemo(() => {
    return episodes
      .filter((ep) => ep.seasonNumber === activeSeason)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  }, [episodes, activeSeason]);

  const handleRowClick = (ep: Episode) => {
    if (selectedEpisode?.id === ep.id) {
      onTogglePlay();
    } else {
      onSelectEpisode(ep);
    }
  };

  return (
    <div
      id="episodes-section"
      className="bg-[#130924] border border-purple-500/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl select-none"
    >
      {/* Header matching image.png */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-extrabold text-2xl sm:text-3xl text-white font-['Bebas_Neue',sans-serif] tracking-wider leading-none">
            EPISODES
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            {currentSeasonEpisodes.length} episodes available
          </p>
        </div>

        {/* Season Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="season-selector-btn"
            onClick={() => setIsSeasonDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e0d38] hover:bg-[#2d1454] border border-white/10 hover:border-purple-500/30 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer shadow-sm"
          >
            <span>Season {activeSeason}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isSeasonDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {isSeasonDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-[#170b2f] border border-purple-500/30 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                Select Season
              </div>
              {seasons.map((seasonNum) => {
                const isCurrent = activeSeason === seasonNum;
                const count = episodes.filter((e) => e.seasonNumber === seasonNum).length;
                return (
                  <button
                    key={seasonNum}
                    onClick={() => {
                      setActiveSeason(seasonNum);
                      setIsSeasonDropdownOpen(false);
                      // Auto-select first episode of this season if none in season is active
                      const firstInSeason = episodes.find((e) => e.seasonNumber === seasonNum);
                      if (firstInSeason && selectedEpisode?.seasonNumber !== seasonNum) {
                        onSelectEpisode(firstInSeason);
                      }
                    }}
                    className={`w-full px-3 py-2 text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-500/20 text-purple-300 font-bold'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>Season {seasonNum}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{count} eps</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Episodes Vertical List (Matching image.png Layout) */}
      <div className="space-y-2 divide-y divide-white/5">
        {currentSeasonEpisodes.map((ep) => {
          const isSelected = selectedEpisode?.id === ep.id;
          const isCurrentPlaying = isSelected && isPlaying;

          return (
            <div
              key={ep.id}
              id={`episode-row-${ep.episodeNumber}`}
              onClick={() => handleRowClick(ep)}
              className={`pt-2 first:pt-0 group flex items-center justify-between gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#241042]/90 border border-purple-500/30 shadow-inner'
                  : 'hover:bg-[#1c0c36]/60 border border-transparent'
              }`}
            >
              {/* Left Column: Number Badge, Thumbnail, and Episode Details */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Number Badge (e.g. 1, 2, 3...) */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                    isCurrentPlaying
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black shadow-md shadow-purple-600/30'
                      : isSelected
                      ? 'bg-[#2d1454] text-purple-300 border border-purple-400/50'
                      : 'bg-[#180d2e] text-slate-300 border border-white/5 group-hover:text-white group-hover:bg-[#241246]'
                  }`}
                >
                  {ep.episodeNumber}
                </div>

                {/* Episode Thumbnail */}
                <div className="w-24 sm:w-36 h-14 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-[#0e061c] relative border border-white/10 group-hover:border-white/20 transition-all">
                  <img
                    src={ep.thumbnailUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80'}
                    alt={ep.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Playing Indicator Overlay on Thumbnail */}
                  {isCurrentPlaying && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                        <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s] h-3" />
                        <span className="w-1 bg-purple-400 rounded-full animate-bounce h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Episode Info: Title & Release Date */}
                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-sm sm:text-base font-bold truncate transition-colors ${
                      isSelected
                        ? 'text-purple-300'
                        : 'text-white group-hover:text-purple-400'
                    }`}
                  >
                    {ep.title.startsWith('Episode') ? ep.title : `Episode ${ep.episodeNumber}: ${ep.title}`}
                  </h4>

                  {/* Date & Meta */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-slate-300">{ep.releaseDate}</span>
                    {ep.releaseTime && (
                      <>
                        <span className="text-slate-600">•</span>
                        <div className="flex items-center gap-1 font-mono text-purple-300 text-[11px]">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{ep.releaseTime}</span>
                        </div>
                      </>
                    )}
                    {ep.duration && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400 font-mono text-[11px]">{ep.duration}</span>
                      </>
                    )}
                  </div>

                  {/* Optional Overview Snippet */}
                  {ep.overview && (
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 hidden md:block group-hover:text-slate-300 transition-colors">
                      {ep.overview}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Play Button Icon matching image.png */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(ep);
                }}
                className={`p-2 sm:p-2.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  isCurrentPlaying
                    ? 'text-purple-300 bg-purple-500/20'
                    : 'text-slate-400 group-hover:text-white hover:bg-white/10'
                }`}
                title={isCurrentPlaying ? 'Pause' : 'Play Episode'}
              >
                {isCurrentPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
