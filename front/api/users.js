// Mock API delay
const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 800))

// Mock users data
const MOCK_USERS = [
  {
    id: "user1",
    email: "demo@example.com",
    name: "Demo User",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=40&width=40&text=DU",
    rating: 4.8,
    verified: true,
    createdAt: "2022-01-15T00:00:00Z",
  },
  {
    id: "user2",
    email: "sarah@example.com",
    name: "Sarah Miller",
    location: "Denver, CO",
    avatar: "/placeholder.svg?height=40&width=40&text=SM",
    rating: 4.9,
    verified: true,
    createdAt: "2022-02-20T00:00:00Z",
  },
]

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User
 */
export const getUserById = async (id) => {
  await apiDelay()

  const user = MOCK_USERS.find((user) => user.id === id)

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

/**
 * Update user profile
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUserProfile = async (id, userData) => {
  await apiDelay()

  const userIndex = MOCK_USERS.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Update user
  const updatedUser = {
    ...MOCK_USERS[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would update the user in your database
  // MOCK_USERS[userIndex] = updatedUser

  // Update localStorage if this is the current user
  const storedUser = localStorage.getItem("deeldeal_user")
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.id === id) {
      localStorage.setItem("deeldeal_user", JSON.stringify(updatedUser))
    }
  }

  return updatedUser
}

/**
 * Get user ratings
 * @param {string} id - User ID
 * @returns {Promise<Array>} Ratings
 */
export const getUserRatings = async (id) => {
  await apiDelay()

  // Mock ratings
  return [
    {
      id: "rating1",
      userId: id,
      ratedBy: "user2",
      raterName: "Sarah Miller",
      rating: 5,
      comment: "Great trader! Item was exactly as described.",
      createdAt: "2023-03-15T14:30:00Z",
    },
    {
      id: "rating2",
      userId: id,
      ratedBy: "user3",
      raterName: "John Doe",
      rating: 4,
      comment: "Good communication and fast transaction.",
      createdAt: "2023-02-10T09:15:00Z",
    },
  ]
}
