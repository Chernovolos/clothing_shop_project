import { X } from "lucide-react";
import { PRODUCT_SIZE, sizeToLabel } from "@/types/enums/product.enums.ts";
import type { CreateOrderItemDto } from "@/types/dtos/order-item.dto.ts";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import { useProductVariant } from "@/hooks/useProductVariant.ts";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";
import { addOrderItem } from "@/thunk/order.thunk.ts";

type Props = {
  product: ProductDetailsDto;
  isOpen: boolean;
  onClose: () => void;
};

const AdHocStockSelector = ({product, isOpen, onClose}: Props) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
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
  } = useProductVariant(product);

  const addItemToCart = () => {
    if (product && selectedSize !== null && selectedColorId !== null) {
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

  return (
    <>
      <div className={ `stock-wrapper ${ isOpen ? "open" : "" }` }>
        <div className="stock">
          <div className="stock-btn-wrapper">
            <button className="py-3" onClick={ onClose }>
              <X className="cart-close-icon" strokeWidth={ 2 } size={ 20 }/>
            </button>
          </div>
          {
            !isAuthenticated ? (<AuthenticationRequired onClose={ onClose } variant={ 'overlay' }/>) :
              (
                <>
                  <p className="product-size-title">Select size:</p>
                  <div className="product-btn-wrapper">
                    { sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      const isUnavailable = !isAvailableSizeByColor(size);
                      return (
                        <button
                          key={ size }
                          className={ `product-btn-size ${size === PRODUCT_SIZE.ONE_SIZE ? "w-[70px]" : ""} ${
                            isSelected ? "product-btn-size--active" : ""
                          } ${ isUnavailable ? "product-btn-size--unavailable" : "" }` }
                          onClick={ () => handleSizeSelect(size) }
                        >{ sizeToLabel(size) }</button>
                      )
                    }) }
                  </div>
                  <p className="product-color-title">Select color:</p>
                  <div className="product-btn-wrapper">
                    { colors.map((color) => {
                      const isSelected = selectedColorId === color.id;
                      const isUnavailable = !isAvailableColorBySize(color.id);
                      return (
                        <button
                          key={ color.id }
                          className={ `product-btn-color ${
                            isSelected ? "product-btn-color--active" : ""
                          } ${ isUnavailable ? "product-btn-color--disabled" : "" }` }
                          style={ {backgroundColor: color.hex} }
                          onClick={ () => handleColorSelect(color.id) }
                        />
                      )
                    }) }
                  </div>
                  <button
                    disabled={ !isSelectionComplete || isOutOfStock }
                    onClick={ addItemToCart }
                    className={ `product-btn-add ${ (!isSelectionComplete || isOutOfStock) ? "product-btn-add--disabled" : "" }` }
                  >
                    add to cart
                  </button>
                </>
              )
          }
        </div>
      </div>
    </>
  )
}

export default AdHocStockSelector;