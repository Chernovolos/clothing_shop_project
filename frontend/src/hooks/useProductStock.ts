import { useMemo } from "react";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import type { ColorDto } from "@/types/dtos/color.dto.ts";
import type { ProductSize } from "@/types/enums/product.enums.ts";
import type { ImageDto } from "@/types/dtos/image.dto.ts";

export const useProductStock = (
  product: ProductDetailsDto | null | undefined,
  selectedColorId: number | null,
  selectedSize: ProductSize | null,
) => {
  return useMemo(() => {
    if (!product) {
      return {
        stockMap: new Map<string, number>(),
        availableColors: [] as ColorDto[],
        availableSizes: [] as ProductSize[],
        availableSizesByColor: [] as ProductSize[],
        availableColorsBySize: [] as ColorDto[],
        imageMap: new Map<number, ImageDto[]>(),
      };
    }

    const stockMap = new Map<string, number>();
    const colorsMap = new Map<number, ColorDto>();
    const sizesSet = new Set<ProductSize>();
    const imageMap = new Map<number, ImageDto[]>();

    const sizeByColor = new Map<number, Set<ProductSize>>();
    const colorBySize = new Map<ProductSize, Set<number>>();

    for (const stock of product.stocks) {
      const color = stock.color;
      if (!color) continue;

      const colorId = color?.id;
      const size = stock.productSize;
      const available = stock.available;

      colorsMap.set(colorId, color);

      if (size !== null) {
        sizesSet.add(size);
      }

      stockMap.set(`${ colorId }_${ size }`, available);

      if (!sizeByColor.has(colorId)) {
        sizeByColor.set(colorId, new Set());
      }
      sizeByColor.get(colorId)!.add(size);

      if (!colorBySize.has(size)) {
        colorBySize.set(size, new Set());
      }
      colorBySize.get(size)!.add(colorId);
    }

    for (const image of product.images) {
      let colorId = image.color?.id ?? 0;
      if (!imageMap.has(colorId)) {
        imageMap.set(colorId, [image])
      } else {
        imageMap.get(colorId)?.push(image);
      }
    }

    return {
      stockMap,
      availableColors: Array.from(colorsMap.values()),
      availableSizes: Array.from(sizesSet),

      availableSizesByColor: selectedColorId
        ? Array.from(sizeByColor.get(selectedColorId) ?? [])
        : Array.from(sizesSet),

      availableColorsBySize: selectedSize !== null
        ? Array.from(colorBySize.get(selectedSize) ?? [])
          .map((id) => colorsMap.get(id)!)
          .filter(Boolean)
        : Array.from(colorsMap.values()),
      imageMap,
    };
  }, [product, selectedColorId, selectedSize]);
};