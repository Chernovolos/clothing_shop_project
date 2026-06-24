import ProductCart from "@/components/ProductCart.tsx";
import { useAppSelector } from "@/app/hooks.ts";
import { selectOrder, selectTotalQuantity } from "@/slices/cart.slice.ts";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MiniCart = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const order = useAppSelector(selectOrder);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const totalQuantity = useAppSelector(selectTotalQuantity);

  const goToCartPage = () => {
    if (order) {
      onClose();
      navigate("order");
    }
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
            <button onClick={ onClose }>
              <X className="cart-close-icon" strokeWidth={ 2 } size={ 20 }/>
            </button>
          </div>
          { !isAuthenticated && (
            <AuthenticationRequired
              onClose={onClose}
              variant={'overlay'}
            />
          )}

          <h2 className="cart-title-quantity p-4">My bag,<span
            className="font-normal">{ order ? totalQuantity : "0" } items</span></h2>
          <div className="flex flex-col overflow-y-auto max-h-[50vh]">
            {
              order?.items?.map((item, index) => (
                <ProductCart key={ index } { ...item } variant={ "mini" }/>
              ))
            }
          </div>
          <div className="grid grid-cols-12 gap-2 p-4">
            <div className="col-span-12 flex justify-between pb-4 pt-3">
              <p className="cart-title-quantity">Total</p>
              <p className="cart-title-quantity">${ order?.total ?? 0 }</p>
            </div>
            <div className="col-span-12 flex justify-between pb-4 gap-2">
              <button
                onClick={ () => goToCartPage() }
                className="cart-btn">
                view bag
              </button>
              <button
                className="cart-btn">
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