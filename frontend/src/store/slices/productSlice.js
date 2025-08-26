import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // axios instance with baseURL

// ------------------- Thunks -------------------

// CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      for (const key in productData) {
        const value = productData[key];

        if (key === "images") {
          // Append images properly
          if (Array.isArray(value)) {
            value.forEach((file) => {
              if (file instanceof File) {
                formData.append("images", file);
              }
            });
          }
        } else if (typeof value === "object" && value !== null) {
          // Stringify only objects/arrays
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          // Primitive values
          formData.append(key, value);
        }
      }

      //fetch doesnt send cookies by defualt 
      /*const res = await fetch("http://localhost:5000/api/createproduct", {
        method: "POST",
        body: formData,
      });*/

      const res = await api.post("/createproduct", formData) ;

      //if error occurs backend error will be caught in catch block
      //error is already in json 
      //return await res.json();

      return res.data ;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);



// GET ALL PRODUCTS
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/productlist");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// GET PRODUCT BY ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/productlist/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/productlist/${id}`);
      return id; // return deleted product id
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      for (const key in updatedData) {
        const value = updatedData[key];

        if (key === "images") {
  if (Array.isArray(value)) {
    value.forEach((file) => {
      if (file instanceof File) {
        // New file upload
        formData.append("images", file);
      } else if (typeof file === "string") {
        // Existing image URL, send separately
        formData.append("existingImages", file);
      }
    });
  }
}
 else if (typeof value === "object" && value !== null) {
          // Stringify only objects/arrays
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          // Primitive values
          formData.append(key, value);
        }
      }

      const { data } = await api.put(`/productlist/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);



// ------------------- Slice -------------------
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
   
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
     setSelectedProduct: (state, action) => {
    state.selectedProduct = action.payload;
  },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ALL
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });


  },
});

export const { clearSelectedProduct, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;



/*
RULES
1)Initial state (the default data).
2)Reducers (synchronous functions that change state).
3)Async logic (optional) — like fetching from API.
*/

