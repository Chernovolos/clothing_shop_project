import React from "react";
import { Link, NavLink  } from "react-router-dom";
import Logo from "../../public/images/icons/logo_transparent.svg";
import Basket from "../../public/images/icons/basket.svg";
import CurrencySelect from "./CurrencySelect";

const Header: React.FC = () => {
  return (
    <section className="section">
      <div className="container">
        <header className="header">
          <nav className="nav">
            <div className="nav-item">
              <NavLink
                to="/women"
                className={({ isActive }) =>
                  `nav-link nav-link-gender ${isActive ? "isActive" : ""}`
                }
              >
                Women
              </NavLink>
              <NavLink
                to="/men"
                className={({ isActive }) =>
                  `nav-link nav-link-gender ${isActive ? "isActive" : ""}`
                }
              >
                Men
              </NavLink>
              <NavLink
                to="/kids"
                className={({ isActive }) =>
                  `nav-link nav-link-gender ${isActive ? "isActive" : ""}`
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
                <button className="btn btn-basket">
                  <img
                    src={ Basket }
                    alt="Clothing Store Logo"
                    className="bascket-icon"
                  />
                </button>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </section>
  );
};

export default Header;
