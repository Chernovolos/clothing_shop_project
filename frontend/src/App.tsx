import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { getSelfUser } from "@/thunk/user.thunk.ts";
import Header from "./components/Header";
import { AuthModalProvider } from "@/contexts/AuthModalContext.tsx";
import { getOrCreateOrder } from "@/thunk/order.thunk.ts";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ScrollToTop } from "@/components/ScrollToTop.tsx";
import { CurrencyProvider } from "@/contexts/CurrencyContext.tsx";

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(getSelfUser());
  }, [dispatch]);


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getOrCreateOrder());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <APIProvider apiKey={ import.meta.env.VITE_GOOGLE_MAPS_API_KEY }
                   onLoad={ () => console.log('Maps API has loaded.') }>
        <AuthModalProvider>
          <ScrollToTop/>
          <CurrencyProvider>
            <Header/>
            <Outlet/>
          </CurrencyProvider>
        </AuthModalProvider>
      </APIProvider>
    </>
  );
}

export default App;
