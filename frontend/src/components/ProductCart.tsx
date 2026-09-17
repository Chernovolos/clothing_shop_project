import ProductCartCarousel from "@/components/ProductCartCarousel.tsx";
import type { OrderItemDto, UpdateOrderItemDto } from "@/types/dtos/order-item.dto.ts";
import { useProductVariant } from "@/hooks/useProductVariant.ts";
import { PRODUCT_SIZE, type ProductSize, sizeToLabel } from "@/types/enums/product.enums.ts";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { removeOrderItem, updateOrder } from "@/thunk/order.thunk.ts";
import { clearOrderError, selectOrderError } from "@/slices/order.slice.ts";
import { useCurrencyContext } from "@/contexts/CurrencyContext.tsx";

type Props = {
  variant?: "mini" | "page" | "";
  orderItem: OrderItemDto
};

const ProductCart = ({orderItem, variant}: Props) => {
  const dispatch = useAppDispatch();
  const orderError = useAppSelector(selectOrderError);
  const { stocks, images } = orderItem.product;

  const { getCurrencySymbol, convertToCurrency } = useCurrencyContext();

  const initialStock = useMemo(
    () => stocks.find(s => s.id === orderItem.stockId),
    [stocks, orderItem.stockId],
  );

  const {
    colors,
    sizes,
    selectedColorId,
    selectedSize,
    handleColorSelect,
    handleSizeSelect,
    isAvailableColorBySize,
    isAvailableSizeByColor,
    isOutOfStock,
    isSelectionComplete,
    // imageMap,
  } = useProductVariant(orderItem.product, initialStock);

  const onSizeSelect = (size: ProductSize) => {
    dispatch(clearOrderError());
    handleSizeSelect(size);
  };

  const onColorSelect = (colorId: number) => {
    dispatch(clearOrderError());
    handleColorSelect(colorId);
  };

  const handleUpdate = () => {
    dispatch(clearOrderError())
    const newsStock = stocks.find(s => s.productSize === selectedSize && s.color?.id === selectedColorId);

    let newOrderItem: UpdateOrderItemDto;
    if (newsStock && newsStock.id !== initialStock?.id) {

      newOrderItem = {
        id: orderItem.id,
        type: orderItem.type,
        orderId: orderItem.orderId,
        productId: orderItem.productId,
        stockId: initialStock!.id,
        quantity: orderItem.quantity,
        price: orderItem.price,
        newStockId: newsStock?.id,
      }
    } else {
      newOrderItem = {
        id: orderItem.id,
        type: orderItem.type,
        orderId: orderItem.orderId,
        productId: orderItem.productId,
        stockId: initialStock!.id,
        quantity: orderItem.quantity,
        price: orderItem.price,
      }
    }

    dispatch(updateOrder(newOrderItem))
  }

  const handleDeleteItem = (id: number) => {
    dispatch(clearOrderError());
    dispatch(removeOrderItem(id))
  }

  return (
    <div className={ `cart ${ variant }` }>
      <div className={ `grid grid-cols-12 
    ${ variant === "mini" ? "gap-2 p-4" : "gap-4 py-6 items-stretch" }` }>
        <div className={ `flex flex-col ${ variant === "mini" ? "col-span-5 gap-0.5" : "col-span-7 gap-1" }` }>
          <h2 className={ `cart-title ${ variant }` }>{ orderItem.product.title }</h2>
          { orderError && <p>{ orderError }</p> }
          { variant === "mini" ? "" : <p className={ `cart-subtitle ${ variant }` }>{ orderItem.product.title }</p> }
          <p className={ `cart-price ${ variant }` }>{getCurrencySymbol()} { convertToCurrency(orderItem.product.price) }</p>

          <p className={ `cart-label ${ variant }` }>size:</p>
          <div className={ `cart-btn-wrapper ${ variant }` }>
            { sizes.map((size) => {
              const isSelected = selectedSize === size;
              const isUnavailable = !isAvailableSizeByColor(size);
              return (
                <button
                  key={ size }
                  className={ `cart-btn-size  ${ variant } ${size === PRODUCT_SIZE.ONE_SIZE ? "w-[70px]" : ""} ${
                    isSelected ? "cart-btn-size--active" : ""
                  } ${ isUnavailable ? "cart-btn-size--unavailable" : "" }` }
                  onClick={ () => onSizeSelect(size) }
                >{ sizeToLabel(size) }</button>
              )
            }) }
          </div>

          <p className={ `cart-label ${ variant }` }>color:</p>
          <div className={ `cart-btn-wrapper ${ variant }` }>
            { colors.map((color) => {
              const isSelected = selectedColorId === color.id;
              const isUnavailable = !isAvailableColorBySize(color.id);
              return (
                <button
                  key={ color.id }
                  className={ `cart-btn-color  ${ variant } ${
                    isSelected ? "cart-btn-color--active" : ""
                  } ${ isUnavailable ? "cart-btn-color--unavailable" : "" }` }
                  style={ {backgroundColor: color.hex} }
                  onClick={ () => onColorSelect(color.id) }
                ></button>
              )
            }) }
          </div>
        </div>

        <div
          className={ `flex flex-col justify-between items-center h-full ${ variant === "mini" ? "col-span-2" : "col-span-1" }` }>
          <button
            disabled={ !isSelectionComplete || isOutOfStock }
            onClick={ () => handleUpdate() }
            className={ `cart-btn-action ${ variant } ${ (!isSelectionComplete || isOutOfStock) ? "cart-btn--disabled" : "" }` }
          >+
          </button>
          <p className="cart-quantity">{ orderItem.quantity }</p>
          <button
            onClick={ () => handleDeleteItem(orderItem.id) }
            className={ `cart-btn-action ${ variant }` }>
            -
          </button>
        </div>

        <div className={ `flex flex-col  ${ variant === "mini" ? "col-span-5" : "col-span-4" }` }>
          <ProductCartCarousel images={ images } outOfStock={ false }/>
        </div>
      </div>
    </div>
  )
}

export default ProductCart;