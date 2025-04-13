import PropTypes from "prop-types";
import "./Subscribe.css";
import React, { useState, useEffect } from "react";

function Subscribe({ className = "" }) {
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    localStorage.setItem("email", newEmail);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email format.Please enter your email address again.");
    } else {
      setError("");
      alert("Subscribed successfully!");
    }
  };

  return (
    <div className={`social-media ${className}`}>
      <div className={`subscribe ${className}`}>
        <div className="subscribe-rectangle">
          <p className="subscribe-to-mysite">
            {error || "Subscribe to Zeitgeist:"}
          </p>

          <form className="input-container" onSubmit={handleSubmit} noValidate>
            <input
              className={`subscribe-rectangle1 ${error ? "error" : ""}`}
              placeholder="Your email address here"
              value={email}
              type="text"
              onChange={handleInputChange}
            />
            <button className="subscribe-arrow-icon" type="submit"></button>
          </form>
        </div>
      </div>
    </div>
  );
}

Subscribe.propTypes = {
  className: PropTypes.string,
};

export default Subscribe;
