import { createSlice } from "@reduxjs/toolkit";
import type { CartItem } from "@/types/Product.ts";
import type { RootState } from "@/app/store.ts";
import type { Order } from "@/types/Order.ts";

interface CartState {
  cartItems: CartItem[],
  order: Order | null,
  isCartItemsLoading: boolean,
  error: null | string
}

const initialState: CartState = {
  cartItems: [],
  order: null,
  isCartItemsLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // .addCase(createOrder.pending, (state) => {
    //   state.error = null;
    // })
    // .addCase(createOrder.fulfilled, (state, action) => {
    //   state.order = action.payload;
    // })
    // .addCase(createOrder.rejected, (state, action) => {
    //   state.error = action.error.message || "Something went wrong";
    // })
    //
    // .addCase(deleteOrder.pending, (state) => {
    //   state.error = null;
    // })
    // .addCase(deleteOrder.fulfilled, (state, action) => {
    //   state.order = action.payload;
    // })
    // .addCase(deleteOrder.rejected, (state, action) => {
    //   state.error = action.error.message || "Something went wrong";
    // })
    //
    // .addCase(updateOrderThunk.pending, (state) => {
    //   state.error = null;
    // })
    // .addCase(updateOrderThunk.fulfilled, (state, action) => {
    //   state.order = action.payload;
    // })
    // .addCase(updateOrderThunk.rejected, (state, action) => {
    //   state.error = action.error.message || "Something went wrong";
    // })


  },
})

export const selectOrder = (state: RootState) => state.cartSlice.order;

export const selectTotalQuantity = (
  state: RootState,
) =>
  state.cartSlice.order?.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  ) ?? 0;

export default cartSlice.reducer;