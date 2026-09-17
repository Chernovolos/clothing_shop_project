import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import {
  selectProducts,
  selectIsProductsLoading,
  selectProductChips,
  selectHasProductsLoaded, selectLoadedCategory, clearAllProductChips, selectProductFilter, clearProductFilter,
} from "@/slices/product.slice.ts";
import { CATEGORY_MAP, type ProductCategory, productTypeOptions } from "@/types/enums/product.enums.ts";
import { getProducts } from "@/thunk/product.thunk.ts";
import ProductCard from "../../components/ProductCard.tsx";
import ProductFilterMenu from "@/components/ProductFilter/ProductFilterMenu.tsx";
import ProductFilterChips from "@/components/ProductFilter/ProductFilterChips.tsx";
import Loading from "@/components/Loading.tsx";
import NotFound from "@/components/NotFound.tsx";

const Product: React.FC = () => {
  const dispatch = useAppDispatch();

  const {category} = useParams<{ category: 'women' | 'men' | 'kids' }>();

  const products = useAppSelector(selectProducts);
  const isProductsLoading = useAppSelector(selectIsProductsLoading);
  const hasProductsLoaded = useAppSelector(selectHasProductsLoaded);

  const loadedCategory = useAppSelector(selectLoadedCategory);

  const productFilter = useAppSelector(selectProductFilter);
  const chips = useAppSelector(selectProductChips);

  const productTypeOption = productTypeOptions.find((option) => option.value === productFilter?.type)
  const title = productTypeOption?.label || ''

  const normalized = category?.toLowerCase().trim();
  const isValidCategory = !!normalized && normalized in CATEGORY_MAP;
  const categoryId: ProductCategory | null = isValidCategory
    ? CATEGORY_MAP[normalized as keyof typeof CATEGORY_MAP] : null

  useEffect(() => {
    if (!categoryId) return;
    if (!hasProductsLoaded || loadedCategory !== categoryId) {
      dispatch(getProducts({
        categoryType: categoryId,
      }));
      dispatch(clearAllProductChips())
      dispatch(clearProductFilter())
    }

  }, [categoryId, hasProductsLoaded, loadedCategory])

  if (isProductsLoading) {
    return <section className="section section-product">
      <div className="container">
        <Loading/>
      </div>
    </section>
  }

  if (!isValidCategory) {
    return <section className="section section-product">
      <div className="container"><NotFound reason={ "category" }/></div>
    </section>
  }

  return (
    <section id="welcome" className="section-product">
      <div className="container">
        <div
          className=" grid
                      items-center
                      grid-cols-1
                      gap-y-3
                      pb-10
                      sm:mt-10
                      sm:grid-cols-2
                      md:pb-15
                      lg:pb-10
                      lg:grid-cols-2
                      lg:gap-x-2
                      lg:gap-y-2"
        >
          <div className="col-span-1">
            <h1 className="product-category-title">{ title }</h1>
          </div>
          <div className="col-span-1">
            <ProductFilterMenu/>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <ProductFilterChips
              chips={ chips }
              productFilter={ productFilter }
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div
          className="grid base:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 lg:gap-x-6 lg:gap-y-8">
          {
            products.length > 0 ? products.map((product) => (
              <ProductCard key={ product.id } product={ product }/>
            )) : <div>No products match your search.</div>
          }
        </div>
      </div>
    </section>
  )
};

export default Product;
