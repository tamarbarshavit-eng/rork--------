import { Bell, BellOff, MessageSquare, Info } from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { theme } from '@/constants/theme';

const MESSAGE_LIMIT_OPTIONS = [5, 10, 15, 20];

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp();

  const handleQuietModeToggle = (value: boolean) => {
    updateSettings({ quietMode: value });
  };

  const handleMessageLimitChange = (limit: number) => {
    updateSettings({ maxMessagesPerDay: limit });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מצב שקט</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              {settings.quietMode ? (
                <BellOff size={24} color={theme.colors.primary} />
              ) : (
                <Bell size={24} color={theme.colors.primary} />
              )}
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>מצב שקט</Text>
              <Text style={styles.settingDescription}>
                {settings.quietMode
                  ? 'לא ניתן לשלוח או לקבל הודעות'
                  : 'תקשורת פעילה'}
              </Text>
            </View>
            <Switch
              value={settings.quietMode}
              onValueChange={handleQuietModeToggle}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.surface}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הגבלת הודעות ליום</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MessageSquare size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>מקסימום הודעות ליום</Text>
              <Text style={styles.settingDescription}>
                נשלחו היום: {settings.currentMessageCount} / {settings.maxMessagesPerDay}
              </Text>
            </View>
          </View>

          <View style={styles.optionsGrid}>
            {MESSAGE_LIMIT_OPTIONS.map((limit) => (
              <TouchableOpacity
                key={limit}
                style={[
                  styles.optionButton,
                  settings.maxMessagesPerDay === limit && styles.optionButtonActive,
                ]}
                onPress={() => handleMessageLimitChange(limit)}
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.maxMessagesPerDay === limit && styles.optionTextActive,
                  ]}
                >
                  {limit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Info size={20} color={theme.colors.primary} />
          <Text style={styles.infoText}>
            הגבלת הודעות עוזרת לשמור על תקשורת מדודה ומכבדת. המגבלה מתאפסת כל יום בחצות.
          </Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>על האפליקציה</Text>
          <Text style={styles.aboutText}>
            האפליקציה מסייעת לשני הורים בהורות משותפת לתקשר בצורה עניינית, מכבדת ובונה - לטובת הילדים.
          </Text>
          <Text style={styles.aboutText}>
            כל הודעה עוברת בדיקה אוטומטית כדי לוודא שהיא עניינית ומכבדת. רק הודעות שעומדות בקריטריון זה יישלחו.
          </Text>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    minWidth: 70,
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  optionTextActive: {
    color: theme.colors.surface,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primaryLight + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  aboutSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
  },
  aboutTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  aboutText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
});
