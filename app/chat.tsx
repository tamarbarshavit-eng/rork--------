import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ArrowLeft } from 'lucide-react-native';
import { ref, onValue } from 'firebase/database';
import Firebase from '@/firebase';
import { useApp } from '@/contexts/AppContext';
import { Message } from '@/types';
import { theme } from '@/constants/theme';

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { sendMessage, user } = useApp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const msgRef = ref(Firebase.db, `messages/${chatId}`);

    return onValue(msgRef, (snap) => {
      const data = snap.val();
      if (!data) return setMessages([]);

      const list = Object.values(data).sort(
        (a: any, b: any) => a.timestamp - b.timestamp
      ) as Message[];

      setMessages(list);

      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderUid: user!.uid,
      originalText: text.trim(),
      filteredText: text.trim(),
      wasFiltered: false,
      timestamp: Date.now(),
    };

    await sendMessage(chatId as string, message);
    setText('');
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderUid === user?.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.meContainer : styles.otherContainer,
        ]}
      >
        <View style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe && styles.meText]}>
            {item.filteredText}
          </Text>
          <Text style={styles.time}>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/chats")}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>שיחה</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="כתבו הודעה..."
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !text.trim() && styles.disabled]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Send size={20} color="#fff" />
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
    height: 60,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },

  messagesList: {
    padding: 12,
  },

  messageContainer: {
    marginVertical: 6,
    maxWidth: '80%',
  },

  meContainer: {
    alignSelf: 'flex-start',
  },

  otherContainer: {
    alignSelf: 'flex-end',
  },

  bubble: {
    borderRadius: 16,
    padding: 12,
  },

  meBubble: {
    backgroundColor: theme.colors.primary,
  },

  otherBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  messageText: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 4,
  },

  meText: {
    color: '#fff',
  },

  time: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'left',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: 8,
  },

  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
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

  disabled: {
    opacity: 0.4,
  },
});
