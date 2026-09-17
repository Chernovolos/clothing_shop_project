import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import AuthModalContent from "@/components/AuthModalContent.tsx";
import PortalModal from "@/components/PortalModal.tsx";

export type AuthMode = 'login' | 'register' | 'logout' | null;

type AuthModalContextType = {
  openLogin: () => void;
  openRegister: () => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({children}: { children: ReactNode }) => {
  const [mode, setMode] = useState<AuthMode | null>(null);

  const value = useMemo<AuthModalContextType>(() => ({
    openLogin: () => setMode('login'),
    openRegister: () => setMode('register'),
    closeAuthModal: () => setMode(null),
  }), []);
  return (
    <AuthModalContext.Provider
      value={ value }
    >
      { children }

      <PortalModal
        open={ mode !== null }
        onClose={ () => setMode(null) }
      >
        { mode && (
          <AuthModalContent
            mode={ mode }
            switchMode={ setMode }
          />
        ) }
      </PortalModal>
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }

  return context;
};