import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import {
  CreditCard as Edit,
  Bell,
  Lock,
  FileText,
  Trash2,
  ChevronRight,
  X,
  Camera,
  LogOut,
  Pencil,
  MessageSquareWarning,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { baseUrl } from "@/config";
import axios from "axios";
import { router } from "expo-router";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
}

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Kinley Tshering",
    email: "kinley.tshering@example.com",
    bio: "Literary enthusiast and contributor to Bhutan Echoes community.",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(profileData);
  const [password, setPassword] = useState("");

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(baseUrl + "/delete-account", {
        password: "",
      });
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      Alert.alert("Success", "Account deleted successfully.");
      Toast.show({
        type: "success",
        text1: "Account deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      Toast.show({
        type: "error",
        text1: "Error deleting account. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const profileMenuItems = [
    {
      id: "edit",
      title: "Edit Profile",
      icon: Pencil,
      color: "#48732C",
      onPress: () => setShowEditModal(true),
    },
    {
      id: "notifications",
      title: "Notification Setting",
      icon: Bell,
      color: "#48732C",
      onPress: () =>
        Alert.alert(
          "Notification Settings",
          "Configure your notification preferences"
        ),
    },
    {
      id: "password",
      title: "Change Password",
      icon: Lock,
      color: "#48732C",
      onPress: () =>
        Alert.alert("Change Password", "Update your account password"),
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: FileText,
      color: "#48732C",
      onPress: () =>
        Linking.openURL("https://bhutanechos.srvtechnology.com/public/privacy"),
    },
    {
      id: "report-abuse",
      title: "Report Abuse",
      icon: MessageSquareWarning,
      color: "#48732C",
      onPress: () =>
        Linking.openURL(
          "https://bhutanechos.srvtechnology.com/public/csae-declaration"
        ),
    },
    {
      id: "delete",
      title: "Delete My Account",
      icon: Trash2,
      color: "#48732C",
      onPress: () =>
        Linking.openURL(
          "https://bhutanechos.srvtechnology.com/public/delete-account"
        ),
    },
    {
      id: "logout",
      title: "Log Out",
      icon: LogOut,
      color: "#48732C",
      onPress: () => handleLogout(),
    },
  ];

  const handleSaveProfile = () => {
    setProfileData(editData);
    setShowEditModal(false);
    Alert.alert(
      "Profile Updated",
      "Your profile has been successfully updated."
    );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => console.log("Open camera") },
      { text: "Gallery", onPress: () => console.log("Open gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleChangeProfilePicture}
          >
            <Image
              source={{
                uri: "https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg",
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.cameraOverlay}>
              <Pencil size={20} color="white" />
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{profileData.name}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {profileMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: `${item.color}` },
                  ]}
                >
                  <item.icon size={20} color={"white"} />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    // item.id === "delete" && styles.deleteText,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={25} color="#000" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={false}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Profile Picture */}
            <View style={styles.editProfileImageSection}>
              <TouchableOpacity
                style={styles.editProfileImageContainer}
                onPress={handleChangeProfilePicture}
              >
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg",
                  }}
                  style={styles.editProfileImage}
                  resizeMode="cover"
                />
                <View style={styles.editCameraOverlay}>
                  <Camera size={24} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={styles.changePhotoText}>Tap to change photo</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.name}
                  onChangeText={(text) =>
                    setEditData((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={editData.email}
                  onChangeText={(text) =>
                    setEditData((prev) => ({ ...prev, email: text }))
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.textInput, styles.bioInput]}
                  value={editData.bio}
                  onChangeText={(text) =>
                    setEditData((prev) => ({ ...prev, bio: text }))
                  }
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditData(profileData);
                setShowEditModal(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 21,
    color: "#48732C",
    textAlign: "center",
    fontFamily: "interBold",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#48732C",
    borderRadius: 100,
    padding: 4,
  },
  profileImage: {
    width: 134,
    height: 134,
    borderRadius: 100,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#48732C",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileName: {
    fontSize: 18,
    color: "#48732C",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "interBold",
  },
  profileBio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  menuSection: {
    backgroundColor: "white",
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 33,
    height: 33,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 17,
    color: "#000",
    fontFamily: "interMedium",
  },
  deleteText: {
    color: "#FF3B30",
  },
  bottomSpacing: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalContent: {
    flex: 1,
  },
  editProfileImageSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  editProfileImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#48732C",
  },
  editCameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#48732C",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  changePhotoText: {
    fontSize: 14,
    color: "#48732C",
    fontWeight: "500",
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#48732C",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
