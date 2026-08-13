import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import {
  selectProducts,
  selectIsProductsLoading,
  selectProductChips,
  selectHasProductsLoaded, selectLoadedCategory, clearAllProductChips, selectProductFilter,
} from "@/slices/product.slice.ts";
import { CATEGORY_MAP, PRODUCT_CATEGORY, type ProductCategory } from "@/types/enums/product.enums.ts";
import { getProducts } from "@/thunk/product.thunk.ts";
import ProductCard from "../../components/ProductCard.tsx";
import ProductFilterMenu from "@/components/ProductFilter/ProductFilterMenu.tsx";
import ProductFilterChips from "@/components/ProductFilter/ProductFilterChips.tsx";

const Product: React.FC = () => {
  const { category } = useParams<{ category: 'women' | 'men' | 'kids' }>();

  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const isProductsLoading = useAppSelector(selectIsProductsLoading);
  const chips = useAppSelector(selectProductChips);
  const hasProductsLoaded = useAppSelector(selectHasProductsLoaded);
  const loadedCategory = useAppSelector(selectLoadedCategory);
  const productFilter = useAppSelector(selectProductFilter);

  const normalized = category?.toLowerCase().trim();
  const categoryId: ProductCategory =
    normalized && normalized in CATEGORY_MAP
      ? CATEGORY_MAP[normalized as keyof typeof CATEGORY_MAP]
      : PRODUCT_CATEGORY.DEFAULT;

  useEffect(() => {
    if (!hasProductsLoaded || loadedCategory !== categoryId) {
      dispatch(getProducts({
        categoryType: categoryId,
      }));
      dispatch(clearAllProductChips())
    }

  }, [categoryId])

  return (
    <section id="welcome" className="section-product">
      <div className="container">
        <div
          className=" pb-10 sm:mt-10 md:pb-15 lg:pb-20 grid base:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-2 gap-y-3 lg:gap-x-2 lg:gap-y-2">
          <h1 className="product-category-title">Category name</h1>
          <ProductFilterMenu/>
          <div className="col-span-2">
            <ProductFilterChips
              chips={ chips }
              productFilter={ productFilter }
            />
          </div>
        </div>
      </div>
      { isProductsLoading ? (<div className="container">Loading...</div>) :
        (
          <div className="container">
            <div
              className="grid base:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 lg:gap-x-6 lg:gap-y-8">
              { products?.map((product) => (
                <ProductCard key={ product.id } product={ product }/>
              )) }
            </div>
          </div>
        ) }
    </section>
  );
};

export default Product;
