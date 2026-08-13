import { X } from "lucide-react";
import type { ProductFilterChip } from "@/components/ProductFilter/ProductFilterMenu.tsx";
import { useAppDispatch } from "@/app/hooks.ts";
import {
  clearAllProductChips, clearProductFilter,
  type ProductFilterForm,
  removeProductChip,
  setProductFilter,
} from "@/slices/product.slice.ts";
import { getProducts } from "@/thunk/product.thunk.ts";
import {
  CATEGORY_MAP,
  PRODUCT_CATEGORY,
  type ProductCategory,
} from "@/types/enums/product.enums.ts";
import { useParams } from "react-router";

type ProductFilterChipsProps = {
  chips: ProductFilterChip[],
  productFilter: ProductFilterForm | null
}

const ProductFilterChips = ({chips, productFilter}: ProductFilterChipsProps) => {
  const dispatch = useAppDispatch()
  const {category} = useParams<{ category: 'women' | 'men' | 'kids' }>();

  const normalized = category?.toLowerCase().trim();
  const categoryId: ProductCategory =
    normalized && normalized in CATEGORY_MAP
      ? CATEGORY_MAP[normalized as keyof typeof CATEGORY_MAP]
      : PRODUCT_CATEGORY.DEFAULT;

  const handleClearAll = () => {
    dispatch(clearAllProductChips())
    dispatch(getProducts({categoryType: categoryId}))
  }

  const handleRemoveChip = (chip: ProductFilterChip) => {
    const newFilter = {
      ...productFilter,
    };

    if (productFilter) {
      if (productFilter.type && chip.type === "productType") {
        newFilter.type = productFilter.type.filter(
          (value) => value !== chip.value,
        );
      }

      if (productFilter.subType && chip.type === "subType") {
        newFilter.subType = productFilter.subType.filter(
          (value) => value !== chip.value,
        );
      }

      if (productFilter.tags && chip.type === "productTag") {
        newFilter.tags = productFilter.tags.filter(
          (value) => value !== chip.value,
        );
      }
    }

    dispatch(setProductFilter(newFilter));
    dispatch(removeProductChip(chip));

    const hasFilters = (
        newFilter.type?.length ?? 0) > 0 ||
      (newFilter.subType?.length ?? 0) > 0 ||
      (newFilter.tags?.length ?? 0) > 0 ||
      newFilter.minPrice !== 0 ||
      newFilter.maxPrice !== 20000;

    if (!hasFilters) {
      dispatch(clearProductFilter());
      dispatch(getProducts({categoryType: categoryId}));

      return;
    }

    dispatch(
      getProducts({
        categoryType: categoryId,
        type: newFilter.type,
        subType: newFilter.subType,
        tags: newFilter.tags,
        minPrice: newFilter.minPrice,
        maxPrice: newFilter.maxPrice,
      }),
    );
  }
  return (
    <div className="product-filter__chip">
      {
        chips.map((chip) => (
          <div key={ `${ chip.type }-${ chip.value }` } className="product-filter__chip-container mr-1">
            <button
              type="button"
              onClick={ () => handleRemoveChip(chip) }
            >
              <X size={ 15 }/>
            </button>
            <span className="product-filter__chip-title">{ chip.label }</span>
          </div>
        ))
      }

      {
        chips.length > 0 && (
          <div className="product-filter__chip-clear-container ml-1">
            <button onClick={ handleClearAll } className="product-filter__chip-clear-button">Clear
              all
            </button>
          </div>
        )
      }
    </div>
  )
}

export default ProductFilterChips;