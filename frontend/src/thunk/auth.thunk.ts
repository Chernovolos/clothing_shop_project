import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/services/api.service.ts";
import type { AuthResponseDto } from "@/types/dtos/auth.dto.ts";
import type { UserLoginDto } from "@/types/dtos/user.dto.ts";
import type { RejectValue } from "@/types/dtos/custom-error.dto.ts";
import type { AppDispatch } from "@/app/store.ts";
import { logout } from "@/slices/user.slice.ts";


export const login = createAsyncThunk<
  AuthResponseDto,
  UserLoginDto,
  { rejectValue: RejectValue }
>(
  'auth/login',
  async (userLoginDto, thunkAPI) => {
    try {
      const result = await apiService.login(userLoginDto);

      localStorage.setItem(
        "accessToken",
        result.accessToken,
      )
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const logoutUser = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("accessToken");
  dispatch(logout());
}