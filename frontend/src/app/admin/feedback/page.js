"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchFeedbacks,
  replyFeedback,
  resolveFeedback,
  updateFeedbackStatus,
  clearMessages,
} from "@/store/slices/feedbackSlice"
import MetricCard from "@/components/MetricCard"
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Loader from "@/components/loader"
export default function FeedbackPage() {
  const dispatch = useDispatch()
  const { feedbacks, status, error, successMessage, replyLoading } = useSelector((state) => state.feedback)

  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [showResolveSuccess, setShowResolveSuccess] = useState(false)

  useEffect(() => {
    dispatch(fetchFeedbacks())
  }, [dispatch])

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearMessages()), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, dispatch])

  const handleReply = async () => {
    if (!replyMessage.trim()) return alert("Reply cannot be empty!")
    const result = await dispatch(replyFeedback({ id: selectedFeedback._id, response: replyMessage }))
    if (!result.error) {
      setReplyMessage("")
      setSelectedFeedback(null)
    }
  }

  const handleResolve = (id) => {
    if (confirm("Mark as resolved?")) {
      dispatch(resolveFeedback(id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateFeedbackStatus({ id, status: newStatus }))
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const newFeedbacks = feedbacks.filter((f) => f.status === "New")
  const inProgressFeedbacks = feedbacks.filter((f) => f.status === "In Progress")
  const respondedFeedbacks = feedbacks.filter((f) => f.status === "Responded")
  const resolvedFeedbacks = feedbacks.filter((f) => f.status === "Resolved")

  const getStatusDot = (status) => {
    switch (status) {
      case "New":
        return "bg-yellow-500"
      case "In Progress":
        return "bg-blue-500"
      case "Responded":
        return "bg-green-500"
      case "Resolved":
        return "bg-slate-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "In Progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "Responded":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "Resolved":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }
  }

  const handleResolveWithReply = async () => {
    if (!replyMessage.trim()) return alert("Reply cannot be empty!")
    const replyResult = await dispatch(replyFeedback({ id: selectedFeedback._id, response: replyMessage }))
    if (!replyResult.error) {
      const resolveResult = await dispatch(resolveFeedback(selectedFeedback._id))
      if (!resolveResult.error) {
        setShowResolveSuccess(true)
        setTimeout(() => {
          setShowResolveSuccess(false)
          setReplyMessage("")
          setSelectedFeedback(null)
        }, 2000)
      }
    }
  }
  
  if (status=="loading") {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="text-lg text-slate-300 mt-4">Loading feedback...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10 max-w-7xl">
        <div className="flex flex-col min-h-[80vh] w-full mx-auto">
          <div className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden rounded-lg border mb-6">
            <div className="border-b border-slate-700/50 pb-5 p-6">
              <div className="flex items-center justify-between">
                <div className="text-slate-100 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-cyan-500" />
                  <h1 className="text-xl font-semibold">Customer Feedback</h1>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">Manage customer queries and send email responses</p>
            </div>
          </div>

          {status === "loading" && (
            <div className="bg-blue-600/20 border border-blue-700 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-md">
              <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-blue-400 text-sm">Loading feedbacks...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-600/20 border border-red-700 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-md">
              <AlertCircle className="text-red-400" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-600/20 border border-green-700 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-md">
              <CheckCircle className="text-green-400" size={20} />
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

          <div className="p-6 mb-8 border border-slate-700/50 bg-slate-900/50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="New Queries"
                value={newFeedbacks.length}
                icon={MessageSquare}
                color="yellow"
                detail="Pending review"
                unit=""
              />
              <MetricCard
                title="In Progress"
                value={inProgressFeedbacks.length}
                icon={Clock}
                color="blue"
                detail="Being processed"
                unit=""
              />
              <MetricCard
                title="Responded"
                value={respondedFeedbacks.length}
                icon={CheckCircle}
                color="green"
                detail="Awaiting customer"
                unit=""
              />
              <MetricCard
                title="Resolved"
                value={resolvedFeedbacks.length}
                icon={XCircle}
                color="cyan"
                detail="Completed"
                unit=""
              />
            </div>
          </div>

          <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-lg backdrop-blur-sm flex-grow">
            <div className="bg-slate-800/30 border-b border-slate-700/50">
              <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-slate-400">
                <div className="col-span-3">Customer</div>
                <div className="col-span-4">Message</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-slate-700/30">
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  className="grid grid-cols-12 gap-3 items-center text-xs text-slate-300 px-3 py-3 hover:bg-slate-800/30"
                >
                  <div className="col-span-3">
                    <div className="text-slate-100 font-medium">{fb.name}</div>
                    <div className="text-slate-400 mt-1 truncate">{fb.email}</div>
                  </div>

                  <div className="col-span-4">
                    <div className="text-slate-300">
                      {fb.message.length > 80 ? `${fb.message.substring(0, 80)}...` : fb.message}
                    </div>
                    {fb.adminResponse && (
                      <div className="mt-2 text-cyan-400 bg-cyan-900/20 p-2 rounded border border-cyan-700/30">
                        <span className="font-medium">Reply:</span> {fb.adminResponse.substring(0, 40)}...
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(fb.status)} mr-2`}></div>
                    <Badge variant="outline" className={`${getStatusBadge(fb.status)} text-xs`}>
                      {fb.status}
                    </Badge>
                  </div>

                  <div className="col-span-2 text-slate-400">
                    {new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>

                  <div className="col-span-1 flex items-center gap-1">
                    <button
                      className="p-1 bg-cyan-600 hover:bg-cyan-700 rounded text-white h-6 px-2 text-xs transition-colors"
                      onClick={() => {
                        setSelectedFeedback(fb)
                        setReplyMessage(fb.adminResponse || "")
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {feedbacks.length === 0 && status !== "loading" && (
            <div className="text-center py-8 bg-slate-900/30 rounded-lg border border-slate-700/50">
              <MessageSquare className="mx-auto text-slate-500 mb-2 h-8 w-8" />
              <h3 className="text-sm font-medium text-slate-300 mb-1">No feedback received yet</h3>
              <p className="text-xs text-slate-500">Customer feedback will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-600/50 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">Reply to Customer</h2>
                  <p className="text-slate-400 text-sm">Responding to {selectedFeedback.name}</p>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-200 transition-colors duration-200 p-2 hover:bg-slate-700/50 rounded-lg"
                  onClick={() => setSelectedFeedback(null)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-8 p-6 bg-slate-800/70 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedFeedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-100 font-semibold">{selectedFeedback.name}</p>
                    <p className="text-slate-400 text-sm">{selectedFeedback.email}</p>
                  </div>
                </div>
                <div className="border-t border-slate-600/30 pt-4">
                  <p className="text-slate-400 text-sm mb-2 font-medium">Original Message:</p>
                  <p className="text-slate-200 leading-relaxed bg-slate-700/30 p-4 rounded-lg border border-slate-600/20">
                    "{selectedFeedback.message}"
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-slate-300 text-sm font-medium mb-3">Your Reply</label>
                <textarea
                  className="w-full bg-slate-800/70 border border-slate-600/50 rounded-xl p-4 text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 text-sm leading-relaxed placeholder-slate-500"
                  rows="6"
                  placeholder="Type your professional reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>

              {showResolveSuccess && (
                <div className="mb-6 bg-green-600/20 border border-green-700 rounded-xl p-4 flex items-center gap-3 shadow-md animate-in fade-in-0 slide-in-from-top-2">
                  <CheckCircle className="text-green-400" size={20} />
                  <p className="text-green-400 text-sm font-medium">
                    Feedback resolved successfully! Closing dialog...
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  className="px-6 py-3 bg-slate-700/70 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                  onClick={() => setSelectedFeedback(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
                  onClick={handleReply}
                  disabled={replyLoading}
                >
                  {replyLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    "Send Reply"
                  )}
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/25"
                  onClick={handleResolveWithReply}
                  disabled={replyLoading}
                >
                  {replyLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Resolving...
                    </span>
                  ) : (
                    "Reply & Resolve"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
