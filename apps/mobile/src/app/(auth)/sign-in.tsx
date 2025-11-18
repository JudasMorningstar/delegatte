import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLink = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signIn.magicLink({
        email,
      });

      if (result.error) {
        Alert.alert(
          "Error",
          result.error.message || "Failed to send magic link",
        );
        return;
      }

      setMagicLinkSent(true);
    } catch (err: any) {
      console.error("Magic link error:", err);
      Alert.alert("Error", err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        Alert.alert("Error", result.error.message || "Failed to sign in");
        return;
      }

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Sign in error:", err);
      Alert.alert("Error", err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setMagicLinkSent(false);
    setEmail("");
  };

  // Success screen after magic link is sent
  if (magicLinkSent) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons name="mail" size={64} color="#c03484" />
            </View>

            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successSubtitle}>We sent a magic link to</Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.instructionsBox}>
              <View style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.instructionText}>
                  Open the email we just sent
                </Text>
              </View>

              <View style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.instructionText}>Click the magic link</Text>
              </View>

              <View style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.instructionText}>
                  You&apos;ll be signed in automatically
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleTryAgain}
            >
              <Text style={styles.secondaryButtonText}>
                Use a different email
              </Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              Didn&apos;t receive the email? Check your spam folder
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name={mode === "magic" ? "mail" : "shield-checkmark"}
              size={48}
              color="#c03484"
            />
          </View>
          <Text style={styles.title}>Sign in to Delegatte</Text>
          <Text style={styles.subtitle}>
            {mode === "magic"
              ? "We'll email you a magic link for a password-free sign in"
              : "Enter your email and password to continue"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "magic" && styles.toggleButtonActive,
              ]}
              onPress={() => setMode("magic")}
              disabled={loading}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={mode === "magic" ? "#fff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.toggleText,
                  mode === "magic" && styles.toggleTextActive,
                ]}
              >
                Magic Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "password" && styles.toggleButtonActive,
              ]}
              onPress={() => setMode("password")}
              disabled={loading}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={mode === "password" ? "#fff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.toggleText,
                  mode === "password" && styles.toggleTextActive,
                ]}
              >
                Password
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              autoComplete="email"
              autoFocus
            />
          </View>

          {/* Password Input (only shown in password mode) */}
          {mode === "password" && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={mode === "magic" ? handleMagicLink : handlePasswordSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons
                  name={
                    mode === "magic" ? "paper-plane-outline" : "log-in-outline"
                  }
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {mode === "magic" ? "Send Magic Link" : "Sign In"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Benefits (only for magic link) */}
          {mode === "magic" && (
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>No password required</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>
                  More secure than passwords
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.benefitText}>Sign in with one click</Text>
              </View>
            </View>
          )}

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in")}
              disabled={loading}
            >
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formContainer: {
    width: "100%",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#c03484",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  toggleTextActive: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#c03484",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  benefitsContainer: {
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 12,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  signUpText: {
    color: "#6b7280",
    fontSize: 14,
  },
  signUpLink: {
    color: "#c03484",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
  footerLink: {
    color: "#c03484",
    fontWeight: "500",
  },
  // Success screen styles
  successContainer: {
    alignItems: "center",
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fce7f3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  successSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#c03484",
    marginBottom: 32,
  },
  instructionsBox: {
    width: "100%",
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#c03484",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stepNumberText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
  },
  helpText: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
});
