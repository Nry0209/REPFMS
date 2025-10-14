import React from "react";
import "./SimpleLayout.css";

const SimpleFooter = () => {
  const year = new Date().getFullYear();
  const lastUpdate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="text-white mt-5">
      <div className="bg-dark-brown p-4">
        <div className="container d-flex justify-content-between align-items-center flex-column flex-md-row text-center text-md-start">
          {/* Left side */}
          <p className="mb-2 mb-md-0 small">
            Copyright © {year} Ministry of Science & Technology.
            All Rights Reserved. <br />
            Design & Developed by <span className="fw-bold">SLIIT - ISE</span>
          </p>
          {/* Right side */}
          <p className="mb-0 small">Last Update: {lastUpdate}</p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
