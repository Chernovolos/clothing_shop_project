import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import App from "./App";
import Product from "@/pages/Product/Product.tsx";
import ProductDetails from "@/pages/ProductDetails/ProductDetails.tsx";
import Order from "@/pages/Order/Order.tsx";
import CheckoutOrder from "@/pages/Order/CheckoutOrder.tsx";
import NotFound from "@/components/NotFound.tsx";
import OrderDetails from "@/pages/Order/OrderDetails.tsx";
import PrivateLayout from "@/components/PrivateLayout.tsx";
import OrderHistory from "@/pages/Order/OrderHistory.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {index: true, element: <Home/>},
      {path: ":category", element: <Product/>},
      {path: ":category/:id", element: <ProductDetails/>},
      {
        element: <PrivateLayout/>,
        children: [
          {path: "order", element: <Order/>},
          {path: "order/checkout-order", element: <CheckoutOrder/>},
          {path: "order/history", element: <OrderHistory/>},
          {path: "order/:orderId", element: <OrderDetails/>},
        ],
      },
      {path: "*", element: <NotFound/>},
    ],
  },

]);
