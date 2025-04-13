import PropTypes from "prop-types";
import "./Kurs.css";
import Model3D from "../Model3D";
import CurrencyRates from "./CurrencyRates";

function Kurs({ className = "", property1 = "Default" }) {
  return (
    <div
      className={`listen-2 ${className}`}
      data-property1={property1}
    >
      <div className="listen-background" />
      <div className="model-and-rates-container" style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: '30px',
      }}>
        <Model3D />
        <div className="currency-rates-wrapper" style={{
          width: '200px',
          marginTop: '10px',
          zIndex: 1,
        }}>
          <CurrencyRates currencies={['USD', 'EUR', 'CNY']} />
        </div>
      </div>

      <img
        alt=""
        className="listen-icon"
        loading="lazy"
        src="/vector-3.svg"
      />
    </div>
  );
}

Kurs.propTypes = {
  className: PropTypes.string,
  /** Variant props */
  property1: PropTypes.string,
};

export default Kurs;