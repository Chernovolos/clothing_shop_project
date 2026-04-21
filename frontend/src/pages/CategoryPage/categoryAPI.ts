import { createAsyncThunk} from "@reduxjs/toolkit";
import type { Category, CategoryTypes } from "../../types/Category.ts";
import type { Product } from "../../types/Product.ts";
import { product_categories, products_for_kids, products_for_man, products_for_woman} from "../../mocks/products.ts"

export const fetchCategories = createAsyncThunk<Category[]>(
    "category/fetchCategories",
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        return product_categories;
    }
);

export const fetchProductsForWoman = createAsyncThunk<Product[]>(
    "category/fetchProductsForWoman",
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        return products_for_woman;
    }
);

export const fetchProductsForMan = createAsyncThunk<Product[]>(
    "category/fetchProductsForMan",
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        return products_for_man;
    }
);

export const fetchProductsForKids = createAsyncThunk<Product[]>(
    "category/fetchProductsForKids",
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        return products_for_kids;
    }
);

export const fetchProducts = createAsyncThunk<Product[], CategoryTypes>(
  "category/fetchProducts",
  async (category) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const dataMap: Record<CategoryTypes, Product[]> = {
      women: products_for_woman,
      men: products_for_man,
      kids: products_for_kids,
    }

    return dataMap[category];
  }
)

