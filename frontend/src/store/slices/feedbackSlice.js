// store/slices/feedbackSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // axios instance

// ✅ POST feedback (customer submits contact form)
export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/feedback", feedbackData, {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Feedback submission failed"
      );
    }
  }
);

// ✅ GET all feedbacks (admin side)
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/feedback", { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Reply to feedback (send email)
export const replyFeedback = createAsyncThunk(
  "feedback/replyFeedback",
  async ({ id, response }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/feedback/${id}/reply`,
        { response },
        { withCredentials: true }
      );
      return data.feedback;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to send reply"
      );
    }
  }
);

// ✅ Resolve feedback (mark as resolved without reply)
export const resolveFeedback = createAsyncThunk(
  "feedback/resolveFeedback",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/feedback/${id}/resolve`,
        {}, // no body needed
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to resolve feedback"
      );
    }
  }
);

// ✅ Update feedback status
export const updateFeedbackStatus = createAsyncThunk(
  "feedback/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/feedback/${id}/status`,
        { status },
        { withCredentials: true }
      );
      return data.feedback;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ✅ Slice
const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [], // all feedback (admin side)
    currentFeedback: null, // single/latest if needed
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    successMessage: null,
    replyLoading: false, // separate loading state for replies
  },
  reducers: {
    resetFeedbackState: (state) => {
      state.currentFeedback = null;
      state.successMessage = null;
      state.error = null;
      state.status = "idle";
      state.replyLoading = false;
    },
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentFeedback = action.payload;
        state.successMessage = "Feedback submitted successfully!";
        state.feedbacks.unshift(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Fetch feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Reply
      .addCase(replyFeedback.fulfilled, (state, action) => {
        state.replyLoading = false;
        state.successMessage = "Reply sent successfully!";
        const index = state.feedbacks.findIndex(
          (fb) => fb._id === action.payload._id
        );
        if (index !== -1) state.feedbacks[index] = action.payload;
      })

      // ✅ Resolve
      .addCase(resolveFeedback.fulfilled, (state, action) => {
        state.successMessage = "Feedback resolved successfully!";
        const index = state.feedbacks.findIndex(
          (fb) => fb._id === action.payload._id
        );
        if (index !== -1) state.feedbacks[index] = action.payload;
      });
  },
});

export const { resetFeedbackState, clearMessages } = feedbackSlice.actions;
export default feedbackSlice.reducer;
