import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import App from "./App";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage/ProductDetailsPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: ":category", element: <CategoryPage /> },
      { path: ":category/:cartId", element: <ProductDetailsPage/>}
    ],
  },
]);
