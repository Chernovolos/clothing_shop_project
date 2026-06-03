import type { Color } from "@/types/Color.ts";
import type { Size } from "@/types/Size.ts";
import type { Product } from "@/types/Product.ts";

export type OrderProduct = {
  id: number;
  color: Color;
  size: Size;
  quantity: number;
  sum: number;
  product: Product
}

export type Order = {
  id: number;
  date: string;
  total: number;
  items: OrderProduct[];
}