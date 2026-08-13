import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store.ts";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import { getProducts } from "@/thunk/product.thunk.ts";
import { getProductById } from "@/thunk/product-details.thunk.ts";
import type { ProductFilterChip } from "@/components/ProductFilter/ProductFilterMenu.tsx";
import type { ProductCategory, ProductSubType, ProductType } from "@/types/enums/product.enums.ts";

export type ProductFilterForm = {
  categoryType?: ProductCategory;
  type?: ProductType[];
  subType?: ProductSubType[];
  tags?: number[];
  maxPrice?: number,
  minPrice?: number,
}

interface ProductState {
  product: ProductDetailsDto | null;
  products: ProductDetailsDto[];
  productError: string | null;
  productsError: string | null;
  CategoriesError: string | null;
  isProductLoading: boolean;
  isProductsLoading: boolean;
  isCategoriesLoading: boolean;
  chips: ProductFilterChip[];
  hasProductsLoaded: boolean;
  loadedCategory: ProductCategory | null;
  productFilter: ProductFilterForm | null
}

const initialState: ProductState = {
  product: null,
  products: [],
  productError: null,
  productsError: null,
  CategoriesError: null,
  isProductLoading: false,
  isProductsLoading: false,
  isCategoriesLoading: false,

  chips: [],
  hasProductsLoaded: false,
  loadedCategory: null,
  productFilter: null,
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
    },
    setProductChips: (state, action: PayloadAction<ProductFilterChip[]>) => {
      state.chips = action.payload;
    },
    clearAllProductChips: (state) => {
      state.chips = [];
    },
    removeProductChip: (state, action: PayloadAction<ProductFilterChip>) => {
      state.chips = state.chips.filter((chip) => (
        !(chip.type === action.payload.type && chip.value === action.payload.value)
      ))
    },

    setProductFilter(state, action: PayloadAction<ProductFilterForm>) {
      state.productFilter = action.payload;
    },

    clearProductFilter: (state) => {
      state.productFilter = {
        type: [],
        subType: [],
        tags: [],
        minPrice: 0,
        maxPrice: 999999.99,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      //PRODUCT
      .addCase(getProductById.pending, (state) => {
        state.isProductLoading = true;
        state.productError = null;
        // state.product = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isProductLoading = false;
        state.productError = action.payload?.message || "Something went wrong";
      })

      //PRODUCTS
      .addCase(getProducts.pending, (state) => {
        state.isProductsLoading = true;
        state.productsError = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isProductsLoading = false;
        state.products = action.payload;
        state.hasProductsLoaded = true;
        state.loadedCategory = action.meta.arg.categoryType ?? null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isProductsLoading = false;
        state.productsError = action.payload?.message || "Something went wrong";
      })
  },
});

export const {
  resetProducts,
  setProductChips,
  clearAllProductChips,
  removeProductChip,
  setProductFilter,
  clearProductFilter,
} = productSlice.actions;

export const selectProduct = (state: RootState) => state.productSlice.product;
export const selectProducts = (state: RootState) => state.productSlice.products;

export const selectIsProductLoading = (state: RootState) => state.productSlice.isProductLoading;
export const selectIsProductsLoading = (state: RootState) => state.productSlice.isProductsLoading;

export const selectHasProductsLoaded = (state: RootState) => state.productSlice.hasProductsLoaded;
export const selectLoadedCategory = (state: RootState) => state.productSlice.loadedCategory;

export const selectProductChips = (state: RootState) => state.productSlice.chips;
export const selectProductFilter = (state: RootState) => state.productSlice.productFilter;
export default productSlice.reducer;