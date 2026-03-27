import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

import {signInWithEmailAndPassword} from 'firebase/auth'

import Firebase from '@/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {user, loggedin, setLoggedIn, setUser} = useApp()
  const router = useRouter();

  useEffect(() => {
        if(loggedin) {
            router.replace("/chats")
        }
  },[loggedin])
  const onComplete = () => {
    const emailValue = email;
    const passwordValue = password;
    signInWithEmailAndPassword(Firebase.auth, emailValue, passwordValue).then(async result => {
        if(result) {
            Alert.alert("Welcome back " + emailValue)
        }
    }).catch(e => {
        Alert.alert(e.message)
    })
  };

  const handleGoogleSignIn = () => {

  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>ברוכים השבים</Text>
            <Text style={styles.subtitle}>התחברו לחשבון שלכם</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={theme.colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="אימייל"
                placeholderTextColor={theme.colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="סיסמה"
                placeholderTextColor={theme.colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>התחברות</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>או</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.googleButtonText}>התחברות עם Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push("/register")}
                    activeOpacity={0.8}
                    >
                    <Text style={styles.linkButtonText}>אין חשבון? צרו אחד עכשיו</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    linkButton: {
  paddingVertical: theme.spacing.sm,
  alignItems: "center",
},
linkButtonText: {
  fontSize: theme.fontSize.md,
  fontWeight: "600" as const,
  color: theme.colors.primary,
},

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  form: {
    gap: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    textAlign: 'right',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  primaryButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.surface,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  googleButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  googleButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
});
