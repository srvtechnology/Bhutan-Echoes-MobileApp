"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from "react-native"
import {X} from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"

export type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [animation] = useState(new Animated.Value(0))

  useEffect(() => {
    if (toasts.length > 0) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [toasts, animation])

  const showToast = (message: string, type: ToastType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, message, type, duration }
    setToasts((prevToasts) => [...prevToasts, newToast])

    if (duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, duration)
    }
  }

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return theme.colors.success
      case "error":
        return theme.colors.error
      case "warning":
        return theme.colors.warning
      case "info":
      default:
        return theme.colors.primary
    }
  }

  // Web implementation
  if (Platform.OS === "web") {
    return (
      <ToastContext.Provider value={{ showToast, hideToast }}>
        {children}
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                backgroundColor: "white",
                borderLeftWidth: 4,
                borderLeftColor: getToastColor(toast.type),
                borderRadius: 4,
                padding: 16,
                marginBottom: 8,
                minWidth: 300,
                maxWidth: 400,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>{toast.message}</div>
              <div style={{ cursor: "pointer", padding: 4 }} onClick={() => hideToast(toast.id)}>
                <X width={16} height={16} color="#666666" />
              </div>
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    )
  }

  // Native implementation
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={styles.toastContainer}>
        {toasts.map((toast) => (
          <Animated.View
            key={toast.id}
            style={[
              styles.toast,
              {
                opacity: animation,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
                borderLeftColor: getToastColor(toast.type),
              },
            ]}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
            <TouchableOpacity onPress={() => hideToast(toast.id)} style={styles.closeButton}>
              <X width={16} height={16} color="#666666" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: "white",
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    minWidth: 300,
    maxWidth: 400,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    color: "#444444",
  },
  closeButton: {
    padding: 4,
  },
})
