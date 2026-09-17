import type { OrderItemDto } from "@/types/dtos/order-item.dto.ts";
import type { OrderPaymentType, OrderStatus } from "@/types/enums/order.enums.ts";

export interface OrderDto {
  id: number;
  quantity: number;
  total: number;
  status: OrderStatus;
  orderItems: OrderItemDto[];
}

export interface CheckoutOrderDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comment?: string;
  npCityRef: string;
  npWarehouseRef: string;
  npWarehouseLat?: number;
  npWarehouseLon?: number;
  cityName: string;
  warehouseName: string;
  paymentMethod: OrderPaymentType;
}

export interface OrderDetailsDto extends OrderDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comment?: string;
  npCityRef: string;
  npWarehouseRef: string;
  npWarehouseLat?: string;
  npWarehouseLon?: string;
  cityName: string;
  warehouseName: string;
  paymentMethod: OrderPaymentType;
  createdAt: string;
}