import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductDetailsDto, ProductFilterDto } from "@/types/dtos/product.dto.ts";
import type { RejectValue } from "@/types/dtos/custom-error.dto.ts";
import apiService from "@/services/api.service.ts";

export const getProducts = createAsyncThunk<
  ProductDetailsDto[],
  ProductFilterDto,
  { rejectValue: RejectValue }
>(
  'products/getProducts',

  async (filter, thunkAPI) =>  {
    try {
      const result = await apiService.getProducts(filter);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);