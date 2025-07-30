import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Please fill all the fields",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password does not match",
      });
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axiosInstance.post(
        baseUrl + "/profile",
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Password", data);
      Toast.show({
        type: "success",
        text1: data.message,
      });
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {Platform.OS === "ios" && (
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <MoveLeft size={24} color={"#48732C"} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Password Setting</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Confirm Old Password</Text>
        <TextInput
          placeholder="Confirm Old Password"
          style={styles.input}
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
          secureTextEntry
        />
        <Text style={styles.formLabel}>Enter New Password</Text>
        <TextInput
          placeholder="Enter New Password"
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <Text style={styles.formLabel}>Confirm New Password</Text>
        <TextInput
          placeholder="Confirm New Password"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
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
  },
  formLabel: {
    fontSize: 16,
    fontFamily: "interMedium",
    color: "#000",
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: "#ddd",
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "#48732C",
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignSelf: "center",
    borderRadius: 6,
  },
  updateButtonText: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "interMedium",
  },
});
