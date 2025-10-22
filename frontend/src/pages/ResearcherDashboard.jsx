import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Modal, ListGroup, Form, Toast, ToastContainer, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {FileText,Users,CheckCircle,Clock,TrendingUp,User,BookOpen} from "lucide-react";
import { HouseDoor, FileEarmarkText, PersonCircle, FileEarmark, LayoutSidebar, BoxArrowRight } from 'react-bootstrap-icons';
import { getComments, getAssignedPapers, getResearcherUploads, uploadResearcherPaper, getLocalPendingRequests } from "../api/researcher";

const ResearcherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [coactorModal, setCoactorModal] = useState({ show: false, coactor: null });
  const [activeComments, setActiveComments] = useState([]);
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [uploadState, setUploadState] = useState({ details: "", file: null, uploading: false, error: "", success: "" });
  const [fundingStatuses, setFundingStatuses] = useState({});
  const [supervisions, setSupervisions] = useState([]);
  const [supervisionByTitle, setSupervisionByTitle] = useState({});
  const [fundingMap, setFundingMap] = useState({});
  const [fundForm, setFundForm] = useState({});
  const [discoverList, setDiscoverList] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [fundingModal, setFundingModal] = useState({ show: false, research: null });
  const [activeList, setActiveList] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [activeError, setActiveError] = useState("");
  const [supModal, setSupModal] = useState({ show: false, research: null });
  const [loadingSup, setLoadingSup] = useState(false);
  const [supList, setSupList] = useState([]);
  const [stats, setStats] = useState({
    totalResearches: 0,
    currentSupervision: 0,
    finishedResearches: 0,
    pendingResearches: 0,
  });
  const navigate = useNavigate();
  const activeRef = useRef(null);
  const ongoingRef = useRef(null);
  const [activeUploads, setActiveUploads] = useState({});
  const [createModal, setCreateModal] = useState({ show: false });
  const [newResearch, setNewResearch] = useState({
    title: "",
    description: "",
    domainMain: "",
    domainOther: "",
    file: null,
    saving: false,
    error: "",
  });
  const [domainsOptions, setDomainsOptions] = useState([
    "Information Technology",
    "Healthcare & Medicine",
    "Agriculture & Food Security",
    "Engineering & Technology",
    "Biotechnology & Life Sciences"
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  // --- Helpers: API fetches and actions ---
  const fetchMySupervisions = async () => {
    try {
      const token = localStorage.getItem("researcherToken");
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/supervisions/my-supervisions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data?.supervisions) {
        setSupervisions(data.supervisions);
        const map = {};
        for (const s of data.supervisions) map[s.projectTitle] = s;
        setSupervisionByTitle(map);
      }
    } catch (e) {}
  };

  const fetchDiscoverProjects = async () => {
    try {
      setLoadingDiscover(true);
      const token = localStorage.getItem("researcherToken");
      if (!token) {
        setDiscoverList([]);
        return;
      }
      const res = await fetch("http://localhost:5000/api/researchers/pending-projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to load discover projects");
      setDiscoverList(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setDiscoverList([]);
    } finally {
      setLoadingDiscover(false);
    }
  };

  // ---- Create Research (Modal handlers) ----
  const openCreateResearch = () => {
    setNewResearch({ title: "", description: "", domainMain: "", domainOther: "", file: null, saving: false, error: "" });
    setCreateModal({ show: true });
  };

  const createResearch = async (e) => {
    e?.preventDefault?.();
    try {
      const token = localStorage.getItem("researcherToken");
      if (!token) throw new Error("Not authenticated");
      const domains = [];
      if (newResearch.domainMain && newResearch.domainMain !== "Other") domains.push(newResearch.domainMain);
      if (newResearch.domainMain === "Other" && newResearch.domainOther.trim()) domains.push(newResearch.domainOther.trim());
      if (domains.length === 0) throw new Error("Please select a domain or specify Other");
      if (domains.length > 3) throw new Error("You can select up to 3 domains");
      const form = new FormData();
      form.append("title", newResearch.title);
      form.append("description", newResearch.description);
      domains.forEach((d) => form.append("domains", d));
      if (newResearch.file) form.append("paperFile", newResearch.file);
      setNewResearch((s) => ({ ...s, saving: true, error: "" }));
      const res = await fetch("http://localhost:5000/api/researchers/research", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to create research");
      setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Research created" }]);
      setCreateModal({ show: false });
      await fetchProfile();
      await fetchDiscoverProjects();
    } catch (err) {
      setNewResearch((s) => ({ ...s, error: err.message || "Failed" }));
    } finally {
      setNewResearch((s) => ({ ...s, saving: false }));
    }
  };

  const openSupervisors = async (research) => {
    try {
      setSupModal({ show: true, research });
      setLoadingSup(true);
      const token = localStorage.getItem("researcherToken");
      const res = await fetch(`http://localhost:5000/api/researchers/research/${research._id}/supervisors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSupList((data?.success && Array.isArray(data.data)) ? data.data : []);
    } catch (e) {
      setSupList([]);
    } finally {
      setLoadingSup(false);
    }
  };

  const requestSupervision = async (research, supervisorId) => {
    try {
      const token = localStorage.getItem("researcherToken");
      const res = await fetch(`http://localhost:5000/api/researchers/research/${research._id}/request-supervision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supervisorId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to request supervision");
      setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Supervision request sent" }]);
      fetchPendingRequests();
      fetchMySupervisions();
      setSupModal({ show: false, research: null });
    } catch (e) {
      setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: e.message || "Request failed" }]);
    }
  };

  const fetchFundingRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/funding");
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        const meId = profile?.researcher?._id;
        const map = {};
        data.data
          .filter((r) => !meId || String(r.researcher?._id || r.researcher) === String(meId))
          .forEach((r) => {
            map[r.projectTitle] = r;
          });
        setFundingMap(map);
        const statuses = {};
        (profile?.researcher?.researches || []).forEach((r) => {
          const fr = map[r.title];
          if (fr) statuses[r._id] = { status: fr.status };
        });
        setFundingStatuses(statuses);
      }
    } catch (e) {}
  };

  const handleFundingSubmit = async (research) => {
    const form = fundForm[research._id] || {};
    if (!form.amount || !form.justification) {
      setToasts((t) => [...t, { id: Date.now(), bg: "warning", text: "Enter amount and justification" }]);
      return;
    }
    try {
      const body = {
        projectTitle: research.title,
        researcher: profile?.researcher?._id,
        supervisor: supervisionByTitle[research.title]?.supervisor?._id,
        department: profile?.researcher?.department || "",
        requestedAmount: parseFloat(form.amount),
        justification: form.justification,
        documents: [],
      };
      const res = await fetch("http://localhost:5000/api/funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to submit funding request");
      await fetchFundingRequests();
      setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Funding request submitted" }]);
      setFundingModal({ show: true, research });
    } catch (e) {
      setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: e.message || "Submission failed" }]);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPendingRequests();
    const id = setInterval(fetchPendingRequests, 10000);
    const onUpdated = () => fetchPendingRequests();
    window.addEventListener('pending-requests-updated', onUpdated);
    fetchActiveResearch();
    fetchMySupervisions();
    fetchFundingRequests();
    fetchDiscoverProjects();
    return () => {
      clearInterval(id);
      window.removeEventListener('pending-requests-updated', onUpdated);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("researcherToken");
      if (!token) {
        navigate("/researcher/auth");
        return;
      }

      const res = await fetch("http://localhost:5000/api/researchers/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      if (data.success) {
        setProfile(data.data);
        calculateStats(data.data.researcher);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(err.message);
      if (err.message.includes("authorized")) {
        localStorage.removeItem("researcherToken");
        navigate("/researcher/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem("researcherToken");
      let apiList = [];
      if (token) {
        const res = await fetch("http://localhost:5000/api/researchers/my/pending-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) apiList = data.data || [];
      }
      const localList = await getLocalPendingRequests();
      const merged = [...localList, ...apiList];
      // Deduplicate by _id if present, else by projectTitle+supervisorId
      const seen = new Map();
      for (const r of merged) {
        const key = r?._id || `${r.projectTitle || ''}|${r.supervisor?._id || r.supervisor}`;
        if (!seen.has(key)) seen.set(key, r);
      }
      setPendingRequests(Array.from(seen.values()));
    } catch (e) {
      console.error("Fetch pending requests error:", e);
    }
  };

  const calculateStats = (researcher) => {
    const researches = researcher.researches || [];
    setStats({
      totalResearches: researches.length,
      currentSupervision: researches.filter(r => r.status === "Current").length,
      finishedResearches: researches.filter(r => r.status === "Finished").length,
      pendingResearches: researches.filter(r => r.status === "Pending").length,
    });
  };

  const fetchActiveResearch = async () => {
    try {
      setLoadingActive(true);
      setActiveError("");
      const token = localStorage.getItem("researcherToken");
      if (!token) {
        setActiveList([]);
        return;
      }
      const res = await fetch("http://localhost:5000/api/researchers/my/active-research", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to load active research");
      setActiveList(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setActiveError(e.message || "Failed to load active research");
    } finally {
      setLoadingActive(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Current: "primary",
      Finished: "success",
      Pending: "warning",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const yourProjects = (profile?.researcher?.researches && profile.researcher.researches.length)
    ? profile.researcher.researches
    : (profile?.researches || []);
  const activeProject = yourProjects.find(r => r.status === "Current") || null;
  const assignedSupervisorName = (activeProject?.supervisor?.fullName) || (profile?.currentSupervision?.supervisor?.fullName) || "";
  const coActors = (activeProject?.coResearchers && activeProject.coResearchers.length ? activeProject.coResearchers : (profile?.currentSupervision?.coResearchers || []));
  const completedProjects = yourProjects.filter(r => r.status === "Finished");
  const pendingProjects = yourProjects.filter(r => r.status === "Pending");

  const openCoactorSupervisor = (coactor) => {
    setCoactorModal({ show: true, coactor });
  };

  useEffect(() => {
    const loadActiveArtifacts = async () => {
      try {
        const id = activeProject?._id;
        if (!id) return;
        const [c, a, u] = await Promise.all([
          getComments(id),
          getAssignedPapers(id),
          getResearcherUploads(id),
        ]);
        setActiveComments(c);
        setAssignedPapers(a);
        setMyUploads(u);
      } catch (e) {
        // best-effort
      }
    };
    loadActiveArtifacts();
  }, [activeProject?._id]);

  useEffect(() => {
    fetchFundingRequests();
  }, [completedProjects.length, profile?.researcher?._id]);

  const handlePaperUpload = async (e) => {
    e.preventDefault();
    if (!activeProject?._id || !uploadState.file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const f = uploadState.file;
    if (!allowed.includes(f.type)) {
      setUploadState((s) => ({ ...s, error: "Only PDF, DOC, DOCX files are allowed." }));
      setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Invalid file type for paper upload." }]);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setUploadState((s) => ({ ...s, error: "File too large. Max 10MB." }));
      setToasts((t) => [...t, { id: Date.now(), bg: "warning", text: "Paper upload exceeds 10MB." }]);
      return;
    }
    try {
      setUploadState((s) => ({ ...s, uploading: true, error: "", success: "" }));
      await uploadResearcherPaper(activeProject._id, uploadState.file, uploadState.details);
      const updated = await getResearcherUploads(activeProject._id);
      setMyUploads(updated);
      setUploadState({ details: "", file: null, uploading: false, error: "", success: "Uploaded successfully" });
      setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Paper uploaded successfully." }]);
    } catch (err) {
      setUploadState((s) => ({ ...s, uploading: false, error: err.message || "Upload failed" }));
      setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Paper upload failed." }]);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" style={{ color: '#00798c' }} />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchProfile} style={{ backgroundColor: '#00798c', borderColor: '#00798c' }}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <style>{`
        .custom-card-header {
          background: linear-gradient(135deg, #0d3b66, #00798c);
          color: white;
          border-radius: 12px 12px 0 0;
        }
        .custom-card {
          border: none;
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .custom-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 121, 140, 0.15);
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 121, 140, 0.05);
        }
      `}</style>

      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white position-relative"
        style={{
          width: sidebarOpen ? '280px' : '80px',
          minHeight: '100vh',
          backgroundColor: '#00798c',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div className="text-center px-3 pt-4 pb-3 position-relative" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <Button variant="link" className="position-absolute top-0 end-0 mt-3 me-3 p-0" onClick={toggleSidebar} style={{ color: 'white' }}>
            <LayoutSidebar size={22} />
          </Button>
          <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 70, height: 70 }}>
            <img src="/emblem.png" alt="Logo" style={{ width: 48, height: 48 }} />
          </div>
          {sidebarOpen && (
            <>
              <h5 className="fw-bold mb-1 text-white">Researcher Panel</h5>
              <small className="text-light d-block" style={{ lineHeight: 1.3 }}>Ministry of Science & Technology<br/>Sri Lanka</small>
            </>
          )}
        </div>

        <Nav className="flex-column flex-grow-1 px-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <HouseDoor /> },
            { id: 'pending', label: 'Pending Requests', icon: <FileEarmarkText /> },
            { id: 'active', label: 'Active Research', icon: <FileEarmark /> },
            { id: 'completed', label: 'Completed Projects', icon: <FileEarmark /> },
            { id: 'profile', label: 'Profile', icon: <PersonCircle /> },
          ].map((item) => (
            <Nav.Link
              key={item.id}
              onClick={() => {
                if (item.id === 'profile') {
                  navigate('/researcher/profile');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`text-white d-flex align-items-center gap-2 my-1 p-2 rounded ${activeTab === item.id ? 'fw-bold bg-white bg-opacity-10' : ''}`}
              style={{ transition: '0.2s' }}
            >
              {item.icon}
              <span className={`${!sidebarOpen ? 'd-none' : ''}`}>{item.label}</span>
            </Nav.Link>
          ))}

          <div className="mt-auto pt-3 border-top">
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3"
              style={{ color: '#dc3545', transition: '0.2s' }}
              onClick={() => {
                localStorage.removeItem('researcherToken');
                localStorage.removeItem('researcherInfo');
                navigate('/researcher/auth');
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <BoxArrowRight size={20} className="me-3" />
              {sidebarOpen && <span>Logout</span>}
            </Nav.Link>
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3 mt-2"
              style={{ color: "#f8fafc", transition: "0.2s", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            >
              <BoxArrowRight size={20} className="me-3" style={{ transform: "rotate(180deg)" }} />
              {sidebarOpen && <span>Go Back</span>}
            </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {activeTab === 'dashboard' && (
          <Container className="px-0">
            <Row className="mb-4">
              <Col>
                <Card className="custom-card border-0 shadow">
                  <div className="p-4 text-white custom-card-header">
                    <h2 className="mb-1 d-flex align-items-center"><User className="me-2" size={32} /> Welcome, {profile?.researcher?.fullName}!</h2>
                    <div className="text-white-50">Track your research projects, supervision status, and funding requests</div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Statistics Cards - SINGLE INSTANCE */}
            <Row className="mb-4">
              <Col md={3} sm={6} className="mb-3">
                <Card className="custom-card shadow-sm h-100">
                  <Card.Body className="text-center">
                    <FileText size={40} style={{ color: '#00798c' }} className="mb-3" />
                    <h3 className="mb-1" style={{ color: '#0d3b66' }}>{stats.totalResearches}</h3>
                    <p className="text-muted mb-0">Total Researches</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-3">
                <Card className="custom-card shadow-sm h-100">
                  <Card.Body className="text-center">
                    <TrendingUp size={40} style={{ color: '#00798c' }} className="mb-3" />
                    <h3 className="mb-1" style={{ color: '#0d3b66' }}>{stats.currentSupervision}</h3>
                    <p className="text-muted mb-0">Current Supervision</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-3">
                <Card className="custom-card shadow-sm h-100">
                  <Card.Body className="text-center">
                    <CheckCircle size={40} className="text-success mb-3" />
                    <h3 className="mb-1" style={{ color: '#0d3b66' }}>{stats.finishedResearches}</h3>
                    <p className="text-muted mb-0">Finished</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-3">
                <Card className="custom-card shadow-sm h-100">
                  <Card.Body className="text-center">
                    <Clock size={40} className="text-warning mb-3" />
                    <h3 className="mb-1" style={{ color: '#0d3b66' }}>{stats.pendingResearches}</h3>
                    <p className="text-muted mb-0">Pending</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Your Projects */}
            <Row className="mb-4">
              <Col>
                <Card className="custom-card shadow border-0">
                  <Card.Header className="custom-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Your Projects</h5>
                    <Button size="sm" variant="light" onClick={openCreateResearch}>New Research</Button>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 align-middle">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Domains</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yourProjects.map((r) => (
                            <tr key={r._id}>
                              <td>{r.title}</td>
                              <td>
                                {(r.domains || []).map((d, i) => (
                                  <Badge key={i} bg="info" className="me-1">{d}</Badge>
                                ))}
                              </td>
                              <td>{getStatusBadge(r.status)}</td>
                              <td>
                                {r.status === 'Pending' && (
                                  <Button size="sm" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} onClick={() => openSupervisors(r)}>View Available Supervisors</Button>
                                )}
                                {r.status === 'Finished' && (supervisionByTitle[r.title]?.feasibility === 'Feasible') && (
                                  <Button size="sm" className="ms-2" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} onClick={() => handleFundingSubmit(r)}>Request Funding</Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Discover Projects */}
            <Row className="mb-4">
              <Col>
                <Card className="custom-card shadow border-0">
                  <Card.Header className="custom-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Discover Projects (matching your domains)</h5>
                    <Button size="sm" variant="light" onClick={fetchDiscoverProjects} disabled={loadingDiscover}>{loadingDiscover ? 'Loading...' : 'Refresh'}</Button>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {loadingDiscover ? (
                      <div className="text-center py-4"><Spinner animation="border" style={{ color: '#00798c' }} /></div>
                    ) : discoverList.length === 0 ? (
                      <div className="text-center text-muted py-4">No matching projects found</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Domains</th>
                              <th>Researcher</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {discoverList.map((r) => (
                              <tr key={r._id}>
                                <td>{r.title}</td>
                                <td>
                                  {(r.domains || []).map((d, i) => (
                                    <Badge key={i} bg="secondary" className="me-1">{d}</Badge>
                                  ))}
                                </td>
                                <td>{r.researcher?.fullName || '-'}</td>
                                <td>
                                  <Button size="sm" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} onClick={() => openSupervisors(r)}>Find Supervisors</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Current Active Project */}
            {(profile?.currentSupervision || activeProject) && (
              <Row className="mb-4">
                <Col>
                  <Card className="custom-card shadow-lg border-0" ref={activeRef}>
                    <Card.Header className="custom-card-header">
                      <h5 className="mb-0 d-flex align-items-center"><Users className="me-2" /> Current Active Project</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Research:</strong> {activeProject?.title || profile.currentSupervision.projectTitle}</p>
                          <p><strong>Supervisor:</strong> {profile.currentSupervision?.supervisor?.fullName || "-"}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Status:</strong> {getStatusBadge(activeProject?.status || profile.currentSupervision?.status)}</p>
                          <p><strong>Started:</strong> {new Date((profile.currentSupervision?.createdAt || activeProject?.createdAt) || Date.now()).toLocaleDateString()}</p>
                          <p><strong>Supervisor:</strong> {assignedSupervisorName || '-'}</p>
                        </Col>
                      </Row>
                      {(coActors?.length || 0) > 0 && (
                        <>
                          <hr />
                          <h6>Co-actors</h6>
                          {(coActors || []).map((r) => (
                            <Button key={r._id} size="sm" variant="outline-secondary" className="me-2 mb-2" onClick={() => openCoactorSupervisor(r)}>
                              {r.fullName}
                            </Button>
                          ))}
                        </>
                      )}
                      <hr />
                      <Row>
                        <Col md={6} className="mb-3">
                          <h6>Supervisor Feedback</h6>
                          {profile?.currentSupervision?.feedbacks?.length ? (
                            <ListGroup>
                              {profile.currentSupervision.feedbacks.map((f, idx) => (
                                <ListGroup.Item key={idx}>
                                  <div className="small text-muted">{new Date(f.date).toLocaleString()}</div>
                                  <div>{f.comment}</div>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          ) : (
                            <p className="text-muted mb-0">No feedback yet.</p>
                          )}
                        </Col>
                        <Col md={6}>
                          <h6>System Assigned Papers</h6>
                          {assignedPapers.length === 0 ? (
                            <p className="text-muted mb-2">No assigned papers.</p>
                          ) : (
                            <ListGroup className="mb-2">
                              {assignedPapers.map((p) => (
                                <ListGroup.Item key={p.id}>
                                  <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#00798c' }}>{p.title}</a>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          )}

                          <h6 className="mt-3">Upload Your Paper</h6>
                          {uploadState.error && <Alert variant="danger">{uploadState.error}</Alert>}
                          {uploadState.success && <Alert variant="success">{uploadState.success}</Alert>}
                          <Form onSubmit={handlePaperUpload} className="d-grid gap-2">
                            <Form.Control as="textarea" rows={2} placeholder="Specific details..." value={uploadState.details} onChange={(e) => setUploadState((s) => ({ ...s, details: e.target.value }))} />
                            <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={(e) => setUploadState((s) => ({ ...s, file: e.target.files?.[0] || null }))} />
                            <Button type="submit" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} disabled={uploadState.uploading || !uploadState.file}>{uploadState.uploading ? "Uploading..." : "Upload"}</Button>
                          </Form>
                          {myUploads.length > 0 && (
                            <div className="mt-2">
                              <div className="small text-muted mb-1">Your uploads</div>
                              <ListGroup>
                                {myUploads.map((u) => (
                                  <ListGroup.Item key={u.id} className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <div className="fw-semibold">{u.title}</div>
                                      <div className="small text-muted">{u.details}</div>
                                    </div>
                                    <div className="small text-muted">{new Date(u.uploadedAt).toLocaleString()}</div>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </div>
                          )}
                        </Col>
                      </Row>
                      <Button 
                        style={{ backgroundColor: '#00798c', borderColor: '#00798c' }}
                        onClick={() => navigate(`/researcher/supervision/${profile.currentSupervision?._id || "current"}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {/* My Research Projects */}
            <Row>
              <Col>
                <Card className="custom-card shadow border-0">
                  <Card.Header className="custom-card-header">
                    <h5 className="mb-0"><BookOpen className="me-2" /> My Research Projects</h5>
                  </Card.Header>
                  <Card.Body>
                    {yourProjects.length === 0 ? (
                      <p className="text-muted text-center">No research projects found</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Domains</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yourProjects.map((research) => (
                              <tr key={research._id}>
                                <td>{research.title}</td>
                                <td>
                                  {research.domains?.map((domain, idx) => (
                                    <Badge key={idx} bg="info" className="me-1">{domain}</Badge>
                                  ))}
                                </td>
                                <td>{getStatusBadge(research.status)}</td>
                                <td>
                                  {research.status === 'Finished' ? (
                                    <Button size="sm" variant="outline-secondary" onClick={() => setFundingModal({ show: true, research })}>Funding</Button>
                                  ) : research.status === 'Current' ? (
                                    <Button size="sm" variant="outline-primary" onClick={() => activeRef.current?.scrollIntoView({ behavior: 'smooth' })}>View</Button>
                                  ) : research.status === 'Pending' ? (
                                    <></>
                                  ) : (
                                    <Button size="sm" variant="outline-primary" onClick={() => navigate(`/researcher/research/${research._id}`)}>View</Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}

        {activeTab === 'pending' && (
          <Card className="custom-card shadow border-0">
            <Card.Header className="custom-card-header">
              <h5 className="mb-0">Pending Supervision Requests</h5>
            </Card.Header>
            <Card.Body>
              {pendingRequests?.length === 0 ? (
                <p className="text-muted mb-0">No pending requests</p>
              ) : (
                <ListGroup>
                  {pendingRequests.map((req) => (
                    <ListGroup.Item key={req._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{req.projectTitle}</strong>
                        <div className="small text-muted">Supervisor: {req.supervisor?.fullName}</div>
                      </div>
                      {getStatusBadge(req.status)}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        )}

        {activeTab === 'active' && (
          <Row className="mb-4">
            <Col>
              <Card className="custom-card shadow border-0">
                <Card.Header className="custom-card-header">
                  <h5 className="mb-0">Active Research</h5>
                </Card.Header>
                <Card.Body>
                  {loadingActive ? (
                    <div className="text-center"><Spinner animation="border" style={{ color: '#00798c' }} /></div>
                  ) : activeError ? (
                    <Alert variant="danger" className="mb-0">{activeError}</Alert>
                  ) : activeList.length === 0 ? (
                    <p className="text-muted mb-0">No active research</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Start Date</th>
                            <th>Supervisor</th>
                            <th>Co-Researchers</th>
                            <th>Paper</th>
                            <th>Comments</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeList.map((r) => (
                            <tr key={r._id}>
                              <td>{r.title}</td>
                              <td>{r.startDate ? new Date(r.startDate).toLocaleDateString() : '-'}</td>
                              <td>{r.supervisor?.name || '-'}</td>
                              <td>
                                {(r.coResearchers || []).length === 0 ? (
                                  <span className="text-muted">None</span>
                                ) : (
                                  (r.coResearchers || []).map((c, i) => (
                                    <Button key={c._id || i} size="sm" variant="outline-secondary" className="me-1 mb-1" onClick={() => openCoactorSupervisor(c)}>
                                      {c.name || c.fullName || c.email}
                                    </Button>
                                  ))
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <Form.Control size="sm" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setActiveUploads((m) => ({ ...m, [r._id]: e.target.files?.[0] || null }))} />
                                  <Button size="sm" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} disabled={!activeUploads[r._id]} onClick={() => setToasts((t)=>[...t,{id:Date.now(),bg:"success",text:"Paper selected (stub)."}])}>Upload</Button>
                                  {r.researchPaper ? (
                                    <a href={r.researchPaper} target="_blank" rel="noreferrer" style={{ color: '#00798c' }}>Open</a>
                                  ) : (
                                    <span className="text-muted">None</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <Button size="sm" variant="outline-primary" onClick={() => activeRef.current?.scrollIntoView({ behavior: 'smooth' })}>View</Button>
                              </td>
                              <td>
                                <Button size="sm" variant="outline-primary" onClick={() => activeRef.current?.scrollIntoView({ behavior: 'smooth' })}>View</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === 'completed' && (
          <Row className="mb-4">
            <Col>
              <Card className="custom-card shadow border-0">
                <Card.Header className="custom-card-header">
                  <h5 className="mb-0">Completed Projects</h5>
                </Card.Header>
                <Card.Body>
                  {completedProjects.length === 0 ? (
                    <p className="text-muted mb-0">No completed projects yet</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Domains</th>
                            <th>Status</th>
                            <th>Funding Request</th>
                            <th>Approval</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedProjects.map((research) => (
                            <tr key={research._id}>
                              <td>{research.title}</td>
                              <td>
                                {research.domains?.map((domain, idx) => (
                                  <Badge key={idx} bg="info" className="me-1">{domain}</Badge>
                                ))}
                              </td>
                              <td>{getStatusBadge(research.status)}</td>
                              <td>
                                {(() => {
                                  const sup = supervisionByTitle[research.title];
                                  const canRequest = sup?.status === 'Finished' && sup?.feasibility === 'Feasible';
                                  if (!canRequest) return <span className="text-muted">Unavailable</span>;
                                  return (
                                    <div className="d-flex flex-column gap-2" style={{ minWidth: 260 }}>
                                      <Form.Control
                                        type="number"
                                        placeholder="Requested amount"
                                        value={fundForm[research._id]?.amount || ''}
                                        onChange={(e) => setFundForm((m) => ({ ...m, [research._id]: { ...(m[research._id]||{}), amount: e.target.value } }))}
                                      />
                                      <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Justification"
                                        value={fundForm[research._id]?.justification || ''}
                                        onChange={(e) => setFundForm((m) => ({ ...m, [research._id]: { ...(m[research._id]||{}), justification: e.target.value } }))}
                                      />
                                      <Button size="sm" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} onClick={() => handleFundingSubmit(research)}>Submit</Button>
                                    </div>
                                  );
                                })()}
                              </td>
                              <td>
                                {fundingStatuses[research._id]?.status ? (
                                  <Badge bg={
                                    fundingStatuses[research._id].status === 'approved' ? 'success' :
                                    fundingStatuses[research._id].status === 'rejected' ? 'danger' :
                                    fundingStatuses[research._id].status === 'pending' ? 'warning' : 'secondary'
                                  }>
                                    {fundingStatuses[research._id].status}
                                  </Badge>
                                ) : (
                                  <Badge bg="secondary">none</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      {/* Co-actor Details Modal */}
      <Modal show={coactorModal.show} onHide={() => setCoactorModal({ show: false, coactor: null })}>
        <Modal.Header closeButton style={{ backgroundColor: '#0d3b66', color: 'white' }}>
          <Modal.Title>Co-actor details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {coactorModal.coactor ? (
            <div>
              <p className="mb-1"><strong>Name:</strong> {coactorModal.coactor.fullName}</p>
              {coactorModal.coactor.email && (
                <p className="mb-1"><strong>Email:</strong> {coactorModal.coactor.email}</p>
              )}
              {coactorModal.coactor.degree && (
                <p className="mb-0"><strong>Degree:</strong> {coactorModal.coactor.degree}</p>
              )}
            </div>
          ) : (
            <p className="text-muted mb-0">No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCoactorModal({ show: false, coactor: null })}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Funding Status Modal */}
      <Modal show={fundingModal.show} onHide={() => setFundingModal({ show: false, research: null })}>
        <Modal.Header closeButton style={{ backgroundColor: '#0d3b66', color: 'white' }}>
          <Modal.Title>Funding Request Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fundingModal.research ? (
            <div>
              <p className="mb-1"><strong>Project:</strong> {fundingModal.research.title}</p>
              <p className="mb-1"><strong>Status:</strong> {fundingStatuses[fundingModal.research._id]?.status || 'none'}</p>
              {fundingStatuses[fundingModal.research._id]?.fileName && (
                <p className="mb-0"><strong>File:</strong> {fundingStatuses[fundingModal.research._id].fileName}</p>
              )}
            </div>
          ) : (
            <p className="text-muted mb-0">No selection.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setFundingModal({ show: false, research: null })}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Create Research Modal */}
      <Modal show={createModal.show} onHide={() => setCreateModal({ show: false })} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#0d3b66', color: 'white' }}>
          <Modal.Title>Create New Research</Modal.Title>
        </Modal.Header>
        <Form onSubmit={createResearch}>
          <Modal.Body>
            {newResearch.error && <Alert variant="danger">{newResearch.error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={newResearch.title}
                onChange={(e) => setNewResearch((s) => ({ ...s, title: e.target.value }))}
                placeholder="Enter research title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newResearch.description}
                onChange={(e) => setNewResearch((s) => ({ ...s, description: e.target.value }))}
                placeholder="Short description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Domain</Form.Label>
              <Form.Select
                value={newResearch.domainMain}
                onChange={(e) => setNewResearch((s) => ({ ...s, domainMain: e.target.value }))}
                required
              >
                <option value="">Select domain</option>
                {domainsOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            {newResearch.domainMain === "Other" && (
              <Form.Group className="mb-3">
                <Form.Label>Other Domain</Form.Label>
                <Form.Control
                  value={newResearch.domainOther}
                  onChange={(e) => setNewResearch((s) => ({ ...s, domainOther: e.target.value }))}
                  placeholder="Specify your domain"
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-2">
              <Form.Label>Upload Paper (PDF/DOC/DOCX)</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setNewResearch((s) => ({ ...s, file: e.target.files?.[0] || null }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCreateModal({ show: false })} disabled={newResearch.saving}>Cancel</Button>
            <Button type="submit" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} disabled={newResearch.saving}>
              {newResearch.saving ? 'Saving...' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Available Supervisors Modal */}
      <Modal show={supModal.show} onHide={() => setSupModal({ show: false, research: null })}>
        <Modal.Header closeButton style={{ backgroundColor: '#0d3b66', color: 'white' }}>
          <Modal.Title>Available Supervisors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {supModal.research ? (
            <div>
              <p className="mb-1"><strong>Project:</strong> {supModal.research.title}</p>
              {loadingSup ? (
                <div className="text-center py-3"><Spinner animation="border" style={{ color: '#00798c' }} /></div>
              ) : supList.length === 0 ? (
                <p className="text-muted mb-0">No supervisors available for this domain.</p>
              ) : (
                <div className="d-grid gap-2">
                  {supList.map((s) => (
                    <div key={s._id} className="p-2 border rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold">{s.name || s.fullName}</div>
                          <div className="small text-muted">{s.email}</div>
                        </div>
                        <Button size="sm" style={{ backgroundColor: '#00798c', borderColor: '#00798c' }} onClick={() => requestSupervision(supModal.research, s._id)}>Request</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted mb-0">No selection.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSupModal({ show: false, research: null })}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Toasts */}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((t) => (
          <Toast key={t.id} bg={t.bg} onClose={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))} delay={3000} autohide>
            <Toast.Body className="text-white">{t.text}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default ResearcherDashboard;