"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account? <Link href="/login" style={{ color: "#007cba" }}>Login</Link>
      </p>
    </div>
  );
}
