import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router";
import EmblaCarousel from "@/components/EmblaCarousel.tsx";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectProductDetails, selectProductLoading } from "@/pages/ProductDetailsPage/productDetailsSlice.ts";
import { fetchProductById } from "@/pages/ProductDetailsPage/productDetailsAPI.ts";
import type { Gender } from "../../types/Category.ts";
import type { Color } from "@/types/Color.ts";
import type { Size } from "@/types/Size.ts";

const ProductDetailsPage = () => {
  const {category, cartId} = useParams<{
    category: Gender;
    cartId: string;
  }>();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductDetails);
  const loading = useAppSelector(selectProductLoading);

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [cart, setCart] = useState<ProductCart[]>([]);

  useEffect(() => {
    if (!category || !cartId) return;
    dispatch(fetchProductById({gender: category, id: cartId}));
  }, [category, cartId, dispatch])

  const {stockAvailabilityMap, availableColors, availableSizes} = useMemo(() => {
    if (!product) {
      return {
        stockAvailabilityMap: new Map<string, number>(),
        availableColors: [] as Color[],
        availableSizes: [] as Size[],
      };
    }

    const map = new Map<string, number>();
    const colorsMap = new Map<number, Color>();
    const sizesSet = new Set<Size>();

    for (const stock of product.stock) {
      sizesSet.add(stock.size);
      colorsMap.set(stock.color.id, stock.color);

      map.set(`${ stock.color.code }_${ stock.size }`, stock.available);
    }

    return {
      stockAvailabilityMap: map,
      availableColors: Array.from(colorsMap.values()),
      availableSizes: Array.from(sizesSet.values()),
    };
  }, [product]);

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

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>No product found</div>;

  const {title, images, price, description, subcategory} = product;

  const getQuantity = (color?: Color | null, size?: Size | null) => {
    if (!color || !size) return 0;
    console.log(stockAvailabilityMap.get(`${ color.code }_${ size }`) ?? 0)
    return stockAvailabilityMap.get(`${ color.code }_${ size }`) ?? 0;
  };

  const isSizeAvailable = (size: Size) => {
    if (!selectedColor) {
      return availableColors.some((color) => getQuantity(color, size) > 0);
    }
    return getQuantity(selectedColor, size) > 0;
  };

  const isColorAvailable = (color: Color) => {
    if (!selectedSize) {
      return availableSizes.some((size) => getQuantity(color, size) > 0);
    }
    return getQuantity(color, selectedSize) > 0;
  };

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);

    if (selectedColor && getQuantity(selectedColor, size) === 0) {
      const newColor = availableColors.find(
        (c) => getQuantity(c, size) > 0,
      );
      setSelectedColor(newColor ?? null);
    }
  };

  const handleColorChange = (color: Color) => {
    setSelectedColor(color);

    if (selectedSize && getQuantity(color, selectedSize) === 0) {
      const newSize = availableSizes.find(
        (s) => getQuantity(color, s) > 0,
      );
      setSelectedSize(newSize ?? null);
    }
  };

  type ProductCart = {
    id: number
    quantity: number;
    color: Color;
    size: Size;
  }
  const addToCart = (newItem: ProductCart, products: ProductCart[])
    : ProductCart[] => {
    const existingItem = products.find((item) =>
      item.id === newItem.id && item?.color.id === newItem?.color.id && item.size === newItem.size,
    );

    if (existingItem) {
      return products.map((item) => (
        item === existingItem ?
          {...item, quantity: item.quantity + newItem.quantity} : item
      ))
    }
    return [...products, newItem];
  }

  const addItemToCart = () => {
    if (!selectedColor || !selectedSize) return;

    const newItem: ProductCart = {
      id: product.id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    };

    setCart((prev) => addToCart(newItem, prev));
  };

  const currentQuantity = getQuantity(selectedColor, selectedSize);
  const outOfStock = product.stock.every((s) => s.available === 0);

  return loading ? (<div className="container">Loading...</div>) : (
    <section className="section section-product-details">
      <div className="container">
        <div className="grid grid-cols-12 gap-x-20">
          <div className="col-span-8">
            <EmblaCarousel images={ images ?? [] } outOfStock={ outOfStock }/>
          </div>
          <div className="col-span-4 flex flex-col">
            <h2 className="product-title">{ title }</h2>
            <p className="product-subtitle">{ subcategory.subcategory_name }</p>

            <p className="product-size">size:</p>
            <div className="product-btn-wrapper">
              { outOfStock ? <div>OUT OF STOCK</div> : availableSizes.map((size) => {
                return (
                  <button
                    key={ size }
                    className={ `btn btn-size ${
                      selectedSize === size ? "activeSize" : ""
                    } ${ isSizeAvailable(size) ? "" : "disabled:opacity-40 not-available-size" }` }
                    onClick={ () => handleSizeChange(size) }
                    // disabled={!isSizeAvailable(size)}
                  >{ size }</button>
                )
              }) }
            </div>

            <p className="product-color">color:</p>
            <div className="product-btn-wrapper">
              { availableColors.map((color) => {
                return (
                  <button
                    key={ color.id }
                    className={ `btn btn-color ${
                      selectedColor?.id === color.id ? "activeColor" : ""
                    } ${ isColorAvailable(color) ? "" : "disabled:opacity-40 not-available-color" }` }
                    style={ {backgroundColor: color.hex} }
                    onClick={ () => handleColorChange(color) }
                    disabled={ !isColorAvailable(color) }
                  >
                  </button>
                )
              }) }
            </div>

            <p className="product-price-title">price:</p>
            <p className="product-price">${ price }</p>
            <button
              disabled={ !selectedColor || !selectedSize || !currentQuantity }
              onClick={ addItemToCart }
              className={ `btn ${ (!selectedColor || !selectedSize || !currentQuantity) ? "disabled" : "" }` }>add to
              cart
            </button>
            <p className="product-description">
              { description }
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsPage;