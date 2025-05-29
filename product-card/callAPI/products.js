import axios from 'axios';
const baseURLAssets = 'http://localhost:3000/api/product/1';
export const baseItemsURL = 'http://localhost:8055/items';
export const baseURL = 'http://localhost:8055';
import {  getCookie , setCookie , decodedToken } from './utiles';
import { getUserByProductId } from './users';
/**
 * Get all products
 * @param {Object} params - Query parameters
 */
export const getProducts = async (params = {}) => {
  try {
    const token = await getCookie()
    if(!token){
       const products = await axios.get(`${baseItemsURL}/Items?filter[status_swap][_neq]=unavailable`);
        // console.log("callAPI getProducts" , products.data.data) 
        return products.data.data;
    }
    else{
      const {id} =  await decodedToken()
      // not equal  
      //  const products = await axios.get(`${baseItemsURL}/Items`);
    const products = await axios.get(`${baseItemsURL}/Items?filter[user_id][_neq]=${id}&filter[status_swap][_neq]=unavailable`);
        // console.log("callAPI getProducts" , products.data.data) 
        return products.data.data;
      // http://localhost:8055/items/Items
    }
       
    // Apply filters based on params
    // let filteredProducts = [...products]

    // if (params.category) {
    //   filteredProducts = filteredProducts.filter((p) => p.category === params.category)
    // }

    // if (params.search) {
    //   const searchLower = params.search.toLowerCase()
    //   filteredProducts = filteredProducts.filter(
    //     (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
    //   )
    // }

    // if (params.minPrice) {
    //   filteredProducts = filteredProducts.filter((p) => p.price >= params.minPrice)
    // }

    // if (params.maxPrice) {
    //   filteredProducts = filteredProducts.filter((p) => p.price <= params.maxPrice)
    // }

    // // Sort products
    // if (params.sort) {
    //   switch (params.sort) {
    //     case "price_asc":
    //       filteredProducts.sort((a, b) => a.price - b.price)
    //       break
    //     case "price_desc":
    //       filteredProducts.sort((a, b) => b.price - a.price)
    //       break
    //     case "rating":
    //       filteredProducts.sort((a, b) => b.rating - a.rating)
    //       break
    //     case "newest":
    //       filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    //       break
    //     default:
    //       break
    //   }
    // }

    // return filteredProducts
  } catch (error) {
    console.error("Get products error:", error)
    throw error
  }
}




// This function fetches all images to one product
export const getImageProducts = async (idImage) => {
  try {
    const ids = idImage.join(',')
    const response = await axios.get(`${baseItemsURL}/Items_files?filter[id][_in]=${ids}`,
      {
        "email": "admin@example.com",
         "password": "123"
      } 
    );
    return response.data.data ;  
    } catch (err) {
      console.error('Failed to fetch Products:', err)
      throw new Error('The API is not responding')
    }

}


// This function fetches all images to one product
export const getAllImageProducts = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/Items_files`,
      {
        "email": "admin@example.com",
         "password": "123"
      }
    );
    return response.data.data ;  
    } catch (err) {
      console.error('Failed to fetch Products:', err)
      throw new Error('The API is not responding')
    }

}



export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${baseItemsURL}/Items/${id}`);
    // console.log(response.data.data.id) 
    return response.data.data ;
     
  } catch (err) {
    console.error('Failed to fetch Products:', err)
    throw new Error('The API is not responding')
  }

}

// top price deel 
export const getProductTopPrice = async () => {
  try {
    // const response = await axios.get(`${baseItemsURL}/Items?sort=-price&limit=5`);
    const response = await axios.get(`${baseItemsURL}/Items?filter[status_swap][_neq]=unavailable&sort=-price&limit=5`);
return response.data.data;
    // console.log(response.data.data) 
  } catch (err) {
    console.error('Failed to fetch Products:', err)
    throw new Error('The API is not responding')
  }

}

export const getProductSearchFilter = async (fliter) => {
  try {
    // const response = await axios.get(`${baseItemsURL}/Items/?filter[_or][0][name][_contains]=${fliter}`);
    // `&filter[_or][][price][_eq]=${fliter}
    // &filter[_or][][category][_contains]=${fliter}
    // /items/products?filter[_or][][status][_eq]=draft&filter[_or][][status][_eq]=archived
    // console.log(response.data.data) 
    const response = await axios.get(
  `${baseItemsURL}/Items?filter[_and][0][status_swap][_neq]=unavailable&filter[_and][1][_or][0][name][_contains]=${fliter}`
);
return response.data.data;
    
  } catch (err) {
    console.error('Failed to fetch Products:', err)
    throw new Error('The API is not responding')
  }

}

