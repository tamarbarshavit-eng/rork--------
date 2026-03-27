import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { theme } from '@/constants/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { loggedin,loading,user } = useApp();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/chats');
      } else {
        router.replace('/login');
      }
    }
  }, [loggedin, user, loading, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
