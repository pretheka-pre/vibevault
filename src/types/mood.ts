export type MoodType = 
  | 'happy' 
  | 'chill' 
  | 'focus' 
  | 'energetic' 
  | 'melancholy' 
  | 'romantic';

export interface Mood {
  id: string;
  type: MoodType;
  title: string;
  tagline: string;
  description: string;
  icon: string; // Ionicons icon name
  gradient: [string, string];
  accentColor: string;
  songCount?: number;
}
