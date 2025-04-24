// components/Footer_but.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./Footer_but.css";

// Используем параметры по умолчанию в JavaScript
function Footer_but({ className = "", onToggle, isMenuOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);

  // Синхронизация внешнего состояния сайдбара с кнопкой
  useEffect(() => {
    setIsOpen(isMenuOpen);
  }, [isMenuOpen]);

  const handleClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <div
      className={`footer-but ${className} ${isOpen ? "active" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="footer-but-child"></div>
      <div className="footer-but-item"></div>
      <div className="footer-but-child"></div>
    </div>
  );
}

Footer_but.propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func,
  isMenuOpen: PropTypes.bool
};

// Удаляем устаревший defaultProps
// Footer_but.defaultProps = {
//   isMenuOpen: false
// };

export default Footer_but;