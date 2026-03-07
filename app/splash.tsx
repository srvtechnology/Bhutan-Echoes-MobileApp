import { View, StyleSheet, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { theme } from "@/theme/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/(tabs)/home");
    }, 3000);
  }, []);

  return (
    <LinearGradient
      colors={[
        theme.colors.primary,
        theme.colors.secondary,
        theme.colors.background,
      ]}
      style={styles.container}
    >
      {/* <ImageBackground
        source={require("../assets/images/bg.png")}
        style={styles.imageContainer}
        resizeMode="cover"
      > */}
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logoStyle}
          resizeMode="contain"
        />
      </View>
      {/* </ImageBackground> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.primary,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logoStyle: {},
});
