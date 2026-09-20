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
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
              : 'bg-[#160b2b] hover:bg-[#251246] text-purple-200/80 border-white/10 hover:border-purple-500/30'
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
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                  : 'bg-[#160b2b] hover:bg-[#251246] text-purple-200/80 border-white/10 hover:border-purple-500/30'
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
