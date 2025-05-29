import Cookies from 'js-cookie'; 
import { jwtDecode } from "jwt-decode";

export const baseItemsURL = 'http://localhost:8055/items';
export const baseURL = 'http://localhost:8055';

    // Get a cookie
    export  const getCookie =  async () => {
      const tokenValue = Cookies.get('Token');
      console.log('Token in getCookie function:', tokenValue);
      return tokenValue;
    }
     // Remove a cookie
     export  const removeCookie = async () => {
      Cookies.remove('Token');
      console.log('Token removed'); 
      return null;
    }
     // decoded JWT token
     export  const decodedToken = async () => {
     const token = await getCookie();
  if (!token || typeof token !== "string" || token.split(".").length !== 3) {
    console.error("Invalid or missing JWT token");
    return null;
  }
  const decoded = jwtDecode(token);
  console.log('Decoded JWT in decodedToken function:', decoded.id);
  return decoded;
    }
    
// Set a cookie
    export  const setCookie = async (jwtToken)=>{
Cookies.set('Token',  jwtToken  , { expires: 7 }); // 7 days expiration
       
      }
      
