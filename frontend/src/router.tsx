import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import App from "./App";
import Product from "@/pages/Product/Product.tsx";
import ProductDetails from "@/pages/ProductDetails/ProductDetails.tsx";
import Order from "@/pages/Order/Order.tsx";
import CheckoutOrder from "@/pages/Order/CheckoutOrder.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {path: "/", element: <Home/>},
      {path: ":category", element: <Product/>},
      {path: ":category/:id", element: <ProductDetails/>},
      {path: "order", element: <Order/>},
      {path: "order/checkout-order", element: <CheckoutOrder/>}
    ],
  },
]);
