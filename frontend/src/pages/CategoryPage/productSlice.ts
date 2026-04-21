import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store.ts";
import type { Product } from "../../types/Product";
import { fetchProducts } from "./categoryAPI.ts";

interface ProductState {
  products: Product[];
  error: null | string;
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
  },
});

export const { setProducts } = productSlice.actions;

export const selectProduct = (state: RootState) => state.productSlice.products;
export const selectLoading = (state: RootState) => state.productSlice.loading;
export const selectError = (state: RootState) => state.productSlice.error;

export default productSlice.reducer;