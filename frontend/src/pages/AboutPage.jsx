import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserCog, Search } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardFooter from "../components/layout/DashboardFooter";

const AboutPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleProceed = () => {
    if (!role) return alert("Please select a role");
    navigate(`/${role}/auth`);
  };

  return (
    <>
      {/* 🔹 Main Navbar */}
      <Navbar
        expand="lg"
        bg="white"
        className="shadow-sm py-2"
        style={{ borderBottom: "4px solid #0d3b66" }}
      >
        <Container className="d-flex align-items-center justify-content-between">
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center p-2 rounded shadow-sm"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <img
              src="/emblem.png"
              alt="Ministry Logo"
              style={{ height: "60px", marginRight: "15px", borderRadius: "8px" }}
            />
            <div className="d-flex flex-column">
              <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#0d3b66" }}>
                Research Expert Pooling System
              </span>
              <span style={{ fontSize: "1rem", color: "#0d3b66" }}>
                Ministry of Science & Technology
              </span>
            </div>
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <img src="/lion.png" alt="Lion Logo" style={{ height: "40px" }} />
              <a href="https://www.gov.lk/" target="_blank" rel="noreferrer" className="fw-bold text-decoration-none" style={{ color: "#0d3b66" }}>
                GOV.lk
              </a>
            </div>

            <div className="position-relative">
              <input
                type="search"
                className="form-control form-control-sm rounded-pill ps-4"
                placeholder="Search"
                style={{ width: "180px" }}
              />
              <Search size={16} className="position-absolute text-secondary" style={{ left: "8px", top: "50%", transform: "translateY(-50%)" }} />
            </div>

            <Navbar.Toggle aria-controls="main-navbar-nav" />
            <Navbar.Collapse id="main-navbar-nav">
              <Nav className="fw-bold text-decoration-none align-items-center">
                <Nav.Link href="#about" style={{ color: "#0d3b66" }}>About</Nav.Link>
                <Nav.Link href="#roles" style={{ color: "#0d3b66" }}>Login</Nav.Link>
                <Nav.Link href="#contact" style={{ color: "#0d3b66" }}>Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>

      {/* 🔹 Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d3b66 0%, #00798c 100%)",
          color: "white",
          textAlign: "center",
          padding: "96px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h1 className="fw-bold display-6">
          Research Management & Supervision System
        </h1>
        <p className="mt-3 mx-auto" style={{ maxWidth: 900, fontSize: 18, opacity: 0.95 }}>
          A centralized platform for managing and streamlining research supervision, submissions, and communication between researchers, supervisors, and administrators.
        </p>
      </div>

      {/* 🔹 About Section */}
      <Container id="about" className="py-5 text-center">
        <h2 className="fw-bold mb-3" style={{ color: "#00798c" }}>About the System</h2>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: 900 }}>
          This system simplifies the research process at universities by integrating researcher proposal submission, supervisor evaluation, and administrative approvals.
        </p>
      </Container>

      {/* 🔹 Role Selection Section */}
      <Container id="roles" className="py-5">
        <Row className="justify-content-center align-items-center g-0">
          {/* Left Stats Panel */}
          <Col lg={6} xl={7} className="d-none d-lg-block">
            <div className="h-100 w-100 p-4 p-xl-5 text-white" style={{ borderRadius: 16, background: "linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)" }}>
              <h2 className="fw-bold">Welcome Back to REPFMS</h2>
              <p className="mb-4">Oversee approvals, users, and platform integrity.</p>

              <Row className="g-3 mb-4">
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">System Health</div><small>Monitor services and uptime</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">User Management</div><small>Admins, supervisors, researchers</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Approvals</div><small>Review and approve activities</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Insights</div><small>Reports and analytics</small></div></Col>
              </Row>

              <Row className="g-3">
                <Col md={4} className="text-center p-3 rounded-3" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">12</div><small>Admins</small></Col>
                <Col md={4} className="text-center p-3 rounded-3" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">540</div><small>Supervisors</small></Col>
                <Col md={4} className="text-center p-3 rounded-3" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">2.1k</div><small>Researchers</small></Col>
              </Row>
            </div>
          </Col>

          {/* Right Role Selector */}
          <Col lg={6} xl={5} className="p-4 p-xl-5">
            <Card className="shadow border-0 p-4 text-center">
              <h3 className="mb-4 fw-bold">Select Your Role</h3>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose role</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="researcher">Researcher</option>
                </Form.Select>
              </Form.Group>
              <Button className="w-100 portal-btn" onClick={handleProceed}>
                Proceed
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 🔹 Contact Section */}
      <div id="contact" className="text-center" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eef7ff 100%)", padding: "56px 20px" }}>
        <h4 className="fw-bold mb-2" style={{ color: "#0d3b66" }}>Contact & Support</h4>
        <p className="text-muted mb-0" style={{ maxWidth: 900, margin: "0 auto" }}>
          For technical support or inquiries, please contact your university IT department or system administrator.
        </p>
      </div>

      <DashboardFooter />

      <style jsx>{`
        .portal-btn {
          border-radius: 10px;
          background: linear-gradient(90deg, #4c6ef5, #22c1c3);
          color: #fff;
          border: none;
        }
        .portal-btn:hover {
          filter: brightness(0.96);
        }
      `}</style>
    </>
  );
};

export default AboutPage;
