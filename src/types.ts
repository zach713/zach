export type MediaType = 'Movie' | 'Series' | 'Documentary';

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
  type: MediaType;
  genres: string[];
  duration: string;
  quality: '4K' | 'HD';
  status: 'Released' | 'Post Production' | 'In Theaters';
  language: string;
  videoUrl?: string;
  isTrendingToday?: boolean;
  trendingRank?: number;
  featuredOrder?: number;
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
