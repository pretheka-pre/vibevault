import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Toast } from './src/components/Toast';
import { LoadingState } from './src/components/LoadingState';
import { useVibeVaultStore } from './src/store/useVibeVaultStore';
import { usePlaybackTimer } from './src/hooks/usePlaybackTimer';
import { colors } from './src/theme/colors';

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function App() {
  const isAppInitializing = useVibeVaultStore((state) => state.isAppInitializing);
  const loadPersistedData = useVibeVaultStore((state) => state.loadPersistedData);

  // Activate playback ticker simulation
  usePlaybackTimer();

  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {isAppInitializing ? (
          <LoadingState
            message="Entering VibeVault"
            subMessage="Hydrating your personal sonic sanctuary..."
          />
        ) : (
          <NavigationContainer theme={NavigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        )}
        {/* Global Toast for in-app user feedback */}
        <Toast />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
