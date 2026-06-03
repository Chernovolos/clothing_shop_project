import { useMemo } from "react";
import type { Color } from "@/types/Color.ts";
import type { Product } from "@/types/Product.ts";
import type { Size } from "@/types/Size.ts";

export const useProductStock = (product: Product | null | undefined) => {
  return useMemo(() => {
    if (!product) {
      return {
        stockAvailabilityMap: new Map<string, number>(),
        availableColors: [] as Color[],
        availableSizes: [] as Size[],
      };
    }

    const map = new Map<string, number>();
    const colorsMap = new Map<number, Color>();
    const sizesSet = new Set<Size>();

    for (const stock of product.stock) {
      sizesSet.add(stock.size);
      colorsMap.set(stock.color.id, stock.color);

      map.set(`${stock.color.code}_${stock.size}`, stock.available);
    }

    return {
      stockAvailabilityMap: map,
      availableColors: Array.from(colorsMap.values()),
      availableSizes: Array.from(sizesSet.values()),
    };
  }, [product]);
};