import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../public/images/icons/logo_transparent.svg";
import Basket from "../../public/images/icons/basket.svg";
import CurrencySelect from "./CurrencySelect";
import MiniCart from "@/components/MiniCart.tsx";
import { useAppSelector } from "@/app/hooks.ts";
import { selectOrder, selectTotalQuantity } from "@/slices/cartSlice.ts";

const Header = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const order = useAppSelector(selectOrder);
  const totalQuantity = useAppSelector(selectTotalQuantity);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isCartOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setCartOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isCartOpen]);

  useEffect(() => {
    if(isMobileMenuOpen || isCartOpen) {
      document.body.style.overflowY = "hidden";
    }
     else {
       document.body.style.overflowY = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen, isCartOpen]);

  const closeCart = () => setCartOpen(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <section className="section">
      <div className="container header-root">
        <header className="header relative">
          <nav className="nav relative">
            <div className="nav-item">
              <NavLink
                to="/women"
                className={ ({isActive}) =>
                  `nav-link nav-link-gender ${ isActive ? "isActive" : "" }`
                }
              >
                Women
              </NavLink>
              <NavLink
                to="/men"
                className={ ({isActive}) =>
                  `nav-link nav-link-gender ${ isActive ? "isActive" : "" }`
                }
              >
                Men
              </NavLink>
              <NavLink
                to="/kids"
                className={ ({isActive}) =>
                  `nav-link nav-link-gender ${ isActive ? "isActive" : "" }`
                }
              >
                Kids
              </NavLink>
            </div>
            <div className="nav-item">
              <Link className="nav-link" to="/">
                <img
                  src={ Logo }
                  alt="Clothing Store Logo"
                  className="logo-icon"
                />
              </Link>
            </div>
            <div className="nav-item">
              <div className="actions-wrapper">
                <CurrencySelect/>
                <div ref={ dropdownRef } className="cart-root">
                  <button
                    aria-label="Open basket"
                    className="btn-basket relative"
                    onClick={ () => setCartOpen(prev => !prev) }
                  >
                    <img
                      src={ Basket }
                      alt="Clothing Store Logo"
                      className="bascket-icon"
                    />
                    { order ?  <span className="badge">{totalQuantity}</span> : ""}
                  </button>
                  <MiniCart isOpen={ isCartOpen } onClose={ closeCart }/>
                </div>
                <button
                  aria-label="Menu"
                  onClick={ () => setMobileMenuOpen(!isMobileMenuOpen) }
                  className={`btn-burger  ${isMobileMenuOpen ? "open" : ""}`}
                >burger</button>

              </div>
            </div>
          </nav>

          <div ref={mobileMenuRef} className="mobile-menu-root">
            <div
              onClick={() => closeMobileMenu()}
              className={`overlay--mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
            </div>
            <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
              <div className="mobile-menu-container">
                <NavLink
                  to="/women"
                  className={ ({isActive}) =>
                    `nav-link nav-link-gender ${ isActive ? "isActive" : "" }`
                  }
                >
                  Women
                </NavLink>
                <NavLink
                  to="/men"
                  className={ ({isActive}) =>
                    `nav-link nav-link-gender ${ isActive ? "isActive" : "" }`
                  }
                >
                  Men
                </NavLink>
                <NavLink
                  to="/kids"
                  className={ ({isActive}) =>
                    `nav-link nav-link-gender ${ isActive ? "isActive" : "" }`
                  }
                >
                  Kids
                </NavLink>
              </div>

            </div>
          </div>

        </header>
      </div>
    </section>
  );
};

export default Header;
