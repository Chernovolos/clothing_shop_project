import ProductCart from "@/components/ProductCart.tsx";
import { useAppSelector } from "@/app/hooks.ts";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";
import { selectOrder } from "@/slices/order.slice.ts";
import { X } from "lucide-react";
import { useCurrencyContext } from "@/contexts/CurrencyContext.tsx";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MiniCart = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const order = useAppSelector(selectOrder)

  const { getCurrencySymbol, convertToCurrency } = useCurrencyContext();

  const goToCartPage = () => {
    if (!order?.quantity) return;
    onClose();
    navigate("order");
  }

  const goToCheckoutOrderPage = () => {
    if (!order?.quantity) return;
    onClose();
    navigate("order/checkout-order");
  }

  return (
    <>
      <div
        className={ `overlay ${ isOpen ? "open" : "" }` }
        onClick={ onClose }
      ></div>
      <div className={ `cart-dropdown ${ isOpen ? "open" : "" }` }>
        <div className="cart-wrapper">
          <div className="cart-btn-wrapper">
            {
              !isAuthenticated && (
                <button onClick={ onClose }>
                  <X className="cart-close-icon" strokeWidth={ 2 } size={ 20 }/>
                </button>
              )
            }
          </div>
          { !isAuthenticated && (
              <AuthenticationRequired
                onClose={onClose}
                variant={'overlay'}
              />
          )}

          <h2 className="cart-title-quantity p-4">My bag,
            <span className="font-normal"> { order ? order.quantity : "0" } items</span></h2>
          <div className="flex flex-col overflow-y-auto max-h-[50vh]">
            {
              order?.orderItems?.map((item) => (
                <ProductCart key={ item.id } orderItem={item} variant={ "mini" }/>
              ))
            }
          </div>
          <div className="grid grid-cols-12 gap-2 p-4">
            <div className="col-span-12 flex justify-between pb-4 pt-3">
              <p className="cart-title-quantity">Total</p>
              <p className="cart-title-quantity">{getCurrencySymbol()} { order?.total ? convertToCurrency(order?.total) : 0 }</p>
            </div>
            <div className="col-span-12 flex justify-between pb-4 gap-2">
              <button
                onClick={ () => goToCartPage() }
                className="cart-btn">
                view bag
              </button>
              <button
                className="cart-btn"
                onClick={() => goToCheckoutOrderPage()}
              >
                check out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MiniCart;