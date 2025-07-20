import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Bell } from "lucide-react-native";

interface Notification {
  id: string;
  userName: string;
  message: string;
  timestamp: string;
  avatar: string;
  isRead: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      userName: "Kinley",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "10:30am",
      avatar: "K",
      isRead: false,
    },
    {
      id: "2",
      userName: "Tshering",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "01:00pm",
      avatar: "T",
      isRead: false,
    },
    {
      id: "3",
      userName: "Admin",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "10:30am",
      avatar: "A",
      isRead: false,
    },
    {
      id: "4",
      userName: "Kinley",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "01:00pm",
      avatar: "K",
      isRead: false,
    },
    {
      id: "5",
      userName: "Tshering",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "Yesterday",
      avatar: "T",
      isRead: true,
    },
    {
      id: "6",
      userName: "Admin",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "Yesterday",
      avatar: "A",
      isRead: true,
    },
    {
      id: "7",
      userName: "Kinley",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "Yesterday",
      avatar: "K",
      isRead: true,
    },
    {
      id: "8",
      userName: "Tshering",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "16/07/2025",
      avatar: "T",
      isRead: true,
    },
    {
      id: "9",
      userName: "Admin",
      message:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      timestamp: "13/07/2025",
      avatar: "A",
      isRead: true,
    },
  ]);

  const getAvatarColor = (userName: string) => {
    const colors = {
      Kinley: "#4A90E2",
      Tshering: "#4C904C",
      Admin: "#9B59B6",
    };
    return colors[userName as keyof typeof colors] || "#666";
  };

  const handleNotificationPress = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(notification.id)}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: getAvatarColor(notification.userName) },
        ]}
      >
        <Text style={styles.avatarText}>{notification.avatar}</Text>
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.userName}>{notification.userName}</Text>
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
        </View>
        <Text style={styles.message} numberOfLines={3}>
          {notification.message}
        </Text>
      </View>

      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#4C904C" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map(renderNotification)}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4C904C",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  unreadNotification: {
    backgroundColor: "#f8fffe",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 14,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  unreadDot: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4C904C",
  },
  bottomSpacing: {
    height: 100,
  },
});
