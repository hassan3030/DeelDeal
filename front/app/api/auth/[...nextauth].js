// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: '602047752247-39qmihl9qoh15v24vr6ojptd5g60i9pr.apps.googleusercontent.com',
      clientSecret: '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'
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // You can create or check the user in Directus here
      try {
        await axios.post('http://localhost:8055/users', {
          email: user.email,
          first_name: user.name,
        }, {
          headers: {
            Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
          },
        });
      } catch (err) {
        // Ignore if already exists or handle errors
        if (err?.response?.status !== 409) {
          console.error('Directus user sync error:', err);
        }
      }

      return true;
    },

    async session({ session, token, user }) {
      // Attach Directus token or role if needed
      return session;
    },

    async jwt({ token, account, profile }) {
      return token;
    },
  },
});
