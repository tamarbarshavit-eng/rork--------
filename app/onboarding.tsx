import { useRouter } from 'expo-router';
import { Heart, Shield, MessageCircle, Copy, Check } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useApp } from '@/contexts/AppContext';
import { theme } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { createChat, joinChat, completeOnboarding } = useApp();
  const [step, setStep] = useState<number>(1);
  const [partnerName, setPartnerName] = useState<string>('');
  const [connectionType, setConnectionType] = useState<'create' | 'join' | null>(null);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && connectionType) {
      setStep(4);
    } else if (step === 4) {
      if (connectionType === 'create' && partnerName.trim()) {
        const chat = createChat(partnerName);
        setGeneratedCode(chat.inviteCode);
        setStep(5);
      } else if (connectionType === 'join' && inviteCode.trim()) {
        const chat = joinChat(inviteCode.trim(), partnerName.trim() || 'שותף/ה');
        if (chat) {
          completeOnboarding();
          router.replace(`/chats`);
        } else {
          Alert.alert('שגיאה', 'קוד לא תקין');
        }
      }
    } else if (step === 5) {
      completeOnboarding();
      router.replace('/chats');
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Heart size={64} color={theme.colors.primary} fill={theme.colors.primary} />
      </View>
      <Text style={styles.title}>תקשורת מכבדת{'\n'}למען הילדים</Text>
      <Text style={styles.description}>
        ברוכים הבאים לאפליקציה שעוזרת לכם לתקשר בצורה עניינית, מכבדת ובונה - לטובת הילדים.
      </Text>
      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Shield size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>הגנה מפני הודעות פוגעניות</Text>
        </View>
        <View style={styles.feature}>
          <MessageCircle size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>תקשורת עניינית בלבד</Text>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Shield size={64} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>איך זה עובד?</Text>
      <View style={styles.howItWorksContainer}>
        <View style={styles.howItWorksItem}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <Text style={styles.howItWorksText}>
            כתבו את ההודעה שלכם בחופשיות
          </Text>
        </View>
        <View style={styles.howItWorksItem}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>2</Text>
          </View>
          <Text style={styles.howItWorksText}>
            האפליקציה בודקת שהניסוח מכבד ועניני
          </Text>
        </View>
        <View style={styles.howItWorksItem}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>3</Text>
          </View>
          <Text style={styles.howItWorksText}>
            תאשרו את הנוסח הסופי לפני השליחה
          </Text>
        </View>
        <View style={styles.howItWorksItem}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>4</Text>
          </View>
          <Text style={styles.howItWorksText}>
            השותף שלכם מקבל רק הודעות מכבדות
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <MessageCircle size={64} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>איך תרצו להתחבר?</Text>
      <Text style={styles.description}>
        בחרו אחת מהאפשרויות:
      </Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            connectionType === 'create' && styles.optionButtonActive,
          ]}
          onPress={() => setConnectionType('create')}
        >
          <Shield size={32} color={connectionType === 'create' ? theme.colors.primary : theme.colors.textLight} />
          <Text style={[
            styles.optionTitle,
            connectionType === 'create' && styles.optionTitleActive,
          ]}>
            צור קוד חדש
          </Text>
          <Text style={styles.optionDescription}>
            צרו קוד ושלחו לשותף/ה
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            connectionType === 'join' && styles.optionButtonActive,
          ]}
          onPress={() => setConnectionType('join')}
        >
          <MessageCircle size={32} color={connectionType === 'join' ? theme.colors.primary : theme.colors.textLight} />
          <Text style={[
            styles.optionTitle,
            connectionType === 'join' && styles.optionTitleActive,
          ]}>
            הזן קוד קיים
          </Text>
          <Text style={styles.optionDescription}>
            הזינו קוד שקיבלתם מהשותף/ה
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => {
    if (connectionType === 'create') {
      return (
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <Shield size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>מה השם של שותף/ה ההורות?</Text>
          <Text style={styles.description}>
            השם יופיע בשיחה שלכם
          </Text>
          <TextInput
            style={styles.input}
            placeholder="שם השותף/ה"
            value={partnerName}
            onChangeText={setPartnerName}
            autoFocus
            placeholderTextColor={theme.colors.textLight}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <MessageCircle size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>הזינו את הקוד</Text>
          <Text style={styles.description}>
            הזינו את הקוד שקיבלתם מהשותף/ה
          </Text>
          <TextInput
            style={styles.codeInput}
            placeholder="XXXX-XXXX-XXXX"
            value={inviteCode}
            onChangeText={(text) => setInviteCode(text.toUpperCase())}
            autoFocus
            autoCapitalize="characters"
            maxLength={14}
            placeholderTextColor={theme.colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="השם שלכם (אופציונלי)"
            value={partnerName}
            onChangeText={setPartnerName}
            placeholderTextColor={theme.colors.textLight}
          />
        </View>
      );
    }
  };

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Check size={64} color={theme.colors.success} />
      </View>
      <Text style={styles.title}>הקוד שלכם מוכן!</Text>
      <Text style={styles.description}>
        שלחו את הקוד הזה לשותף/ה להורות:
      </Text>
      <View style={styles.codeBox}>
        <Text style={styles.codeText}>{generatedCode}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
          {copied ? (
            <Check size={20} color={theme.colors.success} />
          ) : (
            <Copy size={20} color={theme.colors.primary} />
          )}
          <Text style={styles.copyButtonText}>{copied ? 'הועתק!' : 'העתק'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.note}>
        לאחר שהשותף/ה יזין את הקוד, תוכלו להתחיל לתקשר
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {[1, 2, 3, 4, 5].map((dot) => {
            if (connectionType === 'join' && dot === 5) return null;
            return (
              <View
                key={dot}
                style={[
                  styles.dot,
                  step === dot && styles.dotActive,
                ]}
              />
            );
          })}
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            ((step === 3 && !connectionType) ||
            (step === 4 && connectionType === 'create' && !partnerName.trim()) ||
            (step === 4 && connectionType === 'join' && !inviteCode.trim())) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={
            (step === 3 && !connectionType) ||
            (step === 4 && connectionType === 'create' && !partnerName.trim()) ||
            (step === 4 && connectionType === 'join' && !inviteCode.trim())
          }
        >
          <Text style={styles.buttonText}>
            {step === 5 ? 'סיום' : step === 4 && connectionType === 'join' ? 'התחבר' : 'המשך'}
          </Text>
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
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  featureText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  howItWorksContainer: {
    width: '100%',
    gap: theme.spacing.lg,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold' as const,
    color: theme.colors.surface,
  },
  howItWorksText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
    paddingTop: 4,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  note: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  optionButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '10',
  },
  optionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold' as const,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  optionTitleActive: {
    color: theme.colors.text,
  },
  optionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  codeInput: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.xxl,
    color: theme.colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
    fontWeight: 'bold' as const,
    letterSpacing: 2,
  },
  codeBox: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  codeText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    letterSpacing: 3,
    marginBottom: theme.spacing.md,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  copyButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  footer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold' as const,
    color: theme.colors.surface,
  },
});
