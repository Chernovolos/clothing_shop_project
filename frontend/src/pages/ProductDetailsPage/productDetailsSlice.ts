import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store.ts";
import { fetchProductById } from "./productDetailsAPI.ts";
import type { Product } from "@/types/Product.ts";

interface ProductDetailsState {
  product: Product | null;
  error: null | string;
  loading: boolean;
}

const initialState: ProductDetailsState = {
  product: null,
  error: null,
  loading: false,
}

export const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    clearSelectedProductDetails: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  }
})

export const { clearSelectedProductDetails } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;

export const selectProductDetails = (state: RootState) =>
  state.productDetails.product;

export const selectProductLoading = (state: RootState) =>
  state.productDetails.loading;

export const selectProductError = (state: RootState) =>
  state.productDetails.error;