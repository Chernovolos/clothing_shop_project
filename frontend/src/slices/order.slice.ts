import type { OrderDto } from "@/types/dtos/order.dto.ts";
import type { RootState } from "../app/store.ts";
import type { OrderItemDto } from "@/types/dtos/order-item.dto.ts";
import { createSlice } from "@reduxjs/toolkit";
import { addOrderItem, checkOutOrder, getOrCreateOrder, removeOrderItem, updateOrder } from "@/thunk/order.thunk.ts";

interface OrderState {
  order: OrderDto | null;
  orderItem: OrderItemDto | null;

  isOrderLoading: boolean;
  orderError: string | null;

  completedOrder: OrderDto | null;
}

const initialState: OrderState = {
  order: null,
  orderItem: null,
  isOrderLoading: false,
  orderError: null,
  completedOrder: null,
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
    clearOrderError: (state) => {
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //GET OR CREATE ORDER //
      .addCase(getOrCreateOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })
      .addCase(getOrCreateOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrCreateOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong";
      })

      //ADD ORDER ITEM//
      .addCase(addOrderItem.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })
      .addCase(addOrderItem.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload;
      })
      .addCase(addOrderItem.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong";
      })

      //UPDATE//
      .addCase(updateOrder.pending, (state) => {
        state.isOrderLoading = false;
        state.orderError = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong";
      })

      //REMOVE//
      .addCase(removeOrderItem.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })
      .addCase(removeOrderItem.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload;
      })
      .addCase(removeOrderItem.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong";
      })

      //CHECKOUT ORDER//
      .addCase(checkOutOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })

      .addCase(checkOutOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.completedOrder = action.payload;
      })

      .addCase(checkOutOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong";
      })
  },
})

export const {clearOrder, clearOrderError} = orderSlice.actions;

export const selectOrder = (state: RootState) => state.orderSlice.order;
export const selectIsOrderLoading = (state: RootState) => state.orderSlice.isOrderLoading;
export const selectOrderError = (state: RootState) => state.orderSlice.orderError;

export default orderSlice.reducer;