import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import { useMemo } from "react";
import type { ColorDto } from "@/types/dtos/color.dto.ts";
import type { ProductSize } from "@/types/enums/product.enums.ts";
import type { ImageDto } from "@/types/dtos/image.dto.ts";

export const useProductStock2 = (  product: ProductDetailsDto | null) => {

  return useMemo(() => {
    if(!product) {
      return {
        stockMap: new Map<string, number>(),
        colors: [] as ColorDto[],
        sizes: [] as ProductSize[],
        imageMap: new Map<number, ImageDto[]>(),
      }
    }

    const stockMap = new Map<string, number>();
    const colorsMap = new Map<number, ColorDto>();
    const sizesSet = new Set<ProductSize>();
    const imageMap = new Map<number, ImageDto[]>();

    for(const stock of product.stocks) {
      const color = stock.color;
      const size = stock.productSize;
      const available = stock.available;

      if(!color) continue;

      const colorId = color?.id;

      stockMap.set(`${colorId}_${size}`, available);
      colorsMap.set(colorId, color);

      if (stock.productSize !== null) {
        sizesSet.add(size);
      }
    }

    for (const image of product.images) {
      const colorId = image.color?.id ?? 0;
      if (!imageMap.has(colorId)) {
        imageMap.set(colorId, []);
      }

      imageMap.get(colorId)!.push(image);
    }

    return {
      stockMap,
      colors: Array.from(colorsMap.values()),
      sizes: Array.from(sizesSet),
      imageMap,
    };
  }, [product]);

}