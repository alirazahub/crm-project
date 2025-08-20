// store/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

//Fetch cart
export const fetchCart = createAsyncThunk(
    "cart/fetch", async () => {
    const res = await api.get("/cart/user");
    return res.data;
});



// Add to cart
export const addToCart = createAsyncThunk(
    "cart/add",
    async ({ productId, quantity }) => {
        console.log("Token being sent:", localStorage.getItem("token"));
    const res = await api.post("/cart/add-item", { productId, quantity });
        return res.data;
    }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
    "cart/remove",
    async (productId) => {
        const res = await api.delete(`/cart/remove-item/${productId}`);
        return res.data;
    }
);

// Clear cart
export const clearCart = createAsyncThunk("cart/clear", async () => {
    const res = await api.delete("/cart/clear-cart");
    return res.data;
});
//calculation
const calculateTotals = (cart) => {
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * (item.product?.price || item.priceAtAddition);
    });

    return { totalQuantity, totalPrice };
};

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cart: [],
        totalQuantity: 0,
        totalPrice: 0,
        status: "idle",
        error: null,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload.items || []; // ✅ backend sends items
                const totals = calculateTotals(state.cart);
                state.totalQuantity = totals.totalQuantity;
                state.totalPrice = totals.totalPrice;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload.items || []; // ✅
                const totals = calculateTotals(state.cart);
                state.totalQuantity = totals.totalQuantity;
                state.totalPrice = totals.totalPrice;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload.items || []; // ✅
                const totals = calculateTotals(state.cart);
                state.totalQuantity = totals.totalQuantity;
                state.totalPrice = totals.totalPrice;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.cart = []; // ✅ backend just sends message
                state.totalQuantity = 0;
                state.totalPrice = 0;
            });

    },
});

export default cartSlice.reducer;
