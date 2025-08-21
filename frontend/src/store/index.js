
import { configureStore , combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage



// 1. Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only these slices will be persisted
};

// 2. Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
});

// 3. Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer ,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});

// 5. Create persistor
export const persistor = persistStore(store);

