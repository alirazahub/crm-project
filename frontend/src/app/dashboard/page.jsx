
import { signOut , auth } from "@/auth.js"
import { cookies } from 'next/headers'

export default async function Dashboard() {
    const session = await auth() ;
    const cookieStore = await cookies() ;
    console.log(cookieStore.get('session')) ;
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to your Dashboard</h1>
        <p className="text-gray-600 mb-6">You are signed in.</p>

        <form
        action={async () => {
        "use server"
         const cookieStore = await cookies();
         cookieStore.delete('session');
        await signOut({redirectTo:'/sign-in'}) ;
        }}
        >
        <button
        type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Sign Out
        </button>
        </form>
      </div>
    </div>
  )
}
