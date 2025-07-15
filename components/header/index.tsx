import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Bell, MoveLeft } from "lucide-react-native";
import { router } from "expo-router";

const Header = ({ title, back = true }: { title: string; back?: boolean }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {Platform.OS === "ios" && back && (
          <TouchableOpacity onPress={() => router.back()}>
            <MoveLeft size={24} color={"#48732C"} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={"#48732C"} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#48732C",
    fontFamily: "interBold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginLeft: 5,
    flexShrink: 1,
  },
  headerRight: {
    position: "relative",
    marginLeft: 10,
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -10,
    right: -15,
    backgroundColor: "#BF0A0A",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "inter",
  },
});

export default Header;
