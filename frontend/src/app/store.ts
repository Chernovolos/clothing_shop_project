import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../slices/product.slice.ts"
import cartSlice from "@/slices/cart.slice.ts";
import userSlice  from "@/slices/user.slice.ts";

export const store = configureStore({
  reducer: {
    productSlice: productSlice,
    cartSlice: cartSlice,
    userSlice: userSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
