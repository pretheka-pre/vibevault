import { useMemo } from 'react';
import { Song } from '../types/song';
import { VaultFilter } from '../types/store';
import { MoodType } from '../types/mood';

interface UseVaultFilterProps {
  songs: Song[];
  searchQuery: string;
  vaultFilter: VaultFilter;
  moodFilter?: MoodType | null;
}

export const useVaultFilter = ({
  songs,
  searchQuery,
  vaultFilter,
  moodFilter,
}: UseVaultFilterProps): Song[] => {
  return useMemo(() => {
    let result = [...songs];

    // Filter by mood if provided
    if (moodFilter) {
      result = result.filter((s) => s.mood === moodFilter);
    }

    // Filter by vault category
    switch (vaultFilter) {
      case 'favorites':
        result = result.filter((s) => s.isFavorite);
        break;
      case 'recent':
        // Sort by addedAt descending
        result = result.sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
        break;
      case 'top_rated':
        // Sort by rating descending
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case 'all':
      default:
        break;
    }

    // Dynamic search filtering across title, artist, album, genre
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.album.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      );
    }

    return result;
  }, [songs, searchQuery, vaultFilter, moodFilter]);
};
