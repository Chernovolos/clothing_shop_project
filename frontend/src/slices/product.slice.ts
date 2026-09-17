import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store.ts";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import type { ProductFilterChip } from "@/components/ProductFilter/ProductFilterMenu.tsx";
import type { ColorDto } from "@/types/dtos/color.dto.ts";
import type { TagDto } from "@/types/dtos/tag.dto.ts";
import { getProducts } from "@/thunk/product.thunk.ts";
import { getProductById } from "@/thunk/product-details.thunk.ts";
import { getFilterColors, getFilterSizes, getFilterTags } from "@/thunk/product-filter.thunk.ts";
import {
  PRODUCT_TYPE,
  type ProductCategory,
  type ProductSize,
  type ProductSubType,
  type ProductType,
} from "@/types/enums/product.enums.ts";

export type ProductFilterForm = {
  categoryType?: ProductCategory;
  type?: ProductType;
  subType?: ProductSubType[];
  tags?: number[];
  colors?: number[];
  sizes?: number[];
  maxPrice?: number,
  minPrice?: number,
}

interface ProductState {
  product: ProductDetailsDto | null;
  products: ProductDetailsDto[];
  productError: string | null;
  productsError: string | null;

  isProductLoading: boolean;
  isProductsLoading: boolean;
  isCategoriesLoading: boolean;

  chips: ProductFilterChip[];
  hasProductsLoaded: boolean;
  loadedCategory: ProductCategory | null;
  productFilter: ProductFilterForm | null;

  tagsFilter: TagDto[];
  tagsError: string | null;
  isLoadingTags: boolean;

  colorsFilter: ColorDto[];
  colorsError: string | null;
  isLoadingColors: boolean;

  sizesFilter: ProductSize[];
  sizesError: string | null;
  isLoadingSizes: boolean;
}

const initialState: ProductState = {
  product: null,
  products: [],

  productError: null,
  productsError: null,

  isProductLoading: false,
  isProductsLoading: false,
  isCategoriesLoading: false,

  chips: [],
  hasProductsLoaded: false,
  loadedCategory: null,
  productFilter: null,

  tagsFilter: [],
  tagsError: null,
  isLoadingTags: false,

  colorsFilter: [],
  colorsError: null,
  isLoadingColors: false,

  sizesFilter: [],
  sizesError: null,
  isLoadingSizes: false,
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
      state.tagsFilter = [];
      state.colorsFilter = [];
      state.sizesFilter = [];
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
        type: PRODUCT_TYPE.DEFAULT,
        subType: [],
        tags: [],
        colors: [],
        sizes: [],
        minPrice: undefined,
        maxPrice: undefined,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      //PRODUCT
      .addCase(getProductById.pending, (state) => {
        state.isProductLoading = true;
        state.productError = null;
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

      //TAGS
      .addCase(getFilterTags.pending, (state) => {
        state.isLoadingTags = true;
        state.tagsError = null;
      })
      .addCase(getFilterTags.fulfilled, (state, action) => {
        state.isLoadingTags = false;
        state.tagsFilter = action.payload;
      })
      .addCase(getFilterTags.rejected, (state, action) => {
        state.isLoadingTags = false;
        state.tagsError = action.payload?.message || "Something went wrong";
      })

    //COLORS
      .addCase(getFilterColors.pending, (state) => {
        state.isLoadingColors = true;
        state.tagsError = null;
      })
      .addCase(getFilterColors.fulfilled, (state, action) => {
        state.isLoadingColors = false;
        state.colorsFilter = action.payload;
      })
      .addCase(getFilterColors.rejected, (state, action) => {
        state.isLoadingColors = false;
        state.colorsError = action.payload?.message || "Something went wrong";
      })

    //SIZES
      .addCase(getFilterSizes.pending, (state) => {
        state.isLoadingSizes = true;
        state.sizesError = null;
      })
      .addCase(getFilterSizes.fulfilled, (state, action) => {
        state.isLoadingSizes = false;
        state.sizesFilter = action.payload;
      })
      .addCase(getFilterSizes.rejected, (state, action) => {
        state.isLoadingSizes = false;
        state.sizesError = action.payload?.message || "Something went wrong";
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

export const selectTagsFilter = (state: RootState) => state.productSlice.tagsFilter;
export const selectColorsFilter = (state: RootState) => state.productSlice.colorsFilter;
export const selectSizesFilter = (state: RootState) => state.productSlice.sizesFilter;
export default productSlice.reducer;