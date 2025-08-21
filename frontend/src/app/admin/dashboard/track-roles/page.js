import { cookies } from "next/headers";
import api from "@/utils/api";

export default async function TrackRoles() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token").value;
  console.log(token) ;

  const res = await api.get("/track-roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = res.data;

  return (
    <div className="space-y-4 p-6 max-w-md mx-auto">
      {/* Users */}
      <div className="group flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-blue-100 cursor-pointer transition">
        <span className="font-semibold text-gray-800">Users: {data.users.count}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-xl">
          →
        </span>
      </div>

      {/* Sales */}
      <div className="group flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-green-100 cursor-pointer transition">
        <span className="font-semibold text-gray-800">Sales: {data.sales.count}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-600 text-xl">
          →
        </span>
      </div>

      {/* Managers */}
      <div className="group flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-yellow-100 cursor-pointer transition">
        <span className="font-semibold text-gray-800">Managers: {data.managers.count}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-600 text-xl">
          →
        </span>
      </div>
    </div>
  );
}
