import type { OrderItemType } from "@/types/enums/order.enums.ts";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";

export interface OrderItemDto {
  id: number;
  type: OrderItemType;
  orderId: number;
  productId: number;
  stockId: number;
  quantity: number;
  price: number;
  product: ProductDetailsDto
}


export interface CreateOrderItemDto {
  type: OrderItemType;
  productId: number;
  stockId: number;
  quantity: number;
}

export interface UpdateOrderItemDto {
  id: number;
  type: OrderItemType;
  orderId: number;
  productId: number;
  stockId: number;
  quantity: number;
  price: number;
  newStockId?: number
}