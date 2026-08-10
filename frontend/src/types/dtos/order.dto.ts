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
  city: string;
  warehouseRef: string;
  warehouseLat?: number;
  warehouseLon?: number;
  paymentMethod: OrderPaymentType;
}