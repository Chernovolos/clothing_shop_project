import { LogOut, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { logoutUser } from "@/thunk/auth.thunk.ts";
import { selectUser } from "@/slices/user.slice.ts";
import { useNavigate } from "react-router-dom";
import { clearOrder } from "@/slices/order.slice.ts";

type Props = {
  isOpen: boolean,
  onClose: () => void;
}
const Profile = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleLogout  = () => {
    dispatch(logoutUser());
    dispatch(clearOrder())

    onClose();
    navigate("/women");
  }
  return (
    <>
      <div
        className={`profile-overlay ${ isOpen ? "profile-overlay--open" : "" }`}
        onClick={onClose}
      ></div>
      <div className={ `profile-dropdown ${ isOpen ? "profile-dropdown--open" : "" }` }>
        <div className="profile-wrapper">
          <div className="profile-btn-wrapper">
            <button className="px-1" onClick={onClose}>
              <X className="cart-close-icon" strokeWidth={ 1 } size={ 20 }/>
            </button>
          </div>
          <div className="flex flex-col overflow-y-auto  p-2">
            <div className="profile-list">
              <p className="profile-list__email">{user?.email}</p>
            </div>
            <div className="profile-list">
              <p className="profile-list__link">my purchases</p>
            </div>
            <button
              className="profile-btn"
              onClick={ handleLogout }>
              Logout
              <LogOut strokeWidth={ 1 } size={ 15 }/>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile;