import { useAppSelector } from "@/app/hooks.ts";
import { selectOrder } from "@/slices/order.slice.ts";
import ProductCart from "@/components/ProductCart.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useCurrencyContext } from "@/contexts/CurrencyContext.tsx";

const Order = () => {
  const order = useAppSelector(selectOrder);
  const navigate = useNavigate();

  const { getCurrencySymbol, convertToCurrency } = useCurrencyContext();

  return (
    <section className="section section-cart">
      <div className="container">
        <div className="flex flex-col">
          <h2 className="cart-title--header">Cart</h2>
          <div className="cart-wrapper page">
            {
              order ? (
                order?.orderItems?.map((item) => (
                  <ProductCart key={ item.id } orderItem={item} variant={"page"}/>
                ))
              ) : (
                <p className="text-2xl">
                  Your cart is empty :(.
                  <Link to={'/women'} className="cart-link"> Continue shopping.</Link>
                </p>
              )
            }
          </div>
        </div>

        { order?.quantity ? (
          <div className="grid gap-2 justify-items-start pb-6">
            <div className="grid grid-flow-col grid-rows gap-4 py-2">
              <div className="row-span-2 row-start-2 ...">
                <p className="text-2xl mt-2">Quantity:</p>
                <p className="font-medium text-2xl">Total:</p>
              </div>
              <div className="row-span-2 row-start-2 ...">
                <p className="font-bold text-2xl mt-2">{ order.quantity }</p>
                <p className="font-bold text-2xl">{getCurrencySymbol()} { convertToCurrency(order.total) }</p>
              </div>
            </div>
            <button
              className="cart-btn sm:w-[280px]"
              onClick={() => {
                navigate('/order/checkout-order');
              }}
            >
              order
            </button>
          </div>
        ): null
        }
      </div>
    </section>
  )
}

export default Order;