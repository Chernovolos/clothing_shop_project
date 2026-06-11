import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import App from "./App";
import Product from "@/pages/Product/Product.tsx";
import ProductDetails from "@/pages/ProductDetails/ProductDetails.tsx";
import Cart from "@/pages/Cart/Cart.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {path: "", element: <Home/>},
      {path: ":category", element: <Product/>},
      {path: ":category/:id", element: <ProductDetails/>},
      {path: "order", element: <Cart/>},
    ],
  },
]);
