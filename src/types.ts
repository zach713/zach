export type MediaType = 'Movie' | 'Series' | 'Documentary';

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  runtimeSeconds: number;
  releaseDate: string;
  releaseTime: string;
  overview?: string;
  thumbnailUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number | string;
  releaseYear: number;
  releaseDate: string;
  releaseTime: string; // e.g. "12:00 AM EST", "03:00 AM EST", "08:00 PM EST"
  episodeReleaseTime?: string; // for series e.g. "Fridays at 03:00 AM EST"
  type: MediaType;
  genres: string[];
  duration: string;
  runtimeSeconds: number; // e.g. 6420 for 1:47:00
  formattedRuntime: string; // e.g. "1:47:00"
  quality: '4K' | 'HD';
  status: 'Released' | 'Post Production' | 'In Theaters';
  language: string;
  videoUrl?: string;
  introVideoUrl?: string;
  isTrendingToday?: boolean;
  trendingRank?: number;
  featuredOrder?: number;
  episodes?: Episode[];
}

export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Animation'
  | 'Comedy'
  | 'Crime'
  | 'Documentary'
  | 'Drama'
  | 'Family'
  | 'Fantasy'
  | 'Horror'
  | 'Mystery'
  | 'Romance'
  | 'Sci-Fi'
  | 'Thriller'
  | 'War';

export type NavTab = 'Trending' | 'Movies' | 'TV Series' | 'Favorites';
export type FilterTab = 'Trending' | 'Movies' | 'Series' | 'Top Rated' | 'Favorites';
