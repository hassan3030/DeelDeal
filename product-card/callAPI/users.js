import axios from "axios";

import {
  baseURL,
  getCookie,
  setCookie,
  decodedToken,
  baseItemsURL,
} from "./utiles";

// authenticate the user and get the token
export const auth = async (email, password) => {
  try {
    const authResponse = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    });
    const token = await authResponse.data.data.access_token;
    await setCookie(token);
    //  console.log("authResponse.data.data i am in auth func" , authResponse.data.data.access_token)
    //  console.log("access_token i am in auth func" , token)

    return authResponse.data.data;
    // console.log("response.data.data" , response.data.data)
  } catch (err) {
    console.error("Failed to authantication:", err);
    // throw new Error('The API is not responding')
  }
};

// login user
export const login = async (email, password) => {
  try {
    const authResponse = await auth(email, password);
    const { id } = await decodedToken(authResponse.access_token);
    //  console.log("i am in login func  id" , id)
    const response = await axios.get(
      `${baseURL}/users/${id}`,
      {
        email,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${authResponse.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response.data.data)
    return response.data.data;
  } catch (err) {
    console.error("Failed to login:", err);
    // throw new Error('The API is not responding')
  }
};

// register user
export const register = async (email, password, userName) => {
  try {
    // make register API call
    await axios.post(`${baseURL}/users/register`, {
      email,
      password,
      first_name: userName,
    });

    const authResponse = await auth(email, password);
    await setCookie(authResponse.access_token);

    // console.log("response.data.data" , response.data.data)
    // console.log("i am in register authResponse.data.data " , authResponse.access_token)
    // return authResponse.data.data;
  } catch (err) {
    console.error("Failed to register:", err);
    // throw new Error('The API register is not responding')
  }
};

//  add message
// register user
export const addMessage = async (email, name, message, phone_number) => {
  try {
    const token = getCookie();
    if (token) {
      const { id } = await decodedToken();
      const data = await axios.post(`${baseURL}/items/Customers_Problems`, {
        user_id: id,
        email: email,
        name: name,
        message: message,
        phone_number: phone_number,
      });
      // console.log("response.data.data" , response.data.data)
      // console.log("i am in add message " , data )
    } else {
      const data = await axios.post(`${baseURL}/items/Customers_Problems`, {
        email: email,
        name: name,
        message: message,
        phone_number: phone_number,
      });
      // console.log("response.data.data" , response.data.data)
      // console.log("i am in add message " , data )
    }

    // return authResponse.data.data;
  } catch (err) {
    console.error("Failed to register:", err);
    throw new Error('The API register is not responding')
  }
};

//get user by id
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/users/${id}`);
    console.log(response.data.data.id)
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch user data:", err);
    throw new Error("The API is not responding");
  }
};

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
    console.error("Failed to fetch user data:", err);
    throw new Error("The API is not responding");
  }
};
// edit profile user

export const editeProfile = async (userData, authId, avatar) => {
  try {
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0OTU0NTYxMywiZXhwIjoxNzUwMTUwNDEzLCJpc3MiOiJkaXJlY3R1cyJ9.VsIBg7slfZOcEqJ8FPEypSRsZJlelWiD62LI4qG0hh8"
    const { id } = await decodedToken();
    // console.log("token.id" , id)
    // console.log("token" , token)

    if (id === authId) {
      if (!avatar) {
        // console.log("You are authorized to edit this profile without avatar" , id)
        const response = await axios.patch(
          `${baseURL}/users/${id}`,
          {
            ...userData,
          },
          {
            headers: {
              Authorization: `Bearer ${getCookie("Token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.data)
        return response.data.data;
      } else {
        // remove old avatar from the server
        const oldAvatarId = await axios.get(`${baseURL}/users/${id}`);
        await axios.delete(`${baseURL}/files/${oldAvatarId.data.data.avatar}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // upload avatar to the server and  get the avatar id
        const formData = new FormData();
        formData.append("file", avatar);
        const avatarResponse = await axios.post(
          `http://localhost:8055/files`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log("avatar uploaded" , avatarResponse.data.data)

        // upload new avatar to user profile
        const response = await axios.patch(
          `${baseURL}/users/${id}`,
          {
            ...userData,
            avatar: avatarResponse.data.data.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.data)
      }
    } else {
      // console.log("You are not authorized to edit this profile")
      return null;
    }
  } catch (err) {
    console.error("Failed to edite profile:", err);
    // throw new Error('The API register is not responding')
  }
};

// reset pass
export const resetPassword = async (newPassword, email) => {
  try {
    const { id } = await decodedToken();

    if (id) {
      const user = await getUserById(id);
      if (user.email === email) {
        const response = await axios.patch(
          `${baseURL}/users/${id}`,
          {
            password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0ODcyNzU1MywiZXhwIjoxNzQ5MzMyMzUzLCJpc3MiOiJkaXJlY3R1cyJ9.qe92ZWahzineAgfmeS3slHSTipz6mOZ_ZMcoVvI2iic"}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("reset password", response.data.data);
        return response.data.data;
      }
    }
  } catch (err) {
    console.error("Failed to reset password:", err);
    // throw new Error('The API register is not responding')
  }
};
