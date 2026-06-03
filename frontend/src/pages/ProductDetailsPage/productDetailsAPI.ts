import type { Gender } from "@/types/Category.ts";
import type { Product } from "@/types/Product.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService } from "@/services";

type FetchProductArgs = {
  gender: Gender;
  id: string;
};

export const getProductById = createAsyncThunk<Product, FetchProductArgs>(
  "produc-details/getProductById",
  ProductService.getProductById
)