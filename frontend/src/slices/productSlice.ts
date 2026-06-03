import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store.ts";
import type { Product } from "../types/Product.ts";
import { getCategories, getProducts } from "@/pages/ProductPage/categoryAPI.ts";
import type { Category } from "@/types/Category.ts";
import { getProductById } from "@/pages/ProductDetailsPage/productDetailsAPI.ts";

interface ProductState {
  product:  Product | null;
  products: Product[];
  categories: Category[];
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
  categories: [],
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
    setProduct: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
    },
    clearSelectedProductDetails: (state) => {
      state.product = null;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
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

    //CATEGORIES
      .addCase(getCategories.pending, (state) => {
        state.isCategoriesLoading = true;
        state.CategoriesError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isCategoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isCategoriesLoading = false;
        state.CategoriesError = action.error.message || "Something went wrong";
      })
  },
});

export const { setProduct, setProducts, setCategories } = productSlice.actions;

export const selectProduct = (state: RootState) => state.productSlice.product;
export const selectProducts = (state: RootState) => state.productSlice.products;
export const selectCategories = (state: RootState) => state.productSlice.categories;

export const selectIsProductLoading = (state: RootState) => state.productSlice.isProductLoading;
export const selectIsProductsLoading =  (state: RootState) => state.productSlice.isProductsLoading;

export default productSlice.reducer;