export const getProductByCategory = async (fliter) => {
  try {
    // const response = await axios.get(`${baseItemsURL}/Items/?filter[category][_eq]=${fliter}`);
    // console.log(response.data.data) 
    const response = await axios.get(`${baseItemsURL}/Items?filter[status_swap][_neq]=unavailable&filter[category][_eq]=${fliter}`);
return response.data.data;
    
  } catch (err) {
    console.error('Failed to fetch Products:', err)
    throw new Error('The API is not responding')
  }

}

// get Product By User Id to swapping
export const getProductByUserId = async () => {
  const {id} = await decodedToken()
  try {
    const response = await axios.get(`${baseItemsURL}/Items/?filter[user_id][_eq]=${id}`);
    // console.log("getProductByUserId" , response.data.data) 
    return response.data.data ;
     
  } catch (err) {
    console.error('getProductByUserId   Failed to fetch Products: ', err)
    throw new Error('The API is not responding')
  }

}

// ----------------------------------------------------------------------------------
// get Products Owner swapping
export const getProductsOwnerById = async (idProduct) => {
  try {
    const {id} =  await getUserByProductId(idProduct)
    // if(!id){
    //   return null
    // }
    // else{
      const response = await axios.get(`${baseItemsURL}/Items/?filter[user_id][_eq]=${id}`);
    // console.log("getProductsOwnerById" , response.data.data) 
    return response.data.data ;
    // }
    
     
  } catch (err) {
    console.error('getProductByUserId   Failed to fetch Products: ', err)
    throw new Error('The API is not responding')
  }

}

export const addProduct = async (productCollectionData , authId , images) => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0ODM5Mzc1NSwiZXhwIjoxNzQ4OTk4NTU1LCJpc3MiOiJkaXJlY3R1cyJ9.jhUNKnw0kCPjrhSsmp2KEOpHOHNP1UBDDHBdWjd4E7Q"
    const {id} = await decodedToken()
    // console.log("token.id" , id)
    // console.log("token" , token)


    if (id === authId) {

        // remove old avatar from the server
        // upload avatar to the server and  get the avatar id
        const formData = new FormData();
        formData.append('file', avatar);
       const avatarResponse =  await axios.post(`http://localhost:8055/files`, 
          formData
            ,
            {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                  },
              }
        );
        // console.log("avatar uploaded" , avatarResponse.data.data)
        
        // upload new avatar to user profile
        const response = await axios.post(`${baseItemsURL}/Items`,
            {
             ...userData, 
             avatar: avatarResponse.data.data.id
            }
          ,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              },
          }
        );
        // console.log(response.data.data)
        
 
     
    }
    else {
      // console.log("You are not authorized to edit this profile")
      return null;
    }

    } catch (err) {
      // console.error('Failed to edite profile:', err)
      // throw new Error('The API register is not responding')
    }


}


/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteProduct = async (id) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
  const response = await axios.delete(`${baseItemsURL}/Items/${id}`);
    // console.log(response.data.data) 
    return response.data.data ;
 
  } catch (error) {
    console.error(`Delete product ${id} error:`, error)
    throw error
  }
}



// ************************** offer ***************************//


/**
//  * Get All Offers
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers list
//  */

export const getAllOffers = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offers`);
    console.log(response.data.data.id) 
    return response.data.data ;
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}

/**
//  * Get  Offers by id in cart
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers list
//  */

export const getOfferById = async (id) => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offers?filter[from_user_id][_eq]=${id}`);
    console.log(response.data.data.id) 
    return response.data.data;
   
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}

