import { Song } from './song';
import { MoodType } from './mood';
import { JournalEntry } from './journal';
import { UserProfile } from './profile';

export type VaultFilter = 'all' | 'favorites' | 'recent' | 'top_rated';

export interface VibeVaultState {
  // Songs & Vault
  songs: Song[];
  favorites: string[]; // array of song IDs
  vaultFilter: VaultFilter;
  searchQuery: string;
  
  // Selected Mood Filter (e.g. for Home screen dynamic recommendation)
  selectedMood: MoodType | null;

  // Simulated Playback State
  currentSong: Song | null;
  isPlaying: boolean;
  playbackProgress: number; // 0 to 1

  // Journal Reflections
  journalEntries: JournalEntry[];

  // User Profile
  profile: UserProfile;

  // UI States
  isAppInitializing: boolean;
  isVaultLoading: boolean;
  vaultError: string | null;
  toastMessage: string | null;

  // Actions
  toggleFavorite: (songId: string) => void;
  playSong: (song: Song) => void;
  togglePlayback: () => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  updatePlaybackProgress: (progress: number) => void;
  setMood: (mood: MoodType | null) => void;
  setVaultFilter: (filter: VaultFilter) => void;
  setSearchQuery: (query: string) => void;
  rateSong: (songId: string, rating: number) => void;
  addJournalEntry: (data: { songId: string; mood: MoodType; rating: number; note: string }) => boolean;
  deleteJournalEntry: (id: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  
  // Persistence & State lifecycle
  loadPersistedData: () => Promise<void>;
  resetVaultError: () => void;
  simulateVaultError: () => void;
  simulateVaultLoading: () => void;
  resetToDemoData: () => Promise<void>;
  showToast: (message: string) => void;
  hideToast: () => void;
}
