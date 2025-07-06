'use client'

import axios from 'axios';
import { register , login } from "@/callAPI/users"
const train=()=> {
  
  const ADMIN_TOKEN = 'y-M5MNSauYKP5VFW0rvRl4zQg6V_LyR6';
const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:8055/users/register', {
      email: 'make22222@example.com',
      password: 'password123',
      first_name: 'make222222',

    }
      );

      const getRes = await axios.get('http://localhost:8055/users', {
      params: {
        filter: { email: { _eq: 'make22222@example.com' } },
      },
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    const user = getRes.data.data[0];

    if (!user) {
      console.log('User not found.');
      return;
    }

    const userId = user.id;

    // Step 2: Update (PATCH) the user status to active
    const patchRes = await axios.patch(`http://localhost:8055/users/${userId}`,
      { status: 'active' },
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      }
    );

    console.log('User activated:', patchRes.data);

console.log('User registered:', response.data);

await login("make22222@example.com" , 'password123')

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
  }
};






  return (
    <section>
<button onClick={()=>{registerUser()}}>registerUser</button> <br/>
<button onClick={()=>{rr}}>login</button> <br/>

    </section>
  );
}



export default train;