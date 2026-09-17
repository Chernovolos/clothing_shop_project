import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { useProductStock } from "@/hooks/useProductStock.ts";
import { selectIsProductLoading, selectProduct } from "@/slices/product.slice.ts";
import { PRODUCT_SIZE, type ProductSize, sizeToLabel } from "@/types/enums/product.enums.ts";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel.tsx";
import { getProductById } from "@/thunk/product-details.thunk.ts";
import type { CreateOrderItemDto } from "@/types/dtos/order-item.dto.ts";
import { addOrderItem } from "@/thunk/order.thunk.ts";
import { useCurrencyContext } from "@/contexts/CurrencyContext.tsx";
import Loading from "@/components/Loading.tsx";
import NotFound from "@/components/NotFound.tsx";

const ProductDetails = () => {
  const {id} = useParams<{ id: string }>();
  const normalizedProductId = id ? parseInt(id, 10) : null;

  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const isProductLoading = useAppSelector(selectIsProductLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  const {getCurrencySymbol, convertToCurrency} = useCurrencyContext();

  useEffect(() => {
    if (!normalizedProductId) return;
    dispatch(getProductById(normalizedProductId));
  }, [normalizedProductId, dispatch])

  const {
    stockMap,
    availableColors,
    availableSizes,
    imageMap,
  } = useProductStock(product, selectedColorId, selectedSize);

  useEffect(() => {
    if (!product) return;

    const firstAvailable = product.stocks.find((s) => s.available > 0);
    if (firstAvailable) {
      setSelectedColorId(firstAvailable.color?.id ?? null);
    } else {
      setSelectedSize(null);
      setSelectedColorId(null);
    }

  }, [product])


  if (isProductLoading) {
    return <section className="section section-product-details"><Loading/></section>
  }
  if (!product) {
    return <section className="section section-product-details"><NotFound reason="product"/></section>
  }
  const {title, price, description} = product;

  const getStock = (colorId: number, size: ProductSize) =>
    stockMap.get(`${ colorId }_${ size }`) ?? 0;

  const isAvailableSizeByColor = (size: ProductSize) => {
    if (!selectedColorId) return true;
    return getStock(selectedColorId, size) > 0;
  };

  const isAvailableColorBySize = (color: number) => {
    if (selectedSize === null) return true;

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

    if (selectedSize === null) return;

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

  const addItemToCart = () => {
    if (product && selectedSize !== null && selectedColorId) {
      const stock = product.stocks.find(s => s.productSize === selectedSize && s.color && s.color.id === selectedColorId);
      if (stock) {
        const newItem: CreateOrderItemDto = {
          type: 0,
          productId: product.id,
          stockId: stock.id,
          quantity: 1,
        };
        dispatch(addOrderItem(newItem));
      }
    }
  };

  const outOfStock = product.stocks.every((s) => s.available === 0);

  return (
    <section className="section section-product-details">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-x-4">
          <div className="col-span-6 lg:col-span-6">
            <ProductDetailsCarousel
              images={ imageMap.get(selectedColorId ?? 0) ?? [] }
              outOfStock={ outOfStock }
            />
          </div>
          <div className="col-span-3 lg:col-span-2 flex flex-col">
            <h2 className="product-title">{ title }</h2>
            <div className="flex">
              { product.tags.map((tag) => {
                return <p key={ tag.id } className="product-tag">{ tag.title }</p>
              }) }
            </div>

            <p className="product-size-title">size:</p>
            <div className="product-btn-wrapper">
              { outOfStock ? <div>OUT OF STOCK</div> :
                availableSizes.map((size, i) => {
                  return (
                    <button
                      key={ i }
                      className={ `product-btn-size ${size === PRODUCT_SIZE.ONE_SIZE ? "w-[70px]" : ""} ${
                        selectedSize === size ? "product-btn-size--active" : ""
                      } ${ isAvailableSizeByColor(size) ? "" : "product-btn-size--unavailable" }` }
                      onClick={ () => handleSizeChange(size) }
                    >{ sizeToLabel(size) }</button>
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
            <p className="product-price">{ getCurrencySymbol() } { convertToCurrency(price) }</p>
            { isAuthenticated && (
              <>
                <button
                  disabled={ !selectedColorId || selectedSize === null }
                  onClick={ addItemToCart }
                  className={ `product-btn-add ${ (!selectedColorId || selectedSize === null) ? "product-btn-add--disabled" : "" }` }
                >
                  add to cart
                </button>
                <p className="product-description">{ description }</p>
              </>
            ) }

            <div className="relative">
              { !isAuthenticated && (<AuthenticationRequired variant={ 'inline' }/>) }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails;