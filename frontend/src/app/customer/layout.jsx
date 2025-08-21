// app/customer/layout.js

import Navbar from "@/components/Navbar";

export default function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
