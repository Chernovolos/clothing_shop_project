import { createAsyncThunk} from "@reduxjs/toolkit";
import type { Category, CategoryTypes } from "@/types/Category.ts";
import type { Product } from "@/types/Product.ts";
import MockProductService from "@/services/MockProductService.ts";

export const getCategories = createAsyncThunk<Category[]>(
    "product/getCategories",
  MockProductService.getCategories
);

export const getProducts = createAsyncThunk<Product[], CategoryTypes>(
  "products/getProducts",
  MockProductService.getProducts
)

