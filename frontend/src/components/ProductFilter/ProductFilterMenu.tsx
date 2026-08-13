import {
  type ProductSubType,
  type ProductType,
  productTypeOptions,
  productSubTypeOptions,
  productTagsOptions, CATEGORY_MAP, PRODUCT_CATEGORY,
} from "@/types/enums/product.enums.ts";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, Menu, X } from "lucide-react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { selectProductChips, setProductChips, setProductFilter } from "@/slices/product.slice.ts";
import { useParams } from "react-router";
import { getProducts } from "@/thunk/product.thunk.ts";
import type { ProductFilterDto } from "@/types/dtos/product.dto.ts";

interface ProductFilterForm {
  productType: ProductType[],
  subType: ProductSubType[],
  productTag: number[],
  minPrice: number,
  maxPrice: number,
}

export type ProductFilterChip = {
  type: "productType" | "subType" | "productTag" | "maxPrice" | "minPrice";
  value: number | string;
  label: string;
};

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 999999.99;

const ProductFilterMenu = () => {
  const dispatch = useAppDispatch();

  const {category} = useParams<{ category: 'women' | 'men' | 'kids' }>();
  const normalized = category?.toLowerCase().trim();
  const categoryId =
    normalized && normalized in CATEGORY_MAP
      ? CATEGORY_MAP[normalized as keyof typeof CATEGORY_MAP]
      : PRODUCT_CATEGORY.DEFAULT;

  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
  const [isProductSubTypeOpen, setIsProductSubTypeOpen] = useState(false);
  const [isProductTagOpen, setIsProductTagOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const chips = useAppSelector(selectProductChips);

  const filterProductRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setIsToggle((isToggle: boolean) => !isToggle)
  };

  const toggleProductType = () => {
    setIsProductTypeOpen((prev) => !prev);
  };

  const toggleProductSubType = () => {
    setIsProductSubTypeOpen((prev) => !prev);
  }

  const toggleProductTag = () => {
    setIsProductTagOpen((prev) => !prev);
  }

  const togglePrice = () => {
    setIsPriceOpen((prev) => !prev);
  }

  const {
    control, register,
    handleSubmit,
    setValue,
    formState: {errors}
  } = useForm<ProductFilterForm>({
    mode: "onChange",
    defaultValues: {
      productType: [],
      subType: [],
      productTag: [],
      minPrice: MIN_PRICE_LIMIT,
      maxPrice: MAX_PRICE_LIMIT,
    },
  })

  const onSubmit: SubmitHandler<ProductFilterForm> = (data) => {
    const productTypeChips: ProductFilterChip[] = data.productType
      .map((value) => {
        const option = productTypeOptions.find(
          (option) => option.value === value,
        );

        if (!option) return undefined;

        return {
          type: "productType" as const,
          value: option.value,
          label: option.label,
        };
      }).filter((value) => value !== undefined);

    const subTypeChips: ProductFilterChip[] = data.subType
      .map((value) => {
        const option = productSubTypeOptions.find((option) => option.value === value)

        if (!option) return undefined

        return {
          type: "subType" as const,
          value: option.value,
          label: option.label,
        }
      }).filter((value) => value !== undefined)

    const productTagChips: ProductFilterChip[] = data.productTag
      .map((value) => {
        const option = productTagsOptions.find((option) => option.value === value)
        if (!option) return undefined

        return {
          type: "productTag" as const,
          value: option.value,
          label: option.label,
        }

      }).filter((value) => value !== undefined)

    dispatch(setProductFilter({
      categoryType: categoryId,
      type: data.productType,
      subType: data.subType,
      tags: data.productTag,
      maxPrice: data.maxPrice,
      minPrice: data.minPrice,
    }))

    dispatch(setProductChips([
      ...productTypeChips,
      ...subTypeChips,
      ...productTagChips,
    ]))

    const productFilterDto: ProductFilterDto = {
      categoryType: categoryId,
      type: data.productType,
      subType: data.subType,
      tags: data.productTag,
      maxPrice: data.maxPrice,
      minPrice: data.minPrice,
    }

    dispatch(getProducts({...productFilterDto}))


    setIsToggle(false);
  };

  useEffect(() => {
    const productTypeValues = chips
      .filter((chip) => chip.type === "productType")
      .map((chip) => chip.value as ProductType)

    const productSubTypeValues = chips
      .filter((chip) => chip.type === "subType")
      .map((chip) => chip.value as ProductSubType)

    const productTagValues = chips
      .filter((chip) => chip.type === "productTag")
      .map((chip) => chip.value as number);

    setValue("productType", productTypeValues)
    setValue("subType", productSubTypeValues)
    setValue("productTag", productTagValues)

  }, [chips, setValue]);

  return (

    <div className="filter-container relative">
      <div className="product-filter__header">
        <button
          onClick={ toggle }
          type="button"
        >
          <Menu/>
        </button>
      </div>
      <div
        className={ `product-filter__overlay ${ isToggle ? "open" : "" }` }
        onClick={ toggle }
      ></div>

      <div
        ref={ filterProductRef }
        className={ `product-filter__dropdown ${
          isToggle ? "product-filter__dropdown--open" : ""
        }` }
      >
        <div className="product-filter">
          <div className="product-filter__content">
            <div className="product-filter__category">
              <button
                type="button"
                className="product-filter__category-header"
                onClick={ toggle }
              >
                <span>FILTERS</span>
                <X size={ 20 }/>
              </button>
            </div>
            <form
              id="product-filter-form"
              onSubmit={ handleSubmit(onSubmit) }
            >

              <div className="product-filter__category">
                <button
                  type="button"
                  className="product-filter__category-header"
                  onClick={ toggleProductType }
                >
                  <span>CATEGORY</span>
                  <ChevronUp className={ isProductTypeOpen ? "" : "rotate-180" } size={ 16 }/>
                </button>
                <div
                  className={ `product-filter__category-list ${
                    isProductTypeOpen
                      ? "product-filter__category-list--open"
                      : ""
                  }` }
                >
                  <div>
                    <Controller
                      name="productType"
                      control={ control }
                      render={ ({field}) => (
                        <>
                          { productTypeOptions.map((option) => {
                            const checked = field.value.includes(option.value);
                            return (
                              <label key={ option.value } className="product-filter__category-item">
                                <input
                                  type="checkbox"
                                  checked={ checked }
                                  onChange={ () => {
                                    const newValue = checked
                                      ? field.value.filter(
                                        (value) => value !== option.value,
                                      )
                                      : [...field.value, option.value];
                                    field.onChange(newValue);
                                  } }
                                />
                                <span className="product-filter__category-label">{ option.label }</span>
                              </label>
                            );
                          }) }
                        </>
                      ) }
                    />
                  </div>
                </div>
              </div>

              <div className="product-filter__category">
                <button
                  type="button"
                  className="product-filter__category-header"
                  onClick={ toggleProductSubType }
                >
                  <span>SUB TYPE</span>
                  <ChevronUp className={ isProductSubTypeOpen ? "" : "rotate-180" } size={ 16 }/>
                </button>
                <div
                  className={ `product-filter__category-list ${
                    isProductSubTypeOpen
                      ? "product-filter__category-list--open"
                      : ""
                  }` }
                >
                  <div>
                    <Controller
                      name="subType"
                      control={ control }
                      render={ ({field}) => (
                        <>
                          { productSubTypeOptions.map((option) => {
                            const checked = field.value.includes(option.value);
                            return (
                              <label key={ option.value } className="product-filter__category-item">
                                <input
                                  type="checkbox"
                                  checked={ checked }
                                  onChange={ () => {
                                    const newValue = checked
                                      ? field.value.filter(
                                        (value) => value !== option.value,
                                      )
                                      : [...field.value, option.value];

                                    field.onChange(newValue);
                                  } }
                                />
                                <span className="product-filter__category-label">{ option.label }</span>
                              </label>
                            );
                          }) }
                        </>
                      ) }
                    />
                  </div>
                </div>
              </div>

              <div className="product-filter__category">
                <button
                  type="button"
                  className="product-filter__category-header"
                  onClick={ toggleProductTag }
                >
                  <span>TAGS</span>
                  <ChevronUp className={ isProductTagOpen ? "" : "rotate-180" } size={ 16 }/>
                </button>
                <div
                  className={ `product-filter__category-list ${
                    isProductTagOpen
                      ? "product-filter__category-list--open"
                      : ""
                  }` }
                >
                  <div>
                    <Controller
                      name="productTag"
                      control={ control }
                      render={ ({field}) => (
                        <>
                          { productTagsOptions.map((option) => {
                            const checked = field.value.includes(option.value);
                            return (
                              <label key={ option.value } className="product-filter__category-item">
                                <input
                                  type="checkbox"
                                  checked={ checked }
                                  onChange={ () => {
                                    const newValue = checked
                                      ? field.value.filter(
                                        (value) => value !== option.value,
                                      )
                                      : [...field.value, option.value];

                                    field.onChange(newValue);
                                  } }
                                />
                                <span className="product-filter__category-label">{ option.label }</span>
                              </label>
                            );
                          }) }
                        </>
                      ) }
                    />
                  </div>
                </div>
              </div>

              <div className="product-filter__category">
                <button
                  type="button"
                  className="product-filter__category-header"
                  onClick={ togglePrice }
                >
                  <span>PRICE</span>
                  <ChevronUp className={ isPriceOpen ? "" : "rotate-180" } size={ 16 }/>
                </button>
                <div
                  className={ `product-filter__category-list ${
                    isPriceOpen
                      ? "product-filter__category-list--open"
                      : ""
                  }` }
                >
                  <div className="product-filter__price">
                    <div className="form-group">
                      <div className="product-filter__price-content gap-3">
                        <div className="input-group flex-1">
                          <div className="input-wrapper product-filter__price-input-wrapper px-3 py-2">
                            <span>$</span>
                            <input
                              id="minPrice"
                              type="number"
                              step="0.01"
                              min={ MIN_PRICE_LIMIT }
                              max={ MAX_PRICE_LIMIT }
                              { ...register("minPrice", {
                                valueAsNumber: true,
                                min: {
                                  value: MIN_PRICE_LIMIT,
                                  message: `Price must be at least ${ MIN_PRICE_LIMIT }`,
                                },
                                max: {
                                  value: MAX_PRICE_LIMIT,
                                  message: `Price cannot exceed ${ MAX_PRICE_LIMIT }`,
                                },
                              }) }
                              className="product-filter__price-input form-control w-full"
                            />

                          </div>
                        </div>

                        <span className="text-gray-400 lowercase">to</span>

                        <div className="input-group flex-1">
                          <div className="input-wrapper product-filter__price-input-wrapper px-3 py-2">
                            <span>$</span>
                            <input
                              id="maxPrice"
                              type="number"
                              step="0.01"
                              min={ MIN_PRICE_LIMIT }
                              max={ MAX_PRICE_LIMIT }
                              { ...register("maxPrice", {
                                valueAsNumber: true,
                                min: {
                                  value: MIN_PRICE_LIMIT,
                                  message: `Price must be at least ${ MIN_PRICE_LIMIT }`,
                                },
                                max: {
                                  value: MAX_PRICE_LIMIT,
                                  message: `Price cannot exceed ${ MAX_PRICE_LIMIT }`,
                                },
                              }) }
                              className="product-filter__price-input form-control w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        { errors.minPrice &&
                          <p className="product-filter__price-input-error">{ errors.minPrice.message }</p> }
                        { errors.maxPrice && (
                          <p className="product-filter__price-input-error">{ errors.maxPrice.message }</p>
                        ) }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <footer className="product-filter__footer">
            <button form="product-filter-form" type="submit" className="product-filter__button">
              VIEW RESULTS
            </button>
          </footer>

        </div>
      </div>
    </div>
  )
}

export default ProductFilterMenu;