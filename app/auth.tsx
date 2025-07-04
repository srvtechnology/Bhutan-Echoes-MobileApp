import {
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import CustomText from "@/components/ui/CustomText";
import axios from "axios";
import { baseUrl } from "../config";
import Toast from "react-native-simple-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateFields = () => {
    if (!email.trim() || !password.trim()) {
      Toast.show(
        "Validation Error, Email and password are required.",
        Toast.LONG,
        {
          tapToDismissEnabled: true,
        }
      );
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show(
        "Validation Error, Please enter a valid email address.",
        Toast.LONG,
        {
          tapToDismissEnabled: true,
        }
      );
      return false;
    }
    if (password.length < 6) {
      Toast.show(
        "Validation Error, Password must be at least 6 characters long.",
        Toast.LONG,
        {
          tapToDismissEnabled: true,
        }
      );
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await axios.post(baseUrl + "/login", {
        email,
        password,
      });

      // Handle success (store token, user data, etc.)
      console.log("Login success:", response.data);
      await AsyncStorage.setItem('token', response.data.token);

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Login error:", error);
      Toast.show(
        "Login Failed " + error.response?.data?.message ||
          "Something went wrong. Please try again.",
        Toast.LONG,
        {
          tapToDismissEnabled: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
   router.push('/signup')
  };

  const handleForgotPassword = () => {
    // Handle forgot password
    console.log("Forgot password");
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/signinBg.png")}
          style={styles.imageContainer}
          resizeMode="cover"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logoStyle}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Sign In Form */}
          <View style={styles.formContainer}>
            <CustomText style={styles.title} variant="interMedium">
              Sign in
            </CustomText>

            <View style={styles.inputContainer}>
              <CustomText style={styles.label} variant="inter">
                Email ID
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder="eg. example@gmail.com"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomText style={styles.label} variant="inter">
                Password
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder="eg. Abc@2025"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
              >
                 {!loading ? <CustomText
                                  style={styles.signInButtonText}
                                  variant="interMedium"
                                >
                                  Sign In
                                </CustomText>
                                
                              : <ActivityIndicator color={'white'}  />}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <CustomText style={styles.forgotPassword} variant="interBold">
                  Forgot Password?
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Account */}
          <View style={styles.createAccountContainer}>
            <CustomText style={styles.createAccountText} variant="inter">
              Don't have an account?
            </CustomText>
            <TouchableOpacity onPress={handleCreateAccount}>
              <CustomText style={styles.createAccountLink} variant="interBold">
                Create New Account
              </CustomText>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoStyle: {},
  logoText: {
    fontSize: 50,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
    marginBottom: 40,
    width: "90%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#222",
    paddingVertical: 8,
    fontSize: 15,
    color: "#333",
    fontFamily: "inter",
    fontStyle: "italic",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  signInButton: {
    backgroundColor: "#48732C",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    width: 120,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "interMedium",
  },
  forgotPassword: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "interMedium",
  },
  createAccountContainer: {
    alignItems: "center",
  },
  createAccountText: {
    color: "white",
    fontSize: 12,
    marginBottom: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    fontFamily: "inter",
  },
  createAccountLink: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
    fontFamily: "interBold",
  },
});
