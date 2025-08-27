import express from "express";
import Feedback from "../models/feedbackModel.js";
import { authorize } from "../middleware/authorization.js";
import {sendFeedbackReply} from "../utils/emailservice.js";

const router = express.Router();

// POST - create new feedback
router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    res.status(500).json({ error: "Failed to save feedback" });
    console.log(error.message);
  }
});

// GET - fetch all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // newest first
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});
// Reply to feedback (send email + update status)
// Reply to feedback (send email + update status)
router.post("/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: "Not found" });

    // ✅ Send email
    await sendFeedbackReply(
      feedback.email,
      feedback.name,
      response,
      feedback.message
    );

    // ✅ Update DB
    feedback.adminResponse = response;
    feedback.status = "Responded";
    feedback.respondedAt = new Date();
    await feedback.save();

    res.json({ message: "Reply sent via email and status updated", feedback });
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ error: "Failed to send reply email" });
  }
});


// Mark resolved without reply
router.patch("/:id/resolve", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark resolved" });
  }
});

export default router;
