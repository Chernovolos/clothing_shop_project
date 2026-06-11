import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import apiService from "@/services/api.service.ts";
import axios from "axios";

// type FetchProductArgs = {
//   gender: Gender;
//   id: string;
// };

interface MyKnownError {
  message: string;
}

// export const getProductById = createAsyncThunk<Product, FetchProductArgs>(
//   "produc-details/getProductById",
//   ProductService.getProductById
// )

export const getProductById = createAsyncThunk<
  ProductDetailsDto,
  number,
  { rejectValue: MyKnownError }
>(
  'products/getProductById',

  async (id, thunkAPI) => {
    try {
      const result = await apiService.getProductById(id);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        console.error(error.response?.status);
        const errorData: MyKnownError = error.response?.data || {
          message: error.message || 'An unexpected network error occurred.',
        };
        return thunkAPI.rejectWithValue(errorData)
      }
      return thunkAPI.rejectWithValue({message: 'A runtime error occurred.'});
    }
  },
)