import axios from 'axios';
const baseURLAssets = 'http://localhost:3000/api/product/1';
export const baseItemsURL = 'http://localhost:8055/items';
export const baseURL = 'http://localhost:8055';
import {  getCookie , setCookie , decodedToken } from './utiles';
import { getUserByProductId } from './users';

/**
 * Get available items by user id 
 * @param {Object} params - Query parameters
 */

export const getAvailableAndUnavailableProducts = async (user_id , available = true) => {
  try {
    const token = await getCookie()
    if(!token){
        return null
    }
    else{
      if(available){
 const products = await axios.get(`${baseItemsURL}/Items?filter[user_id][_eq]=${user_id}&filter[status_swap][_eq]=available`);
        return products.data.data;
      }
     else{
      const products = await axios.get(`${baseItemsURL}/Items?filter[user_id][_eq]=${user_id}&filter[status_swap][_eq]=unavailable`);
        return products.data.data;
     }
   
    }
  } catch (error) {
    console.error("Get Available products Error:", error)
    throw error
  }
}



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
 await axios.delete(`${baseItemsURL}/Items/${id}`);
    // console.log(response.data.data) 
   
 
  } catch (error) {
    console.error(`Delete product ${id} error:`, error)
    throw error
  }
}
