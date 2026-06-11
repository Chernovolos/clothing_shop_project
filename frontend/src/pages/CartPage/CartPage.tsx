// import ProductCart from "@/components/ProductCart.tsx";
// import { useAppSelector } from "@/app/hooks.ts";
// import { selectOrder } from "@/slices/cartSlice.ts";


const CartPage = () => {

  // const order = useAppSelector(selectOrder);

  return (
    <section className="section section-cart">
      <div className="container">
        <div className="flex flex-col">
          <h2 className="cart-title--header">Cart</h2>
          {/*<div className="cart-page-wrapper">*/}
          {/*  { !order ? <div>Your cart is empty.</div> :*/}
          {/*    order?.items?.map((item) => (*/}
          {/*      <ProductCart key={ `${ item.id }-${ item.size }-${ item.color }` } { ...item } variant=""/>*/}
          {/*    ))*/}
          {/*  }*/}
          {/*</div>*/}
        </div>

        {/*{ order && (*/}
        {/*  <div className="grid gap-2 py-6 justify-items-start">*/}
        {/*    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 text-xl">*/}
        {/*      <p className="font-medium text-2xl mt-2">Total:</p>*/}
        {/*      <p className="font-bold text-2xl mt-2">$200.00</p>*/}
        {/*    </div>*/}
        {/*    <button className="cart-btn sm:w-[280px]">*/}
        {/*      order*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*) }*/}
      </div>
    </section>
  )
}

export default CartPage;