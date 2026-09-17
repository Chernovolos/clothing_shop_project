import { useProductVariant } from "@/hooks/useProductVariant.ts";
import { useCurrencyContext } from "@/contexts/CurrencyContext.tsx";
import { X} from "lucide-react";
import type { OrderItemDto } from "@/types/dtos/order-item.dto.ts";
import { PRODUCT_SIZE, sizeToLabel } from "@/types/enums/product.enums.ts";

type OrderItemSummaryProps = {
  item: OrderItemDto
}

const OrderItemSummary = ({item}: OrderItemSummaryProps) => {
  const {getCurrencySymbol, convertToCurrency} = useCurrencyContext();
  const stock = item.product.stocks.find(s => s.id === item.stockId);
  const image = item.product.images.find(img => img.color?.id === stock?.color?.id);
  const {colors, sizes, selectedColorId, selectedSize} = useProductVariant(item.product, stock);

  return (
    <div className="cart page">
      <div className="flex flex-row gap-3 py-6 items-stretch justify-between">
        <div className="flex flex-col col-span-5 gap-2">
          <h2 className="cart-title mini">{ item.product.title }</h2>
          <div className="flex">
            { item.product.tags.map((tag) => {
              return <p key={ tag.id } className="product-tag capitalize">{ tag.title }</p>
            }) }
          </div>
          <p className="cart-price mini font-bold">{ getCurrencySymbol() } { convertToCurrency(item.product.price) }</p>
          <p className="cart-label page font-normal text-sm">size:</p>
          <div className="cart-btn-wrapper mini">
            { sizes.map((size) => (
              <div
                key={ size }
                className={ `cart-btn-size page cart-btn-size--static ${ selectedSize === size ? "cart-btn-size--active" : "" }
                ${size === PRODUCT_SIZE.ONE_SIZE ? "w-[70px]" : ""}
                ` }
              >{ sizeToLabel(size) }</div>
            )) }
          </div>
          <p className="cart-label page font-normal text-sm">color:</p>
          <div className="cart-btn-wrapper mini">
            { colors.map((color) => (
              <div
                key={ color.id }
                className={ `cart-btn-color mini cart-btn-color--static ${ selectedColorId === color.id ? "cart-btn-color--active" : "" }` }
                style={ {backgroundColor: color.hex} }
              ></div>
            )) }
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <p className="cart-quantity flex flex-row items-baseline gap-0.5">
            <X size={ 10 }/>
            <span className="font-bold">{ item.quantity }</span>
          </p>
          <img
            src={ image?.url }
            alt={ item.product.title }
            className="w-[150px] shrink object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default OrderItemSummary;
