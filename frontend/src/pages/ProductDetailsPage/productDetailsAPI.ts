import type { CategoryTypes, Gender } from "../../types/Category.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "../../types/Product.ts";
import { products_for_woman, products_for_man, products_for_kids } from "../../mocks/products.ts";

type FetchProductArgs = {
  gender: Gender;
  id: string;
};

export const fetchProductById = createAsyncThunk<Product, FetchProductArgs>(
  "cartDetails/fetchProductById",
  async ({ gender, id }) => {
    await  new Promise((resolve) => setTimeout(resolve, 500))

    const dataMap: Record<CategoryTypes, Product[]> = {
      women: products_for_woman,
      men: products_for_man,
      kids: products_for_kids,
    }

    const products = dataMap[gender];

    const product = products.find((item) => {
      console.log("product", item);
      return item.id === +id;
    });

    console.log("result", product)
    if (!product) {
      throw new Error("Product not found");
    }

    return product;

  }
)