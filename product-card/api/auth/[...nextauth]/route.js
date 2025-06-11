// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:"602047752247-39qmihl9qoh15v24vr6ojptd5g60i9pr.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
