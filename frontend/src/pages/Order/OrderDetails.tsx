import { useEffect } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { Loader} from "lucide-react";
import { getOrderById } from "@/thunk/order.thunk.ts";
import { selectIsOrderDetailsLoading, selectOrderDetails } from "@/slices/order.slice.ts";
import OrderSummary from "@/components/OrderSummary.tsx";
import OrderItemSummary from "@/components/OrderItemSummary.tsx";

const OrderDetails = () => {
  const {orderId} = useParams<{ orderId: string }>();
  const normalizedOrderId = orderId ? parseInt(orderId, 10) : null;
  const dispatch = useAppDispatch();
  const orderDetails = useAppSelector(selectOrderDetails);
  const isOrderDetailsLoading = useAppSelector(selectIsOrderDetailsLoading);

  useEffect(() => {
    if (!normalizedOrderId) return;

    dispatch(getOrderById(normalizedOrderId))
  }, [normalizedOrderId])

  if (!orderDetails) return null;

  return (
    <div className="section mt-42">
      <div className="container">
        { isOrderDetailsLoading ? <Loader/> : " " }
        <div className="flex items-center flex-col gap-2">
          <h2 className="order-summary__title">
            Thank you for your order!
          </h2>
          <p className="order-summary__description">Your order has been placed. A confirmation has been sent to
            <span className="font-normal"> { orderDetails.email }</span>.</p>
        </div>
        <div className="order-details">
          <div>
            { orderDetails.orderItems.map((item) => (
              <OrderItemSummary key={ item.id } item={ item }/>
            )) }
          </div>
          <OrderSummary orderDetails={ orderDetails } />
        </div>
      </div>
    </div>
  )
}

export default OrderDetails;