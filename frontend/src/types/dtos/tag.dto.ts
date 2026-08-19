import type { ProductCategory, ProductSubType, ProductType } from "@/types/enums/product.enums.ts";

export interface TagDto {
  id: number;
  title: string;
}

export interface TagFilterDto {
  categoryType?: ProductCategory;
  type?: ProductType;
  subType?: ProductSubType[];
  colors?: number[];
  sizes?: number[];
  maxPrice?: number,
  minPrice?: number,
}
