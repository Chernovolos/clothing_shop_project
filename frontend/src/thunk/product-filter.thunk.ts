import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RejectValue } from "@/types/dtos/custom-error.dto.ts";
import apiService from "@/services/api.service.ts";
import type { TagDto, TagFilterDto } from "@/types/dtos/tag.dto.ts";
import type { ColorDto, ColorFilterDto } from "@/types/dtos/color.dto.ts";
import type { ProductSize } from "@/types/enums/product.enums.ts";
import type { ProductFilterDto } from "@/types/dtos/product.dto.ts";

export const getFilterTags = createAsyncThunk<
  TagDto[],
  TagFilterDto,
  { rejectValue: RejectValue }
>(
  'tags/getFilterTags',

  async (filter, thunkAPI) => {
    try {
      const result = await apiService.filterTags(filter);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getFilterColors = createAsyncThunk<
  ColorDto[],
  ColorFilterDto,
  { rejectValue: RejectValue }
>(
  'colors/getFilterColors',

  async (filter, thunkAPI) => {
    try {
      const result = await apiService.filterColors(filter);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const getFilterSizes = createAsyncThunk<
  ProductSize[],
  ProductFilterDto,
  { rejectValue: RejectValue }
>(
  'sizes/getFilterSizes',

  async (filter, thunkAPI) => {
    try {
      const result = await apiService.filterSizes(filter);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)