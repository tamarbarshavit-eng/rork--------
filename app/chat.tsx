import { useRouter, useLocalSearchParams } from 'expo-router';
import { Settings as SettingsIcon, Send, AlertCircle, ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { theme } from '@/constants/theme';
import { filterMessage } from '@/utils/messageFilter';
import type { Message } from '@/types';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { getChatById, canSendMessage } = useApp();
  const [messageText, setMessageText] = useState<string>('');
  
  const chatId = params.chatId as string;
  const chat = getChatById(chatId);
  const messages = chat?.messages || [];
  const partnerName = chat?.partnerName || '';

  useEffect(() => {
    if (!chat) {
      router.replace('/chats');
    }
  }, [chat, router]);

  const handleSend = () => {
    if (!messageText.trim()) {
      return;
    }

    const sendCheck = canSendMessage();
    if (!sendCheck.allowed) {
      Alert.alert('לא ניתן לשלוח', sendCheck.reason);
      return;
    }

    const filtered = filterMessage(messageText.trim());
    
    router.push({
      pathname: '/approval',
      params: {
        chatId: chatId,
        originalText: messageText.trim(),
        filteredText: filtered.filteredText,
        wasFiltered: filtered.wasFiltered ? 'true' : 'false',
      },
    });
    
    setMessageText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isFromMe = item.isFromMe;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isFromMe ? styles.messageContainerMe : styles.messageContainerOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isFromMe ? styles.messageBubbleMe : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isFromMe ? styles.messageTextMe : styles.messageTextOther,
            ]}
          >
            {item.filteredText}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isFromMe ? styles.messageTimeMe : styles.messageTimeOther,
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString('he-IL', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{partnerName || 'צ\'אט'}</Text>
          <Text style={styles.headerSubtitle}>תקשורת מכבדת</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <SettingsIcon size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertCircle size={48} color={theme.colors.textLight} />
          <Text style={styles.emptyStateTitle}>עדיין אין הודעות</Text>
          <Text style={styles.emptyStateText}>
            כתבו את ההודעה הראשונה שלכם{'\n'}
            והאפליקציה תוודא שהיא מכבדת ועניינית
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          inverted
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="כתבו הודעה..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
            placeholderTextColor={theme.colors.textLight}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  messagesList: {
    padding: theme.spacing.md,
    flexDirection: 'column-reverse',
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    maxWidth: '80%',
  },
  messageContainerMe: {
    alignSelf: 'flex-start',
  },
  messageContainerOther: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  messageBubbleMe: {
    backgroundColor: theme.colors.sent,
  },
  messageBubbleOther: {
    backgroundColor: theme.colors.received,
  },
  messageText: {
    fontSize: theme.fontSize.md,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  messageTextMe: {
    color: theme.colors.surface,
  },
  messageTextOther: {
    color: theme.colors.text,
  },
  messageTime: {
    fontSize: theme.fontSize.xs,
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeOther: {
    color: theme.colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
});
