import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { theme } from '@/constants/theme';
import type { Message } from '@/types';

export default function ApprovalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addMessage } = useApp();

  const chatId = params.chatId as string;
  const originalText = params.originalText as string;
  const filteredText = params.filteredText as string;
  const wasFiltered = params.wasFiltered === 'true';

  const handleApprove = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: originalText,
      filteredText: filteredText,
      isFromMe: true,
      timestamp: Date.now(),
      wasFiltered: wasFiltered,
    };

    addMessage(chatId, newMessage);
    router.back();
  };

  const handleEdit = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {wasFiltered ? (
          <View style={styles.statusContainer}>
            <AlertTriangle size={48} color={theme.colors.warning} />
            <Text style={styles.statusTitle}>הניסוח שופר</Text>
            <Text style={styles.statusDescription}>
              הניסוח המקורי לא היה עניני או מכבד דיו.{'\n'}
              הנה הניסוח המשופר שיישלח:
            </Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <CheckCircle size={48} color={theme.colors.success} />
            <Text style={styles.statusTitle}>הניסוח מעולה!</Text>
            <Text style={styles.statusDescription}>
              ההודעה שלך עניינית ומכבדת.{'\n'}
              היא תישלח כמות שכתבת.
            </Text>
          </View>
        )}

        {wasFiltered && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>הניסוח המקורי:</Text>
            <View style={styles.messageBox}>
              <Text style={styles.originalText}>{originalText}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {wasFiltered ? 'הניסוח המשופר:' : 'ההודעה שתישלח:'}
          </Text>
          <View style={[styles.messageBox, styles.filteredMessageBox]}>
            <Text style={styles.filteredText}>{filteredText}</Text>
          </View>
        </View>

        {wasFiltered && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              💡 הניסוח המשופר שומר על המסר העיקרי שלך, אך מנוסח בצורה שמקדמת שיתוף פעולה ותקשורת בריאה.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <XCircle size={20} color={theme.colors.error} />
          <Text style={styles.editButtonText}>עריכה מחדש</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
          <CheckCircle size={20} color={theme.colors.surface} />
          <Text style={styles.approveButtonText}>אישור ושליחה</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  statusTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statusDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold' as const,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  messageBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filteredMessageBox: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  originalText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
  filteredText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  noteContainer: {
    backgroundColor: theme.colors.primaryLight + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  noteText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  editButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold' as const,
    color: theme.colors.error,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  approveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold' as const,
    color: theme.colors.surface,
  },
});
