// src/auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("✅ Google sign-in successful for:", user.email);
      return true; // Allow all Google sign-ins
    },
    async session({ session, token }) {
      // Add user ID to session if needed
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  }
});
