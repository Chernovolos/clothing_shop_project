import type { ColorDto } from './color.dto';
import type { ProductSize } from "@/types/enums/product.enums.ts";

export interface StockDto {
  id: number;
  productSize: ProductSize;
  available: number;
  color: ColorDto | null;
}
