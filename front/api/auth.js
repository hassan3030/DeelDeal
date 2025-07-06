// // Mock API delay
// const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 800))

// // Mock user data
// const MOCK_USERS = [
//   {
//     id: "user1",
//     email: "demo@example.com",
//     password: "Password123",
//     name: "Hassan Hamdi",
//     location: "San Francisco, CA",
//     avatar: "/avatar.png",
//     rating: 4.8,
//     verified: true,
//     createdAt: "2022-01-15T00:00:00Z",
//   },
// ]

// /**
//  * Login user
//  * @param {string} email - User email
//  * @param {string} password - User password
//  * @returns {Promise<Object>} User data
//  */
// export const login = async (email, password) => {
//   try {
//     if (!email || !password) {
//       throw new Error("Email and password are required")
//     }

//     await apiDelay()

//     const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

//     if (!user) {
//       throw new Error("Invalid credentials")
//     }

//     // Don't return password
//     const { password: _, ...userWithoutPassword } = user

//     // Store in localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("deeldeal_user", JSON.stringify(userWithoutPassword))
//     }

//     return userWithoutPassword
//   } catch (error) {
//     console.error("Login error:", error)
//     throw error
//   }
// }

// /**
//  * Register new user
//  * @param {string} email - User email
//  * @param {string} password - User password
//  * @param {Object} userData - Additional user data
//  * @returns {Promise<Object>} User data
//  */
// export const register = async (email, password, userData) => {
//   try {
//     if (!email || !password) {
//       throw new Error("Email and password are required")
//     }

//     await apiDelay()

//     // Check if user exists
//     if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
//       throw new Error("User already exists")
//     }

//     // Create new user
//     const newUser = {
//       id: `user${Date.now()}`,
//       email,
//       password,
//       name: userData?.name || "New User",
//       location: userData?.location || "Unknown",
//       avatar: `/placeholder.svg?height=40&width=40&text=${userData?.name?.charAt(0) || "N"}${userData?.name?.split(" ")[1]?.charAt(0) || "U"}`,
//       rating: 0,
//       verified: false,
//       createdAt: new Date().toISOString(),
//     }

//     // In a real app, you would add the user to your database
//     // MOCK_USERS.push(newUser)

//     // Don't return password
//     const { password: _, ...userWithoutPassword } = newUser

//     // Store in localStorage
//     if (typeof window !== "undefined") {
//       localStorage.setItem("deeldeal_user", JSON.stringify(userWithoutPassword))
//     }

//     return userWithoutPassword
//   } catch (error) {
//     console.error("Register error:", error)
//     throw error
//   }
// }

// /**
//  * Logout user
//  * @returns {Promise<void>}
//  */
// export const logout = async () => {
//   try {
//     await apiDelay()
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("deeldeal_user")
//     }
//     return true
//   } catch (error) {
//     console.error("Logout error:", error)
//     throw error
//   }
// }

// /**
//  * Check if user is authenticated
//  * @returns {Promise<Object|null>} User data or null
//  */
// export const checkAuth = async () => {
//   try {
//     await apiDelay()
//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("deeldeal_user")
//       if (storedUser) {
//         return JSON.parse(storedUser)
//       }
//     }
//     return null
//   } catch (error) {
//     console.error("Auth check error:", error)
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("deeldeal_user")
//     }
//     return null
//   }
// }
