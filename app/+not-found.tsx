import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'לא נמצא' }} />
      <View style={styles.container}>
        <Text style={styles.title}>הדף לא נמצא</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>חזרה לדף הבית</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  link: {
    marginTop: theme.spacing.md,
  },
  linkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
  },
});
