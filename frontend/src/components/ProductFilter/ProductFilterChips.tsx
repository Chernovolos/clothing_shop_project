import { useParams } from "react-router";
import { useAppDispatch } from "@/app/hooks.ts";
import { X } from "lucide-react";
import {
  type ProductFilterForm,
  clearAllProductChips,
  clearProductFilter,
  removeProductChip,
  setProductFilter,
} from "@/slices/product.slice.ts";
import {
  CATEGORY_MAP,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  type ProductCategory,
} from "@/types/enums/product.enums.ts";
import type { ProductFilterChip } from "@/components/ProductFilter/ProductFilterMenu.tsx";
import { getProducts } from "@/thunk/product.thunk.ts";

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
    dispatch(clearProductFilter())
    dispatch(getProducts({categoryType: categoryId}))
  }

  const handleRemoveChip = (chip: ProductFilterChip) => {
    if (!productFilter) {
      dispatch(removeProductChip(chip))
      dispatch(getProducts({categoryType: categoryId}));
      return;
    }

    const newFilter: ProductFilterForm = {
      ...productFilter,
    };

    if (chip.type === "productType") {
      newFilter.type = PRODUCT_TYPE.DEFAULT;
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

    if (productFilter.colors && chip.type === "productColor") {
      newFilter.colors = productFilter.colors.filter(
        (value) => value !== chip.value,
      );
    }

    if (productFilter.sizes && chip.type === "productSize") {
      newFilter.sizes = productFilter.sizes.filter(
        (value) => value !== chip.value,
      );
    }

    if (chip.type === "price") {
      newFilter.maxPrice = undefined;
      newFilter.minPrice = undefined;
    }

    const hasFilters =
      (newFilter.type !== undefined && newFilter.type !== PRODUCT_TYPE.DEFAULT) ||
      (newFilter.subType?.length ?? 0) > 0 ||
      (newFilter.colors?.length ?? 0) > 0 ||
      (newFilter.sizes?.length ?? 0) > 0 ||
      (newFilter.tags?.length ?? 0) > 0 ||
      newFilter.minPrice !== undefined ||
      newFilter.maxPrice !== undefined;

    dispatch(removeProductChip(chip));

    if (!hasFilters) {
      dispatch(clearProductFilter());
      dispatch(clearAllProductChips());
      dispatch(getProducts({categoryType: categoryId}));

      return;
    }

    dispatch(setProductFilter(newFilter));

    const productFilterDto = {
      categoryType: categoryId,

      ...((newFilter.type !== undefined && newFilter.type !== PRODUCT_TYPE.DEFAULT) && {
        type: newFilter.type,
      }),

      ...(newFilter.subType && newFilter.subType.length > 0 && {
        subType: newFilter.subType,
      }),

      ...(newFilter.tags && newFilter.tags.length > 0 && {
        tags: newFilter.tags,
      }),
      ...(newFilter.colors && newFilter.colors.length > 0 && {
        colors: newFilter.colors,
      }),
      ...(newFilter.sizes && newFilter.sizes.length > 0 && {
        sizes: newFilter.sizes,
      }),
      ...(newFilter && newFilter.minPrice !== undefined && {
        minPrice: newFilter.minPrice,
      }),
      ...(newFilter && newFilter.maxPrice !== undefined && {
        maxPrice: newFilter.maxPrice,
      }),
    };

    dispatch(getProducts(productFilterDto));
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
            { chip.type === "productColor" ? (
              <span className="product-filter__chip-color" style={ {backgroundColor: chip.hex} }></span>
            ) : chip.type === "price" ? (
              <span className="product-filter__chip-title">
                { chip.minPrice !== undefined && `$${ chip.minPrice }` }
                { chip.minPrice !== undefined && chip.maxPrice !== undefined && " - " }
                { chip.maxPrice !== undefined && `$${ chip.maxPrice }` }
              </span>
            ) : chip.type === "productSize" ? (
              <span className="product-filter__chip-title">{ chip.label }</span>
            ) : (
              <span className="product-filter__chip-title">{ chip.label }</span>
            ) }
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