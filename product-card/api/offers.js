// Mock API delay
const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 800))

// Mock offers data
const MOCK_OFFERS = [
  {
    id: "offer1",
    targetItemId: "1",
    offeredItemIds: ["2"],
    cashAdjustment: 200,
    message: "I'm interested in your MacBook. Would you consider my mountain bike plus $200?",
    status: "pending", // pending, accepted, rejected, completed
    createdBy: "user2",
    createdAt: "2023-05-10T14:30:00Z",
  },
]

/**
 * Get offers by user
 * @param {string} userId - User ID
 * @param {string} type - Type of offers (sent, received, all)
 * @returns {Promise<Array>} Offers
 */
export const getOffersByUser = async (userId, type = "all") => {
  await apiDelay()

  let filteredOffers = [...MOCK_OFFERS]

  if (type === "sent") {
    filteredOffers = filteredOffers.filter((offer) => offer.createdBy === userId)
  } else if (type === "received") {
    // This would require joining with items to find offers for items owned by the user
    // For simplicity, we'll just return an empty array
    return []
  }

  return filteredOffers
}

/**
 * Get offer by ID
 * @param {string} id - Offer ID
 * @returns {Promise<Object>} Offer
 */
export const getOfferById = async (id) => {
  await apiDelay()

  const offer = MOCK_OFFERS.find((offer) => offer.id === id)

  if (!offer) {
    throw new Error("Offer not found")
  }

  return offer
}

/**
 * Create new offer
 * @param {Object} offerData - Offer data
 * @returns {Promise<Object>} Created offer
 */
export const createOffer = async (offerData) => {
  await apiDelay()

  const newOffer = {
    id: `offer${Date.now()}`,
    ...offerData,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // In a real app, you would add the offer to your database
  // MOCK_OFFERS.push(newOffer)

  return newOffer
}

/**
 * Update offer status
 * @param {string} id - Offer ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated offer
 */
export const updateOfferStatus = async (id, status) => {
  await apiDelay()

  const offerIndex = MOCK_OFFERS.findIndex((offer) => offer.id === id)

  if (offerIndex === -1) {
    throw new Error("Offer not found")
  }

  // Update offer
  const updatedOffer = {
    ...MOCK_OFFERS[offerIndex],
    status,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would update the offer in your database
  // MOCK_OFFERS[offerIndex] = updatedOffer

  return updatedOffer
}

/**
 * Delete offer
 * @param {string} id - Offer ID
 * @returns {Promise<boolean>} Success
 */
export const deleteOffer = async (id) => {
  await apiDelay()

  const offerIndex = MOCK_OFFERS.findIndex((offer) => offer.id === id)

  if (offerIndex === -1) {
    throw new Error("Offer not found")
  }

  // In a real app, you would delete the offer from your database
  // MOCK_OFFERS = MOCK_OFFERS.filter(offer => offer.id !== id)

  return true
}
