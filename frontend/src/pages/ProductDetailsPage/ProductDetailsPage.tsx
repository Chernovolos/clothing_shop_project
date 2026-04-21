import { useParams } from "react-router";
import EmblaCarousel from "@/components/EmblaCarousel.tsx";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectProductDetails } from "@/pages/ProductDetailsPage/productDetailsSlice.ts";
import { useEffect } from "react";
import { fetchProductById } from "@/pages/ProductDetailsPage/productDetailsAPI.ts";
import type {  Gender } from "../../types/Category.ts";
import type { Color } from "@/types/Color.ts";
import type { Size } from "@/types/Size.ts";


const ProductDetailsPage = () => {
  const { category, cartId} = useParams<{
    category: Gender;
    cartId: string;
  }>();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductDetails);

  useEffect(() => {
    if (!category || !cartId) return;
    dispatch(fetchProductById({ gender: category , id: cartId }));

  }, [category, cartId, dispatch])

  const stockAvailabilityMap: Map<string, number> = new Map();
  const availableColors: Set<Color> = new Set();
  const availableSizes: Set<Size> = new Set();

  if (product !== null) {
    for (let stock of product.stock) {
      // get all unique colors
      if(!availableColors.has(stock.color)) {
        availableColors.add(stock.color);
      }
      // get all unique sizes
      if(!availableSizes.has(stock.size)) {
        availableSizes.add(stock.size);
      }

      // put to stockAvailabilityMap
      stockAvailabilityMap.set(`${stock.color.code}_${stock.size}`, stock.available);
    }
  }
  console.log("availableColors", availableColors);
  console.log("availableSizes", availableSizes);
  console.log("stockAvailabilityMap", stockAvailabilityMap);



  console.log("product", product);

  return (
    <section className="section section-product-details">
      <div className="container">
        {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-12 gap-y-20">*/}
        <div className="grid grid-cols-12 gap-20">
          <div className="col-span-7">
            <EmblaCarousel/>
          </div>
          <div className="col-span-5 flex flex-col">
            <h2 className="product-title">Apollo</h2>
            <p className="product-subtitle">Sub category</p>

            <p className="product-size">size:</p>
            <div className="product-btn-wrapper">
              {[...availableSizes].map((size) => {
                return (
                  <button key={size} className="btn btn-size">{size}</button>
                )
              })}
            </div>

            <p className="product-color">color:</p>
          </div>
        </div>

      </div>
    </section>

  )
}

export default ProductDetailsPage;