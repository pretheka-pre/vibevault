import { MoodType } from './mood';
import { GenreType } from './song';

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  favoriteGenre: GenreType;
  favoriteMood: MoodType;
  bio: string;
}

export interface ProfileFormData {
  name: string;
  username: string;
  favoriteGenre: GenreType;
  favoriteMood: MoodType;
}
