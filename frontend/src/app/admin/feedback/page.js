// pages/admin/FeedbackPage.jsx
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

export default function FeedbackPage() {
  const dispatch = useDispatch();
  const { 
    feedbacks, 
    status, 
    error, 
    successMessage, 
    replyLoading 
  } = useSelector((state) => state.feedback);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Load feedbacks on page load
  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // ✅ Handle Reply (with actual email sending)
  const handleReply = async () => {
    if (!replyMessage.trim()) {
      alert("Reply cannot be empty!");
      return;
    }

    try {
      const result = await dispatch(
        replyFeedback({ 
          id: selectedFeedback._id, 
          response: replyMessage 
        })
      );

      if (!result.error) {
        setReplyMessage("");
        setSelectedFeedback(null);
        // Success message will be shown via Redux state
      }
    } catch (error) {
      console.error('Reply failed:', error);
    }
  };

  // ✅ Handle Mark Resolved
  const handleResolve = async (id) => {
    if (confirm("Are you sure you want to mark this as resolved?")) {
      await dispatch(resolveFeedback(id));
    }
  };

  // ✅ Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    await dispatch(updateFeedbackStatus({ id, status: newStatus }));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer Feedback</h1>
        <p className="text-gray-600 mt-2">Manage customer queries and send email responses</p>
      </div>

      {/* Status & Messages */}
      {status === "loading" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading feedbacks...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-medium">❌ {error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">✅ {successMessage}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="text-2xl font-bold text-yellow-600">
            {feedbacks.filter(f => f.status === 'New').length}
          </div>
          <div className="text-sm text-gray-600">New Queries</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="text-2xl font-bold text-blue-600">
            {feedbacks.filter(f => f.status === 'In Progress').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="text-2xl font-bold text-green-600">
            {feedbacks.filter(f => f.status === 'Responded').length}
          </div>
          <div className="text-sm text-gray-600">Responded</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="text-2xl font-bold text-gray-600">
            {feedbacks.filter(f => f.status === 'Resolved').length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbacks.map((fb) => (
                <tr key={fb._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{fb.name}</div>
                      <div className="text-sm text-gray-500">{fb.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {fb.message.length > 100 
                        ? `${fb.message.substring(0, 100)}...` 
                        : fb.message
                      }
                    </div>
                    {fb.adminResponse && (
                      <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        <strong>Previous Reply:</strong> {fb.adminResponse.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={fb.status}
                      onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        fb.status === "New"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : fb.status === "Responded"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : fb.status === "Resolved"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Responded">Responded</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{formatDate(fb.createdAt)}</div>
                    {fb.respondedAt && (
                      <div className="text-xs text-green-600">
                        Replied: {formatDate(fb.respondedAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                        onClick={() => {
                          setSelectedFeedback(fb);
                          setReplyMessage(fb.adminResponse || "");
                        }}
                      >
                        📧 Reply
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
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

      {feedbacks.length === 0 && status !== "loading" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg">No feedback received yet.</p>
        </div>
      )}

      {/* Reply Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reply to {selectedFeedback.name}
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedFeedback(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Customer Email:</strong> {selectedFeedback.email}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Original Message:</strong>
                </p>
                <p className="text-sm text-gray-800 italic">"{selectedFeedback.message}"</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply (will be sent via email):
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="6"
                  placeholder="Type your reply here. This will be sent to the customer's email address..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  📧 This response will be emailed to: {selectedFeedback.email}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                  onClick={() => setSelectedFeedback(null)}
                  disabled={replyLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleReply}
                  disabled={replyLoading || !replyMessage.trim()}
                >
                  {replyLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      📧 Send Email Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// // pages/admin/FeedbackPage.jsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFeedbacks,
//   replyFeedback,
//   resolveFeedback,
// } from "@/store/slices/feedbackSlice";

// export default function FeedbackPage() {
//   const dispatch = useDispatch();
//   const { feedbacks, status, error, successMessage } = useSelector(
//     (state) => state.feedback
//   );

//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [replyMessage, setReplyMessage] = useState("");

//   // Load feedbacks on page load
//   useEffect(() => {
//     dispatch(fetchFeedbacks());
//   }, [dispatch]);

//   // ✅ Handle Reply (via thunk)
//   const handleReply = () => {
//     if (!replyMessage.trim()) return alert("Reply cannot be empty!");

//     dispatch(
//       replyFeedback({ id: selectedFeedback._id, response: replyMessage })
//     ).then((res) => {
//       if (!res.error) {
//         setReplyMessage("");
//         setSelectedFeedback(null);
//       }
//     });
//   };

//   // ✅ Handle Mark Resolved (via thunk)
//   const handleResolve = (id) => {
//     dispatch(resolveFeedback(id));
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Customer Feedback</h1>

//       {/* Status & Messages */}
//       {status === "loading" && <p>Loading feedbacks...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {successMessage && <p className="text-green-600">{successMessage}</p>}

//       {/* Feedback Table */}
//       <table className="w-full border rounded-lg shadow">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2">Name</th>
//             <th className="p-2">Email</th>
//             <th className="p-2">Message</th>
//             <th className="p-2">Status</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {feedbacks.map((fb) => (
//             <tr key={fb._id} className="border-t">
//               <td className="p-2">{fb.name}</td>
//               <td className="p-2">{fb.email}</td>
//               <td className="p-2">{fb.message}</td>
//               <td className="p-2">
//                 <span
//                   className={`px-2 py-1 rounded text-xs ${
//                     fb.status === "New"
//                       ? "bg-yellow-200 text-yellow-800"
//                       : fb.status === "Responded"
//                       ? "bg-green-200 text-green-800"
//                       : fb.status === "Resolved"
//                       ? "bg-gray-200 text-gray-800"
//                       : "bg-blue-200 text-blue-800"
//                   }`}
//                 >
//                   {fb.status}
//                 </span>
//               </td>
//               <td className="p-2 flex gap-2">
//                 <button
//                   className="px-3 py-1 bg-blue-500 text-white rounded"
//                   onClick={() => setSelectedFeedback(fb)}
//                 >
//                   Reply
//                 </button>
//                 <button
//                   className="px-3 py-1 bg-gray-500 text-white rounded"
//                   onClick={() => handleResolve(fb._id)}
//                 >
//                   Resolve
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Reply Modal */}
//       {selectedFeedback && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white w-96 p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">
//               Reply to {selectedFeedback.name}
//             </h2>
//             <p className="text-sm text-gray-600 mb-2">
//               <strong>Customer Email:</strong> {selectedFeedback.email}
//             </p>
//             <textarea
//               className="w-full border rounded p-2 mb-4"
//               rows="4"
//               placeholder="Type your reply here..."
//               value={replyMessage}
//               onChange={(e) => setReplyMessage(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-3 py-1 bg-gray-400 text-white rounded"
//                 onClick={() => setSelectedFeedback(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-3 py-1 bg-green-600 text-white rounded"
//                 onClick={handleReply}
//               >
//                 Send Reply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
