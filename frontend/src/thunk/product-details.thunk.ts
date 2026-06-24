import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import type { RejectValue } from "@/types/dtos/custom-error.dto.ts";
import apiService from "@/services/api.service.ts";

export const getProductById = createAsyncThunk<
  ProductDetailsDto,
  number,
  { rejectValue: RejectValue }
>(
  'products/getProductById',

  async (id, thunkAPI) => {
    try {
      const result = await apiService.getProductById(id);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)