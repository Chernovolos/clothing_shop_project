import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CartItem } from "@/types/Product.ts";
import type { RootState } from "@/app/store.ts";
import type { Order } from "@/types/Order.ts";
import MockOrderService from "@/services/MockOrderService.ts";

export const createOrder = createAsyncThunk<
  Order,
  CartItem,
{ state: RootState }
>(
  "cart/createOrder",

  async (cartItem, { getState }) => {

    const existOrder = getState().cartSlice.order;

    return MockOrderService.getOrder(cartItem, existOrder);
  }

);

export const deleteOrder = createAsyncThunk<
  Order,
  CartItem,
  {state: RootState}>(
    "cart/deleteOrder",

  async (cartItem, { getState}) => {
    const existOrder = getState().cartSlice.order;

    return MockOrderService.removeOrder(cartItem, existOrder);
  }
)

export const updateOrderThunk = createAsyncThunk<
  Order,
  CartItem,
  {state: RootState}>(
    "cart/updateOrder",
  async (cartItem, { getState}) => {
    const existOrder = getState().cartSlice.order;

    return MockOrderService.updateOrder(cartItem, existOrder);
  }
)




