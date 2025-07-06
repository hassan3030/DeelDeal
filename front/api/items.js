// Mock API delay
const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 800))

// Mock items data
const MOCK_ITEMS = [
  {
    id: "1",
    name: 'MacBook Pro 16" 2021 M1 Pro',
    description:
      "Excellent condition MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD. Includes charger and original box.",
    images: ["/placeholder.svg?height=400&width=400&text=MacBook+Pro"],
    category: "Electronics",
    valueEstimate: 1800,
    allowedCategories: ["Electronics", "RealEstate", "Vehicles"],
    ownerId: "user1",
    location: "San Francisco, CA",
    createdAt: "2023-04-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Mountain Bike - Trek Fuel EX 8",
    description:
      "2022 Trek Fuel EX 8 mountain bike, size large. Great condition with minor scratches. Perfect for trail riding.",
    images: ["/placeholder.svg?height=400&width=400&text=Mountain+Bike"],
    category: "Sports",
    valueEstimate: 2500,
    allowedCategories: ["Sports", "Electronics", "Furniture"],
    ownerId: "user2",
    location: "Denver, CO",
    createdAt: "2023-04-20T09:15:00Z",
  },
]

/**
 * Get all items
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Items
 */
export const getItems = async (filters = {}) => {
  await apiDelay()

  let filteredItems = [...MOCK_ITEMS]

  // Apply filters
  if (filters.category) {
    filteredItems = filteredItems.filter((item) => item.category === filters.category)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredItems = filteredItems.filter(
      (item) => item.name.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower),
    )
  }

  if (filters.ownerId) {
    filteredItems = filteredItems.filter((item) => item.ownerId === filters.ownerId)
  }

  return filteredItems
}

/**
 * Get item by ID
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Item
 */
export const getItemById = async (id) => {
  await apiDelay()

  const item = MOCK_ITEMS.find((item) => item.id === id)

  if (!item) {
    throw new Error("Item not found")
  }

  return item
}

/**
 * Create new item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created item
 */
export const createItem = async (itemData) => {
  await apiDelay()

  const newItem = {
    id: `item${Date.now()}`,
    ...itemData,
    createdAt: new Date().toISOString(),
  }

  // In a real app, you would add the item to your database
  // MOCK_ITEMS.push(newItem)

  return newItem
}

/**
 * Update item
 * @param {string} id - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} Updated item
 */
export const updateItem = async (id, itemData) => {
  await apiDelay()

  const itemIndex = MOCK_ITEMS.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    throw new Error("Item not found")
  }

  // Update item
  const updatedItem = {
    ...MOCK_ITEMS[itemIndex],
    ...itemData,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would update the item in your database
  // MOCK_ITEMS[itemIndex] = updatedItem

  return updatedItem
}

/**
 * Delete item
 * @param {string} id - Item ID
 * @returns {Promise<boolean>} Success
 */
export const deleteItem = async (id) => {
  await apiDelay()

  const itemIndex = MOCK_ITEMS.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    throw new Error("Item not found")
  }

  // In a real app, you would delete the item from your database
  // MOCK_ITEMS = MOCK_ITEMS.filter(item => item.id !== id)

  return true
}
