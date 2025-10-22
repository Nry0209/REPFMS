import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Users, Building, Mail, Lock, Phone, MapPin, Award, BookOpen, FileText, Briefcase } from "lucide-react";
import Message from "../components/common/Message";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SupervisorAuth = ({ setAuth }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modeFromQuery = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(modeFromQuery !== "register");
  const [loading, setLoading] = useState(false);

  // Supervisor info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [experience, setExperience] = useState("");
  const [domains, setDomains] = useState([]);
  const [linkedin, setLinkedin] = useState("");
  const [googleScholar, setGoogleScholar] = useState("");
  
  const domainOptions = [
    "Information Technology",
    "Healthcare & Medicine",
    "Agriculture & Food Security",
    "Engineering & Technology",
    "Biotechnology & Life Sciences"
  ];
  
  const studyOptions = [
    "Bachelor's Degree", 
    "Master's Degree", 
    "Postgraduate Diploma", 
    "Doctoral Degree"
  ];
  
  const [studies, setStudies] = useState([]);
  const [transcriptFiles, setTranscriptFiles] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1=request, 2=reset
  const [fpEmail, setFpEmail] = useState("");
  const [fpToken, setFpToken] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState("");

  useEffect(() => {
    setIsLogin(modeFromQuery !== "register");
    // Clear form when switching modes
    resetForm();
  }, [modeFromQuery]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setAddress("");
    setTitle("");
    setAffiliation("");
    setExperience("");
    setDomains([]);
    setStudies([]);
    setTranscriptFiles({});
    setCvFile(null);
    setError("");
    setSuccess("");
    setLinkedin("");
    setGoogleScholar("");
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
      const res = await fetch(`${API_BASE_URL}/supervisors/request-reset`, {
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
      const res = await fetch(`${API_BASE_URL}/supervisors/reset`, {
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

  const toggleDomain = (domain) => {
    if (domains.includes(domain)) {
      setDomains(domains.filter(d => d !== domain));
    } else if (domains.length < 3) {
      setDomains([...domains, domain]);
    }
  };

  const toggleStudy = (study) => {
    if (studies.includes(study)) {
      setStudies(studies.filter(s => s !== study));
      // Remove transcript file for this study
      setTranscriptFiles(prev => {
        const updated = { ...prev };
        delete updated[study];
        return updated;
      });
    } else {
      setStudies([...studies, study]);
    }
  };

  const handleTranscriptChange = (study, file) => {
    setTranscriptFiles(prev => ({
      ...prev,
      [study]: file
    }));
  };

  const validateForm = () => {
    if (!isLogin) {
      // Registration validation
      if (!name || !email || !password || !title || !affiliation || !experience) {
        setError("Please complete all required fields to proceed with registration");
        return false;
      }

      // Validate experience
      const expNum = parseInt(experience);
      if (isNaN(expNum) || expNum < 0) {
        setError("Experience must be a valid number (0 or greater)");
        return false;
      }
      
      if (expNum > 70) {
        setError("Experience cannot exceed 70 years");
        return false;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
      
      if (domains.length === 0) {
        setError("Please select at least one research domain");
        return false;
      }
      
      if (studies.length === 0) {
        setError("Please select at least one academic qualification");
        return false;
      }
      
      // Transcripts are optional in development; if provided, they'll be validated below
      
      if (!cvFile) {
        setError("Please upload your CV document");
        return false;
      }

      // Validate file types
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(cvFile.type)) {
        setError("CV must be a PDF, DOC, or DOCX file");
        return false;
      }

      for (const [study, file] of Object.entries(transcriptFiles)) {
        if (!file) continue;
        if (!allowedTypes.includes(file.type)) {
          setError(`${study} transcript must be a PDF, DOC, or DOCX file`);
          return false;
        }
      }

      // Validate file sizes (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (cvFile.size > maxSize) {
        setError("CV file size must be less than 10MB");
        return false;
      }

      for (const [study, file] of Object.entries(transcriptFiles)) {
        if (!file) continue;
        if (file.size > maxSize) {
          setError(`${study} transcript file size must be less than 10MB`);
          return false;
        }
      }
    } else {
      // Login validation
      if (!email || !password) {
        setError("Please provide your official email and password");
        return false;
      }
    }
    
    return true;
  };

  const handleRegister = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisors/register`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0] || 'Registration failed');
      }

      // Store auth info in localStorage
      localStorage.setItem('supervisorToken', data.token);
      localStorage.setItem('supervisorInfo', JSON.stringify(data.supervisor));
      
      setAuth({
        supervisor: true,
        supervisorId: data.supervisor._id, // Make sure to use _id instead of id
        name: data.supervisor.name,
        email: data.supervisor.email,
        domains: data.supervisor.domains,
        affiliation: data.supervisor.affiliation,
        title: data.supervisor.title,
        experience: data.supervisor.experience,
        studies: data.supervisor.studies,
      });

      setSuccess("Registration successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/supervisor/dashboard");
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisors/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and info
      localStorage.setItem('supervisorToken', data.token);
      localStorage.setItem('supervisorInfo', JSON.stringify(data.supervisor));

      console.log('Login successful, token stored');

      setAuth({
        supervisor: true,
        supervisorId: data.supervisor._id,
        name: data.supervisor.name,
        email: data.supervisor.email
      });

      navigate("/supervisor/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (!isLogin) {
        // Registration - prepare FormData
        const formData = new FormData();
        
        // Add basic fields
        formData.append('name', name.trim());
        formData.append('email', email.toLowerCase().trim());
        formData.append('password', password);
        formData.append('phone', phone.trim());
        formData.append('address', address.trim());
        formData.append('title', title.trim());
        formData.append('affiliation', affiliation.trim());
        formData.append('experience', experience);
        formData.append('domains', JSON.stringify(domains));
        formData.append('studies', JSON.stringify(studies));
        if (linkedin) formData.append('linkedin', linkedin.trim());
        if (googleScholar) formData.append('googleScholar', googleScholar.trim());
        
        // Add CV file
        formData.append('cvFile', cvFile);
        
        // Add transcript files in the correct order
        studies.forEach(study => {
          if (transcriptFiles[study]) {
            formData.append('transcripts', transcriptFiles[study]);
          }
        });

        await handleRegister(formData);
      } else {
        // Login
        await handleLogin();
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f5f7fb" }}>
      <Container className="py-4">
        <Row className="g-4 align-items-stretch">
          <Col lg={6} xl={5}>
            {error && (
              <div className="mb-3">
                <Message variant="danger">
                  <div className="d-flex align-items-center"><FileText className="me-2" size={16} />{error}</div>
                </Message>
              </div>
            )}
            {success && (
              <div className="mb-3">
                <Message variant="success">
                  <div className="d-flex align-items-center"><FileText className="me-2" size={16} />{success}</div>
                </Message>
              </div>
            )}
            <Card className="shadow border-0" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 56, height: 56, background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
                    <Users size={28} color="#fff" />
                  </div>
                  <h3 className="fw-bold mt-3 mb-1" style={{ color: "#0d3b66" }}>{isLogin ? "Welcome Back" : "Create Supervisor Account"}</h3>
                  <div className="text-muted">{isLogin ? "Sign in to your account" : "Fill in details to register"}</div>
                </div>
                <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                      <>
                        {/* Personal Information Section */}
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3 pb-2" style={{ color: "#0d3b66", borderBottom: "2px solid #e2e8f0" }}>
                            Personal Information
                          </h6>

                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                  <Users className="me-2" size={16} />
                                  Full Name *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={name}
                                  onChange={e => setName(e.target.value)}
                                  required
                                  className="form-control-lg"
                                  style={{ borderColor: "#cbd5e1" }}
                                  placeholder="Dr. John Smith"
                                  disabled={loading}
                                  maxLength={100}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                  <Phone className="me-2" size={16} />
                                  Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={phone}
                                  onChange={e => setPhone(e.target.value)}
                                  className="form-control-lg"
                                  style={{ borderColor: "#cbd5e1" }}
                                  placeholder="+94 71 234 5678"
                                  disabled={loading}
                                  maxLength={20}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                  <MapPin className="me-2" size={16} />
                                  Address
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={address}
                                  onChange={e => setAddress(e.target.value)}
                                  className="form-control-lg"
                                  style={{ borderColor: "#cbd5e1" }}
                                  placeholder="Colombo, Sri Lanka"
                                  disabled={loading}
                                  maxLength={200}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        {/* Professional Information Section */}
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3 pb-2" style={{ color: "#0d3b66", borderBottom: "2px solid #e2e8f0" }}>
                            Professional Information
                          </h6>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                  <Award className="me-2" size={16} />
                                  Professional Title *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={title}
                                  onChange={e => setTitle(e.target.value)}
                                  required
                                  className="form-control-lg"
                                  style={{ borderColor: "#cbd5e1" }}
                                  placeholder="Professor, Associate Professor, Dr."
                                  disabled={loading}
                                  maxLength={50}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                  <Building className="me-2" size={16} />
                                  Institution/Affiliation *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={affiliation}
                                  onChange={e => setAffiliation(e.target.value)}
                                  required
                                  className="form-control-lg"
                                  style={{ borderColor: "#cbd5e1" }}
                                  placeholder="University of Colombo, NIFS, etc."
                                  disabled={loading}
                                  maxLength={100}
                                />
                              </Form.Group>
                            </Col>

                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                  <Briefcase className="me-2" size={16} />
                                  Years of Experience *
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={experience}
                                  onChange={e => setExperience(e.target.value)}
                                  required
                                  className="form-control-lg"
                                  style={{ borderColor: "#cbd5e1" }}
                                  placeholder="e.g., 5"
                                  disabled={loading}
                                  min="0"
                                  max="70"
                                />
                                <small className="text-muted mt-1 d-block">
                                  Enter your years of experience in research and supervision (0-70 years)
                                </small>
                              </Form.Group>
                            </Col>
                          </Row>

                          {/* Research Domains */}
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold d-flex align-items-center mb-3" style={{ color: "#0d3b66" }}>
                              <BookOpen className="me-2" size={16} />
                              Research Domains * (Select up to 3)
                            </Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                              {domainOptions.map(d => (
                                <Button
                                  key={d}
                                  variant={domains.includes(d) ? "custom-selected" : "outline-secondary"}
                                  size="sm"
                                  type="button"
                                  onClick={() => toggleDomain(d)}
                                  className="px-3 py-2 fw-semibold"
                                  style={domains.includes(d)
                                    ? { backgroundColor: "#00798c", borderColor: "#00798c", color: "#fff" }
                                    : { borderColor: "#cbd5e1", color: "#64748b" }
                                  }
                                  disabled={loading || (!domains.includes(d) && domains.length >= 3)}
                                >
                                  {d}
                                </Button>
                              ))}
                            </div>
                            <small className="text-muted mt-1 d-block">
                              Selected: {domains.length}/3 domains
                            </small>
                          </Form.Group>

                          {/* Studies */}
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold d-flex align-items-center mb-3" style={{ color: "#0d3b66" }}>
                              <BookOpen className="me-2" size={16} />
                              Academic Qualifications * (Select all that apply)
                            </Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                              {studyOptions.map(study => (
                                <Button
                                  key={study}
                                  variant={studies.includes(study) ? "custom-selected" : "outline-secondary"}
                                  size="sm"
                                  type="button"
                                  onClick={() => toggleStudy(study)}
                                  className="px-3 py-2 fw-semibold"
                                  style={studies.includes(study)
                                    ? { backgroundColor: "#00798c", borderColor: "#00798c", color: "#fff" }
                                    : { borderColor: "#cbd5e1", color: "#64748b" }
                                  }
                                  disabled={loading}
                                >
                                  {study}
                                </Button>
                              ))}
                            </div>
                            <small className="text-muted mt-1 d-block">
                              Selected: {studies.length}
                            </small>
                          </Form.Group>

                          {/* Transcript Uploads */}
                          {studies.length > 0 && (
                            <div className="mb-4">
                              <h6 className="fw-bold mb-3 pb-2" style={{ color: "#0d3b66", borderBottom: "2px solid #e2e8f0" }}>
                                Upload Transcripts for Selected Studies *
                              </h6>
                              {studies.map(study => (
                                <Form.Group key={study} className="mb-3">
                                  <Form.Label className="fw-semibold">
                                    <FileText className="me-2" size={14} />
                                    {study} Transcript *
                                  </Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    required
                                    disabled={loading}
                                    onChange={e => handleTranscriptChange(study, e.target.files[0])}
                                    className="form-control-lg"
                                    style={{ borderColor: "#cbd5e1" }}
                                  />
                                  {transcriptFiles[study] && (
                                    <small className="text-success mt-1 d-block">
                                      ✓ File selected: {transcriptFiles[study].name} ({(transcriptFiles[study].size / 1024 / 1024).toFixed(2)} MB)
                                    </small>
                                  )}
                                </Form.Group>
                              ))}
                            </div>
                          )}

                          {/* CV Upload */}
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3 pb-2" style={{ color: "#0d3b66", borderBottom: "2px solid #e2e8f0" }}>
                              Upload CV *
                            </h6>
                            <Form.Group>
                              <Form.Label className="fw-semibold">
                                <FileText className="me-2" size={14} />
                                Curriculum Vitae (CV) *
                              </Form.Label>
                              <Form.Control
                                type="file"
                                accept=".pdf,.doc,.docx"
                                required
                                disabled={loading}
                                onChange={e => setCvFile(e.target.files[0])}
                                className="form-control-lg"
                                style={{ borderColor: "#cbd5e1" }}
                              />
                              {cvFile && (
                                <small className="text-success mt-1 d-block">
                                  ✓ File selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                                </small>
                              )}
                            </Form.Group>
                          </div>

                          {/* LinkedIn and Google Scholar */}
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3 pb-2" style={{ color: "#0d3b66", borderBottom: "2px solid #e2e8f0" }}>
                              Professional Profiles
                            </h6>

                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                    <i className="bi bi-linkedin me-2" size={16} />
                                    LinkedIn Profile
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={linkedin}
                                    onChange={e => setLinkedin(e.target.value)}
                                    className="form-control-lg"
                                    style={{ borderColor: "#cbd5e1" }}
                                    placeholder="https://www.linkedin.com/in/your-profile"
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>

                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                                    <i className="bi bi-google me-2" size={16} />
                                    Google Scholar Profile
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={googleScholar}
                                    onChange={e => setGoogleScholar(e.target.value)}
                                    className="form-control-lg"
                                    style={{ borderColor: "#cbd5e1" }}
                                    placeholder="https://scholar.google.com/citations?user=your-profile"
                                    disabled={loading}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>

                        </div>
                      </>
                    )}

                    {/* Login Credentials Section */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 pb-2" style={{ color: "#0d3b66", borderBottom: "2px solid #e2e8f0" }}>
                        {isLogin ? "Login Credentials" : "Account Credentials"}
                      </h6>

                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                              <Mail className="me-2" size={16} />
                              Official Email Address *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                              disabled={loading}
                              className="form-control-lg"
                              style={{ borderColor: "#cbd5e1" }}
                              placeholder="supervisor@institution.edu.lk"
                            />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold d-flex align-items-center" style={{ color: "#0d3b66" }}>
                              <Lock className="me-2" size={16} />
                              Password *
                            </Form.Label>
                            <Form.Control
                              type="password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                              disabled={loading}
                              className="form-control-lg"
                              style={{ borderColor: "#cbd5e1" }}
                              placeholder="Enter secure password (min. 6 characters)"
                              minLength={6}
                            />
                            {isLogin && (
                              <div className="text-end mt-2">
                                <Button variant="link" type="button" onClick={openForgot} className="p-0" style={{ color: "#00798c" }}>Forgot password?</Button>
                              </div>
                            )}
                            {!isLogin && (
                              <small className="text-muted mt-1 d-block">
                                Password must be at least 6 characters long
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="d-grid gap-2">
                      <Button type="submit" size="lg" disabled={loading} className="py-3 fw-bold" style={{ background: loading ? "#6c757d" : "linear-gradient(90deg, #4c6ef5, #22c1c3)", border: "none" }}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {isLogin ? "Signing In..." : "Creating..."}
                          </>
                        ) : (
                          isLogin ? "Sign In" : "Create Account"
                        )}
                      </Button>
                    </div>
                    <div className="text-center mt-3">
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => { const next = isLogin ? 'register' : 'login'; navigate(`/supervisor/auth?mode=${next}`); }}
                        disabled={loading}
                      >
                        {isLogin ? "New supervisor? Create account" : "Already registered? Sign in"}
                      </Button>
                    </div>

                    {/* Additional Info for Registration */}
                    {!isLogin && (
                      <div className="mt-4">
                        <Card className="border-0" style={{ backgroundColor: "rgba(0, 121, 140, 0.05)" }}>
                          <Card.Body className="py-3">
                            <div className="d-flex align-items-start">
                              <FileText className="me-2 mt-1" size={16} style={{ color: "#00798c" }} />
                              <div>
                                <h6 className="fw-bold mb-2" style={{ color: "#0d3b66" }}>Important Notes:</h6>
                                <ul className="mb-0" style={{ color: "#64748b", fontSize: "0.9rem" }}>
                                  <li>All uploaded documents should be in PDF, DOC, or DOCX format</li>
                                  <li>Maximum file size: 10MB per document</li>
                                  <li>Your account will be verified by our admin team within 24-48 hours</li>
                                  <li>You will receive an email notification once your account is approved</li>
                                  <li>Ensure all information is accurate as it will be used for verification</li>
                                </ul>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
          </Col>
          <Col lg={6} xl={7} className="d-none d-lg-block">
            <div className="h-100 w-100 p-4 p-xl-5 text-white" style={{ borderRadius: 16, background: "linear-gradient(135deg, #5B86E5 0%, #36D1DC 100%)" }}>
              <h2 className="fw-bold">Welcome Back to REPFMS</h2>
              <p className="mb-4">Manage supervisions, review requests, and collaborate with researchers.</p>
              <Row className="g-3 mb-4">
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Track Requests</div><small>Manage incoming supervision requests</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Domain Matching</div><small>Smart matches to your expertise</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Project Insights</div><small>Overview of active projects</small></div></Col>
                <Col md={6}><div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.12)" }}><div className="fw-semibold">Community</div><small>Connect with peers</small></div></Col>
              </Row>
              <Row className="g-3">
                <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">1.2k</div><small>Researchers</small></div></Col>
                <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">320</div><small>Active Projects</small></div></Col>
                <Col md={4}><div className="p-3 rounded-3 text-center" style={{ background: "rgba(255,255,255,0.18)" }}><div className="h4 mb-0">98%</div><small>Approval Rate</small></div></Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <style>{`
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .form-control-lg {
          font-size: 1rem;
          padding: 0.75rem 1rem;
        }
        
        .btn-outline-secondary:hover:not(:disabled) {
          background-color: #00798c !important;
          border-color: #00798c !important;
          color: white !important;
        }
        
        .custom-selected {
          background-color: #00798c !important;
          border-color: #00798c !important;
          color: #fff !important;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
        
        .form-control:disabled {
          background-color: #f8f9fa;
          opacity: 0.7;
        }
        
        .btn:disabled {
          cursor: not-allowed;
        }

        .text-success {
          color: #28a745 !important;
        }

        .text-muted {
          color: #6c757d !important;
        }
      `}</style>

      {/* Forgot Password Modal */}
      <Modal show={showForgot} onHide={() => setShowForgot(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#0d3b66" }}>{fpStep === 1 ? 'Forgot Password' : 'Reset Password'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fpMsg && (
            <div className={`alert ${fpMsg.includes('successful') ? 'alert-success' : 'alert-warning'}`}>{fpMsg}</div>
          )}
          {fpStep === 1 ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Official Email</Form.Label>
                <Form.Control type="email" value={fpEmail} onChange={e=>setFpEmail(e.target.value)} disabled={fpLoading} placeholder="supervisor@institution.edu.lk" />
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
    </div>
    
  );
};

export default SupervisorAuth;