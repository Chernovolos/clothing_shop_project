import {
  type ProductSubType,
  type ProductType,
  productTypeOptions,
  productSubTypeOptions,
  CATEGORY_MAP, PRODUCT_CATEGORY, PRODUCT_TYPE, PRODUCT_SIZE_LABEL, type ProductSize,
} from "@/types/enums/product.enums.ts";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { type SubmitHandler, useForm, Controller, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import {
  selectColorsFilter,
  selectLoadedCategory,
  selectProductChips, selectSizesFilter,
  selectTagsFilter,
  setProductChips,
  setProductFilter,
} from "@/slices/product.slice.ts";
import { useParams } from "react-router";
import { getProducts } from "@/thunk/product.thunk.ts";
import type { ProductFilterDto } from "@/types/dtos/product.dto.ts";
import { getFilterColors, getFilterSizes, getFilterTags } from "@/thunk/product-filter.thunk.ts";
import FilterCategory from "@/components/ProductFilter/FilterCategory.tsx";

interface ProductFilterFieldValues {
  productType: ProductType,
  subType: ProductSubType[],
  productTag: number[],
  productColor: number[],
  productSize: ProductSize[],
  minPrice?: number,
  maxPrice?: number,
}

export type ProductFilterChip =
  | { type: "productType"; value: ProductType; label: string }
  | { type: "subType"; value: ProductSubType; label: string }
  | { type: "productTag"; value: number; label: string }
  | { type: "productColor"; value: number; hex: string }
  | { type: "productSize"; value: ProductSize; label: string }
  | { type: "price"; value: "price"; minPrice?: number; maxPrice?: number };


type FilterSection =
  "productFilter"
  | "productType"
  | "productSubType"
  | "productTag"
  | "productColor"
  | "productSize"
  | "productPrice";
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 20000;

const chipsOfType = <T extends ProductFilterChip["type"]>(
  chips: ProductFilterChip[],
  type: T,
): Extract<ProductFilterChip, { type: T }>[] => {
  return chips.filter(
    (chip): chip is Extract<ProductFilterChip, { type: T }> => chip.type === type,
  )
}

const normalizeChips = <T, V>(
  values: V[],
  source: T[] | null | undefined,
  match: (item: T, value: V) => boolean,
  toChip: (item: T) => ProductFilterChip,
): ProductFilterChip[] => {
  return values
    .map((value) => {
      if (!source) return undefined;

      const item = source.find((item) => match(item, value))
      return item ? toChip(item) : undefined
    })
    .filter((chip) => chip !== undefined)
}

const ProductFilterMenu = () => {
  const dispatch = useAppDispatch();
  const tagsFilter = useAppSelector(selectTagsFilter);
  const colorsFilter = useAppSelector(selectColorsFilter);
  const sizesFilter = useAppSelector(selectSizesFilter);
  const loadedCategory = useAppSelector(selectLoadedCategory);
  const chips = useAppSelector(selectProductChips);

  const {category} = useParams<{ category: 'women' | 'men' | 'kids' }>();
  const normalized = category?.toLowerCase().trim();
  const categoryId =
    normalized && normalized in CATEGORY_MAP
      ? CATEGORY_MAP[normalized as keyof typeof CATEGORY_MAP]
      : PRODUCT_CATEGORY.DEFAULT;

  const filterProductRef = useRef<HTMLDivElement>(null);

  const [openSection, setOpenSections] = useState<Record<FilterSection, boolean>>({
    productFilter: false,
    productType: false,
    productSubType: false,
    productTag: false,
    productSize: false,
    productColor: false,
    productPrice: false,
  })

  const toggleSection = (section: FilterSection) => {
    setOpenSections((prev) => ({...prev, [section]: !prev[section]}));
  }

  const {
    control, register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<ProductFilterFieldValues>({
    mode: "onChange",
    defaultValues: {
      productType: 0,
      subType: [],
      productTag: [],
      productColor: [],
      productSize: [],
      minPrice: undefined,
      maxPrice: undefined,
    },
  })

  const productType = useWatch({
    control,
    name: "productType",
  })
  const productSubType = useWatch({
    control,
    name: "subType",
  })
  const productTag = useWatch({
    control,
    name: "productTag",
  })
  const productColor = useWatch({
    control,
    name: "productColor",
  })
  const productSize = useWatch({
    control,
    name: "productSize",
  })
  const minPrice = useWatch({
    control,
    name: "minPrice",
  })
  const maxPrice = useWatch({
    control,
    name: "maxPrice",
  })

  const buildBaseFilter = () => ({
    ...(categoryId !== PRODUCT_CATEGORY.DEFAULT && {
      categoryType: categoryId,
    }),
    ...(productType !== PRODUCT_TYPE.DEFAULT && {
      type: productType,
    }),
    ...((productSubType?.length ?? 0) > 0 && {
      subType: productSubType,
    }),
    ...(minPrice !== undefined && {
      minPrice: minPrice,
    }),
    ...(maxPrice !== undefined && {
      maxPrice: maxPrice,
    }),
  })

  const onSubmit: SubmitHandler<ProductFilterFieldValues> = (data) => {
    const productTypeOption = productTypeOptions.find(
      (option) => option.value === data.productType,
    );

    let productTypeChip: ProductFilterChip | null = null;
    let priceChip: ProductFilterChip | null = null;

    if (data.productType !== PRODUCT_TYPE.DEFAULT) {
      productTypeChip = {
        type: "productType",
        value: data.productType,
        label: productTypeOption?.label ?? "",
      }
    }

    const subTypeChips: ProductFilterChip[] = normalizeChips(
      data.subType,
      productSubTypeOptions,
      (option, value) => option?.value === value,
      (option) => ({type: "subType", value: option.value, label: option.label}),
    )

    const productTagChips: ProductFilterChip[] = normalizeChips(
      data.productTag,
      tagsFilter,
      (tag, id) => tag?.id === id,
      (tag) => ({type: "productTag", value: tag.id, label: tag.title}),
    )

    const productColorChips: ProductFilterChip[] = normalizeChips(
      data.productColor,
      colorsFilter,
      (color, id) => color?.id === id,
      (color) => ({type: "productColor", value: color.id, hex: color.hex}),
    )

    const productSizeChips: ProductFilterChip[] = data.productSize
      .filter((size) => sizesFilter?.includes(size))
      .map((size) => ({
        type: "productSize" as const,
        value: size,
        label: PRODUCT_SIZE_LABEL[size],
      }));

    const productFilterDto: ProductFilterDto = {
      ...buildBaseFilter(),
      ...(data.productTag.length > 0 && {
        tags: data.productTag,
      }),
      ...(data.productColor.length > 0 && {
        colors: data.productColor,
      }),
      ...(data.productSize.length > 0 && {
        sizes: data.productSize,
      }),
    }

    if (data.minPrice !== undefined || data.maxPrice !== undefined) {
      priceChip = {
        type: "price",
        value: "price",
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      }
    }

    dispatch(setProductFilter({...productFilterDto}))
    dispatch(setProductChips([
      ...(productTypeChip ? [productTypeChip] : []),
      ...(priceChip ? [priceChip] : []),
      ...subTypeChips,
      ...productTagChips,
      ...productColorChips,
      ...productSizeChips,
    ]))
    dispatch(getProducts({...productFilterDto}))
    toggleSection("productFilter")
  };


  useEffect(() => {
    const productTypeValue = chipsOfType(chips, "productType")[0];
    const productSubTypeValues = chipsOfType(chips, "subType").map((chip) => chip.value);
    const productTagValues = chipsOfType(chips, "productTag").map((chip) => chip.value);
    const productColorValues = chipsOfType(chips, "productColor").map((chip) => chip.value);
    const productSizesValues = chipsOfType(chips, "productSize").map((chip) => chip.value);
    const priceChip = chipsOfType(chips, "price")[0];

    setValue("productType", productTypeValue?.value ?? PRODUCT_TYPE.DEFAULT)
    setValue("subType", productSubTypeValues)
    setValue("productTag", productTagValues)
    setValue("productColor", productColorValues)
    setValue("productSize", productSizesValues)
    setValue("maxPrice", priceChip?.maxPrice)
    setValue("minPrice", priceChip?.minPrice)
  }, [chips, setValue]);

  useEffect(() => {
    dispatch(getFilterColors({
      ...buildBaseFilter(),
      ...((productTag?.length ?? 0) > 0 && {
        tags: productTag,
      }),
      ...((productSize?.length ?? 0) > 0 && {
        sizes: productSize,
      }),
    }))
  }, [categoryId, productType, productSubType, productTag, productSize, minPrice, maxPrice, dispatch, loadedCategory]);

  useEffect(() => {
    dispatch(getFilterTags({
      ...buildBaseFilter(),
      ...((productColor?.length ?? 0) > 0 && {
        colors: productColor,
      }),
      ...((productSize?.length ?? 0) > 0 && {
        sizes: productSize,
      }),
    }))
  }, [categoryId, productType, productSubType, productSize, productColor, minPrice, maxPrice, dispatch, loadedCategory]);

  useEffect(() => {
    dispatch(
      getFilterSizes({
        ...buildBaseFilter(),
        ...((productTag?.length ?? 0) > 0 && {
          tags: productTag,
        }),
        ...((productColor?.length ?? 0) > 0 && {
          colors: productColor,
        }),
      }))
  }, [categoryId, productType, productSubType, productTag, productColor, minPrice, maxPrice, dispatch, loadedCategory]);

  return (
    <div className="filter-container relative">
      <div className="product-filter__header">
        <button
          onClick={ () => toggleSection("productFilter") }
          type="button"
        >
          <Menu/>
        </button>
      </div>
      <div
        className={ `product-filter__overlay ${ openSection.productFilter ? "open" : "" }` }
        onClick={ () => toggleSection("productFilter") }
      ></div>

      <div
        ref={ filterProductRef }
        className={ `product-filter__dropdown ${
          openSection.productFilter ? "product-filter__dropdown--open" : ""
        }` }
      >
        <div className="product-filter">
          <div className="product-filter__content">
            <div className="product-filter__category">
              <button
                type="button"
                className="product-filter__category-header"
                onClick={ () => toggleSection("productFilter") }
              >
                <span>FILTERS</span>
                <X size={ 20 }/>
              </button>
            </div>
            <form
              id="product-filter-form"
              onSubmit={ handleSubmit(onSubmit) }
            >

              <FilterCategory
                title={ "CATEGORY" }
                isOpen={ openSection.productType }
                onToggle={ () => toggleSection("productType") }
              >
                <Controller
                  name="productType"
                  control={ control }
                  render={ ({field}) => (
                    <>
                      { productTypeOptions.map((option) => {
                        const checked = field?.value === option.value;
                        return (
                          <label key={ option.value } className="product-filter__category-item">
                            <input
                              type="checkbox"
                              checked={ checked }
                              onChange={ () => {
                                field.onChange(
                                  checked ? PRODUCT_TYPE.DEFAULT : option.value,
                                );
                              } }
                            />
                            <span className="product-filter__category-label">{ option.label }</span>
                          </label>
                        );
                      }) }
                    </>
                  ) }
                />
              </FilterCategory>

              { productType === PRODUCT_TYPE.CLOTHING && (
                <FilterCategory
                  title={ "SUB TYPE" }
                  isOpen={ openSection.productSubType }
                  onToggle={ () => toggleSection("productSubType") }
                >
                  <Controller
                    name="subType"
                    control={ control }
                    render={ ({field}) => (
                      <>
                        { productSubTypeOptions.map((option) => {
                          const checked = field.value.includes(option.value);
                          return (
                            <label key={ option.value }
                                   className="product-filter__category-item">
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
                </FilterCategory>
              ) }

              <FilterCategory
                title={ "TAGS" }
                isOpen={ openSection.productTag }
                onToggle={ () => toggleSection("productTag") }
              >
                <Controller
                  name="productTag"
                  control={ control }
                  render={ ({field}) => (
                    <>
                      { tagsFilter && tagsFilter.map((option) => {
                        const checked = field.value.includes(option.id);
                        return (
                          <label key={ option.id } className="product-filter__category-item">
                            <input
                              type="checkbox"
                              checked={ checked }
                              onChange={ () => {
                                const newValue = checked
                                  ? field.value.filter(
                                    (value) => value !== option.id,
                                  )
                                  : [...field.value, option.id];

                                field.onChange(newValue);
                              } }
                            />
                            <span className="product-filter__category-label">{ option.title }</span>
                          </label>
                        );
                      }) }
                    </>
                  ) }
                />
              </FilterCategory>

              <FilterCategory
                title={ "COLORS" }
                isOpen={ openSection.productColor }
                onToggle={ () => toggleSection("productColor") }
              >
                <div className="product-filter__option-container py-2 px-2">
                  <Controller
                    name="productColor"
                    control={ control }
                    render={ ({field}) => (
                      <>
                        { colorsFilter && colorsFilter.map((color) => {
                          const checked = field.value.includes(color.id);
                          return (
                            <label
                              key={ color.id }
                              className={ `product-filter__option product-filter__color ${
                                checked ? "product-filter__option--active" : ""
                              }` }
                              style={ {backgroundColor: color.hex} }
                            >
                              <input
                                type="checkbox"
                                checked={ checked }
                                onChange={ () => {
                                  const newValue = checked
                                    ? field.value.filter((id) => id !== color.id)
                                    : [...field.value, color.id];
                                  field.onChange(newValue);
                                } }
                              />
                            </label>
                          );
                        }) }
                      </>
                    ) }
                  />
                </div>
              </FilterCategory>

              <FilterCategory
                title={ "SIZE" }
                isOpen={ openSection.productSize }
                onToggle={ () => toggleSection("productSize") }
              >
                <div className="product-filter__option-container py-2 px-2">
                  <Controller
                    name="productSize"
                    control={ control }
                    render={ ({field}) => (
                      <>
                        { sizesFilter && sizesFilter.map((size) => {
                          const checked = field.value.includes(size);
                          return (
                            <label
                              key={ size }
                              className={ `product-filter__option product-filter__size ${
                                checked ? "product-filter__option--active" : ""
                              }` }
                            >
                              <input
                                type="checkbox"
                                checked={ checked }
                                onChange={ () => {
                                  const newValue = checked
                                    ? field.value.filter((s) => s !== size)
                                    : [...field.value, size];
                                  field.onChange(newValue);
                                } }
                              />
                              { PRODUCT_SIZE_LABEL[size] }
                            </label>
                          );
                        }) }
                      </>
                    ) }
                  />
                </div>
              </FilterCategory>

              <FilterCategory
                title={ "PRICE" }
                isOpen={ openSection.productPrice }
                onToggle={ () => toggleSection("productPrice") }
              >
                <div className="product-filter__price">
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
                            setValueAs: (value) => (value === "" ? undefined : Number(value)),
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
                            setValueAs: (value) => (value === "" ? undefined : Number(value)),
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
              </FilterCategory>
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