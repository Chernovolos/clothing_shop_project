import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store.ts";
import { getProductById } from "@/pages/ProductDetails/product-details.api.ts";
import { getProducts } from "@/pages/Product/product.api.ts";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";

interface ProductState {
  product:  ProductDetailsDto | null;
  products: ProductDetailsDto[];
  productError: string | null;
  productsError: string | null;
  CategoriesError: string | null;
  isProductLoading: boolean;
  isProductsLoading: boolean;
  isCategoriesLoading:boolean;
}

const initialState: ProductState = {
  product: null,
  products: [],
  productError: null,
  productsError: null,
  CategoriesError: null,
  isProductLoading: false,
  isProductsLoading: false,
  isCategoriesLoading:false,
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
    }
  },

  extraReducers: (builder) => {
    builder
      //PRODUCT
      .addCase(getProductById.pending, (state) => {
        state.isProductLoading = true;
        state.productError = null;
        state.product = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.error.message || "Something went wrong";
      })

      //PRODUCTS
      .addCase(getProducts.pending, (state) => {
        state.isProductsLoading = true;
        state.productsError = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isProductsLoading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isProductsLoading = false;
        state.productsError = action.error.message || "Something went wrong";
      })
  },
});

export const { resetProducts } = productSlice.actions;

export const selectProduct = (state: RootState) => state.productSlice.product;
export const selectProducts = (state: RootState) => state.productSlice.products;

export const selectIsProductLoading = (state: RootState) => state.productSlice.isProductLoading;
export const selectIsProductsLoading =  (state: RootState) => state.productSlice.isProductsLoading;

export default productSlice.reducer;