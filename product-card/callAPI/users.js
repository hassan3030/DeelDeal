import axios from 'axios';

import { baseURL , getCookie , setCookie , decodedToken , baseItemsURL } from './utiles';
// // show all users
// export const getAllUsers = async () => {
//     try {
//         const response = await axios.get(`${baseURL}/Items`);
//         return response.data.data ;  
//         // console.log(response.data.data)
//       } catch (err) {
//         console.error('Failed to fetch Products:', err)
//         throw new Error('The API is not responding')
//       }
   
// }


  
// authenticate the user and get the token
export const auth = async (email , password) => {
  try {
    const authResponse = await axios.post(`${baseURL}/auth/login`, 
      {
        email,
        password,
    }
  
  );
  const token = await authResponse.data.data.access_token;
 await setCookie(token)
//  console.log("authResponse.data.data i am in auth func" , authResponse.data.data.access_token)
//  console.log("access_token i am in auth func" , token)

return authResponse.data.data;  
      // console.log("response.data.data" , response.data.data)
  } 
  catch (err) {
      console.error('Failed to authantication:', err)
      // throw new Error('The API is not responding')
    }

}


// login user
export const login = async (email , password ) => {

    try {
      const authResponse = await auth(email , password)
       const {id}= await decodedToken(authResponse.access_token)
      //  console.log("i am in login func  id" , id)
        const response = await axios.get(`${baseURL}/users/${id}` ,
          {
            email ,
             password,
          },
          {
            headers: {
              'Authorization': `Bearer ${authResponse.access_token}`,
              'Content-Type': 'application/json',
              },
          }
        );
        // console.log(response.data.data)
        return response.data.data ;  
      } catch (err) {
        console.error('Failed to login:', err)
        // throw new Error('The API is not responding')
      }
  
}


 
// register user
export const register = async (email  ,  password,  userName) => {
    try {
      // make register API call
         await axios.post(`${baseURL}/users/register`,
          {
            email ,
            password,
            first_name: userName,
          }
        );

        const authResponse = await auth(email , password)
        await setCookie(authResponse.access_token)
        
        // console.log("response.data.data" , response.data.data)
        // console.log("i am in register authResponse.data.data " , authResponse.access_token)
        // return authResponse.data.data;  

      } catch (err) {
        console.error('Failed to register:', err)
        // throw new Error('The API register is not responding')
      }
  
}

//  add message 
// register user
export const addMessage  = async ( email ,  name , message , phone_number) => {

    try {
     const token = getCookie()
     if(token){
      const {id} =  await decodedToken()
   const data = await axios.post(`${baseURL}/items/Customers_Problems`,
          {
            user_id : id, 
             email : email ,  
             name:  name ,
             message : message , 
             phone_number : phone_number
          }
        )
        // console.log("response.data.data" , response.data.data)
        // console.log("i am in add message " , data )
     }
     else{
   const data = await axios.post(`${baseURL}/items/Customers_Problems`,
          {
              email : email ,  
             name:  name ,
             message : message , 
             phone_number : phone_number
          }
        )
        // console.log("response.data.data" , response.data.data)
        // console.log("i am in add message " , data )
     }
      
        // return authResponse.data.data;  

      } catch (err) {
        console.error('Failed to register:', err)
        // throw new Error('The API register is not responding')
      }
  
}
 
