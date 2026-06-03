import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../slices/productSlice.ts"
import cartSlice from "@/slices/cartSlice.ts";

export const store = configureStore({
  reducer: {
    productSlice: productSlice,
    cartSlice: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
