import React from "react";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserCog } from "lucide-react";
import { Link } from "react-router-dom"; 
import DashboardFooter from "../components/layout/DashboardFooter";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <>
        <Navbar expand="lg" bg="white" className="shadow-sm" style={{ borderBottom: "4px solid #0d3b66" }}>
        <Container>
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

      <Navbar.Toggle aria-controls="main-navbar-nav" />
      <Navbar.Collapse id="main-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link href="#about" style={{ color: "#0d3b66" }}>About</Nav.Link>
          <Nav.Link href="#roles" style={{ color: "#0d3b66" }}>Login</Nav.Link>
          <Nav.Link href="#contact" style={{ color: "#0d3b66" }}>Contact</Nav.Link>
        </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔹 Hero Section */}
      <div
        style={{
          background: "linear-gradient(to right, #0a2a43, #004e92)",
          color: "white",
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h1 className="fw-bold">Research Management & Supervision System</h1>
        <p className="lead mt-3 px-3">
          A centralized platform for managing and streamlining research supervision, submissions, and communication
          between researchers, supervisors, and administrators.
        </p>
      </div>

      {/* 🔹 About Section */}
      <Container id="about" className="py-5 text-center">
        <h2 className="fw-bold mb-4">About the System</h2>
        <p className="text-muted fs-5">
          This system is designed to simplify the research process at universities by integrating researcher
          proposal submission, supervisor evaluation, and administrative approvals. Each user role has tailored
          features that enhance efficiency, transparency, and collaboration.
        </p>
      </Container>

      {/* 🔹 Role Cards */}
      <Container id="roles" className="py-5">
        <h2 className="text-center fw-bold mb-5">Select Your Portal</h2>
        <Row className="justify-content-center">
          <Col md={4} className="mb-4">
          <Card className="shadow border-0 text-center p-4">
            <UserCheck size={48} color="#006b3f" className="mx-auto mb-3" />
            <h4>Researcher Portal</h4>
            <p className="text-muted">
              Login to access your dashboard, submit proposals, and track your supervision progress.
            </p>
            <div className="d-flex flex-column gap-2">
              <Button
                variant="outline-success"
                onClick={() => navigate("/researcher/auth?mode=login")}
              >Login
              </Button>
            </div>
          </Card>
        </Col>

          {/* Supervisor Card */}
          <Col md={4} className="mb-4">
            <Card className="shadow border-0 text-center p-4">
              <UserCheck size={48} color="#006b3f" className="mx-auto mb-3" />
              <h4>Supervisor Portal</h4>
              <p className="text-muted">
                Register or log in to manage research students, evaluate proposals, and monitor progress.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button
                variant="success" onClick={() => navigate("/supervisor/auth?mode=register")}
              >Register</Button>
              <Button variant="outline-success" onClick={() => navigate("/supervisor/auth?mode=login")}
              >Login</Button>
              </div>
            </Card>
          </Col>

         {/* Admin Card */}
          <Col md={4} className="mb-4">
            <Card className="shadow border-0 text-center p-4">
              <UserCog size={48} color="#004e92" className="mx-auto mb-3" />
               {/* You can use any Lucide icon you like */}
              <h4>Admin Portal</h4>
              <p className="text-muted">
                Login to manage users, supervisors, and overall system operations.
              </p>
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="outline-success"
                  onClick={() => navigate("/admin/auth?mode=login")}
                >
                  Login
                </Button>
              </div>
            </Card>
          </Col>

        </Row>
      </Container>

      {/* 🔹 Contact Section */}
      <div
        id="contact"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h4 className="fw-bold mb-3">Contact & Support</h4>
        <p className="text-muted">
          For technical support or inquiries, please contact your university IT department or system administrator.
        </p>
      </div>

      <DashboardFooter />
    </>
  );
};

export default AboutPage;
