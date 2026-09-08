import { MoodType } from './mood';

export type GenreType = 
  | 'Synthwave'
  | 'Lofi Beats'
  | 'Indie Electronic'
  | 'Ambient'
  | 'Chillhop'
  | 'Dream Pop'
  | 'R&B / Soul'
  | 'Deep House'
  | 'Acoustic';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  genre: GenreType;
  mood: MoodType;
  duration: number; // in seconds, e.g. 214
  rating: number; // 1 to 5
  isFavorite: boolean;
  description: string;
  releaseYear: number;
  addedAt: string; // ISO date string
  playCount: number;
}
