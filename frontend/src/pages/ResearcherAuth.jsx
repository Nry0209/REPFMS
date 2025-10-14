// // // src/pages/ResearcherAuth.jsx
// // import React, { useState } from "react";
// // import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";
// // import { Mail, Lock } from "lucide-react";
// // import SimpleHeader from "../components/layout/SimpleHeader";
// // import SimpleFooter from "../components/layout/SimpleFooter";
// // import Message from "../components/common/Message";

// // const ResearcherAuth = ({ setAuth }) => {
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });
// //   const [message, setMessage] = useState("");
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage("");

// //     try {
// //       const res = await fetch("http://localhost:5000/api/researchers/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           email: formData.email,
// //           password: formData.password,
// //         }),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.message || "Login failed");

// //       localStorage.setItem("token", data.token);
// //       setAuth(true);
// //       navigate("/researcher/dashboard");
// //     } catch (err) {
// //       setMessage(err.message);
// //     }
// //   };

// //   return (
// //     <>
// //       <SimpleHeader />
// //       <Container className="my-5">
// //         <Row className="justify-content-center">
// //           <Col md={8} lg={6}>
// //             <Card className="p-4 shadow-lg border-0 rounded-4">
// //               <h3 className="text-center mb-4">Researcher Login</h3>

// //               {message && <Message variant="danger">{message}</Message>}

// //               <Form onSubmit={handleSubmit}>
// //                 <Form.Group className="mb-3" controlId="email">
// //                   <Form.Label>
// //                     <Mail size={18} className="me-2" />
// //                     Email
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-3" controlId="password">
// //                   <Form.Label>
// //                     <Lock size={18} className="me-2" />
// //                     Password
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="password"
// //                     name="password"
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </Form.Group>

// //                 <div className="d-grid">
// //                   <Button type="submit" variant="primary">
// //                     Login
// //                   </Button>
// //                 </div>
// //               </Form>

// //               <p className="text-center mt-3">
// //                 Don’t have an account? Contact admin for registration.
// //               </p>
// //             </Card>
// //           </Col>
// //         </Row>
// //       </Container>
// //       <SimpleFooter />
// //     </>
// //   );
// // };

// // export default ResearcherAuth;


// // src/pages/ResearcherAuth.jsx
// // import React, { useState } from "react";
// // import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";
// // import { Mail, Lock, User } from "lucide-react";
// // import SimpleHeader from "../components/layout/SimpleHeader";
// // import SimpleFooter from "../components/layout/SimpleFooter";

// // const ResearcherAuth = ({ setAuth }) => {
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });
// //   const [message, setMessage] = useState({ text: "", type: "" });
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //     // Clear message when user starts typing
// //     if (message.text) setMessage({ text: "", type: "" });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage({ text: "", type: "" });
// //     setLoading(true);

// //     try {
// //       const res = await fetch("http://localhost:5000/api/researchers/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           email: formData.email,
// //           password: formData.password,
// //         }),
// //       });

// //       const data = await res.json();
      
// //       if (!res.ok) {
// //         throw new Error(data.message || "Login failed");
// //       }

// //       if (data.success && data.data.token) {
// //         // Store token and user data
// //         localStorage.setItem("token", data.data.token);
// //         localStorage.setItem("userType", "researcher");
// //         localStorage.setItem("userId", data.data._id);
// //         localStorage.setItem("userName", data.data.name);
        
// //         setAuth(true);
// //         setMessage({ text: "Login successful! Redirecting...", type: "success" });
        
