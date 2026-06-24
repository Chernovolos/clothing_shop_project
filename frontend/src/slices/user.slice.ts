import type { UserDto } from "@/types/dtos/user.dto.ts";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store.ts";
import { createUser, getSelfUser } from "@/thunk/user.thunk.ts";
import { login } from "@/thunk/auth.thunk.ts";

interface UsersState {
  user: UserDto | null;
  isUserLoading: boolean;
  userError: string | null;

  accessToken: string | null;

  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
}

const initialState: UsersState = {
  user: null,
  isUserLoading: false,
  userError: null,

  accessToken: null,

  isAuthenticated: false,
  authLoading: false,
  authError: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.userError = null;
      state.authError = null;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder
      //// REGISTRATION /////
      .addCase(createUser.pending, (state) => {
        state.isUserLoading = true;
        state.userError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload?.message || "Something went wrong";
      })

      /////// LOGIN ///////
      .addCase(login.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = (action.payload as any)?.message || "Login failed";
      })

      /////// CHECK USER ///////
      .addCase(getSelfUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(getSelfUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getSelfUser.rejected, (state, action) => {
        state.authLoading = false;
        state.user = null;
        state.accessToken = null;
        state.authError = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
      })
  },
})

export const { clearError, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.userSlice.user;
export const selectUserError = (state: RootState) => state.userSlice.userError;
export const selectUsesLoading = (state: RootState) => state.userSlice.isUserLoading;

export const selectAccessToken = (state: RootState) => state.userSlice.accessToken;
export const selectAuthLoading = (state: RootState) => state.userSlice.authLoading;
export const selectIsAuthenticated = (state: RootState) => state.userSlice.isAuthenticated;
export const selectAuthError = (state: RootState) => state.userSlice.authError;
export default userSlice.reducer;