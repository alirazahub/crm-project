"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import FeedbackForm from "../../../components/feedbackForm";
import { createFeedback } from "../../../store/slices/feedbackSlice";

export default function FeedbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.feedback);

  const handleSubmit = async (formData) => {
    const result = await dispatch(createFeedback(formData));
    if (result.meta.requestStatus === "fulfilled") {
      alert("Feedback submitted successfully!");
    //   router.push("/thank-you"); // or wherever you want to redirect
    } else {
      alert("Failed to submit feedback: " + (result.error?.message || "Unknown error"));
      console.log("Error details:", error.message);
    }
  };

  const handleCancel = () => {
    router.push("/"); // redirect home or any other page
  };

  return (
    <FeedbackForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={status === "loading"}
    />
  );
}
