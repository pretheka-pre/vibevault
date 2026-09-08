import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { VaultScreen } from '../screens/VaultScreen';
import { MoodsScreen } from '../screens/MoodsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MiniPlayer } from '../components/MiniPlayer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useVibeVaultStore } from '../store/useVibeVaultStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentSong = useVibeVaultStore((state) => state.currentSong);

  const handleMiniPlayerPress = () => {
    if (currentSong) {
      navigation.navigate('SongDetails', { songId: currentSong.id });
    }
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryLight,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'musical-notes' : 'musical-notes-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="VaultTab"
          component={VaultScreen}
          options={{
            tabBarLabel: 'Vault',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'library' : 'library-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MoodsTab"
          component={MoodsScreen}
          options={{
            tabBarLabel: 'Moods',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'color-filter' : 'color-filter-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Floating Mini Player just above bottom tabs */}
      {currentSong && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer onPress={handleMiniPlayerPress} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  miniPlayerContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: Platform.OS === 'ios' ? 88 : 68,
    zIndex: 999,
  },
});
