import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { createSession } from "../lib/session";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks:{
    async signIn({user}){
      console.log('callback') ;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-sign-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,      
            image: user.image,
          }),
        })
        const data = await res.json() ;
        createSession(data.token) ;
      } catch (error) {
        console.error("Failed to sync user to backend:", error)
        return false // fail sign-in if needed
      }
      
      return true // proceed with sign-in
      
    }
  }
})