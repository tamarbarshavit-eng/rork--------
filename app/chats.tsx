import { useRouter } from 'expo-router';
import { MessageCircle, Plus, Settings as SettingsIcon } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { theme } from '@/constants/theme';

export default function ChatsScreen() {
  const router = useRouter();
  const { chats } = useApp(); // <-- UserChat[]

  const handleChatPress = (chatId: string) => {
    router.push(`/chat?chatId=${chatId}`);
  };

  const handleNewChat = () => {
    router.push('/onboarding');
  };

  const renderChat = ({ item }: any) => {
    const lastMessageText = item.lastMessage ?? 'אין הודעות עדיין';

    const lastMessageTime = item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString('he-IL', {
          day: 'numeric',
          month: 'short',
        })
      : '';

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.chatId)}
      >
        <View style={styles.chatAvatar}>
          <MessageCircle size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>
              {item.partnerName ?? 'שותף/ה'}
            </Text>
            {lastMessageTime && (
              <Text style={styles.chatTime}>{lastMessageTime}</Text>
            )}
          </View>
          <Text style={styles.chatPreview} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>שיחות</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/settings')}
          >
            <SettingsIcon size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleNewChat}
          >
            <Plus size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color={theme.colors.textLight} />
          <Text style={styles.emptyStateTitle}>אין שיחות עדיין</Text>
          <Text style={styles.emptyStateText}>
            התחילו שיחה חדשה עם שותף/ה להורות{'\n'}
            על ידי יצירת קוד או הזנת קוד קיים
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={handleNewChat}>
            <Plus size={20} color={theme.colors.surface} />
            <Text style={styles.startButtonText}>התחל שיחה חדשה</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.chatId}
          contentContainerStyle={styles.chatsList}
        />
      )}
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background, }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }, headerTitle: { fontSize: theme.fontSize.xl, fontWeight: 'bold' as const, color: theme.colors.text, }, headerActions: { flexDirection: 'row', gap: theme.spacing.sm, }, headerButton: { padding: theme.spacing.sm, }, emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl, }, emptyStateTitle: { fontSize: theme.fontSize.xl, fontWeight: 'bold' as const, color: theme.colors.text, marginTop: theme.spacing.md, marginBottom: theme.spacing.sm, }, emptyStateText: { fontSize: theme.fontSize.md, color: theme.colors.textLight, textAlign: 'center', lineHeight: 22, marginBottom: theme.spacing.xl, }, startButton: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderRadius: theme.borderRadius.md, }, startButtonText: { fontSize: theme.fontSize.md, fontWeight: 'bold' as const, color: theme.colors.surface, }, chatsList: { padding: theme.spacing.sm, }, chatItem: { flexDirection: 'row', padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.sm, gap: theme.spacing.md, }, chatAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primaryLight + '30', alignItems: 'center', justifyContent: 'center', }, chatContent: { flex: 1, }, chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs, }, chatName: { fontSize: theme.fontSize.md, fontWeight: 'bold' as const, color: theme.colors.text, }, chatTime: { fontSize: theme.fontSize.xs, color: theme.colors.textLight, }, chatPreview: { fontSize: theme.fontSize.sm, color: theme.colors.textLight, }, });