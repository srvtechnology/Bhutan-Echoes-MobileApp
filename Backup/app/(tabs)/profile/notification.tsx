import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "@/config";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import axiosInstance from "@/helpers/axiosInstance";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axiosInstance.get(baseUrl + "/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User", data);
      setName(data.user.name);
      setEmail(data.user.email);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axiosInstance.put(
        baseUrl + "/profile-info-update",
        {
          name,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User", data);
      Toast.show({
        type: "success",
        text1: data.message,
      });
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  });
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {Platform.OS === "ios" && (
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <MoveLeft size={24} color={"#48732C"} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Notification</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#48732C" }}
          thumbColor={isEnabled ? "white" : "#ddd"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <Text style={styles.formDesc}>
        By turning off the notification you will not get any notification from
        Bhutan Echoes.{" "}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    position: "relative",
  },
  back: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 50,
  },
  headerTitle: {
    fontSize: 21,
    color: "#48732C",
    textAlign: "center",
    fontFamily: "interBold",
  },
  formContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formLabel: {
    fontSize: 16,
    fontFamily: "interMedium",
    color: "#000",
    marginBottom: 10,
  },
  formDesc: {
    fontSize: 14,
    fontFamily: "inter",
    color: "#939393",
    paddingHorizontal: 20,
  },
});
