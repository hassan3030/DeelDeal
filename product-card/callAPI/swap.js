// ------------- offers and transactions -------------------//

import axios from 'axios';
import {  getCookie , setCookie , decodedToken } from './utiles';
import { getUserByProductId } from './users';
const baseItemsURL = 'http://localhost:8055/items';
const baseURL = 'http://localhost:8055';




// make swap (on cart)
//    1- get user by products my token               back-end
//    2- get owner by products prod id               back-end

//    3- get  my products my token  != available     back-end
//    4- get  owner products prod id  != available   back-end

//    5- store suitable cat                          front
//    6- select items 
//    7- add message to chate                        
//    8- send request to back-end to swap items      back-end

// add to cart 
//    1-view 
//    2-delete item = change price 
//    3- delete all = withdraw delete offers 
//    4-add message to chat 

// display notifications 
//  1-view 
//  2-delete item = change price 
//  3-delete all = rejected offers
//  4-add message to chat
//  5-accepted offers completed 
//  6-store in transctions

 // display chat
//   1-view 
//   2-add message to chat
//   3-delete message 


// get all swaps (offers)


// get all swape by id (offers)

// transactions (completed offers)

// add review (rate , from , to , comment)







// ************************** offer ***************************//

// ----------- Offers API -----------

// Get all offers
export const getAllOffers = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offers`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offers:', err);
    throw new Error('The API is not responding');
  }
};

// Get offers by from_user_id
export const getOfferById = async (id) => {
  if (!id) throw new Error("User ID is required");
  try {
    const response = await axios.get(`${baseItemsURL}/Offers?filter[from_user_id][_eq]=${id}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offers:', err);
    throw new Error('The API is not responding');
  }
};

