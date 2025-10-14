// // src/pages/AdminAuth.jsx
// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
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
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import SimpleHeader from "../components/layout/SimpleHeader";
import SimpleFooter from "../components/layout/SimpleFooter";
import Message from "../components/common/Message";

const AdminAuth = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
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
        body: JSON.stringify(formData),
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
      });

      navigate("/admin/dashboard");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <SimpleHeader />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {/* Portal Header */}
            <Card className="shadow border-0 rounded-4">
              <Card.Header
                className="text-white py-4"
                style={{
                  background: "linear-gradient(90deg, #005C97 0%, #363795 100%)",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",
                }}
              >
                <h4 className="mb-0 fw-bold">🛡️ Admin Portal Access</h4>
                <p className="mb-0">Access your system management portal</p>
              </Card.Header>

              {/* Login Form */}
              <Card.Body className="p-4">
                <h5
                  className="fw-bold mb-3"
                  style={{ color: "#004a88", display: "flex", alignItems: "center" }}
                >
                  🔐 Admin Login Credentials
                </h5>

                {message && <Message variant="danger">{message}</Message>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-semibold">
                      <Mail size={18} className="me-2" />
                      Official Email Address *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="admin@institution.edu.lk"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="fw-semibold">
                      <Lock size={18} className="me-2" />
                      Password *
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter secure password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      size="lg"
                      className="fw-bold"
                      style={{
                        background: "linear-gradient(90deg, #005C97 0%, #363795 100%)",
                        border: "none",
                        borderRadius: "0.8rem",
                        padding: "0.8rem",
                      }}
                    >
                      Access Admin Portal
                    </Button>
                  </div>
                </Form>

                <p className="text-center mt-3 text-muted">
                  For access issues, contact the system administrator.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <SimpleFooter />
    </>
  );
};

export default AdminAuth;
