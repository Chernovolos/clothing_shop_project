import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store.ts";
import type { Category } from "../../types/Category";
import { fetchCategories } from "./categoryAPI.ts";

interface CategoryState {
  categories: Category[];
  error: null | string;
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchCategories.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCategories.fulfilled, ( state, action) => {
          state.loading = false;
          state.categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Something went wrong";
        })

  }
});

export const { setCategories } = categorySlice.actions;

export const selectCategories = (state: RootState) =>
  state.categorySlice.categories;

export default categorySlice.reducer;
