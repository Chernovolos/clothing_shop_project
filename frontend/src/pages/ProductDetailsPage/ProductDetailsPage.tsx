import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import type { Gender } from "@/types/Category.ts";
import type { Color } from "@/types/Color.ts";
import type { Size } from "@/types/Size.ts";
import type { CartItem } from "@/types/Product.ts";
import { useProductStock } from "@/hooks/useProductStock.ts";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel.tsx";
import { selectIsProductLoading, selectProduct } from "@/slices/productSlice.ts";
import { createOrder } from "@/pages/CartPage/cartApi.ts";
import { getProductById } from "@/pages/ProductDetailsPage/productDetailsAPI.ts";

const ProductDetailsPage = () => {
  const {category, cartId} = useParams<{
    category: Gender;
    cartId: string;
  }>();

  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const isProductLoading = useAppSelector(selectIsProductLoading);

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  useEffect(() => {
    if (!category || !cartId) return;
    dispatch(getProductById({gender: category, id: cartId}));
  }, [category, cartId, dispatch])

  const {
    stockAvailabilityMap,
    availableColors,
    availableSizes,
  } = useProductStock(product);

  useEffect(() => {
    if (!product) return;

    const firstAvailable = product.stock.find((s) => s.available > 0);
    if (firstAvailable) {
      setSelectedSize(firstAvailable.size);
      setSelectedColor(firstAvailable.color);
    } else {
      setSelectedSize(null);
      setSelectedColor(null);
    }

  }, [product])

  if (!product) return <div>No product found</div>;
  const {title, images, price, description, subcategory} = product;

  const isAvailableSets = (color?: Color | null, size?: Size | null) => {
    if (!color || !size) return 0;
    // console.log(stockAvailabilityMap.get(`${ color.code }_${ size }`) ?? 0)
    return stockAvailabilityMap.get(`${ color.code }_${ size }`) ?? 0;
  };

  const isSizeAvailable = (size: Size) => {
    if (!selectedColor) {
      return availableColors.some((color) => isAvailableSets(color, size) > 0);
    }
    return isAvailableSets(selectedColor, size) > 0;
  };

  const isColorAvailable = (color: Color) => {
    if (!selectedSize) {
      return availableSizes.some((size) => isAvailableSets(color, size) > 0);
    }
    return isAvailableSets(color, selectedSize) > 0;
  };

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);

    if (selectedColor && isAvailableSets(selectedColor, size) === 0) {
      const newColor = availableColors.find(
        (c) => isAvailableSets(c, size) > 0,
      );
      setSelectedColor(newColor ?? null);
    }
  };

  const handleColorChange = (color: Color) => {
    setSelectedColor(color);

    if (selectedSize && isAvailableSets(color, selectedSize) === 0) {
      const newSize = availableSizes.find(
        (s) => isAvailableSets(color, s) > 0,
      );
      setSelectedSize(newSize ?? null);
    }
  };

  const addItemToCart = () => {
    if (!selectedColor || !selectedSize) return;

    const newItem: CartItem = {
      id: product.id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      price: product.price
    };
    dispatch(createOrder(newItem));
  };

  const currentQuantity = isAvailableSets(selectedColor, selectedSize);
  const outOfStock = product.stock.every((s) => s.available === 0);

  return (
    <section className="section section-product-details">
      { isProductLoading ? (<div className="container"><h1>Loading...</h1></div>) :
        (<div className="container">
          <div className="grid grid-cols-12 gap-x-20">
            <div className="col-span-8">
              <ProductDetailsCarousel images={ images ?? [] } outOfStock={ outOfStock }/>
            </div>
            <div className="col-span-4 flex flex-col">
              <h2 className="product-title">{ title }</h2>
              <p className="product-subtitle">{ subcategory.subcategory_name }</p>

              <p className="product-size-title">size:</p>
              <div className="product-btn-wrapper">
                { outOfStock ? <div>OUT OF STOCK</div> : availableSizes.map((size) => {
                  return (
                    <button
                      key={ size }
                      className={ `product-btn-size ${
                        selectedSize === size ? "product-btn-size--active" : ""
                      } ${ isSizeAvailable(size) ? "" : "product-btn-size--unavailable" }` }
                      onClick={ () => handleSizeChange(size) }
                      // disabled={!isSizeAvailable(size)}
                    >{ size }</button>
                  )
                }) }
              </div>

              <p className="product-color-title">color:</p>
              <div className="product-btn-wrapper">
                { availableColors.map((color) => {
                  return (
                    <button
                      key={ color.id }
                      className={ `product-btn-color ${
                        selectedColor?.id === color.id ? "product-btn-color--active" : ""
                      } ${ isColorAvailable(color) ? "" : "product-btn-color--disabled" }` }
                      style={ {backgroundColor: color.hex} }
                      onClick={ () => handleColorChange(color) }
                      disabled={ !isColorAvailable(color) }
                    />
                  )
                }) }
              </div>

              <p className="product-price-title">price:</p>
              <p className="product-price">${ price }</p>
              <button
                disabled={ !selectedColor || !selectedSize || !currentQuantity }
                onClick={ addItemToCart }
                className={ `product-btn-add ${ (!selectedColor || !selectedSize || !currentQuantity) ? "product-btn-add--disabled" : "" }` }
                >
                add
                to
                cart
              </button>
              <p className="product-description">
                { description }
              </p>
            </div>
          </div>
        </div>)
      }
    </section>
  )
}

export default ProductDetailsPage;