import PropTypes from "prop-types";
import Model3D from "./Model3D";
import "./Header.css";

function Header({ className = "", property1 = "Default" }) {
  return (
    <header
      className={`header ${className} ${property1 === "Variant2" ? "variant2-style" : ""}`}
      data-property1={property1}
    >
      <div className="content-wrapper">
        <div className="february-articles">
          <div className="flex items-center space-x-4">
            <h1 className="tablet">Zeitgeist</h1>
            <div className="w-12 h-12"> {/* Контейнер для 3D-модели */}
            </div>
          </div>
          <div className="articles-title1">
            <div className="div1">
              23 ФЕВРАЛЯ , 2025 • 1 статей 5
            </div>
          </div>
        </div>
      </div>
      <img
        alt=""
        className="background-shape-icon"
        loading="lazy"
        src="/vector-4.svg"
      />
    </header>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  property1: PropTypes.string,
};

export default Header;