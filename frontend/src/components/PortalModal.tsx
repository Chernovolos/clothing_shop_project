import { createPortal } from "react-dom";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const PortalModal = ({ open, onClose, children }: Props) => {

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;

  return createPortal(
    <div className="portal-modal" onClick={onClose}>
      <div className="portal-modal-content"
           onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={ onClose }>
          <X className="close-icon" strokeWidth={1} size={20}/>
        </button>
        { children }
      </div>
    </div>,
    document.body
  )
}

export default PortalModal;