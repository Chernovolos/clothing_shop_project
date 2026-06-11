import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductDetailsDto, ProductFilterDto } from "@/types/dtos/product.dto.ts";
import axios from "axios";
import apiService from "@/services/api.service.ts";

interface MyKnownError {
  message: string;
}

export const getProducts = createAsyncThunk<
  ProductDetailsDto[],
  ProductFilterDto,
  { rejectValue: MyKnownError }
>(
  'products/getProducts',

  async (filter, thunkAPI) =>  {
    try {
      const result = await apiService.getProducts(filter);
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
      return thunkAPI.rejectWithValue({ message: 'A runtime error occurred.' });
    }
  },
);
