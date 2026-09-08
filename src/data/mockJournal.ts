import { JournalEntry } from '../types/journal';

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    songId: 'song-1',
    songTitle: 'Midnight Reverie',
    artist: 'Luna Pulse',
    artwork: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    mood: 'chill',
    rating: 5,
    note: 'Listened while watching rain stream down the window after an intense coding sprint. The bassline completely reset my racing thoughts.',
    createdAt: '2025-03-01T21:45:00Z',
  },
  {
    id: 'journal-2',
    songId: 'song-3',
    songTitle: 'Rainy Cafe Session',
    artist: 'Coffee & Tape',
    artwork: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    mood: 'focus',
    rating: 5,
    note: 'Wrote the entire architecture specification with this playing on repeat. The gentle vinyl crackle kept me totally anchored.',
    createdAt: '2025-03-03T11:20:00Z',
  },
  {
    id: 'journal-3',
    songId: 'song-6',
    songTitle: 'Velvet Starlight',
    artist: 'Mira Sol',
    artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    mood: 'romantic',
    rating: 5,
    note: 'Played this during a rooftop dinner under twilight. The guitar chords and vocal textures were utterly magical.',
    createdAt: '2025-03-05T20:30:00Z',
  },
];
