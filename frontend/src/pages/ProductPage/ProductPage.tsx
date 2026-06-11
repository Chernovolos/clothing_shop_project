import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { selectProducts, selectIsProductsLoading, resetProducts } from "@/slices/productSlice.ts";
import { CATEGORY_MAP, PRODUCT_CATEGORY } from "@/types/enums/product.enums.ts";
import { getProducts } from "@/pages/ProductPage/productApi.ts";
import ProductCard from "../../components/ProductCard.tsx";

const ProductPage: React.FC = () => {
  const { category } = useParams<{ category: 'women' | 'men' | 'kids' }>();

  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const isProductsLoading = useAppSelector(selectIsProductsLoading);

  const normalized = category?.toLowerCase().trim();
  const categoryId =
    normalized && normalized in CATEGORY_MAP
      ? CATEGORY_MAP[normalized as keyof typeof CATEGORY_MAP]
      : PRODUCT_CATEGORY.DEFAULT;

  useEffect(() => {
    dispatch(
      getProducts({categoryType: categoryId}),
    );
    return () => {
      dispatch(resetProducts())
    }
  }, [categoryId, dispatch])

  return (
    <section id="welcome" className="section-product">
      <div className="container">
        <h1 className="product-category-title">Category name</h1>
      </div>
      { isProductsLoading ? (<div className="container">Loading...</div>) :
        (
          <div className="container">
            <div
              className="grid base:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 lg:gap-x-6 lg:gap-y-8">
              {
                products?.map((product) => (
                  <ProductCard key={ product.id } product={ product }/>
                ))
              }
            </div>
          </div>
        ) }
    </section>
  );
};

export default ProductPage;