// //         // Redirect after a short delay
// //         setTimeout(() => {
// //           navigate("/researcher/dashboard");
// //         }, 1000);
// //       } else {
// //         throw new Error("Invalid response from server");
// //       }
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       setMessage({ 
// //         text: err.message || "Login failed. Please try again.", 
// //         type: "danger" 
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <SimpleHeader />
// //       <Container className="my-5" style={{ minHeight: "70vh" }}>
// //         <Row className="justify-content-center">
// //           <Col md={8} lg={6}>
// //             <Card className="p-4 shadow-lg border-0 rounded-4">
// //               <div className="text-center mb-4">
// //                 <User size={48} className="text-primary mb-3" />
// //                 <h3 className="mb-2">Researcher Login</h3>
// //                 <p className="text-muted">
// //                   Access your research projects and supervision status
// //                 </p>
// //               </div>

// //               {message.text && (
// //                 <Alert 
// //                   variant={message.type} 
// //                   dismissible 
// //                   onClose={() => setMessage({ text: "", type: "" })}
// //                 >
// //                   {message.text}
// //                 </Alert>
// //               )}

// //               <Form onSubmit={handleSubmit}>
// //                 <Form.Group className="mb-3" controlId="email">
// //                   <Form.Label>
// //                     <Mail size={18} className="me-2" />
// //                     Email Address
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     placeholder="Enter your email"
// //                     required
// //                     disabled={loading}
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-4" controlId="password">
// //                   <Form.Label>
// //                     <Lock size={18} className="me-2" />
// //                     Password
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="password"
// //                     name="password"
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     placeholder="Enter your password"
// //                     required
// //                     disabled={loading}
// //                   />
// //                 </Form.Group>

// //                 <div className="d-grid mb-3">
// //                   <Button 
// //                     type="submit" 
// //                     variant="primary" 
// //                     size="lg"
// //                     disabled={loading}
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <Spinner
// //                           as="span"
// //                           animation="border"
// //                           size="sm"
// //                           role="status"
// //                           aria-hidden="true"
// //                           className="me-2"
// //                         />
// //                         Logging in...
// //                       </>
// //                     ) : (
// //                       "Login"
// //                     )}
// //                   </Button>
// //                 </div>
// //               </Form>

// //               <hr />

// //               <div className="text-center">
// //                 <p className="text-muted mb-2">
// //                   Don't have an account?
// //                 </p>
// //                 <p className="small text-muted">
// //                   Contact the Science and Technology Ministry for registration.
// //                 </p>
// //               </div>
// //             </Card>

// //             {/* Test Credentials Card */}
// //             <Card className="mt-3 p-3 bg-light">
// //               <p className="mb-2 fw-bold small">Test Credentials:</p>
// //               <ul className="small mb-0">
// //                 <li>Email: alice.johnson@example.com</li>
// //                 <li>Email: bob.smith@example.com</li>
// //                 <li>Email: clara.zhang@example.com</li>
// //                 <li>Password: password123</li>
// //               </ul>
// //             </Card>
// //           </Col>
// //         </Row>
// //       </Container>
// //       <SimpleFooter />
// //     </>
// //   );
// // };

// // export default ResearcherAuth;

// // import React, { useState } from "react";
// // import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";
// // import { Mail, Lock, User } from "lucide-react";
// // import SimpleHeader from "../components/layout/SimpleHeader";
// // import SimpleFooter from "../components/layout/SimpleFooter";

// // const ResearcherAuth = ({ setAuth }) => {
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });
// //   const [message, setMessage] = useState({ text: "", type: "" });
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //     if (message.text) setMessage({ text: "", type: "" }); // clear message on typing
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage({ text: "", type: "" });
// //     setLoading(true);

// //     try {
// //       const res = await fetch("http://localhost:5000/api/researchers/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(formData),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.message || "Login failed");

// //       // Expected backend response structure:
// //       // { success: true, message: "...", researcher: {...}, token: "..." }

// //       if (data.success && data.token && data.researcher) {
// //         localStorage.setItem("researcherToken", data.token);
// //         localStorage.setItem("researcherInfo", JSON.stringify(data.researcher));

// //         // Update App.jsx global auth state
// //         setAuth({
// //           supervisor: false,
// //           supervisorId: null,
// //           name: data.researcher.name,
// //           email: data.researcher.email,
// //           admin: false,
// //           researcher: true,
// //         });

// //         setMessage({ text: "Login successful! Redirecting...", type: "success" });

