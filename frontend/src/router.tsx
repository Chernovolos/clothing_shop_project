import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import App from "./App";
import ProductPage from "@/pages/ProductPage/ProductPage.tsx";
import ProductDetailsPage from "@/pages/ProductDetailsPage/ProductDetailsPage.tsx";
import CartPage from "@/pages/CartPage/CartPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {path: "", element: <HomePage/>},
      {path: ":category", element: <ProductPage/>},
      {path: ":category/:cartId", element: <ProductDetailsPage/>},
      {path: "order", element: <CartPage/>},
    ],
  },
]);
