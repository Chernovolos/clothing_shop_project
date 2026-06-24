import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/services/api.service.ts";
import type { RejectValue } from "@/types/dtos/custom-error.dto.ts";
import type { CreateUserDto, UserDto } from "@/types/dtos/user.dto.ts";

export const createUser = createAsyncThunk<
  UserDto,
  CreateUserDto,
  { rejectValue: RejectValue }
>(
  'users/createUser',

  async (userCreateDto, thunkAPI) => {
    try {
      const result = await apiService.createUser(userCreateDto);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getSelfUser = createAsyncThunk<
  UserDto,
  void,
  { rejectValue: RejectValue }
>(
  'users/getSelfUser',
  async (_, thunkAPI) => {
    try {
      const result= await apiService.getSelfUser();
      return result ;
    } catch (error: any) {
      localStorage.removeItem("accessToken");
      return thunkAPI.rejectWithValue(error);
    }
  },
)