import React from 'react';
import { Genre } from '../types';
import { GENRES_LIST } from '../data/movies';

interface BrowseByGenreProps {
  selectedGenre: Genre | null;
  onSelectGenre: (genre: Genre | null) => void;
}

export const BrowseByGenre: React.FC<BrowseByGenreProps> = ({
  selectedGenre,
  onSelectGenre,
}) => {
  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase font-['Bebas_Neue',sans-serif] leading-tight">
          BROWSE BY GENRE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Pick a mood, we'll do the rest
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
            selectedGenre === null
              ? 'bg-[#f6c700] text-slate-950 border-[#f6c700] shadow-md shadow-amber-500/20'
              : 'bg-[#081831] hover:bg-[#10274c] text-slate-300 border-white/10 hover:border-white/20'
          }`}
        >
          All Genres
        </button>

        {GENRES_LIST.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              id={`genre-pill-${genre.toLowerCase()}`}
              onClick={() => onSelectGenre(isSelected ? null : genre)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#f6c700] text-slate-950 border-[#f6c700] shadow-md shadow-amber-500/20'
                  : 'bg-[#081831] hover:bg-[#10274c] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </section>
  );
};
