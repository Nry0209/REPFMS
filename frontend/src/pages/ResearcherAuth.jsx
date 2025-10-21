import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, BookOpen, FileText } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ResearcherAuth = ({ setAuth }) => {
  const [searchParams] = useSearchParams();
  const modeFromQuery = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(modeFromQuery !== "register");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1=request, 2=reset
  const [fpEmail, setFpEmail] = useState("");
  const [fpToken, setFpToken] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState("");

  // Registration fields
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [domains, setDomains] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [grants, setGrants] = useState("");
  const [collaborations, setCollaborations] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [scopus, setScopus] = useState("");
  const [googleScholar, setGoogleScholar] = useState("");
  // Removed skills/awards from researcher registration as per requirements

  const domainOptions = [
    "Information Technology",
    "Healthcare & Medicine",
    "Agriculture & Food Security",
    "Engineering & Technology",
    "Biotechnology & Life Sciences",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message.text) setMessage({ text: "", type: "" });
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
      const res = await fetch(`${API_BASE_URL}/researchers/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to request reset');
      setFpMsg('Reset token generated. Use the token below to set a new password.');
      if (data.token) setFpToken(data.token);
      setFpStep(2);
    } catch (err) {
      setFpMsg(err.message || 'Failed to request reset');
    } finally {
      setFpLoading(false);
    }
  };

  const handleDoReset = async () => {
    setFpMsg("");
    if (!fpToken || !fpPassword) { setFpMsg('Token and new password are required'); return; }
    try {
      setFpLoading(true);
      const res = await fetch(`${API_BASE_URL}/researchers/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fpToken, password: fpPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setFpMsg('Password reset successful. You can now sign in.');
      setTimeout(() => setShowForgot(false), 900);
    } catch (err) {
      setFpMsg(err.message || 'Failed to reset password');
    } finally {
      setFpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (isLogin) {
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
      } else {
        // Registration submit
        if (!fullName || !formData.email || !formData.password || !department) {
          throw new Error("Please fill in full name, email, password and department");
        }
        if (domains.length === 0 || domains.length > 3) {
          throw new Error("Select 1 to 3 domains");
        }

        const fd = new FormData();
        fd.append("fullName", fullName.trim());
        fd.append("email", formData.email.toLowerCase().trim());
        fd.append("password", formData.password);
        fd.append("department", department.trim());
        if (degree) fd.append("degree", degree.trim());
        fd.append("domains", JSON.stringify(domains));
        if (cvFile) fd.append("cvFile", cvFile);
        transcripts.forEach((file) => fd.append("transcripts", file));
        if (profilePhoto) fd.append("profilePhoto", profilePhoto);
        if (grants) fd.append("grants", grants.trim());
        if (collaborations) fd.append("collaborations", collaborations.trim());
        if (linkedin) fd.append("linkedin", linkedin.trim());
        if (scopus) fd.append("scopus", scopus.trim());
        if (googleScholar) fd.append("googleScholar", googleScholar.trim());
        // Skills/Awards not required at registration time

        const res = await fetch(`${API_BASE_URL}/researchers/register`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Registration failed");
        }

        localStorage.setItem("researcherToken", data.token);
        localStorage.setItem("researcherInfo", JSON.stringify(data.researcher));
        setAuth((prev) => ({ ...prev, researcher: true, name: data.researcher?.fullName }));
        setMessage({ text: "Registration successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/researcher/dashboard"), 1200);
      }
    } catch (err) {
      setMessage({ text: err.message || "Login failed", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="py-4">
        <Row className="g-4 align-items-stretch">
          <Col lg={6} xl={5}>
            <Card className="p-4 shadow-lg border-0 rounded-4">
              <div className="mb-2">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 56, height: 56, background: "linear-gradient(135deg, #00798c, #0d3b66)" }}>
                  <User size={28} color="#fff" />
                </div>
                <h3 className="fw-bold" style={{ color: "#0d3b66" }}>{isLogin ? "Welcome Back" : "Create Researcher Account"}</h3>
                <div className="text-muted">{isLogin ? "Sign in to your account" : "Fill in details to register"}</div>
              </div>

              {message.text && (<Alert variant={message.type} className="text-center fw-semibold">{message.text}</Alert>)}

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div className="mb-3">
                      <h6 className="fw-bold mb-2" style={{ color: "#0d3b66" }}>
                        <BookOpen className="me-2" size={16} /> Basic Information
                      </h6>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Full Name</Form.Label>
                        <Form.Control type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} required disabled={loading} />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Department</Form.Label>
                            <Form.Control type="text" value={department} onChange={(e)=>setDepartment(e.target.value)} required disabled={loading} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Degree</Form.Label>
                            <Form.Control type="text" value={degree} onChange={(e)=>setDegree(e.target.value)} disabled={loading} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Grants</Form.Label>
                            <Form.Control type="text" value={grants} onChange={(e)=>setGrants(e.target.value)} disabled={loading} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Collaborations</Form.Label>
                            <Form.Control type="text" value={collaborations} onChange={(e)=>setCollaborations(e.target.value)} disabled={loading} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>LinkedIn</Form.Label>
                            <Form.Control type="url" value={linkedin} onChange={(e)=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." disabled={loading} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Scopus</Form.Label>
                            <Form.Control type="url" value={scopus} onChange={(e)=>setScopus(e.target.value)} placeholder="https://scopus.com/..." disabled={loading} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold" style={{ color: "#0d3b66" }}>Google Scholar</Form.Label>
                            <Form.Control type="url" value={googleScholar} onChange={(e)=>setGoogleScholar(e.target.value)} placeholder="https://scholar.google.com/..." disabled={loading} />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold mb-2" style={{ color: "#0d3b66" }}>
                        <BookOpen className="me-2" size={16} /> Research Domains (1-3)
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {domainOptions.map((d) => (
                          <Button
                            key={d}
                            type="button"
                            size="sm"
                            variant={domains.includes(d) ? "primary" : "outline-secondary"}
                            onClick={() => setDomains((prev) => prev.includes(d) ? prev.filter(x=>x!==d) : (prev.length<3 ? [...prev, d] : prev))}
                            disabled={loading}
                          >
                            {d}
                          </Button>
                        ))}
                      </div>
                      <small className="text-muted">Selected: {domains.length}/3</small>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold mb-2" style={{ color: "#0d3b66" }}>
                        <FileText className="me-2" size={16} /> Documents (optional)
                      </h6>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Profile Photo (JPG/PNG)</Form.Label>
                        <Form.Control type="file" accept="image/*" disabled={loading} onChange={(e)=>setProfilePhoto(e.target.files[0])} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">CV (PDF/DOC/DOCX)</Form.Label>
                        <Form.Control type="file" accept=".pdf,.doc,.docx" disabled={loading} onChange={(e)=>setCvFile(e.target.files[0])} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Transcripts (multiple)</Form.Label>
                        <Form.Control type="file" multiple accept=".pdf,.doc,.docx" disabled={loading} onChange={(e)=>setTranscripts(Array.from(e.target.files||[]))} />
                      </Form.Group>
                    </div>

                    {/* Skills & Awards not collected at registration */}
                  </>
                )}
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

                <Form.Group className="mb-2">
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

                {isLogin && (
                  <div className="text-end mb-4">
                    <Button
                      variant="link"
                      type="button"
                      onClick={openForgot}
                      className="p-0"
                      style={{ color: "#00798c" }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}


                <div className="d-grid mb-3">
                  <Button type="submit" size="lg" disabled={loading} className="fw-semibold shadow-sm login-btn" style={{ background: "linear-gradient(90deg, #4c6ef5, #22c1c3)", border: "none" }}>
                    {loading ? (<><Spinner as="span" animation="border" size="sm" role="status" className="me-2" />{isLogin ? "Signing In..." : "Creating..."}</>) : (isLogin ? "Sign In" : "Create Account")}
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <Button type="button" variant="link" onClick={() => { setIsLogin(!isLogin); setMessage({ text: "", type: "" }); }} disabled={loading}>
                    {isLogin ? "New researcher? Create account" : "Already have an account? Sign in"}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
          <Col lg={6} xl={7} className="d-none d-lg-block">
            <div className="h-100 w-100 p-4 p-xl-5 text-white" style={{ borderRadius: 16, background: "linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)" }}>
              <h2 className="fw-bold">Welcome Back to REPFMS</h2>
              <p className="mb-4">Collaborate, submit projects, and find the right supervisors.</p>
              <Row className="g-3 mb-4">
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Supervision Network</div><small>Connect with supervisors by domain</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Project Tracking</div><small>View progress and approvals</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Resources</div><small>Manage CV and transcripts</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Community</div><small>Collaborate with peers</small></div></Col>
              </Row>
              <Row className="g-3">
                <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">50k+</div><small>Documents</small></div></Col>
                <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">2.1k</div><small>Active Users</small></div></Col>
                <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">12.5k</div><small>Approvals</small></div></Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

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

      {/* Forgot Password Modal */}
      <Modal show={showForgot} onHide={() => setShowForgot(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#0d3b66" }}>{fpStep === 1 ? 'Forgot Password' : 'Reset Password'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fpMsg && (
            <Alert variant={fpMsg.includes('successful') ? 'success' : 'warning'} className="fw-semibold text-center">{fpMsg}</Alert>
          )}
          {fpStep === 1 ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control type="email" value={fpEmail} onChange={e=>setFpEmail(e.target.value)} disabled={fpLoading} placeholder="you@example.com" />
              </Form.Group>
            </Form>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reset Token</Form.Label>
                <Form.Control type="text" value={fpToken} onChange={e=>setFpToken(e.target.value)} disabled={fpLoading} />
                <small className="text-muted">Provided here in development mode</small>
              </Form.Group>
              <Form.Group>
                <Form.Label className="fw-semibold">New Password</Form.Label>
                <Form.Control type="password" value={fpPassword} onChange={e=>setFpPassword(e.target.value)} disabled={fpLoading} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {fpStep === 1 ? (
            <Button onClick={handleRequestReset} disabled={fpLoading} style={{ background: '#00798c', border: 'none' }}>{fpLoading ? 'Please wait...' : 'Send Reset Link'}</Button>
          ) : (
            <Button onClick={handleDoReset} disabled={fpLoading} style={{ background: '#00798c', border: 'none' }}>{fpLoading ? 'Resetting...' : 'Reset Password'}</Button>
          )}
        </Modal.Footer>
      </Modal>
    </>

  );
};

export default ResearcherAuth;
