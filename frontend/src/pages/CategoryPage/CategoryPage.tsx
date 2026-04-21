import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { setProducts, selectProduct } from "./productSlice.ts";
import { fetchProducts } from "./categoryAPI.ts";
import { categoryTypes, type CategoryTypes } from "../../types/Category.ts";
import ProductCard from "../../components/ProductCard.tsx";

const CategoryPage: React.FC = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProduct);
  // const loading = useAppSelector(selectLoading);
  // const error = useAppSelector(selectError);
  // const categoriesProducts = useAppSelector(selectCategories);
  const isCategoryType = (value: any): value is CategoryTypes =>
    categoryTypes.includes(value as CategoryTypes);

  useEffect(() => {
    if (isCategoryType(category)) {
      dispatch(fetchProducts(category));
      setProducts(products);
    } else {
      navigate("/women");
    }
  }, [category, dispatch])

  return (
    <div className="category-page">
      <section id="welcome" className="section-category">
        <div className="container">
          <h1 className="category-title">Category name</h1>
        </div>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-20">
            {
              products?.map((product) => (
                <ProductCard key={ product.id } { ...product } />
              ))
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
