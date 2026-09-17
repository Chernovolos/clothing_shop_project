import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { getOrders } from "@/thunk/order.thunk.ts";
import { selectIsOrdersLoading, selectOrders } from "@/slices/order.slice.ts";
import { Hash, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { orderStatusToLabel } from "@/types/enums/order.enums.ts";

const OrderHistory = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const isOrdersLoading = useAppSelector(selectIsOrdersLoading);

  const formatOrderDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: 'numeric',
      month: 'short',
      year: "numeric",
    })
  }

  useEffect(() => {
    dispatch(getOrders())
  }, [])

  return (
    <div className="section mt-25">
      <div className="container">
        { isOrdersLoading ? <Loader/> : " " }
        <div className="order-history">
          <h1 className="order-history__title">Orders History</h1>
          <p className="order-history__quantity"> {orders?.length} orders</p>

          {
            orders && orders?.length > 0 ? (
              <div className="order-history__list">
                <div className="order-history__head">
                  <span>Order</span>
                  <span>Date</span>
                  <span>Items</span>
                  <span>Status</span>
                  <span className="order-history__total">Total</span>
                </div>
                { orders?.map((order) => (
                  <Link className="order-history__row" key={ order.id } to={ `/order/${ order.id }` }>
                  <span className="order-history__number">
                    <Hash size={14}/>
                    { order.id }
                  </span>
                    <span className="order-history__muted">{ formatOrderDate(order.createdAt) }</span>
                    <span className="order-history__muted">{ order.quantity } items</span>
                    <span className="order-history__status">
                    <span className={ `order-history__dot order-history__dot--${ order.status }` }/>
                      { orderStatusToLabel(order.status) }
                </span>
                    <span className="order-history__total">{ order.total }</span>
                  </Link>

                )) }
              </div>
            ) : (
              <p className="text-2xl">
                Your orders history is empty :(.
                <Link to={'/women'} className="order-history__link"> Continue shopping.</Link>
              </p>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default OrderHistory;