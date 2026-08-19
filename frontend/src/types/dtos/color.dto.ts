import type { ProductCategory, ProductSubType, ProductType } from "@/types/enums/product.enums.ts";

export interface ColorDto {
  id: number;
  code: string;
  hex: string;
}

export interface CreateColorDto {
  code: string;
  hex: string;
}

export interface UpdateColorDto {
  code: string;
  hex: string;
}

export interface ColorFilterDto {
  categoryType?: ProductCategory;
  type?: ProductType;
  subType?: ProductSubType[];
  tags? : number[];
  sizes?: number[];
  maxPrice?: number,
  minPrice?: number,
}
