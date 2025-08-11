import Link from "next/link";
import { signOut, auth } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  const cookieStore = await cookies();
  console.log(cookieStore.get("session"));

  // Check if user is authenticated
  if (!session) {
    redirect("/sign-in");
  }

  // Check user role and redirect non-admin users
  if (session.user?.role !== "admin") {
    console.log("User role:", session.user?.role, "- Redirecting to customer homepage");
    redirect("/customer/homepage");
  }

  // Only admin users can see this dashboard
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">Welcome, Admin! You have full access.</p>

        {/* Dashboard Action Buttons */}
        <div className="space-y-4 mb-6">
          <Link
            href="/add-Products"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Add Product
          </Link>

          <Link
            href="/display-products"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Display Product
          </Link>

        </div>

        {/* Sign Out Button */}
        <form
          action={async () => {
            "use server";
            const cookieStore = await cookies();
            cookieStore.delete("session");
            await signOut({ redirectTo: "/sign-in" });
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
  );
}
