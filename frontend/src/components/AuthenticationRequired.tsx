import { LogIn, X } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext.tsx";

type Props = {
  onClose?: () => void;
  title?: string;
  variant : 'overlay' | 'inline';
}

const AuthenticationRequired = ({ onClose, variant, title = "Please, login to continue shopping." }: Props) => {
  const { openLogin } = useAuthModal();
  const handleLogin = () => {
    onClose?.();
    openLogin();
  };

  return (
    <div className={`auth-overlay ${variant === "inline" ? "auth-overlay--inline": ""} `}>
      <div className={`auth-container ${variant === "inline" ? "auth-container--inline": ""} `}>
        {
          variant === "overlay"  && (
            <div className="auth-btn-wrapper">
              <button className="py-3" onClick={ onClose }>
                <X className="auth-close-icon" strokeWidth={ 2 } size={ 20 }/>
              </button>
            </div>
          )
        }
        <div className={`${variant === "inline" ? "" : "p-4"} `}>
          <h2 className="auth-title">{ title }</h2>
          <button
            className="auth-btn"
            onClick={handleLogin}>
            <span>Login</span>
            <LogIn strokeWidth={ 1 } size={ 20 }/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthenticationRequired;