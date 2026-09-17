import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RejectValue } from "@/types/dtos/custom-error.dto.ts";
import apiService from "@/services/api.service.ts";
import type { CreateOrderItemDto, UpdateOrderItemDto } from "@/types/dtos/order-item.dto.ts";
import type { CheckoutOrderDto, OrderDto, OrderDetailsDto } from "@/types/dtos/order.dto.ts";

export const getOrCreateOrder = createAsyncThunk<
  OrderDto,
  void,
  { rejectValue: RejectValue }
>(
  'orders/createOrCreateOrder',

  async (_, thunkAPI) => {
    try {
      const result = await apiService.getOrCreateOrder();
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const addOrderItem = createAsyncThunk<
  OrderDto,
  CreateOrderItemDto,
  { rejectValue: RejectValue }
>(
  'orders/addOrderItem',
  async (createOrderItem, thunkAPI) => {
    try {
      const result = await apiService.addOrderItem(createOrderItem)
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const updateOrder = createAsyncThunk<
  OrderDto,
  UpdateOrderItemDto,
  { rejectValue: RejectValue }
>(
  'orders/updateOrderItem',
  async (updateOrderItem, thunkAPI) => {
    try {
      const result = await apiService.updateOrder(updateOrderItem)
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const removeOrderItem = createAsyncThunk<
  OrderDto,
  number,
  { rejectValue: RejectValue }
>(
  'orders/removeOrderItem',
  async (id, thunkAPI) => {
    try {
      const result = await apiService.removeOrderItem(id)
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const checkOutOrder = createAsyncThunk<
  OrderDto,
  CheckoutOrderDto,
  { rejectValue: RejectValue }
>(
  'orders/checkOutOrder',
  async (checkoutOrderDto, thunkAPI) => {
    try {
      const result = await apiService.checkOutOrder(checkoutOrderDto)
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const getOrderById = createAsyncThunk<
  OrderDetailsDto,
  number,
  { rejectValue: RejectValue }
>(
  'orders/getOrderById',
  async (id, thunkAPI) => {
    try {
      const result = await apiService.getOrderById(id);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)

export const getOrders = createAsyncThunk<
  OrderDetailsDto[],
  void,
  { rejectValue: RejectValue }
>(
  'orders/getOrders',
  async (_, thunkAPI) => {
    try {
      const result = await apiService.getOrders();
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  },
)
