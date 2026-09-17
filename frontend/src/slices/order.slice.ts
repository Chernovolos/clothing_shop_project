import type { OrderDetailsDto, OrderDto } from "@/types/dtos/order.dto.ts";
import type { RootState } from "../app/store.ts";
import type { OrderItemDto } from "@/types/dtos/order-item.dto.ts";
import { createSlice } from "@reduxjs/toolkit";
import {
  addOrderItem,
  checkOutOrder,
  getOrCreateOrder,
  getOrderById, getOrders,
  removeOrderItem,
  updateOrder,
} from "@/thunk/order.thunk.ts";

interface OrderState {
  order: OrderDto | null;
  orderItem: OrderItemDto | null;
  orders: OrderDetailsDto[] | null;

  isOrderLoading: boolean;
  orderError: string | null;
  completedOrder: OrderDto | null;

  isOrderDetailsLoading: boolean;
  orderDetailsError: string | null;
  orderDetails: OrderDetailsDto | null;

  isOrdersLoading: boolean;
  ordersError: string | null;
}

const initialState: OrderState = {
  order: null,
  orderItem: null,
  orders: null,
  isOrderLoading: false,
  orderError: null,
  completedOrder: null,
  orderDetails:null,
  isOrderDetailsLoading: false,
  orderDetailsError: null,
  isOrdersLoading: false,
  ordersError: null,
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

    //GET ORDER BY ID//
      .addCase(getOrderById.pending, (state) => {
        state.isOrderDetailsLoading = true;
        state.orderDetailsError = null;
      })

      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.orderDetails = action.payload;
      })

      .addCase(getOrderById.rejected, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.orderDetailsError =
          action.payload?.message ??
          action.error.message ??
          "Something went wrong";
      })

      //GET ORDERS //
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })

      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })

      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError =
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

export const selectOrderDetails = (state: RootState) => state.orderSlice.orderDetails;
export const selectIsOrderDetailsLoading = (state: RootState) => state.orderSlice.isOrderDetailsLoading;
export const selectOrderDetailsError = (state: RootState) => state.orderSlice.orderDetailsError;

export const selectOrders = (state: RootState) => state.orderSlice.orders;
export const selectIsOrdersLoading = (state: RootState) => state.orderSlice.isOrdersLoading;
export const selectOrdersError = (state: RootState) => state.orderSlice.ordersError;
export default orderSlice.reducer;