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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "@/config";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { MoveLeft } from "lucide-react-native";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(baseUrl + "/profile", {
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
      const { data } = await axios.put(
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.back}
          >
            <MoveLeft size={24} color={"#48732C"} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Name</Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
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
