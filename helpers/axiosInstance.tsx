import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { baseUrl } from "@/config";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});
console.log("Axios Instance Base URL:", baseUrl);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios Interceptor Error:", error);

    if (error.response && error.response.status === 401) {
      // Remove token and user info
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
      // Show toast message
      Toast.show({
        type: "error",
        text1: "Session expired. Please log in again.",
      });
      // Redirect to login
      router.replace("/auth");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
