export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'to-read' | 'reading' | 'completed';
  progress?: number;
  totalPages?: number;
  dateAdded: Date;
  dateStarted?: Date;
  dateCompleted?: Date;
  rating?: number;
  notes?: string;
  type: 'book';
}

export interface Movie {
  id: string;
  title: string;
  director: string;
  coverUrl?: string;
  status: 'to-watch' | 'watching' | 'completed';
  runtime?: number; // in minutes
  dateAdded: Date;
  dateStarted?: Date;
  dateCompleted?: Date;
  rating?: number;
  notes?: string;
  type: 'movie';
  genre?: string;
  releaseYear?: number;
}

export interface TVShow {
  id: string;
  title: string;
  creator: string;
  coverUrl?: string;
  status: 'to-watch' | 'watching' | 'completed';
  currentSeason?: number;
  currentEpisode?: number;
  totalSeasons?: number;
  totalEpisodes?: number;
  dateAdded: Date;
  dateStarted?: Date;
  dateCompleted?: Date;
  rating?: number;
  notes?: string;
  type: 'tv-show';
  genre?: string;
  releaseYear?: number;
}

export type MediaItem = Book | Movie | TVShow;
export type MediaType = 'book' | 'movie' | 'tv-show';
export type MediaStatus = 'to-read' | 'reading' | 'completed' | 'to-watch' | 'watching';

export type BookStatus = Book['status'];
export type WatchStatus = Movie['status'] | TVShow['status'];