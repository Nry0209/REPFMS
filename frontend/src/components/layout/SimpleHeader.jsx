import React from "react";
import { Link } from "react-router-dom";
import "./SimpleLayout.css"; // put the custom CSS here

const SimpleHeader = () => {
  return (
    <header>
      {/* Top Bar */}
      <nav className="navbar navbar-dark bg-dark-brown py-2">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Left side */}
          <div className="d-flex align-items-center">
            <img
              src="/lion.png"
              alt="Logo"
              style={{ height: "40px" }}
              className="me-2"
            />
            <a
              href="https://www.gov.lk/"
              target="_blank"
              rel="noreferrer"
              className="fw-bold text-white text-decoration-none ms-2"
            >
              GOV.lk
            </a>
          </div>
          {/* Right side */}
          <div>
            <Link
              to="/supervisor/auth?mode=login"
              className="text-white me-3 text-decoration-none fw-semibold"
            >
              Login
            </Link>
            <Link
              to="/supervisor/auth?mode=register"
              className="text-white text-decoration-none fw-semibold"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Brand Section */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand mx-auto d-flex align-items-center" to="/">
            <img
              src="/emblem.png"
              alt="Logo"
              style={{ height: "60px", marginRight: "15px", borderRadius: "8px" }}
            />
            <div className="d-flex flex-column">
              <span className="system-name">Research Expert Pooling System</span>
              <span className="ministry-name">Ministry of Science & Technology</span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default SimpleHeader;
