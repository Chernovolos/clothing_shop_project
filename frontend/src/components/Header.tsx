import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../public/images/icons/logo_transparent.svg";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { Hamburger, LogIn, ShoppingCart, UserRound, X } from "lucide-react";
import { selectIsAuthenticated } from "@/slices/user.slice.ts";
import { useAuthModal } from "@/contexts/AuthModalContext";
import CurrencySelect from "./CurrencySelect";
import MiniCart from "@/components/MiniCart.tsx";
import Profile from "@/components/Profile.tsx";
import { clearOrderError, selectOrder } from "@/slices/order.slice.ts";

const Header = () => {
  const dispatch = useAppDispatch();

  const [isCartOpen, setCartOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { openLogin } = useAuthModal();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const order = useAppSelector(selectOrder)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isCartOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setCartOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }

      if (isProfileOpen && profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isCartOpen, isProfileOpen]);

  useEffect(() => {
    document.body.style.overflowY =
      isMobileMenuOpen || isCartOpen || isProfileOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isMobileMenuOpen, isCartOpen, isProfileOpen]);


  const closeCart = () => {
    dispatch(clearOrderError());
    setCartOpen(false)
  };
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closeProfile = () => setProfileOpen(false);

  const toggleCart = () => {
    if (isCartOpen) {
      dispatch(clearOrderError());
    }

    setCartOpen(prev => !prev);
  };

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
                    onClick={ toggleCart }
                  >
                    <ShoppingCart color="#1D1F22" strokeWidth={ 1 } size={ 20 }/>
                    { order ? <span className="badge">{ order.quantity }</span> : "" }
                  </button>
                  <MiniCart
                    isOpen={ isCartOpen }
                    onClose={ closeCart }
                  />
                </div>

                <button
                  aria-label="Menu"
                  onClick={ () => setMobileMenuOpen(!isMobileMenuOpen) }
                  className={ `btn-burger  ${ isMobileMenuOpen ? "open" : "" }` }>
                  <Hamburger color="#1D1F22" strokeWidth={ 1 } size={ 20 }/>
                </button>

                { isAuthenticated ?
                  (
                    <div ref={ profileRef } className="profile-root">
                      <button
                        aria-label="Profile"
                        onClick={() => setProfileOpen(prev => !prev)}
                        className="btn-basket relative"
                      >
                          <UserRound color="#1D1F22" strokeWidth={ 1 } size={ 20 }/>
                      </button>
                      <Profile
                        isOpen={ isProfileOpen }
                        onClose={ closeProfile }
                      />
                    </div>
                  ) :
                  (<button onClick={ openLogin }>
                    <LogIn color="#1D1F22" strokeWidth={ 1 } size={ 20 }/>
                  </button>)
                }
              </div>
            </div>
          </nav>

          <div ref={ mobileMenuRef } className="mobile-menu-root">
            <div
              onClick={ () => closeMobileMenu() }
              className={ `overlay--mobile-menu ${ isMobileMenuOpen ? "open" : "" }` }>
            </div>
            <div className={ `mobile-menu ${ isMobileMenuOpen ? "open" : "" }` }>
              <div className="container">
                <div className="wrapper">
                  <button onClick={ () => closeMobileMenu() }>
                    <X className="close-icon" strokeWidth={ 2 } size={ 20 }/>
                  </button>
                </div>

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
          </div>
        </header>
      </div>
    </section>
  );
};

export default Header;
