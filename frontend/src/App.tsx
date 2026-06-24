import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks.ts";
import { getSelfUser } from "@/thunk/user.thunk.ts";
import Header from "./components/Header";
import { AuthModalProvider } from "@/contexts/AuthModalContext.tsx";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
   dispatch(getSelfUser());
  },[dispatch]);

  return (
    <>
      <AuthModalProvider>
      <Header/>
      <Outlet/>
      </AuthModalProvider>
    </>
  );
}

export default App;
