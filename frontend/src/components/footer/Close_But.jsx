import PropTypes from "prop-types";
import "./Close_But.css";

function Close_But({ className = "", onToggle }) {
  const handleClick = () => {
    if (onToggle) {
      onToggle(false); // Всегда закрываем меню при клике на крестик
    }
  };

  return (
    <div
      className={`close-but ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="close-but-child"></div>
      <div className="close-but-item"></div>
      <div className="close-but-child"></div>
    </div>
  );
}

Close_But.propTypes = {
  className: PropTypes.string,
  onToggle: PropTypes.func
};

export default Close_But;