import { useEffect } from "react";
import { router, Redirect } from "expo-router";
import PushNotificationService from "../helpers/pushNotifications";

export default function Index() {
  useEffect(() => {
    const initializePushNotifications = async () => {
      // Request permission
      await PushNotificationService.requestUserPermission();

      // Get FCM token
      const token = await PushNotificationService.getFCMToken();

      // Setup listeners
      PushNotificationService.setupNotificationListeners();

      // Listen for token refresh
      PushNotificationService.onTokenRefresh((token) => {
        console.log("Token refreshed:", token);
        // Send new token to your server
      });
    };

    initializePushNotifications();
    router.replace("/splash");
  }, []);

  return null;
}