//get user by id
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/users/${id}` );
    // console.log(response.data.data.id) 
    return response.data.data ;
     
  } catch (err) {
    console.error('Failed to fetch user data:', err)
    throw new Error('The API is not responding')
  }

}
 

/// get Product By User Id to swapping
export const getUserByProductId = async (ProductId) => {
  try {
    // Get the product to extract the user_id
    const productRes = await axios.get(`${baseItemsURL}/Items/${ProductId}`);
    const userId = await productRes.data?.data?.user_id;
    if (!userId) throw new Error("No user_id found for this product");

    // Fetch the user by userId
    const response = await axios.get(`${baseURL}/users/${userId}`);
    return response.data.data;
  } catch (err) {
    console.error('Failed to fetch user data:', err);
    throw new Error('The API is not responding');
  }
}
// edit profile user
 
              
export const editeProfile = async (userData ,authId , avatar) => {

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0NzEzMDk1NCwiZXhwIjoxNzQ3NzM1NzU0LCJpc3MiOiJkaXJlY3R1cyJ9.xqs_mhQUiDqyrF18Diku7W1UN5Ebmn2pb_amEmanb7c" 
      const {id} = await decodedToken()
      // console.log("token.id" , id)
      // console.log("token" , token)
 

      if (id === authId) {

        if (!avatar) {
          // console.log("You are authorized to edit this profile without avatar" , id)
          const response = await axios.patch(`${baseURL}/users/${id}`,
              {
               ...userData
              }
            ,
            {
              headers: {
                'Authorization': `Bearer ${getCookie("Token")}`,
                'Content-Type': 'application/json',
                },
            }
          );
          // console.log(response.data.data)
          return response.data.data ;   
        }
        else{
          // remove old avatar from the server
          const oldAvatarId = await axios.get(`${baseURL}/users/${id}`);
          await axios.delete(`${baseURL}/files/${oldAvatarId.data.data.avatar}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                },
            }
          );
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
          const response = await axios.patch(`${baseURL}/users/${id}`,
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
       
      }
      else {
        // console.log("You are not authorized to edit this profile")
        return null;
      }

      } catch (err) {
        console.error('Failed to edite profile:', err)
        // throw new Error('The API register is not responding')
      }
  
}


// // delete all user
// export const deleteAllUsers = async () => {
//     try {
//         const response = await axios.get(`${baseURL}/Items`);
//         return response.data.data ;  
//         // console.log(response.data.data)
//       } catch (err) {
//         console.error('Failed to fetch Products:', err)
//         throw new Error('The API is not responding')
//       }
  
// }


// // // delete user by id
// export const deleteUserById = async () => {
//     try {
//         const response = await axios.get(`${baseURL}/Items`);
//         return response.data.data ;  
//         // console.log(response.data.data)
//       } catch (err) {
//         console.error('Failed to fetch Products:', err)
//         throw new Error('The API is not responding')
//       }
  
// }


// // // update user by id
// export const updateUserById = async (id, data) => {
//     try {
//         const response = await axios.put(`${baseURL}/Items/${id}`, data);
//         return response.data.data ;  
//         // console.log(response.data.data)
//       } catch (err) {
//         console.error('Failed to fetch Products:', err)
//         throw new Error('The API is not responding')
//       }
  
// }



/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.get('/users/profile');
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("deeldeal_user")

      if (storedUser) {
        return JSON.parse(storedUser)
      }
    }

    throw new Error("User not authenticated")
  } catch (error) {
    console.error("Get user profile error:", error)
    throw error
  }
}

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.put('/users/profile', userData);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("deeldeal_user")

      if (storedUser) {
        const currentUser = JSON.parse(storedUser)
        const updatedUser = {
          ...currentUser,
          ...userData,
          id: currentUser.id, // Ensure ID doesn't change
        }

        localStorage.setItem("deeldeal_user", JSON.stringify(updatedUser))
        return updatedUser
      }
    }

    throw new Error("User not authenticated")
  } catch (error) {
    console.error("Update user profile error:", error)
    throw error
  }
}

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success status
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    // In a real app, this would be a real API call
    // await api.post('/users/change-password', { currentPassword, newPassword });

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate password validation
    if (currentPassword === "Password123") {
      return true
    } else {
      throw new Error("Current password is incorrect")
    }
  } catch (error) {
    console.error("Change password error:", error)
    throw error
  }
}

/**
 * Get user orders
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} User orders
 */
