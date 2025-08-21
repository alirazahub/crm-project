// store/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
     // store/slices/orderSlice.js
const { data } = await api.post("/orders", orderData, {
  withCredentials: true,
});
 await dispatch(clearCart());

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Order placement failed"
      );
    }
  }
);


// Fetch latest order
export const fetchMyOrder = createAsyncThunk(
  "order/fetchMyOrder",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/my-orders");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],          // for history (if needed)
    currentOrder: null,  // latest order
    status: "idle",      // idle | loading | succeeded | failed
    error: null,
    successMessage: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.successMessage = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Place order
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload.order;
        state.successMessage = action.payload.message;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Fetch latest order
      .addCase(fetchMyOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentOrder = action.payload; // backend returns latest order
      })
      .addCase(fetchMyOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
