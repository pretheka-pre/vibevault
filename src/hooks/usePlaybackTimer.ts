import { useEffect } from 'react';
import { useVibeVaultStore } from '../store/useVibeVaultStore';

/**
 * Simulates real audio playback by ticking progress when isPlaying is true.
 * Automatically advances progress based on song duration.
 */
export const usePlaybackTimer = () => {
  const isPlaying = useVibeVaultStore((state) => state.isPlaying);
  const currentSong = useVibeVaultStore((state) => state.currentSong);
  const progress = useVibeVaultStore((state) => state.playbackProgress);
  const updateProgress = useVibeVaultStore((state) => state.updatePlaybackProgress);

  useEffect(() => {
    if (!isPlaying || !currentSong) return;

    const durationSeconds = currentSong.duration || 180;
    const intervalMs = 1000;
    const increment = intervalMs / (durationSeconds * 1000);

    const timer = setInterval(() => {
      const nextProgress = progress + increment;
      if (nextProgress >= 1) {
        // Reset or loop playback
        updateProgress(0);
      } else {
        updateProgress(nextProgress);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentSong, progress, updateProgress]);
};
