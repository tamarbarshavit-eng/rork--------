import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { useApp } from "@/contexts/AppContext";
import { useRouter } from "expo-router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

import Firebase from "@/firebase";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { loggedin, setLoggedIn, setUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (loggedin) router.replace("/chats");
  }, [loggedin, router]);

  const onRegister = async () => {
    const emailValue = email.trim();
    const passwordValue = password;

    if (!emailValue) return Alert.alert("שגיאה", "נא להזין אימייל");
    if (passwordValue.length < 6)
      return Alert.alert("שגיאה", "הסיסמה חייבת להכיל לפחות 6 תווים");
    if (passwordValue !== confirmPassword)
      return Alert.alert("שגיאה", "אימות הסיסמה לא תואם");

    try {
      const result = await createUserWithEmailAndPassword(
        Firebase.auth,
        emailValue,
        passwordValue
      );

      const userObj = {
        uid: result.user.uid,
        email: emailValue,
        createdAt: Date.now(),
      };

      // Recommended path: users/{uid}
      await set(ref(Firebase.db, `users/${result.user.uid}`), userObj);

      setUser(userObj);
      setLoggedIn(true);

      router.replace("/chats");
    } catch (e: any) {
      Alert.alert("שגיאה", e?.message ?? "Registration failed");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>יצירת חשבון</Text>
            <Text style={styles.subtitle}>פתחו חשבון חדש והתחילו</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail
                size={20}
                color={theme.colors.textLight}
                style={styles.inputIcon}
              />
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
              <Lock
                size={20}
                color={theme.colors.textLight}
                style={styles.inputIcon}
              />
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

            <View style={styles.inputContainer}>
              <Lock
                size={20}
                color={theme.colors.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="אימות סיסמה"
                placeholderTextColor={theme.colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>יצירת חשבון</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.linkButtonText}>כבר יש לך חשבון? התחברי</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "700" as const,
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
    flexDirection: "row",
    alignItems: "center",
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
    textAlign: "right",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  primaryButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600" as const,
    color: theme.colors.surface,
  },
  linkButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
  },
  linkButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: "600" as const,
    color: theme.colors.primary,
  },
});