export const getOffersNotifications = async (id) => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offers?filter[to_user_id][_eq]=${id}`);
    console.log(response.data.data.id) 
    return response.data.data;
   
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}

/**
//  * delete One  Offers by id 
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offer 
//  */
 
export const deleteOfferById = async (id) => {
  try {
  const response = await axios.delete(`${baseItemsURL}/Offers/${id}`);
    // console.log(response.data.data) 
    return response.data.data ;
 
  } catch (error) {
    console.error(`Delete Offer ${id} error:`, error)
    throw error
  }
}


/**
//  * Updated One  Offers by id 
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offer 
//  */
 
export const updateOfferById = async (id , cash_adjustment) => {
  try {
  const response = await axios.patch(`${baseItemsURL}/Offers/${id}`,
    {
      cash_adjustment ,
    }
  );
    // console.log(response.data.data) 
    return response.data.data ;
 
  } catch (error) {
    console.error(`Delete Offer ${id} error:`, error)
    throw error
  }
}


/**
//  * Add Offer
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Products list
//  */
export const addOffer = async (to_user_id, cash_adjustment=0, user_prods, owner_prods , message) => {
  try {
    const token = await getCookie();
    if (!token) return;

    const { id } = await decodedToken();

    // 1. Add offer to Offers table
    const offerRes = await axios.post(
      `${baseURL}/items/Offers`,
      {
        from_user_id :id,
        to_user_id,
        cash_adjustment,
        status_offer: "pending",
message
      }
    );
    const offer_id = offerRes.data.data.id;
    console.log("offer_id",offer_id);

    // 2. Add items to Offer_Items table
    const allItems = [
      ...user_prods.map(item => ({ item_id: item.id, offered_by: id })),
      ...owner_prods.map(item => ({ item_id: item.id, offered_by: to_user_id }))
    ];
    console.log("allItems",allItems);

    for (const item of allItems) {
     if (!offer_id || !item.item_id || !item.offered_by) {
    console.error("Missing required field:", { offer_id, item });
    continue;
  }
  await axios.post(`${baseURL}/items/Offer_Items`, {
    offer_id,
    item_id: item.item_id,
    offered_by: item.offered_by
  });
    }
    // 3. Update items' status_swap to 'unavailable'
    for (const item of allItems) {
      await axios.patch(`http://localhost:8055/items/Items/${item.item_id}`, {
        "status_swap": "unavailable"
                        
      });
    }
    return offer_id;
  } catch (err) {
    console.error('Failed to add offer:', err);
    throw err;
  }
};

/**
//  * Get all Offers Items 
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers Items
//  */

export const getOfferItems = async () => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offer_Items`);
    console.log(response.data.data.id) 
    return response.data.data;
   
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}



/**
//  * Get  Offers Items by id
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers Items
//  */

export const getOfferItemsById = async (id) => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offer_Items/${id}`);
    console.log(response.data.data.id) 
    return response.data.data;
   
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}



/**
//  * Get  Offers Items by offers id
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers Items
//  */

