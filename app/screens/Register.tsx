import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const handleRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password || !confirm) {
      Alert.alert("Validasi", "Semua field wajib diisi");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Validasi", "Konfirmasi password tidak cocok");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validasi", "Password minimal 6 karakter");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      Alert.alert("Validasi", "Format email tidak valid");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        trimmedEmail,
        password
      );
      console.log("Register success:", cred.user.uid);
      Alert.alert("Sukses", "Akun berhasil dibuat. Silakan login.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      console.error("Register error:", error);
      let msg = "Gagal membuat akun.";
      switch (error.code) {
        case "auth/email-already-in-use":
          msg = "Email sudah digunakan.";
          break;
        case "auth/invalid-email":
          msg = "Format email tidak valid.";
          break;
        case "auth/weak-password":
          msg = "Password terlalu lemah.";
          break;
      }
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register to start saving movies</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Password"
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              style={styles.input}
              placeholder="Repeat password"
              secureTextEntry
            />
          </View>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#4A90E2"
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Register</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  innerContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  headerContainer: { marginBottom: 32, alignItems: "center" },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#7F8C8D" },
  formContainer: { width: "100%" },
  inputContainer: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#2C3E50", marginBottom: 8 },
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
  loader: { marginTop: 10 },
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  linkButton: { marginTop: 20, alignItems: "center" },
  linkText: { color: "#4A90E2", fontSize: 14, fontWeight: "600" },
});
