"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "1",
        email,
        name: "John Doe",
      }

      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "1",
        email,
        name,
      }

      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
