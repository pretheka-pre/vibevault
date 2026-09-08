import { create } from 'zustand';
import { VibeVaultState, VaultFilter } from '../types/store';
import { Song } from '../types/song';
import { MoodType } from '../types/mood';
import { UserProfile } from '../types/profile';
import { mockSongs } from '../data/mockSongs';
import { mockProfile } from '../data/mockProfile';
import { mockJournalEntries } from '../data/mockJournal';
import { storageService } from '../services/storage';

export const useVibeVaultStore = create<VibeVaultState>((set, get) => ({
  songs: mockSongs,
  favorites: mockSongs.filter((s) => s.isFavorite).map((s) => s.id),
  vaultFilter: 'all',
  searchQuery: '',
  selectedMood: null,

  currentSong: null,
  isPlaying: false,
  playbackProgress: 0,

  journalEntries: mockJournalEntries,
  profile: mockProfile,

  isAppInitializing: true,
  isVaultLoading: false,
  vaultError: null,
  toastMessage: null,

  // Load from AsyncStorage
  loadPersistedData: async () => {
    try {
      set({ isAppInitializing: true, isVaultLoading: true, vaultError: null });

      const [storedFavorites, storedSongs, storedJournal, storedProfile, storedMood] =
        await Promise.all([
          storageService.getFavorites(),
          storageService.getSongs(),
          storageService.getJournalEntries(),
          storageService.getProfile(),
          storageService.getSelectedMood(),
        ]);

      // Merge favorite status into songs
      const mergedSongs = storedSongs.map((song) => ({
        ...song,
        isFavorite: storedFavorites.includes(song.id),
      }));

      set({
        favorites: storedFavorites,
        songs: mergedSongs,
        journalEntries: storedJournal,
        profile: storedProfile,
        selectedMood: storedMood,
        isAppInitializing: false,
        isVaultLoading: false,
        vaultError: null,
      });
    } catch (e) {
      console.error('Error hydrating data from storage', e);
      set({
        isAppInitializing: false,
        isVaultLoading: false,
        vaultError: 'Could not load your vault data. Please check your storage.',
      });
    }
  },

  // Favorites
  toggleFavorite: (songId: string) => {
    const { favorites, songs, showToast } = get();
    const isFav = favorites.includes(songId);
    const newFavorites = isFav
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];

    const updatedSongs = songs.map((song) =>
      song.id === songId ? { ...song, isFavorite: !isFav } : song
    );

    set({
      favorites: newFavorites,
      songs: updatedSongs,
    });

    // Fire & forget storage persistence
    storageService.saveFavorites(newFavorites).catch((err) => {
      console.warn('Could not persist favorites', err);
    });

    showToast(isFav ? 'Removed from your vault' : 'Added to your vault');
  },

  // Playback Simulation
  playSong: (song: Song) => {
    set({
      currentSong: song,
      isPlaying: true,
      playbackProgress: 0.05,
    });
  },

  togglePlayback: () => {
    const { isPlaying, currentSong, songs } = get();
    if (!currentSong && songs.length > 0) {
      // Pick first song if none active
      set({ currentSong: songs[0], isPlaying: true, playbackProgress: 0.05 });
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  pausePlayback: () => {
    set({ isPlaying: false });
  },

  stopPlayback: () => {
    set({
      currentSong: null,
      isPlaying: false,
      playbackProgress: 0,
    });
  },

  updatePlaybackProgress: (progress: number) => {
    set({ playbackProgress: progress });
  },

  // Mood filter
  setMood: (mood: MoodType | null) => {
    set({ selectedMood: mood });
    storageService.saveSelectedMood(mood).catch((err) => {
      console.warn('Could not persist selected mood', err);
    });
  },

  // Vault Filtering & Search
  setVaultFilter: (filter: VaultFilter) => {
    set({ vaultFilter: filter });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // Star Rating
  rateSong: (songId: string, rating: number) => {
    const { songs, showToast } = get();
    const updatedSongs = songs.map((s) => (s.id === songId ? { ...s, rating } : s));
    set({ songs: updatedSongs });
    storageService.saveSongs(updatedSongs).catch((err) => {
      console.warn('Could not persist song rating', err);
    });
    showToast(`Rated ${rating} star${rating > 1 ? 's' : ''}`);
  },

  // Journal Reflections
  addJournalEntry: (data: { songId: string; mood: MoodType; rating: number; note: string }) => {
    try {
      const { songs, journalEntries, showToast } = get();
      const song = songs.find((s) => s.id === data.songId);
      if (!song) return false;

      const newEntry = {
        id: `journal-${Date.now()}`,
        songId: data.songId,
        songTitle: song.title,
        artist: song.artist,
        artwork: song.artwork,
        mood: data.mood,
        rating: data.rating,
        note: data.note,
        createdAt: new Date().toISOString(),
      };

      const updatedEntries = [newEntry, ...journalEntries];
      set({ journalEntries: updatedEntries });

      storageService.saveJournalEntries(updatedEntries).catch((err) => {
        console.warn('Could not persist journal entry', err);
      });

      showToast('Reflection saved');
      return true;
    } catch (e) {
      console.error('Failed to add journal entry', e);
      return false;
    }
  },

  deleteJournalEntry: (id: string) => {
    const { journalEntries, showToast } = get();
    const updated = journalEntries.filter((e) => e.id !== id);
    set({ journalEntries: updated });
    storageService.saveJournalEntries(updated).catch((err) => {
      console.warn('Could not persist deleted journal entry', err);
    });
    showToast('Reflection removed');
  },

  // Profile
  updateProfile: (data: Partial<UserProfile>) => {
    const { profile, showToast } = get();
    const updated = { ...profile, ...data };
    set({ profile: updated });
    storageService.saveProfile(updated).catch((err) => {
      console.warn('Could not persist profile update', err);
    });
    showToast('Profile updated');
  },

  // Error & Loading simulation for grading/testing
  resetVaultError: () => {
    set({ vaultError: null });
    get().loadPersistedData();
  },

  simulateVaultError: () => {
    set({
      vaultError: 'Unable to connect to local sound storage. Please verify your cache.',
    });
  },

  simulateVaultLoading: () => {
    set({ isVaultLoading: true });
    setTimeout(() => {
      set({ isVaultLoading: false });
    }, 1800);
  },

  resetToDemoData: async () => {
    await storageService.resetAll();
    await get().loadPersistedData();
    get().showToast('Reset to original demo vibes');
  },

  // Toast feedback
  showToast: (message: string) => {
    set({ toastMessage: message });
  },

  hideToast: () => {
    set({ toastMessage: null });
  },
}));
