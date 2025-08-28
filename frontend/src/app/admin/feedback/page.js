"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedbacks,
  replyFeedback,
  resolveFeedback,
  updateFeedbackStatus,
  clearMessages,
} from "@/store/slices/feedbackSlice";

import AdminSidebar from "@/components/AdminSideBar";
import AdminHeader from "@/components/AdminHeader";

export default function FeedbackPage() {
  const dispatch = useDispatch();
  const { feedbacks, status, error, successMessage, replyLoading } =
    useSelector((state) => state.feedback);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleReply = async () => {
    if (!replyMessage.trim()) return alert("Reply cannot be empty!");
    const result = await dispatch(
      replyFeedback({ id: selectedFeedback._id, response: replyMessage })
    );
    if (!result.error) {
      setReplyMessage("");
      setSelectedFeedback(null);
    }
  };

  const handleResolve = (id) => {
    if (confirm("Mark as resolved?")) {
      dispatch(resolveFeedback(id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateFeedbackStatus({ id, status: newStatus }));
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}

        {/* Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="flex flex-col min-h-[80vh]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Customer Feedback
              </h1>
              <p className="text-slate-400">
                Manage customer queries and send email responses
              </p>
            </div>

            {/* Status Messages */}
            {status === "loading" && (
              <div className="p-4 mb-4 bg-blue-900/40 border border-blue-700 rounded-lg text-blue-300">
                Loading feedbacks...
              </div>
            )}
            {error && (
              <div className="p-4 mb-4 bg-red-900/40 border border-red-700 rounded-lg text-red-300">
                ❌ {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 mb-4 bg-green-900/40 border border-green-700 rounded-lg text-green-300">
                ✅ {successMessage}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "New Queries",
                  count: feedbacks.filter((f) => f.status === "New").length,
                  color: "yellow",
                },
                {
                  label: "In Progress",
                  count: feedbacks.filter((f) => f.status === "In Progress")
                    .length,
                  color: "blue",
                },
                {
                  label: "Responded",
                  count: feedbacks.filter((f) => f.status === "Responded")
                    .length,
                  color: "green",
                },
                {
                  label: "Resolved",
                  count: feedbacks.filter((f) => f.status === "Resolved")
                    .length,
                  color: "gray",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-4 text-center shadow"
                >
                  <div className={`text-2xl font-bold text-${stat.color}-400`}>
                    {stat.count}
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-slate-200">
                  <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">Customer</th>
                      <th className="px-6 py-3 text-left">Message</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {feedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-slate-800/40">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-100">
                            {fb.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {fb.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs text-sm">
                          {fb.message.length > 100
                            ? `${fb.message.substring(0, 100)}...`
                            : fb.message}
                          {fb.adminResponse && (
                            <div className="mt-2 text-xs text-blue-300 bg-blue-900/30 p-2 rounded">
                              <strong>Previous Reply:</strong>{" "}
                              {fb.adminResponse.substring(0, 50)}...
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={fb.status}
                            onChange={(e) =>
                              handleStatusChange(fb._id, e.target.value)
                            }
                            className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Responded">Responded</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatDate(fb.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
                              onClick={() => {
                                setSelectedFeedback(fb);
                                setReplyMessage(fb.adminResponse || "");
                              }}
                            >
                              📧 Reply
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm"
                              onClick={() => handleResolve(fb._id)}
                            >
                              ✓ Resolve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {feedbacks.length === 0 && status !== "loading" && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-400 text-lg">
                  No feedback received yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-lg shadow-xl border border-slate-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-slate-100">
                  Reply to {selectedFeedback.name}
                </h2>
                <button
                  className="text-slate-400 hover:text-slate-200"
                  onClick={() => setSelectedFeedback(null)}
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 p-4 bg-slate-800 rounded-lg text-slate-300">
                <p className="text-sm mb-2">
                  <strong>Customer Email:</strong> {selectedFeedback.email}
                </p>
                <p className="text-sm mb-2">
                  <strong>Original Message:</strong>
                </p>
                <p className="text-sm italic">"{selectedFeedback.message}"</p>
              </div>

              <textarea
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-slate-100 resize-none"
                rows="6"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-slate-100 rounded-lg"
                  onClick={() => setSelectedFeedback(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
                  onClick={handleReply}
                  disabled={replyLoading}
                >
                  {replyLoading ? "Sending..." : "📧 Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
