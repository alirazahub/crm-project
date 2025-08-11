"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import GoogleSignUp from '../../components/GoogleSignUp';

// --- Validators ---
const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
const validatePhone = (phone) =>
    /^(03\d{9}|\+923\d{9})$/.test(phone);

export default function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
    });

    const router = useRouter(); 

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullname, email, password, phone, role } = formData;

        if (!fullname || !email || !password || !phone) {
            alert("All fields are required.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid Gmail address.");
            return;
        }

        if (!validatePassword(password)) {
            alert("Password must be at least 8 characters and include upper/lowercase, numbers, and symbols.");
            return;
        }

        if (!validatePhone(phone)) {
            alert("Enter a valid Pakistani phone number (03XXXXXXXXX or +923XXXXXXXXX).");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/register/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, password, phone, role }),
            });

            if (res.ok) {
                alert("User registered successfully!");
                router.replace('/sign-in');
                
            } else {
                const err = await res.json();
                alert(`Registration failed: ${err.message || "Unknown error"}`);
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong during registration.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Create an Account</h2>
                
                {/* Google Sign Up Button */}
                <GoogleSignUp />
                
                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: "Full Name", name: "fullname", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Password", name: "password", type: "password" },
                        { label: "Phone", name: "phone", type: "text" },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
