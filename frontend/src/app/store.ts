import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../slices/product.slice.ts"
import userSlice  from "@/slices/user.slice.ts";
import orderSlice  from "@/slices/order.slice.ts";
import novaPoshtaSlice from "@/slices/nova-poshta.slice.ts";

export const store = configureStore({
  reducer: {
    productSlice: productSlice,
    userSlice: userSlice,
    orderSlice: orderSlice,
    novaPoshta: novaPoshtaSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
