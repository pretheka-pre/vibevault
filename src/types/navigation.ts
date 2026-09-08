import { NavigatorScreenParams } from '@react-navigation/native';
import { MoodType } from './mood';

export type BottomTabParamList = {
  HomeTab: undefined;
  VaultTab: undefined;
  MoodsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  SongDetails: { songId: string };
  MoodDetails: { moodId: string };
  AddJournalEntry: { initialSongId?: string; initialMood?: MoodType };
  EditProfile: undefined;
};
