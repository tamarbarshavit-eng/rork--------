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
  const { joinChat, user } = useApp();

  const [step, setStep] = useState(1);
  const [connectionType, setConnectionType] = useState<'create' | 'join' | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const myCode = user?.uid ?? '';

  const handleContinue = async () => {
    if (step === 1) return setStep(2);
    if (step === 2) return setStep(3);

    if (step === 3 && connectionType) {
      if (connectionType === 'create') return setStep(5);
      return setStep(4);
    }

    if (step === 4 && inviteCode.trim()) {
      try {
        await joinChat(inviteCode.trim());
        // completeOnboarding();
        router.replace('/chats');
      } catch {
        Alert.alert('שגיאה', 'קוד לא תקין');
      }
    }

    if (step === 5) {
      // completeOnboarding();
      router.replace('/chats');
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(myCode);
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
        {[1,2,3,4].map((n) => (
          <View key={n} style={styles.howItWorksItem}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{n}</Text>
            </View>
            <Text style={styles.howItWorksText}>
              {[
                'כתבו את ההודעה שלכם בחופשיות',
                'האפליקציה בודקת שהניסוח מכבד ועניני',
                'תאשרו את הנוסח הסופי לפני השליחה',
                'השותף שלכם מקבל רק הודעות מכבדות',
              ][n-1]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <MessageCircle size={64} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>איך תרצו להתחבר?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, connectionType==='create' && styles.optionButtonActive]}
          onPress={() => setConnectionType('create')}
        >
          <Shield size={32} color={theme.colors.primary} />
          <Text style={styles.optionTitle}>הצג קוד אישי</Text>
          <Text style={styles.optionDescription}>שלחו לשותף/ה</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, connectionType==='join' && styles.optionButtonActive]}
          onPress={() => setConnectionType('join')}
        >
          <MessageCircle size={32} color={theme.colors.primary} />
          <Text style={styles.optionTitle}>הזן קוד קיים</Text>
          <Text style={styles.optionDescription}>קוד שקיבלתם</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <MessageCircle size={64} color={theme.colors.primary} />
      <Text style={styles.title}>הזינו את הקוד</Text>
      <TextInput
        style={styles.codeInput}
        placeholder="Paste UID"
        value={inviteCode}
        onChangeText={setInviteCode}
      />
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Check size={64} color={theme.colors.success} />
      <Text style={styles.title}>הקוד שלכם מוכן!</Text>
      <View style={styles.codeBox}>
        <Text style={styles.codeText}>{myCode}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
          <Copy size={20} color={theme.colors.primary} />
          <Text style={styles.copyButtonText}>{copied ? 'הועתק!' : 'העתק'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step===1 && renderStep1()}
        {step===2 && renderStep2()}
        {step===3 && renderStep3()}
        {step===4 && renderStep4()}
        {step===5 && renderStep5()}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>המשך</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:theme.colors.background},
  scrollContent:{flexGrow:1,padding:theme.spacing.lg},
  stepContainer:{flex:1,alignItems:'center',justifyContent:'center'},
  iconContainer:{marginBottom:theme.spacing.xl},
  title:{fontSize:theme.fontSize.xxl,fontWeight:'bold',color:theme.colors.text,textAlign:'center',marginBottom:theme.spacing.md},
  description:{fontSize:theme.fontSize.md,color:theme.colors.textLight,textAlign:'center',marginBottom:theme.spacing.xl,lineHeight:24},
  featuresContainer:{width:'100%',gap:theme.spacing.md},
  feature:{flexDirection:'row',alignItems:'center',gap:theme.spacing.md,backgroundColor:theme.colors.surface,padding:theme.spacing.md,borderRadius:theme.borderRadius.md},
  featureText:{fontSize:theme.fontSize.md,color:theme.colors.text,flex:1},
  howItWorksContainer:{width:'100%',gap:theme.spacing.lg},
  howItWorksItem:{flexDirection:'row',alignItems:'flex-start',gap:theme.spacing.md},
  numberBadge:{width:32,height:32,borderRadius:16,backgroundColor:theme.colors.primary,alignItems:'center',justifyContent:'center'},
  numberText:{fontSize:theme.fontSize.md,fontWeight:'bold',color:theme.colors.surface},
  howItWorksText:{flex:1,fontSize:theme.fontSize.md,color:theme.colors.text,lineHeight:22,paddingTop:4},
  input:{width:'100%',backgroundColor:theme.colors.surface,borderRadius:theme.borderRadius.md,padding:theme.spacing.md,fontSize:theme.fontSize.lg,color:theme.colors.text,textAlign:'center',borderWidth:2,borderColor:theme.colors.border,marginBottom:theme.spacing.sm},
  optionsContainer:{width:'100%',gap:theme.spacing.md},
  optionButton:{backgroundColor:theme.colors.surface,borderRadius:theme.borderRadius.md,padding:theme.spacing.lg,alignItems:'center',borderWidth:2,borderColor:theme.colors.border},
  optionButtonActive:{borderColor:theme.colors.primary},
  optionTitle:{fontSize:theme.fontSize.lg,fontWeight:'bold',color:theme.colors.text,marginTop:theme.spacing.sm},
  optionDescription:{fontSize:theme.fontSize.sm,color:theme.colors.textLight,textAlign:'center'},
  codeInput:{width:'100%',backgroundColor:theme.colors.surface,borderRadius:theme.borderRadius.md,padding:theme.spacing.md,fontSize:theme.fontSize.xxl,color:theme.colors.text,textAlign:'center',borderWidth:2,borderColor:theme.colors.primary},
  codeBox:{width:'100%',backgroundColor:theme.colors.surface,borderRadius:theme.borderRadius.md,padding:theme.spacing.lg,borderWidth:2,borderColor:theme.colors.primary,alignItems:'center',marginBottom:theme.spacing.md},
  codeText:{fontSize:theme.fontSize.xxl,fontWeight:'bold',color:theme.colors.text,letterSpacing:3,marginBottom:theme.spacing.md},
  copyButton:{flexDirection:'row',alignItems:'center',gap:theme.spacing.xs},
  copyButtonText:{fontSize:theme.fontSize.sm,fontWeight:'bold',color:theme.colors.primary},
  footer:{padding:theme.spacing.lg},
  button:{backgroundColor:theme.colors.primary,borderRadius:theme.borderRadius.md,padding:theme.spacing.md,alignItems:'center'},
  buttonText:{fontSize:theme.fontSize.lg,fontWeight:'bold',color:theme.colors.surface},
});
