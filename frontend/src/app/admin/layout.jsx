
import AdminNavbar from "@/components/admin-navbar";

export default function CustomerLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
}
