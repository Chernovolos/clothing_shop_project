import type { OrderDetailsDto } from "@/types/dtos/order.dto.ts";
import { useNavigate } from "react-router-dom";
import { orderPaymentTypeToLabel } from "@/types/enums/order.enums.ts";

type OrderSummaryProps = {
  orderDetails: OrderDetailsDto
}
const OrderSummary = ({orderDetails}: OrderSummaryProps) => {
  const navigate = useNavigate();
  const normalizeName = (name?: string) =>
    name
      ?.replace(/_/g, ' ')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const normalizedFirstName = normalizeName(orderDetails?.firstName);
  const normalizedLastName = normalizeName(orderDetails?.lastName);

  const handleContinueShopping = () => {
    navigate('/women');
  }

  return (
    <div className="order-summary">
      <div className="order-summary__item order-details--border-bottom">
        <h3 className="order-summary__title">Summary</h3>
        <div className="order-summary__rows">
          <div className="order-summary__row">
            <span className="order-summary__label text-left">Delivery:</span>
            <span className="order-summary__value text-right">Depends on the selected shipping method.</span>
          </div>
          <div className="order-summary__row order-summary__row--total">
            <span>Total:</span>
            <span>$ { orderDetails.total }</span>
          </div>
        </div>
      </div>
      <div className="order-summary__item order-details--border-bottom">
        <h3 className="order-summary__title">Delivery</h3>
        <p className="order-summary__text">
          { normalizedFirstName } { normalizedLastName }<br/>
          { orderDetails.cityName }<br/>
          { orderDetails.warehouseName }<br/>
        </p>
      </div>
      <div className="order-summary__item order-details--border-bottom">
        <h3 className="order-summary__title">Payment</h3>
        <p className="order-summary__text">
          { orderPaymentTypeToLabel(orderDetails.paymentMethod) }<br/>
        </p>
      </div>
      <div className="order-summary__actions">
        <button
          onClick={ handleContinueShopping }
          className="order-summary__button order-summary__button--ghost cart-btn"
        >Continue shopping
        </button>
      </div>
    </div>
  )
}

export default OrderSummary;