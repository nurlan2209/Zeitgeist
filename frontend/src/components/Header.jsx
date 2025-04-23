import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="main-header">
      <div className="container">
        <div className="header-top">
          <div className="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="header-date">{currentDate} • 1 статей 5</div>
        </div>

        <div className="logo-container">
          <Link to="/">
            <h1 className="site-logo">Tablet</h1>
          </Link>
        </div>

        <div className="header-bottom">
          <div className="header-date-bottom">{currentDate} • 1 статей 5</div>
        </div>

        <div className="header-divider"></div>
      </div>
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;