import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomText from "@/components/ui/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    const isToken = await AsyncStorage.getItem("token");

    router.push(isToken ? "/(tabs)/home" : "/auth");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg.png")}
        style={styles.imageContainer}
        resizeMode="cover"
      >
        {/* <LinearGradient
        colors={['#4A90E2', '#7B68EE', '#FF6B6B']}
        style={styles.background}
      > */}
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

        {/* Content */}
        <View style={styles.content}>
          <CustomText style={styles.welcomeText} variant="inter">
            Welcome to
          </CustomText>
          <CustomText style={styles.titleText} variant="interBold">
            Bhutan Echoes
          </CustomText>
          <CustomText style={styles.subtitleText} variant="inter">
            A year-round initiative of Drukyul’s Literature Festival, nurtures a
            literary culture in Bhutan through a range of digital and in-person
            programs and projects.
          </CustomText>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <CustomText style={styles.buttonText} variant="interMedium">
            Get Started
          </CustomText>
        </TouchableOpacity>
        {/* </LinearGradient> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
  },
  background: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoStyle: {},
  content: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  welcomeText: {
    fontSize: 20,
    color: "white",
    fontWeight: "300",
    marginBottom: 10,
    textAlign: "center",
  },
  titleText: {
    fontSize: 38,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 19,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "300",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#48732C",
    paddingVertical: 14,
    width: "85%",
    marginHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
});
