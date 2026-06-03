import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { setProducts, selectProducts, selectIsProductsLoading } from "@/slices/productSlice.ts";
import { getProducts } from "./categoryAPI.ts";
import { categoryTypes, type CategoryTypes } from "@/types/Category.ts";
import ProductCard from "../../components/ProductCard.tsx";

const ProductPage: React.FC = () => {
  const {category} = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const isProductsLoading = useAppSelector(selectIsProductsLoading);
  const isCategoryType = (value: any): value is CategoryTypes =>
    categoryTypes.includes(value as CategoryTypes);

  useEffect(() => {
    if (isCategoryType(category)) {
      dispatch(getProducts(category));
      setProducts(products);
    } else {
      navigate("/women");
    }
  }, [category, dispatch])

  const testAPI = async () => {
    const res = await fetch("http://localhost:3000/api/test");
    console.log(res);
    const data = await res.json();
    console.log(data);
  };

  return (
    <section id="welcome" className="section-product">
      <div className="container">
        <h1 className="product-category-title">Category name</h1>
      </div>
      <button onClick={testAPI}>test API</button>
      { isProductsLoading ? (<div className="container">Loading...</div>) :
        (
          <div className="container">
            <div
              className="grid base:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 lg:gap-x-6 lg:gap-y-8">
              {
                products?.map((product) => (
                  <ProductCard key={ product.id } { ...product } />
                ))
              }
            </div>
          </div>
        ) }
    </section>
  );
};

export default ProductPage;
