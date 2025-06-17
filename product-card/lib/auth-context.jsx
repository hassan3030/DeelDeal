"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import environment from "../config/environment"
import api from "../callAPI/config"
import { authAPI } from "../callAPI"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(environment.userDataName)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error("Error initializing auth:", err)
        // Clear potentially corrupted data
        localStorage.removeItem(environment.authTokenName)
        localStorage.removeItem(environment.userDataName)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(credentials.email, credentials.password)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.message || "Login failed. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.loginWithGoogle()
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.message || "Google login failed. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Login with Facebook
  const loginWithFacebook = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.loginWithFacebook()
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.message || "Facebook login failed. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.register(userData.email, userData.password, userData)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.message || "Registration failed. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
      router.push("/auth/login")
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || "Logout failed. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.put("/users/profile", profileData)
      const updatedUser = response.data

      // Update stored user data
      localStorage.setItem(environment.userDataName, JSON.stringify(updatedUser))

      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Profile update failed. Please try again."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false
  }

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
