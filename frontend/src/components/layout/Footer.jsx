import React from "react";

export default function Footer() {
  return (
    <footer className="mt-4 border-top">
      <div className="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center" style={{ fontSize: 14 }}>
        <div className="text-muted">© {new Date().getFullYear()} Research Expert Pooling System</div>
        <div className="mt-2 mt-sm-0">
          <a href="/about" className="text-decoration-none me-3">About</a>
          <a href="/news" className="text-decoration-none me-3">News</a>
          <a href="#" className="text-decoration-none">Contact</a>
        </div>
      </div>
    </footer>
  );
}
