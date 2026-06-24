import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import { useState } from "react";
import type { ProductSize } from "@/types/enums/product.enums.ts";
import { useProductStock2 } from "@/hooks/useProductStock2.ts";

export const useProductVariant = (product: ProductDetailsDto | null) => {
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  const {
    stockMap,
    colors,
    sizes,
    imageMap,
  } = useProductStock2(product);

  const getStock = (colorId: number, size: ProductSize) =>
    stockMap.get(`${ colorId }_${ size }`) ?? 0;

  const isAvailableSizeByColor = (size: ProductSize) => {
    if (selectedColorId === null) return true;

    return getStock(selectedColorId, size) > 0;
  };

  const isAvailableColorBySize = (colorId: number) => {
    if (selectedSize === null) return true;

    return getStock(colorId, selectedSize) > 0;
  };

  const handleColorSelect = (colorId: number) => {
    if (selectedColorId === colorId) {
      setSelectedColorId(null);
      return;
    }

    if (selectedSize !== null && getStock(colorId, selectedSize) <= 0) {
      setSelectedSize(null);
    }

    setSelectedColorId(colorId);
  };

  const handleSizeSelect = (size: ProductSize) => {
    if (selectedSize === size) {
      setSelectedSize(null);
      return;
    }

    if (selectedColorId !== null && getStock(selectedColorId, size) <= 0) {
      setSelectedColorId(null);
    }

    setSelectedSize(size);
  };

  const currentStock =
    selectedColorId !== null && selectedSize !== null
      ? getStock(selectedColorId, selectedSize)
      : null;

  const isOutOfStock =
    currentStock !== null && currentStock <= 0;

  const isSelectionComplete =
    selectedColorId !== null && selectedSize !== null;

  return {
    colors,
    sizes,
    imageMap,
    selectedColorId,
    selectedSize,
    setSelectedColorId,
    setSelectedSize,
    handleColorSelect,
    handleSizeSelect,
    isAvailableColorBySize,
    isAvailableSizeByColor,
    isOutOfStock,
    isSelectionComplete,
  }
}