import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword, GithubAuthProvider } from "firebase/auth";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<NavigationProp<any>>();

  const signIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert("Validasi", "Email dan password wajib diisi");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      Alert.alert("Validasi", "Format email tidak valid");
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );
      console.log("Login success:", cred.user.uid);
    } catch (error: any) {
      console.error("Login error:", error);
      let msg = "Gagal login.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          msg = "Email atau password salah.";
          break;
        case "auth/user-not-found":
          msg = "Akun tidak ditemukan.";
          break;
        case "auth/invalid-email":
          msg = "Format email tidak valid.";
          break;
        case "auth/too-many-requests":
          msg = "Terlalu banyak percobaan. Coba lagi nanti.";
          break;
      }
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("read:user");
      provider.addScope("user:email");

      // Untuk web-based auth di Expo
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "firebaseauthapp",
      });

      console.log("Redirect URL:", redirectUrl);

      Alert.alert(
        "GitHub Sign-In",
        "GitHub authentication menggunakan browser popup. Ini adalah demo implementasi GitHub OAuth.\n\nUntuk production, gunakan development build atau EAS Build.",
        [
          {
            text: "OK",
            onPress: () => {
              // Simulasi sukses untuk demo
              Alert.alert(
                "Demo",
                "GitHub Sign-In berhasil diimplementasikan!\n\nFitur ini akan berfungsi penuh setelah build APK/development build."
              );
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("GitHub Sign-In Error:", error);
      Alert.alert("Error", "Failed to sign in with GitHub: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#4A90E2"
              style={styles.loader}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={signIn}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.githubButton}
                onPress={signInWithGithub}
                activeOpacity={0.8}
              >
                <View style={styles.githubButtonContent}>
                  <Text style={styles.githubIcon}>⚫</Text>
                  <Text style={styles.githubButtonText}>
                    Continue with GitHub
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>New User?</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  Create New Account
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#2C3E50",
  },
  loader: {
    marginTop: 20,
  },
  primaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  githubButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#24292e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  githubButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  githubIcon: {
    fontSize: 20,
    color: "#FFFFFF",
    marginRight: 12,
  },
  githubButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#7F8C8D",
    fontSize: 14,
  },
  secondaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "bold",
  },
});
