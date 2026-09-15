import { Outlet} from "react-router-dom";
import { useAppSelector } from "@/app/hooks.ts";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";
import type { FunctionComponent } from "react";

const PrivateLayout: FunctionComponent = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if(!isAuthenticated) {
    return <AuthenticationRequired variant={'page'}/>;
  }

  return <Outlet/>
}

export default PrivateLayout;