// Get offers by to_user_id (notifications)
export const getOffersNotifications = async (id) => {
  if (!id) throw new Error("User ID is required");
  try {
    const response = await axios.get(`${baseItemsURL}/Offers?filter[to_user_id][_eq]=${id}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offers Notifications:', err);
    throw new Error('The API is not responding');
  }
};

// Get Offer_Items by offer_id
export const getItemsByOfferId = async (id) => {
  if (!id) throw new Error("Offer ID is required");
  try {
    const items = await axios.get(`${baseItemsURL}/Offer_Items?filter[offer_id][_eq]=${id}`);
    return items.data.data;
  } catch (error) {
    console.error(`Failed to get items from this Offer:`, error);
    throw error;
  }
};

// Delete (reject) an offer by id
export const deleteOfferById = async (id) => {
  try {
    if (!id) throw new Error("Offer ID is required");

    // 1. Get all Offer_Items for this offer
    const items = await getItemsByOfferId(id);
    if (!Array.isArray(items)) throw new Error("Failed to fetch Offer_Items");

    // 2. For each item, set status_swap to 'available' and delete Offer_Item
    for (const item of items) {
      if (!item.item_id || !item.id) {
        console.warn("Invalid Offer_Item object:", item);
        continue;
      }
      await axios.patch(`${baseItemsURL}/Items/${item.item_id}`, {
        status_swap: "available",
      });
      await axios.delete(`${baseItemsURL}/Offer_Items/${item.id}`);
    }

    // 3. Delete related chats
    const chatRes = await axios.get(`${baseItemsURL}/Chat?filter[offer_id][_eq]=${id}`);
    const chats = chatRes.data?.data || [];
    for (const chat of chats) {
      if (chat.id) {
        await axios.delete(`${baseItemsURL}/Chat/${chat.id}`);
      }
    }

    // 4. Set offer status to 'rejected'
    await axios.patch(`${baseItemsURL}/Offers/${id}`, {
      status_offer: "rejected",
    });

    return true;
  } catch (error) {
    console.error(`Delete Offer ${id} error:`, error?.response?.data || error.message || error);
    throw error;
  }
};

// Accept an offer by id
export const acceptedOffer = async (id) => {
  if (!id) throw new Error("Offer ID is required");
  try {
    const response = await axios.patch(`${baseItemsURL}/Offers/${id}`, {
      status_offer: "accepted"
    });
    return response.data.data;
  } catch (error) {
    console.error(`accepted Offer ${id} error:`, error);
    throw error;
  }
};

// Complete an offer (and delete related items)
export const completeOffer = async (id) => {
  if (!id) throw new Error("Offer ID is required");
  try {
    const response = await axios.patch(`${baseItemsURL}/Offers/${id}`, {
      status_offer: "completed"
    });
    const items = await getItemsByOfferId(id);
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.id) {
          await axios.delete(`${baseItemsURL}/Items/${item.id}`);
        }
      }
      // Delete all Offer_Items for this offer
      for (const item of items) {
        if (item.id) {
          await axios.delete(`${baseItemsURL}/Offer_Items/${item.id}`);
        }
      }
    }
    return response.data.data;
  } catch (error) {
    console.error(`completed Offer ${id} error:`, error);
    throw error;
  }
};

// Update offer by id (cash adjustment)
export const updateOfferById = async (id, cash_adjustment) => {
  if (!id) throw new Error("Offer ID is required");
  try {
    const response = await axios.patch(`${baseItemsURL}/Offers/${id}`, {
      cash_adjustment,
    });
    return response.data.data;
  } catch (error) {
    console.error(`Update Offer ${id} error:`, error);
    throw error;
  }
};




// accepted  offer by id 
export const acceptedOfferById = async (id_offer) => {
  const {id} = await decodedToken();
  if (!id_offer) throw new Error("Offer ID is required");
  if (!id) throw new Error("Login is required");
  try {

    const response = await axios.patch(`${baseItemsURL}/Offers/${id}`, {
      status_offer: "accepted",
    });
    return response.data.data;
  } catch (error) {
    console.error(`Update Offer ${id} error:`, error);
    throw error;
  }
};


// completed offer by id 
export const completedOfferById = async (id_offer) => {
   const {id} = await decodedToken();
  if (!id_offer) throw new Error("Offer ID is required");
  if (!id) throw new Error("Login is required");
  try {

    const response = await axios.patch(`${baseItemsURL}/Offers/${id}`, {
      status_offer: "completed",
    });
    return response.data.data;
  } catch (error) {
    console.error(`Update Offer ${id} error:`, error);
    throw error;
  }
};

// Add a new offer
export const addOffer = async (to_user_id, cash_adjustment = 0, user_prods, owner_prods, message) => {
  let offer_id;
  try {
    const token = await getCookie();
    if (!token) throw new Error("No token found");

    const { id } = await decodedToken();
    if (!id) throw new Error("Invalid token");

    // 1. Add offer to Offers table
    const offerRes = await axios.post(`${baseURL}/items/Offers`, {
      from_user_id: id,
      to_user_id,
      cash_adjustment,
      status_offer: "pending",
    });
    offer_id = offerRes.data.data.id;

    const allItems = [...user_prods, ...owner_prods];
    for (const item of allItems) {
      if (!offer_id || !item) {
        console.error("Missing required field:", { offer_id, item });
        break;
      }
      const ownerProduct = await getUserByProductId(item);
      await axios.post(`${baseURL}/items/Offer_Items`, {
        offer_id,
        item_id: item,
        offered_by: ownerProduct.id
      });
    }
    // 3. Update items' status_swap to 'unavailable'
    for (const item of allItems) {
      await axios.patch(`${baseItemsURL}/Items/${item}`, {
        status_swap: "unavailable"
      });
    }
    if (message) {
      await axios.post(`${baseURL}/items/Chat`, {
        from_user_id: id,
        to_user_id,
        offer_id,
        message
      });
    }
    return offer_id;
  } catch (err) {
    console.error('Failed to add offer:', err);
    if (offer_id) await deleteOfferById(offer_id);
    throw err;
  }
};

// Get all Offer_Items
export const getOfferItems = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offer_Items`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offer_Items:', err);
    throw new Error('The API is not responding');
  }
};

// Get Offer_Item by id
export const getOfferItemsById = async (id) => {
  if (!id) throw new Error("Offer_Item ID is required");
  try {
    const response = await axios.get(`${baseItemsURL}/Offer_Items/${id}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offer_Item:', err);
    throw new Error('The API is not responding');
  }
};

// Get Offer_Items by offer_id
export const getOfferItemsByOfferId = async (offer_id) => {
  if (!offer_id) throw new Error("Offer ID is required");
  try {
    const response = await axios.get(`${baseItemsURL}/Offer_Items?filter[offer_id][_eq]=${offer_id}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offer Items:', err);
    throw new Error('The API is not responding');
  }
};

// Delete Offer_Item by its ID
export const deleteOfferItemsById = async (id, idItemItself, cashAdjustment, offer_id) => {
  try {
    if (!id || !idItemItself) throw new Error("Offer_Item ID is required for deletion.");
    await axios.patch(`${baseItemsURL}/Items/${idItemItself}`, {
      status_swap: "available"
    });
    await axios.delete(`${baseItemsURL}/Offer_Items/${id}`);
    // Only update cashAdjustment if it's a valid number
    if (cashAdjustment !== null && cashAdjustment !== undefined && !isNaN(cashAdjustment)) {
    const patchRes = await axios.patch(`${baseItemsURL}/Offers/${offer_id}`, {
  cash_adjustment: cashAdjustment
});
console.log("PATCH response:", patchRes.data);
    }
  } catch (err) {
    console.error('Failed to delete Offer_Item:', err?.response?.data || err.message || err);
    throw new Error('Failed to delete Offer_Item');
  }
};

// Update Offer_Item by id (add your update fields as needed)
export const updateOfferItemsById = async (id, updateData = {}) => {
  if (!id) throw new Error("Offer_Item ID is required");
  try {
    const response = await axios.patch(`${baseItemsURL}/Offer_Items/${id}`, updateData);
    return response.data.data;
  } catch (err) {
    console.error('Failed to update Offer_Item:', err);
    throw new Error('The API is not responding');
  }
};

// Add chat 
export const addMessage = async (message , to_user_id , offer_id  ) => {
  if (!message) return null;
  const {id} = await decodedToken();
  try {
    const response = await axios.post(`${baseItemsURL}/Chat`, {
      from_user_id: id,
      to_user_id,
      offer_id,
      message
    });
    return response.data.data;
  } catch (err) {
    console.error('Failed to update Message:', err);
    throw new Error('The API is not responding');
  }
};






// Get chat by id 
export const getMessage = async (offer_id ) => {

  try {
    const response = await axios.get(`${baseItemsURL}/Chat?filter[offer_id][_eq]=${offer_id}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to update Message:', err);
    throw new Error('The API is not responding');
  }
};


// Get chat
export const getAllMessage = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/Chat`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to update Message:', err);
    throw new Error('The API is not responding');
  }
};



// ---------------Add wishList -------------------------

// Add wishList 
export const addWishList = async (item_id  , user_id ) => {
  
  try {
    const response = await axios.post(`${baseItemsURL}/WishList`, {
     item_id,
      user_id
    });
    return response.data.data;
  } catch (err) {
    console.error('Failed to update WishList:', err);
    throw new Error('The API is not responding');
  }
};






// Get wishList by  user_id
export const getWishList = async (user_id) => {

  try {
    const response = await axios.get(`${baseItemsURL}/WishList?filter[user_id][_eq]=${user_id}`);
    if (!response.data || !response.data.data) {
      return [];
    }
    else{

      return response.data.data;
    }
  } catch (err) {
    console.error('Failed to update WishList:', err);
    throw new Error('The API is not responding');
  }
};


// Get wishList 
export const getAllWishList = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/WishList`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to update WishList:', err);
    throw new Error('The API is not responding');
  }
};




// Delete wishList by id
export const deleteWishList = async (id) => {

  try {
     await axios.delete(`${baseItemsURL}/WishList/${id}`);
  } catch (err) {
    console.error('Failed to update WishList:', err);
    throw new Error('The API is not responding');
  }
};







// ---------------Add wishList -------------------------

// Add wishList 
export const addReview = async (from_user_id , to_user_id , offer_id , rating , comment) => {
  if(!comment) comment = "No comment";
  try {
    const response = await axios.post(`${baseItemsURL}/Reviews`, {
  from_user_id , to_user_id , offer_id , rating , comment
    });
    return response.data.data;
  } catch (err) {
    console.error('Failed to update Reviews:', err);
    throw new Error('The API is not responding');
  }
};


export const getReview = async (to_user_id) => {
  try {
    const response = await axios.get(`${baseItemsURL}/Reviews/?filter[to_user_id][_eq]=${to_user_id}`)
    return response.data.data;
  } catch (err) {
    console.error('Failed to update Reviews:', err);
    throw new Error('The API is not responding');
  }
};
