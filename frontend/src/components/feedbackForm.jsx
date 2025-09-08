"use client"

import { useState } from "react"

export default function FeedbackForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      alert("All fields are required!")
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="max-w-xl mx-auto mt-2 mb-5 bg-white shadow-md shadow-gray-400 rounded-2xl p-8 border border-gray-100">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-gray-900 font-sans mb-2">Send Us Feedback</h1>
        <p className="text-gray-600 font-sans">We'd love to hear your thoughts and suggestions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 font-sans">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="w-full border border-gray-200 p-4 rounded-xl font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 font-sans">Your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="w-full border border-gray-200 p-4 rounded-xl font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 font-sans">Your Feedback</label>
          <textarea
            name="message"
            placeholder="Share your thoughts, suggestions, or concerns..."
            rows="5"
            className="w-full border border-gray-200 p-4 rounded-xl font-sans text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-sans font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-sans font-medium hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
