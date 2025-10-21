// // src/pages/AdminAuth.jsx
// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { Lock, Mail } from "lucide-react";

// const AdminAuth = ({ setAuth }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("adminToken", data.token);
//       localStorage.setItem("adminInfo", JSON.stringify(data));

//       setAuth({
//         supervisor: false,
//         supervisorId: null,
//         admin: true,
//         researcher: false,
//       });

//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center vh-100">
//       <Card style={{ width: "25rem" }} className="p-4 shadow-sm">
//         <h3 className="text-center mb-4">Admin Login</h3>
//         {error && <div className="alert alert-danger">{error}</div>}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="email" className="mb-3">
//             <Form.Label>
//               <Mail size={18} className="me-2" />
//               Email
//             </Form.Label>
//             <Form.Control
//               type="email"
//               value={email}
//               placeholder="Enter admin email"
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group controlId="password" className="mb-4">
//             <Form.Label>
//               <Lock size={18} className="me-2" />
//               Password
//             </Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               placeholder="Enter password"
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Button type="submit" variant="primary" className="w-100">
//             Login
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default AdminAuth;

// src/pages/AdminAuth.jsx
// src/pages/AdminAuth.jsx

import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import Message from "../components/common/Message";

const AdminAuth = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1=request, 2=reset
  const [fpEmail, setFpEmail] = useState("");
  const [fpToken, setFpToken] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data));

      setAuth({
        supervisor: false,
        supervisorId: null,
        admin: true,
        researcher: false,
        name: data.name,
        email: data.email,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      setMessage(err.message || "Login failed");
    }
  };

  // Forgot password handlers
  const openForgot = () => {
    setShowForgot(true);
    setFpStep(1);
    setFpEmail("");
    setFpToken("");
    setFpPassword("");
    setFpMsg("");
  };

  const handleRequestReset = async () => {
    setFpMsg("");
    if (!fpEmail) { setFpMsg("Email is required"); return; }
    try {
      setFpLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request reset");
      setFpMsg("Reset token generated. Use the token below to set a new password.");
      if (data.token) setFpToken(data.token);
      setFpStep(2);
    } catch (err) {
      setFpMsg(err.message || "Failed to request reset");
    } finally {
      setFpLoading(false);
    }
  };

  const handleDoReset = async () => {
    setFpMsg("");
    if (!fpToken || !fpPassword) { setFpMsg("Token and new password are required"); return; }
    try {
      setFpLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: fpToken, password: fpPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      setFpMsg("Password reset successful. You can now sign in.");
      setTimeout(() => setShowForgot(false), 900);
    } catch (err) {
      setFpMsg(err.message || "Failed to reset password");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <>
    <Container className="py-4">
      <Row className="g-4 align-items-stretch">
        <Col lg={6} xl={5}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <div className="mb-3">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 56, height: 56, background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
                  <Lock size={28} color="#fff" />
                </div>
                <h3 className="fw-bold mt-3 mb-1" style={{ color: "#0d3b66" }}>Admin Login</h3>
                <div className="text-muted">Access system management and approvals</div>
              </div>
              {message && <Message variant="danger">{message}</Message>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-semibold"><Mail size={18} className="me-2" />Official Email Address *</Form.Label>
                  <Form.Control type="email" name="email" placeholder="admin@most.gov.lk" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                  <Form.Label className="fw-semibold"><Lock size={18} className="me-2" />Password *</Form.Label>
                  <Form.Control type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <div className="text-end mb-4">
                  <Button variant="link" type="button" onClick={openForgot} className="p-0" style={{ color: "#00798c" }}>Forgot password?</Button>
                </div>
                <div className="d-grid">
                  <Button type="submit" size="lg" className="fw-bold" style={{ background: "linear-gradient(135deg, #0d3b66, #00798c)", border: "none", borderRadius: "0.8rem", padding: "0.8rem" }}>
                    Sign In
                  </Button>
                </div>
                <div className="text-center mt-3">
                  <small className="text-muted">Sign in as a different role:</small>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <Button variant="link" onClick={() => navigate('/researcher/auth?mode=login')} className="p-0">Researcher</Button>
                    <Button variant="link" onClick={() => navigate('/supervisor/auth?mode=login')} className="p-0">Supervisor</Button>
                  </div>
                </div>
              </Form>
              <p className="text-center mt-3 text-muted">For access issues, contact the system administrator.</p>
            </Card.Body>
          </Card>
        </Col>
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
              <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">12</div><small>Admins</small></div></Col>
              <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">540</div><small>Supervisors</small></div></Col>
              <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">2.1k</div><small>Researchers</small></div></Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>

    {/* Forgot Password Modal */}
    <Modal show={showForgot} onHide={() => setShowForgot(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#0d3b66" }}>{fpStep === 1 ? "Forgot Password" : "Reset Password"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fpMsg && <Message variant={fpMsg.includes("successful") ? "success" : "warning"}>{fpMsg}</Message>}
        {fpStep === 1 ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Admin Email</Form.Label>
              <Form.Control type="email" placeholder="admin@most.gov.lk" value={fpEmail} onChange={(e)=>setFpEmail(e.target.value)} disabled={fpLoading} />
            </Form.Group>
          </Form>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Reset Token</Form.Label>
              <Form.Control type="text" value={fpToken} onChange={(e)=>setFpToken(e.target.value)} disabled={fpLoading} />
              <small className="text-muted">Provided here in development mode</small>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">New Password</Form.Label>
              <Form.Control type="password" value={fpPassword} onChange={(e)=>setFpPassword(e.target.value)} disabled={fpLoading} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {fpStep === 1 ? (
          <Button onClick={handleRequestReset} disabled={fpLoading} style={{ background: "#00798c", border: "none" }}>{fpLoading ? "Please wait..." : "Send Reset Link"}</Button>
        ) : (
          <Button onClick={handleDoReset} disabled={fpLoading} style={{ background: "#00798c", border: "none" }}>{fpLoading ? "Resetting..." : "Reset Password"}</Button>
        )}
      </Modal.Footer>
    </Modal>
    </>
  );
};
export default AdminAuth;
