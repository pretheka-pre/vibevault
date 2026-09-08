/**
 * Formats seconds into mm:ss format (e.g., 218 -> "3:38")
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Returns a personalized greeting based on current local hour
 */
export const getDayGreeting = (): { greeting: string; subtitle: string } => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return {
      greeting: 'Good morning',
      subtitle: 'What is your morning vibration?',
    };
  } else if (hour < 18) {
    return {
      greeting: 'Good afternoon',
      subtitle: 'Keep your energy aligned today.',
    };
  } else {
    return {
      greeting: 'Good evening',
      subtitle: 'What are you feeling tonight?',
    };
  }
};

/**
 * Returns initials from song/artist/album for fallback artwork
 */
export const getInitials = (text: string): string => {
  if (!text) return 'VV';
  return text
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};

/**
 * Formats an ISO date string into a friendly localized date (e.g. "Mar 5, 2025")
 */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
};
