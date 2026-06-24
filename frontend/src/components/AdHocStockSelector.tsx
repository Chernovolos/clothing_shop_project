import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import { sizeToLabel } from "@/types/enums/product.enums.ts";
import { useProductVariant } from "@/hooks/useProductVariant.ts";
import { X } from "lucide-react";
import { useAppSelector } from "@/app/hooks.ts";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";

type Props = {
  product: ProductDetailsDto;
  isOpen: boolean;
  onClose: () => void;
};

const AdHocStockSelector = ({product, isOpen, onClose}: Props) => {
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
                          className={ `product-btn-size ${
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
                    // onClick={ addItemToCart }
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