export const getOfferItemsByOfferId = async (offer_id) => {
  try {
    const response = await axios.get(`${baseItemsURL}/Offer_Items?filter[offer_id][_eq]=${offer_id}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch Offer Items:', err);
    throw new Error('The API is not responding');
  }
}



/**
//  * Delete  Offers Items by id
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers Items
//  */

export const deleteOfferItemsById = async (id) => {
  try {
    const response = await axios.delete(`${baseItemsURL}/Offer_Items/${id}`);
    console.log(response.data.data.id) 
    return response.data.data;
   
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}



/**
//  * Update  Offers Items by id
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Offers Items
//  */

export const updateOfferItemsById = async (id) => {
  try {
    // not updates 
    const response = await axios.patch(`${baseItemsURL}/Offer_Items/${id}`);
    console.log(response.data.data.id) 
    return response.data.data;
   
     
  } catch (err) {
    console.error('Failed to fetch Offers:', err)
    throw new Error('The API is not responding')
  }

}
// /**
//  * Get all products
//  * @param {Object} params - Query parameters
//  * @returns {Promise<Array>} Products list
//  */
// export const getProducts = async (params = {}) => {
//   try {
//     // In a real app, this would be a real API call
//     // const response = await api.get('/products', { params });
//     // return response.data;

//     // Mock implementation
//     await new Promise((resolve) => setTimeout(resolve, 800))

//     // Mock products data
//     const products = [
//       {
//         id: "1",
//         name: "Apple iPhone 14 Pro Max (256GB) - Deep Purple",
//         description: "The ultimate iPhone with a stunning camera system and powerful A16 Bionic chip.",
//         price: 1299,
//         originalPrice: 1399,
//         rating: 4.8,
//         reviewCount: 1245,
//         imageSrc: "/placeholder.svg?height=300&width=300&text=iPhone",
//         isExpress: true,
//         isBestSeller: true,
//         category: "Electronics",
//         stock: 15,
//         createdAt: "2023-01-15T00:00:00Z",
//       },
//       {
//         id: "2",
//         name: "Samsung Galaxy S23 Ultra - Phantom Black",
//         description: "Experience the power of Galaxy with the S23 Ultra featuring an advanced camera system.",
//         price: 1199,
//         originalPrice: 1299,
//         rating: 4.7,
//         reviewCount: 856,
//         imageSrc: "/placeholder.svg?height=300&width=300&text=Samsung",
//         isExpress: true,
//         category: "Electronics",
//         stock: 8,
//         createdAt: "2023-02-10T00:00:00Z",
//       },
//       // Add more mock products as needed
//     ]

//     // Apply filters based on params
//     let filteredProducts = [...products]

//     if (params.category) {
//       filteredProducts = filteredProducts.filter((p) => p.category === params.category)
//     }

//     if (params.search) {
//       const searchLower = params.search.toLowerCase()
//       filteredProducts = filteredProducts.filter(
//         (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
//       )
//     }

//     if (params.minPrice) {
//       filteredProducts = filteredProducts.filter((p) => p.price >= params.minPrice)
//     }

//     if (params.maxPrice) {
//       filteredProducts = filteredProducts.filter((p) => p.price <= params.maxPrice)
//     }

//     // Sort products
//     if (params.sort) {
//       switch (params.sort) {
//         case "price_asc":
//           filteredProducts.sort((a, b) => a.price - b.price)
//           break
//         case "price_desc":
//           filteredProducts.sort((a, b) => b.price - a.price)
//           break
//         case "rating":
//           filteredProducts.sort((a, b) => b.rating - a.rating)
//           break
//         case "newest":
//           filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           break
//         default:
//           break
//       }
//     }

//     return filteredProducts
//   } catch (error) {
//     console.error("Get products error:", error)
//     throw error
//   }
// }

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
export const getProductById2 = async (id) => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.get(`/products/${id}`);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock products data
    const products = [
      {
        id: "1",
        name: "Apple iPhone 14 Pro Max (256GB) - Deep Purple",
        description: "The ultimate iPhone with a stunning camera system and powerful A16 Bionic chip.",
        price: 1299,
        originalPrice: 1399,
        rating: 4.8,
        reviewCount: 1245,
        imageSrc: "/placeholder.svg?height=300&width=300&text=iPhone",
        isExpress: true,
        isBestSeller: true,
        category: "Electronics",
        stock: 15,
        createdAt: "2023-01-15T00:00:00Z",
        specs: {
          display: "6.7-inch Super Retina XDR display",
          processor: "A16 Bionic chip",
          camera: "48MP main camera",
          battery: "Up to 29 hours video playback",
          storage: "256GB",
          os: "iOS 16",
        },
        images: [
          "/placeholder.svg?height=600&width=600&text=iPhone+Front",
          "/placeholder.svg?height=600&width=600&text=iPhone+Back",
          "/placeholder.svg?height=600&width=600&text=iPhone+Side",
        ],
      },
      {
        id: "2",
        name: "Samsung Galaxy S23 Ultra - Phantom Black",
        description: "Experience the power of Galaxy with the S23 Ultra featuring an advanced camera system.",
        price: 1199,
        originalPrice: 1299,
        rating: 4.7,
        reviewCount: 856,
        imageSrc: "/placeholder.svg?height=300&width=300&text=Samsung",
        isExpress: true,
        category: "Electronics",
        stock: 8,
        createdAt: "2023-02-10T00:00:00Z",
        specs: {
          display: "6.8-inch Dynamic AMOLED 2X display",
          processor: "Snapdragon 8 Gen 2",
          camera: "200MP main camera",
          battery: "5000mAh",
          storage: "256GB",
          os: "Android 13",
        },
        images: [
          "/placeholder.svg?height=600&width=600&text=Samsung+Front",
          "/placeholder.svg?height=600&width=600&text=Samsung+Back",
          "/placeholder.svg?height=600&width=600&text=Samsung+Side",
        ],
      },
      // Add more mock products as needed
    ]

    const product = products.find((p) => p.id === id)

    if (!product) {
      throw new Error("Product not found")
    }

    return product
  } catch (error) {
    console.error(`Get product ${id} error:`, error)
    throw error
  }
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.post('/products', productData);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate a new product with the provided data
    const newProduct = {
      id: `product_${Date.now()}`,
      ...productData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    }

    return newProduct
  } catch (error) {
    console.error("Create product error:", error)
    throw error
  }
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (id, productData) => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.put(`/products/${id}`, productData);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock products data
    const products = [
      {
        id: "1",
        name: "Apple iPhone 14 Pro Max (256GB) - Deep Purple",
        description: "The ultimate iPhone with a stunning camera system and powerful A16 Bionic chip.",
        price: 1299,
        originalPrice: 1399,
        rating: 4.8,
        reviewCount: 1245,
        imageSrc: "/placeholder.svg?height=300&width=300&text=iPhone",
        isExpress: true,
        isBestSeller: true,
        category: "Electronics",
        stock: 15,
        createdAt: "2023-01-15T00:00:00Z",
      },
      // Add more mock products as needed
    ]

    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      throw new Error("Product not found")
    }

    // Update the product
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
      id, // Ensure ID doesn't change
    }

    return updatedProduct
  } catch (error) {
    console.error(`Update product ${id} error:`, error)
    throw error
  }
}

