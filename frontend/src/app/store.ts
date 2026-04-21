import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "../pages/CategoryPage/categorySlice.ts";
import productSlice from "../pages/CategoryPage/productSlice.ts"
import productDetailsSlice  from "@/pages/ProductDetailsPage/productDetailsSlice.ts";

export const store = configureStore({
  reducer: {
    categorySlice: categorySlice,
    productSlice: productSlice,
    productDetails: productDetailsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
