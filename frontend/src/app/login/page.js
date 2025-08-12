"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem",
            backgroundColor: loading ? "#ccc" : "#007cba",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don't have an account? <Link href="/signup" style={{ color: "#007cba" }}>Sign up</Link>
      </p>
    </div>
  );
}
