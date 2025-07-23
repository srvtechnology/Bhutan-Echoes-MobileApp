import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform, Alert } from "react-native";

class PushNotificationService {
  async requestUserPermission() {
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
      }
    } else {
      // Android permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted");
      }
    }
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  }

  setupNotificationListeners() {
    // Foreground message handler
    messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message:", remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || "New Message",
        remoteMessage.notification?.body || "You have a new message"
      );
    });

    // Background/Quit state message handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background message:", remoteMessage);
    });

    // Handle notification when app is opened from notification
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app:", remoteMessage);
      // Navigate to specific screen if needed
    });

    // Check if app was opened from a notification (when app was completely closed)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("App opened from notification:", remoteMessage);
        }
      });
  }

  // Listen for token refresh
  onTokenRefresh(callback) {
    messaging().onTokenRefresh(callback);
  }
}

export default new PushNotificationService();
