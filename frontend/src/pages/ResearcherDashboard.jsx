
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Modal, ListGroup, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  User,
  BookOpen
} from "lucide-react";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";
import { getComments, getAssignedPapers, getResearcherUploads, uploadResearcherPaper, getFundingStatus, submitFundingRequest, getLocalPendingRequests } from "../api/researcher";

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
  const [fundingStatuses, setFundingStatuses] = useState({}); // { [researchId]: { status, fileName } }
  // removed quick action modals; showOngoing/showCompleted no longer used
  const [toasts, setToasts] = useState([]);
  // Comments are supervisor-only; researcher dashboard shows them read-only
  const [fundingModal, setFundingModal] = useState({ show: false, research: null });
  const [stats, setStats] = useState({
    totalResearches: 0,
    currentSupervision: 0,
    finishedResearches: 0,
    pendingResearches: 0,
  });
  const navigate = useNavigate();
  const activeRef = useRef(null);
  const ongoingRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchPendingRequests();
    const id = setInterval(fetchPendingRequests, 10000);
    // Listen for immediate refresh requests fired from other pages
    const onUpdated = () => fetchPendingRequests();
    window.addEventListener('pending-requests-updated', onUpdated);
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
      // Merge lists; prefer API entries
      const merged = [...localList, ...apiList];
      setPendingRequests(merged);
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

  const getStatusBadge = (status) => {
    const variants = {
      Current: "primary",
      Finished: "success",
      Pending: "warning",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const activeProject = profile?.researcher?.researches?.find(r => r.status === "Current") || null;
  const assignedSupervisorName = (activeProject?.supervisor?.fullName) || (profile?.currentSupervision?.supervisor?.fullName) || "";
  const coActors = (activeProject?.coResearchers && activeProject.coResearchers.length ? activeProject.coResearchers : (profile?.currentSupervision?.coResearchers || []));
  const completedProjects = (profile?.researcher?.researches || []).filter(r => r.status === "Finished");
  const pendingProjects = (profile?.researcher?.researches || []).filter(r => r.status === "Pending");

  const openCoactorSupervisor = (coactor) => {
    // Show the co-actor's own details instead of their supervisor
    setCoactorModal({ show: true, coactor });
  };

  // Load comments, papers, uploads for active project
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
        // best-effort; surface in UI via sections if needed
      }
    };
    loadActiveArtifacts();
  }, [activeProject?._id]);

  // Load funding status for completed projects
  useEffect(() => {
    const loadFunding = async () => {
      const map = {};
      for (const r of completedProjects) {
        try {
          map[r._id] = await getFundingStatus(r._id);
        } catch (e) {
          map[r._id] = { status: "none", fileName: null };
        }
      }
      setFundingStatuses(map);
    };
    if (completedProjects.length) loadFunding();
  }, [completedProjects.length]);

  const handlePaperUpload = async (e) => {
    e.preventDefault();
    if (!activeProject?._id || !uploadState.file) return;
    // Minimal validation: type and size <= 10MB
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

  const handleFundingUpload = async (researchId, file) => {
    if (!file) return;
    // Minimal validation: PDF only, <= 10MB
    if (file.type !== "application/pdf") {
      setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Funding request must be a PDF." }]);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToasts((t) => [...t, { id: Date.now(), bg: "warning", text: "Funding PDF exceeds 10MB." }]);
      return;
    }
    try {
      await submitFundingRequest(researchId, file);
      const st = await getFundingStatus(researchId);
      setFundingStatuses((m) => ({ ...m, [researchId]: st }));
      setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Funding request submitted." }]);
    } catch (_) {
      setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Failed to submit funding request." }]);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <Container className="my-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard...</p>
        </Container>
        <DashboardFooter />

      {/* Toasts */}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((t) => (
          <Toast key={t.id} bg={t.bg} onClose={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))} delay={3000} autohide>
            <Toast.Body className="text-white">{t.text}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader  />
        <Container className="my-5">
          <Alert variant="danger">{error}</Alert>
          <Button onClick={fetchProfile}>Retry</Button>
        </Container>
        <DashboardFooter />
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <Container className="my-5">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <Card className="bg-primary text-white p-4 shadow">
              <h2 className="mb-2">
                <User className="me-2" size={32} />
                Welcome, {profile?.researcher?.fullName}!
              </h2>
              <p className="mb-0">
                Track your research projects, supervision status, and funding requests
              </p>
            </Card>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <FileText size={40} className="text-primary mb-3" />
                <h3 className="mb-1">{stats.totalResearches}</h3>
                <p className="text-muted mb-0">Total Researches</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <TrendingUp size={40} className="text-primary mb-3" />
                <h3 className="mb-1">{stats.currentSupervision}</h3>
                <p className="text-muted mb-0">Current Supervision</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <CheckCircle size={40} className="text-success mb-3" />
                <h3 className="mb-1">{stats.finishedResearches}</h3>
                <p className="text-muted mb-0">Finished</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <Clock size={40} className="text-warning mb-3" />
                <h3 className="mb-1">{stats.pendingResearches}</h3>
                <p className="text-muted mb-0">Pending</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Pending Requests Section */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <Card.Header className="bg-light">
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
          </Col>
        </Row>

        {/* Current Active Project */}
        {(profile?.currentSupervision || activeProject) && (
          <Row className="mb-4">
            <Col>
              <Card className="shadow" ref={activeRef}>
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <Users className="me-2" />
                    Current Active Project
                  </h5>
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
                      <h6>Supervisors' Comments</h6>
                      {activeComments.filter(c => !assignedSupervisorName || c.supervisorName === assignedSupervisorName).length === 0 ? (
                        <p className="text-muted mb-0">No comments yet.</p>
                      ) : (
                        <ListGroup>
                          {activeComments.filter(c => !assignedSupervisorName || c.supervisorName === assignedSupervisorName).map((c) => (
                            <ListGroup.Item key={c.id}>
                              <div className="fw-semibold">{c.supervisorName}</div>
                              <div className="small text-muted">{new Date(c.date).toLocaleString()}</div>
                              <div>{c.comment}</div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                      {/* Researcher cannot add comments here; shown read-only as supervisors comment via their dashboard */}
                    </Col>
                    <Col md={6}>
                      <h6>System Assigned Papers</h6>
                      {assignedPapers.length === 0 ? (
                        <p className="text-muted mb-2">No assigned papers.</p>
                      ) : (
                        <ListGroup className="mb-2">
                          {assignedPapers.map((p) => (
                            <ListGroup.Item key={p.id}>
                              <a href={p.url} target="_blank" rel="noreferrer">{p.title}</a>
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
                        <Button type="submit" disabled={uploadState.uploading || !uploadState.file}>{uploadState.uploading ? "Uploading..." : "Upload"}</Button>
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
                        variant="primary" 
                        onClick={() => navigate(`/researcher/supervision/${profile.currentSupervision?._id || "current"}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

        {/* Ongoing Projects */}
        <Row className="mb-4" ref={ongoingRef}>
          <Col>
            <Card className="shadow">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Ongoing Projects</h5>
              </Card.Header>
              <Card.Body>
                {((profile?.researcher?.researches || []).filter(r => r.status === 'Pending')).length === 0 ? (
                  <p className="text-muted mb-0">No ongoing projects</p>
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
                        {(profile?.researcher?.researches || []).filter(r => r.status === 'Pending').map((r) => (
                          <tr key={r._id}>
                            <td>{r.title}</td>
                            <td>{r.domains?.map((d, i) => (<Badge key={i} bg="info" className="me-1">{d}</Badge>))}</td>
                            <td>{getStatusBadge(r.status)}</td>
                            <td>
                              <Button size="sm" variant="outline-primary" onClick={() => navigate(`/researcher/research/${r._id}`)}>View</Button>
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

        {/* Completed Projects */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <Card.Header className="bg-light">
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
                                <Badge key={idx} bg="info" className="me-1">
                                  {domain}
                                </Badge>
                              ))}
                            </td>
                            <td>{getStatusBadge(research.status)}</td>
                            <td>
                              <Form.Group controlId={`fund_${research._id}`} className="mb-0">
                                <Form.Control type="file" accept="application/pdf" onChange={(e) => handleFundingUpload(research._id, e.target.files?.[0])} />
                              </Form.Group>
                            </td>
                            <td>
                              <Badge bg={
                                fundingStatuses[research._id]?.status === 'approved' ? 'success' :
                                fundingStatuses[research._id]?.status === 'rejected' ? 'danger' :
                                fundingStatuses[research._id]?.status === 'pending' ? 'warning' : 'secondary'
                              }>
                                {fundingStatuses[research._id]?.status || 'none'}
                              </Badge>
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

        {/* My Research Projects & link to Pending Projects */}
        <Row>
          <Col>
            <Card className="shadow">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <BookOpen className="me-2" />
                  My Research Projects
                </h5>
              </Card.Header>
              <Card.Body>
                {profile?.researcher?.researches?.length === 0 ? (
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
                        {profile?.researcher?.researches?.map((research) => (
                          <tr key={research._id}>
                            <td>{research.title}</td>
                            <td>
                              {research.domains?.map((domain, idx) => (
                                <Badge key={idx} bg="info" className="me-1">
                                  {domain}
                                </Badge>
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
      <DashboardFooter />

      {/* Co-actor Details Modal */}
      <Modal show={coactorModal.show} onHide={() => setCoactorModal({ show: false, coactor: null })}>
        <Modal.Header closeButton>
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
          <Button variant="secondary" onClick={() => setCoactorModal({ show: false, coactor: null })}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Funding Status Modal */}
      <Modal show={fundingModal.show} onHide={() => setFundingModal({ show: false, research: null })}>
        <Modal.Header closeButton>
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

      
    </>
  );
};

export default ResearcherDashboard;