export const getUserOrders = async (params = {}) => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.get('/users/orders', { params });
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock orders data
    const orders = [
      {
        id: "order1",
        orderNumber: "ORD-12345",
        date: "2023-05-15T10:30:00Z",
        status: "delivered",
        total: 1299,
        items: [
          {
            id: "1",
            name: "Apple iPhone 14 Pro Max (256GB) - Deep Purple",
            price: 1299,
            quantity: 1,
            imageSrc: "/placeholder.svg?height=100&width=100&text=iPhone",
          },
        ],
        shippingAddress: {
          name: "Demo User",
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA",
        },
        paymentMethod: "Credit Card",
        deliveryDate: "2023-05-18T14:20:00Z",
      },
      {
        id: "order2",
        orderNumber: "ORD-12346",
        date: "2023-04-20T15:45:00Z",
        status: "delivered",
        total: 1199,
        items: [
          {
            id: "2",
            name: "Samsung Galaxy S23 Ultra - Phantom Black",
            price: 1199,
            quantity: 1,
            imageSrc: "/placeholder.svg?height=100&width=100&text=Samsung",
          },
        ],
        shippingAddress: {
          name: "Demo User",
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA",
        },
        paymentMethod: "PayPal",
        deliveryDate: "2023-04-23T11:10:00Z",
      },
      // Add more mock orders as needed
    ]

    // Apply filters based on params
    let filteredOrders = [...orders]

    if (params.status) {
      filteredOrders = filteredOrders.filter((o) => o.status === params.status)
    }

    if (params.startDate) {
      const startDate = new Date(params.startDate)
      filteredOrders = filteredOrders.filter((o) => new Date(o.date) >= startDate)
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate)
      filteredOrders = filteredOrders.filter((o) => new Date(o.date) <= endDate)
    }

    // Sort orders
    if (params.sort) {
      switch (params.sort) {
        case "date_desc":
          filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
          break
        case "date_asc":
          filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date))
          break
        case "total_desc":
          filteredOrders.sort((a, b) => b.total - a.total)
          break
        case "total_asc":
          filteredOrders.sort((a, b) => a.total - b.total)
          break
        default:
          break
      }
    } else {
      // Default sort by date (newest first)
      filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return filteredOrders
  } catch (error) {
    console.error("Get user orders error:", error)
    throw error
  }
}

/**
 * Get user wishlist
 * @returns {Promise<Array>} User wishlist
 */
export const getUserWishlist = async () => {
  try {
    // In a real app, this would be a real API call
    // const response = await api.get('/users/wishlist');
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock wishlist data
    const wishlist = [
      {
        id: "1",
        name: "Apple iPhone 14 Pro Max (256GB) - Deep Purple",
        price: 1299,
        originalPrice: 1399,
        rating: 4.8,
        reviewCount: 1245,
        imageSrc: "/placeholder.svg?height=300&width=300&text=iPhone",
        isExpress: true,
        isBestSeller: true,
        addedAt: "2023-05-10T08:15:00Z",
      },
      {
        id: "3",
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        price: 349,
        originalPrice: 399,
        rating: 4.9,
        reviewCount: 2341,
        imageSrc: "/placeholder.svg?height=300&width=300&text=Sony",
        isBestSeller: true,
        addedAt: "2023-05-05T14:30:00Z",
      },
      // Add more mock wishlist items as needed
    ]

    return wishlist
  } catch (error) {
    console.error("Get user wishlist error:", error)
    throw error
  }
}

/**
 * Add product to wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<boolean>} Success status
 */
export const addToWishlist = async (productId) => {
  try {
    // In a real app, this would be a real API call
    // await api.post('/users/wishlist', { productId });

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    return true
  } catch (error) {
    console.error(`Add to wishlist error for product ${productId}:`, error)
    throw error
  }
}

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID
 * @returns {Promise<boolean>} Success status
 */
export const removeFromWishlist = async (productId) => {
  try {
    // In a real app, this would be a real API call
    // await api.delete(`/users/wishlist/${productId}`);

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800))

    return true
  } catch (error) {
    console.error(`Remove from wishlist error for product ${productId}:`, error)
    throw error
  }
}
