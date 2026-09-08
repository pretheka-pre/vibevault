import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types/song';
import { JournalEntry } from '../types/journal';
import { UserProfile } from '../types/profile';
import { MoodType } from '../types/mood';
import { mockSongs } from '../data/mockSongs';
import { mockJournalEntries } from '../data/mockJournal';
import { mockProfile } from '../data/mockProfile';

const STORAGE_KEYS = {
  FAVORITES: '@vibevault_favorites',
  JOURNAL: '@vibevault_journal',
  PROFILE: '@vibevault_profile',
  SELECTED_MOOD: '@vibevault_selected_mood',
  SONGS: '@vibevault_songs',
} as const;

export const storageService = {
  // Favorites
  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
      // Default to initial favorites from mock data
      const initialFavorites = mockSongs.filter((s) => s.isFavorite).map((s) => s.id);
      await this.saveFavorites(initialFavorites);
      return initialFavorites;
    } catch (e) {
      console.warn('Failed to load favorites from AsyncStorage', e);
      return mockSongs.filter((s) => s.isFavorite).map((s) => s.id);
    }
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to AsyncStorage', e);
      throw e;
    }
  },

  // Songs (including updated ratings)
  async getSongs(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SONGS);
      if (data) return JSON.parse(data);
      await this.saveSongs(mockSongs);
      return mockSongs;
    } catch (e) {
      console.warn('Failed to load songs from AsyncStorage', e);
      return mockSongs;
    }
  },

  async saveSongs(songs: Song[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    } catch (e) {
      console.warn('Failed to save songs to AsyncStorage', e);
      throw e;
    }
  },

  // Journal Reflections
  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (data) return JSON.parse(data);
      await this.saveJournalEntries(mockJournalEntries);
      return mockJournalEntries;
    } catch (e) {
      console.warn('Failed to load journal entries from AsyncStorage', e);
      return mockJournalEntries;
    }
  },

  async saveJournalEntries(entries: JournalEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
    } catch (e) {
      console.warn('Failed to save journal entries to AsyncStorage', e);
      throw e;
    }
  },

  // User Profile
  async getProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
      await this.saveProfile(mockProfile);
      return mockProfile;
    } catch (e) {
      console.warn('Failed to load profile from AsyncStorage', e);
      return mockProfile;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to AsyncStorage', e);
      throw e;
    }
  },

  // Selected Mood
  async getSelectedMood(): Promise<MoodType | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_MOOD);
      return data ? (JSON.parse(data) as MoodType) : null;
    } catch (e) {
      console.warn('Failed to load selected mood from AsyncStorage', e);
      return null;
    }
  },

  async saveSelectedMood(mood: MoodType | null): Promise<void> {
    try {
      if (mood) {
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_MOOD, JSON.stringify(mood));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_MOOD);
      }
    } catch (e) {
      console.warn('Failed to save selected mood to AsyncStorage', e);
      throw e;
    }
  },

  // Clear / Reset All
  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.JOURNAL,
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.SELECTED_MOOD,
        STORAGE_KEYS.SONGS,
      ]);
    } catch (e) {
      console.warn('Failed to reset AsyncStorage', e);
    }
  },
};