// //         // Navigate immediately
// //         navigate("/researcher/dashboard");
// //       } else {
// //         throw new Error("Invalid server response");
// //       }
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       setMessage({
// //         text: err.message || "Login failed. Please try again.",
// //         type: "danger",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <SimpleHeader />
// //       <Container className="my-5" style={{ minHeight: "70vh" }}>
// //         <Row className="justify-content-center">
// //           <Col md={8} lg={6}>
// //             <Card className="p-4 shadow-lg border-0 rounded-4">
// //               <div className="text-center mb-4">
// //                 <User size={48} className="text-primary mb-3" />
// //                 <h3 className="mb-2">Researcher Login</h3>
// //                 <p className="text-muted">
// //                   Access your research projects and supervision details
// //                 </p>
// //               </div>

// //               {message.text && (
// //                 <Alert
// //                   variant={message.type}
// //                   dismissible
// //                   onClose={() => setMessage({ text: "", type: "" })}
// //                 >
// //                   {message.text}
// //                 </Alert>
// //               )}

// //               <Form onSubmit={handleSubmit}>
// //                 <Form.Group className="mb-3" controlId="email">
// //                   <Form.Label>
// //                     <Mail size={18} className="me-2" />
// //                     Email Address
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     placeholder="Enter your email"
// //                     required
// //                     disabled={loading}
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-4" controlId="password">
// //                   <Form.Label>
// //                     <Lock size={18} className="me-2" />
// //                     Password
// //                   </Form.Label>
// //                   <Form.Control
// //                     type="password"
// //                     name="password"
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     placeholder="Enter your password"
// //                     required
// //                     disabled={loading}
// //                   />
// //                 </Form.Group>

// //                 <div className="d-grid mb-3">
// //                   <Button
// //                     type="submit"
// //                     variant="primary"
// //                     size="lg"
// //                     disabled={loading}
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <Spinner
// //                           as="span"
// //                           animation="border"
// //                           size="sm"
// //                           role="status"
// //                           aria-hidden="true"
// //                           className="me-2"
// //                         />
// //                         Logging in...
// //                       </>
// //                     ) : (
// //                       "Login"
// //                     )}
// //                   </Button>
// //                 </div>
// //               </Form>

// //               <hr />
// //               <div className="text-center">
// //                 <p className="text-muted mb-2">Don’t have an account?</p>
// //                 <p className="small text-muted">
// //                   Contact the Ministry of Science and Technology for registration.
// //                 </p>
// //               </div>
// //             </Card>

// //             {/* Test Accounts */}
// //             <Card className="mt-3 p-3 bg-light">
// //               <p className="fw-bold small mb-1">Test Accounts:</p>
// //               <ul className="small mb-0">
// //                 <li>alice.johnson@example.com</li>
// //                 <li>bob.smith@example.com</li>
// //                 <li>clara.zhang@example.com</li>
// //                 <li>Password: password123</li>
// //               </ul>
// //             </Card>
// //           </Col>
// //         </Row>
// //       </Container>
// //       <SimpleFooter />
// //     </>
// //   );
// // };

// // export default ResearcherAuth;

// // src/pages/ResearcherAuth.jsx
// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, User } from "lucide-react";
// import SimpleHeader from "../components/layout/SimpleHeader";
// import SimpleFooter from "../components/layout/SimpleFooter";

// const ResearcherAuth = ({ setAuth }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Clear message when user starts typing
//     if (message.text) setMessage({ text: "", type: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ text: "", type: "" });
//     setLoading(true);

//     try {
//       console.log("Attempting login with:", formData.email);
      
//       const res = await fetch("http://localhost:5000/api/researchers/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       console.log("Response status:", res.status);
//       const data = await res.json();
//       console.log("Response data:", data);
      
//       if (!res.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // Handle both response formats (with and without success wrapper)
//       const token = data.data?.token || data.token;
//       const userId = data.data?._id || data._id;
//       const userName = data.data?.name || data.name;

//       if (!token) {
//         console.error("No token in response:", data);
//         throw new Error("Invalid server response - no token received");
//       }

//       console.log("Login successful, storing token");
      
//       // Store token and user data
//       localStorage.setItem("token", token);
//       localStorage.setItem("userType", "researcher");
//       localStorage.setItem("userId", userId);
//       localStorage.setItem("userName", userName);
      
//       setAuth(true);
//       setMessage({ text: "Login successful! Redirecting...", type: "success" });
      
//       // Redirect after a short delay
//       setTimeout(() => {
//         navigate("/researcher/dashboard");
//       }, 1000);
      
//     } catch (err) {
//       console.error("Login error:", err);
//       setMessage({ 
//         text: err.message || "Login failed. Please check your credentials and try again.", 
//         type: "danger" 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <SimpleHeader />
//       <Container className="my-5" style={{ minHeight: "70vh" }}>
//         <Row className="justify-content-center">
//           <Col md={8} lg={6}>
//             <Card className="p-4 shadow-lg border-0 rounded-4">
//               <div className="text-center mb-4">
//                 <User size={48} className="text-primary mb-3" />
//                 <h3 className="mb-2">Researcher Login</h3>
//                 <p className="text-muted">
//                   Access your research projects and supervision status
//                 </p>
//               </div>

//               {message.text && (
//                 <Alert 
//                   variant={message.type} 
//                   dismissible 
//                   onClose={() => setMessage({ text: "", type: "" })}
//                 >
//                   {message.text}
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3" controlId="email">
//                   <Form.Label>
//                     <Mail size={18} className="me-2" />
//                     Email Address
//                   </Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                     required
//                     disabled={loading}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-4" controlId="password">
//                   <Form.Label>
//                     <Lock size={18} className="me-2" />
//                     Password
//                   </Form.Label>
//                   <Form.Control
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Enter your password"
//                     required
//                     disabled={loading}
//                   />
//                 </Form.Group>

//                 <div className="d-grid mb-3">
//                   <Button 
//                     type="submit" 
//                     variant="primary" 
//                     size="lg"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Spinner
//                           as="span"
//                           animation="border"
//                           size="sm"
//                           role="status"
//                           aria-hidden="true"
//                           className="me-2"
//                         />
//                         Logging in...
//                       </>
//                     ) : (
//                       "Login"
//                     )}
//                   </Button>
//                 </div>
//               </Form>

//               <hr />

//               <div className="text-center">
//                 <p className="text-muted mb-2">
//                   Don't have an account?
//                 </p>
//                 <p className="small text-muted">
//                   Contact the Science and Technology Ministry for registration.
//                 </p>
//               </div>
//             </Card>

//             {/* Test Credentials Card */}
//             <Card className="mt-3 p-3 bg-light">
//               <p className="mb-2 fw-bold small">Test Credentials:</p>
//               <ul className="small mb-0">
//                 <li>Email: alice.johnson@example.com</li>
//                 <li>Email: bob.smith@example.com</li>
//                 <li>Email: clara.zhang@example.com</li>
//                 <li>Password: password123</li>
//               </ul>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <SimpleFooter />
//     </>
//   );
// };

// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, User } from "lucide-react";
// import SimpleHeader from "../components/layout/SimpleHeader";
// import SimpleFooter from "../components/layout/SimpleFooter";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const ResearcherAuth = ({ setAuth }) => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (message.text) setMessage({ text: "", type: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       const res = await fetch(`${API_BASE_URL}/researchers/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok || data.success === false) {
//         throw new Error(data.message || "Login failed");
//       }

//       // Save token & user info
//       const token = data.data?.token || data.token;
//       const userInfo = data.data || data;
//       localStorage.setItem("researcherToken", token);
//       localStorage.setItem("researcherInfo", JSON.stringify(userInfo));

//       // Update auth context
//       setAuth((prev) => ({ ...prev, researcher: true, name: userInfo?.name || userInfo?.fullName }));

//       setMessage({ text: "Login successful! Redirecting...", type: "success" });

//       setTimeout(() => navigate("/researcher/dashboard"), 1000);
//     } catch (err) {
//       setMessage({ text: err.message || "Login failed", type: "danger" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <SimpleHeader title="Researcher Portal Login" />
//       <Container className="my-5" style={{ minHeight: "70vh" }}>
//         <Row className="justify-content-center">
//           <Col md={8} lg={6}>
//             <Card className="p-4 shadow-lg border-0 rounded-4">
//               <div className="text-center mb-4">
//                 <User size={48} className="text-primary mb-3" />
//                 <h3 className="mb-2">Researcher Login</h3>
//                 <p className="text-muted">Access your research projects and supervision dashboard</p>
//               </div>

//               {message.text && <Alert variant={message.type}>{message.text}</Alert>}

//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     <Mail size={18} className="me-2" />
//                     Email Address
//                   </Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-4">
//                   <Form.Label>
//                     <Lock size={18} className="me-2" />
//                     Password
//                   </Form.Label>
//                   <Form.Control
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     disabled={loading}
//                   />
//                 </Form.Group>

//                 <div className="d-grid mb-3">
//                   <Button type="submit" variant="primary" size="lg" disabled={loading}>
//                     {loading ? (
//                       <>
//                         <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
//                         Logging in...
//                       </>
//                     ) : (
//                       "Login"
//                     )}
//                   </Button>
//                 </div>
//               </Form>

//               <hr />
//               <div className="text-center text-muted small">
//                 Contact the Ministry of Science & Technology for registration
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <SimpleFooter />
//     </>
//   );
// };

// export default ResearcherAuth;

import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import SimpleHeader from "../components/layout/SimpleHeader";
import SimpleFooter from "../components/layout/SimpleFooter";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ResearcherAuth = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/researchers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.data?.token || data.token;
      const userInfo = data.data || data;
      localStorage.setItem("researcherToken", token);
      localStorage.setItem("researcherInfo", JSON.stringify(userInfo));

      setAuth((prev) => ({ ...prev, researcher: true, name: userInfo?.name || userInfo?.fullName }));

      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => navigate("/researcher/dashboard"), 1000);
    } catch (err) {
      setMessage({ text: err.message || "Login failed", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader title="Researcher Portal Login" />

      {/* Portal Banner Section */}
      <div
        style={{
          background: "linear-gradient(90deg, #00798c 0%, #0d3b66 100%)",
          color: "#fff",
          padding: "3rem 0 2.5rem",
          textAlign: "center",
        }}
      >
        <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
          Researcher Portal
        </h1>
        <p className="text-light mb-0" style={{ fontSize: "1.05rem" }}>
          Empowering innovation through collaboration and digital access
        </p>
      </div>

      {/* Login Form Section */}
      <Container
        className="my-5 d-flex align-items-center justify-content-center"
        style={{
          minHeight: "70vh",
          background: "linear-gradient(135deg, #eaf6f6 0%, #ffffff 100%)",
          borderRadius: "12px",
        }}
      >
        <Row className="justify-content-center w-100">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card
              className="p-4 shadow-lg border-0 rounded-4"
              style={{
                background: "linear-gradient(145deg, #ffffff 0%, #f7fbfc 100%)",
                borderTop: "5px solid #0d3b66",
              }}
            >
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #00798c, #0d3b66)",
                  }}
                >
                  <User size={36} color="#fff" />
                </div>
                <h3 className="fw-bold" style={{ color: "#0d3b66" }}>
                  Researcher Login
                </h3>
                <p className="text-muted small mb-0">
                  Access your research dashboard and supervision records
                </p>
              </div>

              {message.text && (
                <Alert variant={message.type} className="text-center fw-semibold">
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>
                    <Mail size={18} className="me-2 mb-1" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="rounded-3 py-2 px-3"
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>
                    <Lock size={18} className="me-2 mb-1" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="rounded-3 py-2 px-3"
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="fw-semibold shadow-sm login-btn"
                    style={{
                      background: "linear-gradient(90deg, #00798c, #0d3b66)",
                      border: "none",
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>

              <hr />
              <div className="text-center text-muted small">
                Need an account? Contact the Ministry of Science & Technology
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <SimpleFooter />

      {/* Polished Interactions */}
      <style jsx>{`
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(13, 59, 102, 0.25);
          transition: all 0.3s ease-in-out;
        }
        .form-control:focus {
          border-color: #00798c !important;
          box-shadow: 0 0 6px rgba(0, 121, 140, 0.4) !important;
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(13, 59, 102, 0.15);
        }
      `}</style>
    </>
  );
};

export default ResearcherAuth;


