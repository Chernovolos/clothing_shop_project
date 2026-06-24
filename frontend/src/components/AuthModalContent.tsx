import LoginForm from "@/components/LoginForm.tsx";
import RegisterForm from "@/components/RegisterForm.tsx";
import type { AuthMode } from "@/contexts/AuthModalContext.tsx";

interface Props {
  mode: AuthMode;
  switchMode: (mode: AuthMode) => void;
}

const AuthModalContent = ({mode, switchMode}: Props) => {
  return (
    <div className="modal-form">
      { mode === "login" ?
        (<LoginForm onSwitchToRegister={ () => switchMode('register') } onClose={ () => switchMode(null) }/>) :
        (<RegisterForm onSwitchToLogin={ () => switchMode('login') } onClose={ () => switchMode(null) }/>)
      }
    </div>
  )
}

export default AuthModalContent;