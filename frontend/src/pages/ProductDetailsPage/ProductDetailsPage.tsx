import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { useProductStock } from "@/hooks/useProductStock.ts";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel.tsx";
import { selectIsProductLoading, selectProduct } from "@/slices/productSlice.ts";
import { getProductById } from "@/pages/ProductDetailsPage/productDetailsAPI.ts";
import { type ProductSize, sizeToLabel } from "@/types/enums/product.enums.ts";

const ProductDetailsPage = () => {
  const {id} = useParams<{ id: string }>();

  const normalizedProductId = id ? parseInt(id, 10) : null;

  console.log("normalizedProductId", normalizedProductId);
  console.log("productId", id);

  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const isProductLoading = useAppSelector(selectIsProductLoading);
  console.log("product", product);

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  useEffect(() => {
    if (!normalizedProductId) return;
    dispatch(getProductById(normalizedProductId));
  }, [normalizedProductId, dispatch])

  const {
    stockMap,
    availableColors,
    availableSizes,
    availableSizesByColor,
    availableColorsBySize,
    imageMap,
  } = useProductStock(product, selectedColorId, selectedSize);

  console.log("stockMap", stockMap);

  console.log("availableColors", availableColors);
  console.log("availableSizes", availableSizes);

  console.log("availableSizesByColor", availableSizesByColor);
  console.log("availableColorsBySize", availableColorsBySize);


  useEffect(() => {
    if (!product) return;

    const firstAvailable = product.stocks.find((s) => s.available > 0);
    if (firstAvailable) {
      // setSelectedSize(firstAvailable.productSize);
      setSelectedColorId(firstAvailable.color?.id ?? null);
    } else {
      setSelectedSize(null);
      setSelectedColorId(null);
    }

  }, [product])

  if (!product) return <div>No product found</div>;
  const { title, price, description } = product;

  const getStock = (colorId: number, size: ProductSize) =>
    stockMap.get(`${ colorId }_${ size }`) ?? 0;

  const isAvailableSizeByColor = (size: ProductSize) => {
    console.log("SIZE", size);
    if (!selectedColorId) return true;
    return getStock(selectedColorId, size) > 0;
  };

  const isAvailableColorBySize = (color: number) => {
    if (!selectedSize) return true;

    return getStock(color, selectedSize) > 0;
  };

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size);

    if (!selectedColorId) return;

    const currentStock = getStock(selectedColorId, size);

    if (currentStock > 0) return;

    const newColor = availableColors.find(
      (c) => getStock(c.id, size) > 0,
    );

    if (newColor) {
      setSelectedColorId(newColor.id);
    } else {
      setSelectedColorId(null);
    }
  };

  const handleColorChange = (colorId: number) => {
    setSelectedColorId(colorId);

    if (!selectedSize) return;

    const currentStock = getStock(colorId, selectedSize);

    if (currentStock > 0) return;

    const newSize = availableSizes.find(
      (s) => getStock(colorId, s) > 0,
    );

    if (newSize) {
      setSelectedSize(newSize);
    } else {
      setSelectedSize(null);
    }


  };

  // const addItemToCart = () => {
  //   if (!selectedColorId || !selectedSize) return;
  //
  //   const newItem: CartItem = {
  //     id: product.id,
  //     quantity: 1,
  //     color: selectedColorId,
  //     size: selectedSize,
  //     price: product.price,
  //   };
  //   dispatch(createOrder(newItem));
  // };

  // const currentQuantity = getStock(selectedColorId, selectedSize) > 0;
  const outOfStock = product.stocks.every((s) => s.available === 0);

  return (
    <section className="section section-product-details">
      { isProductLoading ? (<div className="container"><h1>Loading...</h1></div>) :
        (<div className="container">
          <div className="grid grid-cols-10 gap-x-5">
            <div className="col-span-6">
              <ProductDetailsCarousel
                images={ imageMap.get(selectedColorId ?? 0)  ?? [] }
                outOfStock={ outOfStock }
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <h2 className="product-title">{ title }</h2>
              <div className="flex">
                { product.tags.map((tag) => {
                  return <p key={ tag.id } className="product-tag">{ tag.title }</p>
                }) }
              </div>

              <p className="product-size-title">size:</p>
              <div className="product-btn-wrapper">
                { outOfStock ? <div>OUT OF STOCK</div> : availableSizes.map((size) => {

                  console.log("STOCK_MAP", stockMap.get(`${ selectedColorId }_${ size }`));

                  return (
                    <button
                      key={ size }
                      className={ `product-btn-size ${
                        selectedSize === size ? "product-btn-size--active" : ""
                      } ${ isAvailableSizeByColor(size) ? "" : "product-btn-size--unavailable" }` }
                      onClick={ () => handleSizeChange(size) }
                      // disabled={!isAvailableSizeByColor(size)}
                    >{ sizeToLabel(size) }</button>
                  )
                }) }
              </div>

              <p className="product-color-title">color:</p>
              <div className="product-btn-wrapper">
                { availableColors.map((color) => {
                  console.log("isAvailableColorBySize", isAvailableColorBySize(color.id));
                  return (
                    <button
                      key={ color.id }
                      className={ `product-btn-color ${
                        selectedColorId === color.id ? "product-btn-color--active" : ""
                      } ${ isAvailableColorBySize(color.id) ? "" : "product-btn-color--disabled" }` }
                      style={ {backgroundColor: color.hex} }
                      onClick={ () => handleColorChange(color.id) }
                      disabled={ !isAvailableColorBySize(color.id) }
                    />
                  )
                }) }
              </div>

              <p className="product-price-title">price:</p>
              <p className="product-price">${ price }</p>
              <button
                disabled={ !selectedColorId || !selectedSize }
                // onClick={ addItemToCart }
                className={ `product-btn-add ${ (!selectedColorId || !selectedSize) ? "product-btn-add--disabled" : "" }` }
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