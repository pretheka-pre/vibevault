import { MoodType } from './mood';

export interface JournalEntry {
  id: string;
  songId: string;
  songTitle: string;
  artist: string;
  artwork: string;
  mood: MoodType;
  rating: number; // 1 - 5
  note: string;
  createdAt: string; // ISO date string
}

export interface JournalFormData {
  songId: string;
  mood: MoodType;
  rating: number;
  note: string;
}
