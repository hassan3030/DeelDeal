/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  try {
    // In a real app, this would be a real API call
    // For now, we'll simulate it with a mock

    // Uncomment this for real API integration
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock user data
    const MOCK_USERS = [
      {
        id: "user1",
        email: "demo@example.com",
        password: "Password123",
        name: "Demo User",
        location: "San Francisco, CA",
        avatar: "/placeholder.svg?height=40&width=40&text=DU",
        rating: 4.8,
        verified: true,
        createdAt: "2022-01-15T00:00:00Z",
      },
    ]

    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Don't return password
    const { password: _, ...userWithoutPassword } = user

    // Generate mock token
    const token = `mock_token_${Date.now()}`

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("deeldeal_token", token)
      localStorage.setItem("deeldeal_user", JSON.stringify(userWithoutPassword))
    }

    return {
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

/**
 * Login with Google
 * @returns {Promise<Object>} User data and token
 */
export const loginWithGoogle = async () => {
  try {
    // In a real app, this would use the Google SDK
    // For now, we'll simulate it with a mock

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Mock user data for Google login
    const googleUser = {
      id: "google_user1",
      email: "google_user@example.com",
      name: "Google User",
      location: "Mountain View, CA",
      avatar: "/placeholder.svg?height=40&width=40&text=GU",
      rating: 4.5,
      verified: true,
      createdAt: new Date().toISOString(),
      provider: "google",
    }

    // Generate mock token
    const token = `mock_google_token_${Date.now()}`

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("deeldeal_token", token)
      localStorage.setItem("deeldeal_user", JSON.stringify(googleUser))
    }

    return {
      success: true,
      user: googleUser,
      token,
    }
  } catch (error) {
    console.error("Google login error:", error)
    throw error
  }
}

/**
 * Login with Facebook
 * @returns {Promise<Object>} User data and token
 */
export const loginWithFacebook = async () => {
  try {
    // In a real app, this would use the Facebook SDK
    // For now, we'll simulate it with a mock

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Mock user data for Facebook login
    const facebookUser = {
      id: "facebook_user1",
      email: "facebook_user@example.com",
      name: "Facebook User",
      location: "Menlo Park, CA",
      avatar: "/placeholder.svg?height=40&width=40&text=FB",
      rating: 4.7,
      verified: true,
      createdAt: new Date().toISOString(),
      provider: "facebook",
    }

    // Generate mock token
    const token = `mock_facebook_token_${Date.now()}`

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("deeldeal_token", token)
      localStorage.setItem("deeldeal_user", JSON.stringify(facebookUser))
    }

    return {
      success: true,
      user: facebookUser,
      token,
    }
  } catch (error) {
    console.error("Facebook login error:", error)
    throw error
  }
}

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} userData - Additional user data
 * @returns {Promise<Object>} User data and token
 */
export const register = async (email, password, userData) => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.post('/auth/register', { email, password, ...userData });
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if user exists (mock)
    const MOCK_USERS = [
      {
        id: "user1",
        email: "demo@example.com",
        password: "Password123",
        name: "Demo User",
        location: "San Francisco, CA",
        avatar: "/placeholder.svg?height=40&width=40&text=DU",
        rating: 4.8,
        verified: true,
        createdAt: "2022-01-15T00:00:00Z",
      },
    ]

    if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("User already exists")
    }

    // Create new user
    const newUser = {
      id: `user${Date.now()}`,
      email,
      password,
      name: userData?.name || "New User",
      location: userData?.location || "Unknown",
      avatar: `/placeholder.svg?height=40&width=40&text=${userData?.name?.charAt(0) || "N"}${userData?.name?.split(" ")[1]?.charAt(0) || "U"}`,
      rating: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // Don't return password
    const { password: _, ...userWithoutPassword } = newUser

    // Generate mock token
    const token = `mock_token_${Date.now()}`

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("deeldeal_token", token)
      localStorage.setItem("deeldeal_user", JSON.stringify(userWithoutPassword))
    }

    return {
      user: userWithoutPassword,
      token,
    }
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

/**
 * Logout user
 * @returns {Promise<boolean>} Success status
 */
export const logout = async () => {
  try {
    // In a real app, this would be a real API call
    // await api.post('/auth/logout');

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("deeldeal_token")
      localStorage.removeItem("deeldeal_user")
    }

    return true
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<Object|null>} User data or null
 */
export const checkAuth = async () => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.get('/auth/me');
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("deeldeal_token")
      const storedUser = localStorage.getItem("deeldeal_user")

      if (token && storedUser) {
        return JSON.parse(storedUser)
      }
    }

    return null
  } catch (error) {
    console.error("Auth check error:", error)
    if (typeof window !== "undefined") {
      localStorage.removeItem("deeldeal_token")
      localStorage.removeItem("deeldeal_user")
    }
    return null
  }
}

/**
 * Reset password request
 * @param {string} email - User email
 * @returns {Promise<boolean>} Success status
 */
export const resetPasswordRequest = async (email) => {
  try {
    // In a real app, this would be a real API call
    // await api.post('/auth/reset-password-request', { email });

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    return true
  } catch (error) {
    console.error("Reset password request error:", error)
    throw error
  }
}

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<boolean>} Success status
 */
export const resetPassword = async (token, password) => {
  try {
    // In a real app, this would be a real API call
    // await api.post('/auth/reset-password', { token, password });

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    return true
  } catch (error) {
    console.error("Reset password error:", error)
    throw error
  }
}
