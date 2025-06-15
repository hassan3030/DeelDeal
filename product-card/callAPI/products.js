import axios from 'axios';
import {  getCookie , setCookie , decodedToken , baseItemsURL , baseURL } from './utiles';
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
  const {id} = await decodedToken()
  try {
    // const response = await axios.get(`${baseItemsURL}/Items?sort=-price&limit=5`);
    const response = await axios.get(`${baseItemsURL}/Items?filter[status_swap][_eq]=available&filter[_or][][user_id][_neq]=${id}&sort=-price&limit=5`);
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



export const addProduct = async ( payload , files ) => {
  const token = await getCookie() ; 
  const { id } = await decodedToken();
 
  try {
    // 1. Create the item (without images yet)
    const itemRes = await axios.post(
      `${baseItemsURL}/Items`,
      { ...payload, user_id: id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
// -----------------------------------------


    const itemData = itemRes.data;
    console.log("Response:", itemData);

    const itemId = itemData?.data?.id;
    if (!itemId) {
      throw new Error("Failed to retrieve item ID from the response.");
    }
    // 2. Upload each image and link to item
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      // Upload file to /files
      const fileRes = await axios.post(`${baseURL}/files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fileData = fileRes.data;
      console.log("File Response:", fileData);

      const fileId = fileData?.data?.id;
      if (!fileId) {
        throw new Error("Failed to retrieve file ID from the response.");
      }

      // Link the uploaded image to the item
      await axios.post(
        `${baseItemsURL}/Items_files`,
        {
          Items_id: itemId,
          directus_files_id: fileId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);

   
  }


};


export const updateProduct = async ( payload , files , idItemPage) => {
// Convert all fetch calls to axios
 const token = await getCookie() ; 


  try {
    // 1. Update the item (PATCH)
    const itemRes = await axios.patch(
      `${baseItemsURL}/Items/${idItemPage}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const itemData = itemRes.data;
    console.log("Response:", itemData);

    const itemId = itemData?.data?.id;
    if (!itemId) {
      throw new Error("Failed to retrieve item ID from the response.");
    }

    // 2. Delete existing images linked to this item before uploading new ones
    const existingImagesRes = await axios.get(
      `${baseItemsURL}/Items_files?filter[Items_id][_eq]=${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const existingImagesData = existingImagesRes.data;
    if (existingImagesData?.data?.length > 0) {
      for (const img of existingImagesData.data) {
        await axios.delete(`${baseItemsURL}/Items_files/${img.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    // 3. Upload each image and link to item
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      // Upload file to /files
      const fileRes = await axios.post(`${baseURL}/files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fileData = fileRes.data;
      console.log("File Response:", fileData);
      const fileId = fileData?.data?.id;
      if (!fileId) {
        throw new Error("Failed to retrieve file ID from the response.");
      }

      // Link the uploaded image to the item
      await axios.post(
        `${baseItemsURL}/Items_files`,
        {
          Items_id: itemId,
          directus_files_id: fileId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

   
  } catch (err) {
    console.error(err);
    
  }
};


// used if error 
// add items with fetch
// const handleSubmit = async () => {
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhZjc2NjE5LTI3ZDgtNDBlOC05ODQ0LWIzYzZjOWExNjlmNSIsInJvbGUiOm51bGwsImFwcF9hY2Nlc3MiOmZhbHNlLCJhZG1pbl9hY2Nlc3MiOmZhbHNlLCJpYXQiOjE3NDk3ODE2NTQsImV4cCI6MTc1MDM4NjQ1NCwiaXNzIjoiZGlyZWN0dXMifQ.gIGdvRMACpw9J6PS2IFEGCP9bqZyLz-Uo3fxljK9-5s"; // Replace with your actual token
//   const apiBase = "http://localhost:8055";
//  const {id} = await decodedToken()
//   const files = images; // Use the images array for file uploads

//   if (files.length === 0) {

//      toast({
//         title: t("error") || "ERROR ",
//         description:"Please fill all fields and select at least one image.",
//         variant: "destructive",
//       })
//     return;
//   }

//   try {
//     // 1. Create the item (without images yet)
//     const payload = { ...form.getValues() };
//      // Ensure the id field is not included
//     console.log("Payload:", payload);

//     const itemRes = await fetch(`http://localhost:8055/items/Items`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     body: JSON.stringify({...payload , user_id:id}) ,
//     });

//     const itemData = await itemRes.json();
//     console.log("Response:", itemData);

//     if (!itemRes.ok) {
//       throw new Error(itemData.errors || "Failed to create item");
//     }

//     const itemId = itemData?.data?.id;
//     if (!itemId) {
//       throw new Error("Failed to retrieve item ID from the response.");
//     }

//     // 2. Upload each image and link to item
//     for (const file of files) {
//       const formData = new FormData();
//       formData.append("file", file);

//       // Upload file to /files
//       const fileRes = await fetch(`${apiBase}/files`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const fileData = await fileRes.json();
//       console.log("File Response:", fileData);

//       if (!fileRes.ok) {
//         throw new Error(fileData.errors || "Failed to upload file");
//       }

//       const fileId = fileData?.data?.id;
//       if (!fileId) {
//         throw new Error("Failed to retrieve file ID from the response.");
//       }

//       // Link the uploaded image to the item
//       await fetch(`${apiBase}/items/Items_files`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           Items_id: itemId,
//           directus_files_id: fileId,
//         }),
//       });
//     }
    
//   toast({
//           title: t("successfully") ,
//           description:  "Item added successfully with images!",
//         })
//          // Clear all fields and images
//   form.reset();
//   setImages([]);
//   setImageUrls([]);
//   router.refresh()

//   } catch (err) {
//     console.error(err);
    
//      toast({
//         title: t("error") || "ERROR ",
//         description:err.message || "Error adding item.",
//         variant: "destructive",
//       })

//   }
// };



// with axios
// const handleSubmit = async () => {
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhZjc2NjE5LTI3ZDgtNDBlOC05ODQ0LWIzYzZjOWExNjlmNSIsInJvbGUiOm51bGwsImFwcF9hY2Nlc3MiOmZhbHNlLCJhZG1pbl9hY2Nlc3MiOmZhbHNlLCJpYXQiOjE3NDk3ODE2NTQsImV4cCI6MTc1MDM4NjQ1NCwiaXNzIjoiZGlyZWN0dXMifQ.gIGdvRMACpw9J6PS2IFEGCP9bqZyLz-Uo3fxljK9-5s"; // Replace with your actual token
//   const apiBase = "http://localhost:8055";
//   const { id } = await decodedToken();
//   const files = images;

//   if (files.length === 0) {
//     toast({
//       title: t("error") || "ERROR ",
//       description: "Please fill all fields and select at least one image.",
//       variant: "destructive",
//     });
//     return;
//   }

//   try {
//     // 1. Create the item (without images yet)
//     const payload = { ...form.getValues() };
//     console.log("Payload:", payload);

//     const itemRes = await axios.post(
//       `${apiBase}/items/Items`,
//       { ...payload, user_id: id },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const itemData = itemRes.data;
//     console.log("Response:", itemData);

//     const itemId = itemData?.data?.id;
//     if (!itemId) {
//       throw new Error("Failed to retrieve item ID from the response.");
//     }

//     // 2. Upload each image and link to item
//     for (const file of files) {
//       const formData = new FormData();
//       formData.append("file", file);

//       // Upload file to /files
//       const fileRes = await axios.post(`${apiBase}/files`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const fileData = fileRes.data;
//       console.log("File Response:", fileData);

//       const fileId = fileData?.data?.id;
//       if (!fileId) {
//         throw new Error("Failed to retrieve file ID from the response.");
//       }

//       // Link the uploaded image to the item
//       await axios.post(
//         `${apiBase}/items/Items_files`,
//         {
//           Items_id: itemId,
//           directus_files_id: fileId,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     }

//     toast({
//       title: t("successfully"),
//       description: "Item added successfully with images!",
//     });
//     // Clear all fields and images
//     form.reset();
//     setImages([]);
//     setImageUrls([]);
//     router.refresh();
//   } catch (err) {
//     console.error(err);

//     toast({
//       title: t("error") || "ERROR ",
//       description: err.message || "Error adding item.",
//       variant: "destructive",
//     });
//   }
// };

//  update with fetch
// const handleSubmit = async () => {
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0ODg4NjQwMSwiZXhwIjoxNzQ5NDkxMjAxLCJpc3MiOiJkaXJlY3R1cyJ9.xVvqMIqFcmEgaJny0QI0IDKUYruhBiKQxRLpYNGlNH4"; // Replace with your actual token
//   const apiBase = "http://localhost:8055";

//   const files = imagesFile; // Use the images array for file uploads

//   if (files.length === 0) {
//      toast({
//         title: t("error") || "ERROR ",
//         description:"Please fill all fields and select at least one image.",
//         variant: "destructive",
//       })
   
//     return;
//   }

//   try {
//     // 1. Create the item (without images yet)
//     const payload = { ...form.getValues() };
//      // Ensure the id field is not included
//     console.log("Payload:", payload);

//     const itemRes = await fetch(`http://localhost:8055/items/Items/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const itemData = await itemRes.json();
//     console.log("Response:", itemData);

//     if (!itemRes.ok) {
//       throw new Error(itemData.errors || "Failed to create item");
//     }

//     const itemId = itemData?.data?.id;
//     if (!itemId) {
//       throw new Error("Failed to retrieve item ID from the response.");
//     }

//     // 2- Delete existing images linked to this item before uploading new ones
//     const existingImagesRes = await fetch(`${apiBase}/items/Items_files?filter[Items_id][_eq]=${itemId}`, {
//       headers: {
//       Authorization: `Bearer ${token}`,
//       },
//     });
//     const existingImagesData = await existingImagesRes.json();
//     if (existingImagesData?.data?.length > 0) {
//       for (const img of existingImagesData.data) {
//       await fetch(`${apiBase}/items/Items_files/${img.id}`, {
//         method: "DELETE",
//         headers: {
//         Authorization: `Bearer ${token}`,
//         },
//       });
//       }
//     }
    

//     // 3. Upload each image and link to item
//     for (const file of files) {
//       const formData = new FormData();
//       formData.append("file", file);

//       // Upload file to /files
//       const fileRes = await fetch(`${apiBase}/files`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const fileData = await fileRes.json();
//       console.log("File Response:", fileData);

//       if (!fileRes.ok) {
//         throw new Error(fileData.errors || "Failed to upload file");
//       }

//       const fileId = fileData?.data?.id;
//       if (!fileId) {
//         throw new Error("Failed to retrieve file ID from the response.");
//       }

//       // Link the uploaded image to the item
//       await fetch(`${apiBase}/items/Items_files`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           Items_id: itemId,
//           directus_files_id: fileId,
//         }),
//       });
//     }
//   toast({
//         title: t("error") || "ERROR ",
//         description:"Item added successfully with images!",
//       })
 
//   } catch (err) {
//     console.error(err);
//     toast({
//         title: t("error") || "ERROR ",
//         description: `${err.message}` || "Error adding item.",
//       })
  
//   }
// };