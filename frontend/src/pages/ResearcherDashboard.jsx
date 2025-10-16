// // src/pages/researcher/ResearcherDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { 
//   FileText, 
//   Users, 
//   CheckCircle, 
//   Clock, 
//   TrendingUp,
//   User,
//   BookOpen
// } from "lucide-react";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const ResearcherDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState({
//     totalResearches: 0,
//     currentSupervision: 0,
//     finishedResearches: 0,
//     pendingResearches: 0,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/researcher/login");
//         return;
//       }

//       const res = await fetch("http://localhost:5000/api/researchers/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch profile");
//       }

//       if (data.success) {
//         setProfile(data.data);
//         calculateStats(data.data.researcher);
//       }
//     } catch (err) {
//       console.error("Fetch profile error:", err);
//       setError(err.message);
//       if (err.message.includes("authorized")) {
//         localStorage.removeItem("token");
//         navigate("/researcher/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchActiveResearch = async () => {
//     try {
//       setLoadingActive(true);
//       setActiveError("");
//       const token = localStorage.getItem("researcherToken");
//       if (!token) return;
//       const res = await fetch("http://localhost:5000/api/researchers/my/active-research", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to load active research");
//       setActiveList(Array.isArray(data.data) ? data.data : []);
//     } catch (e) {
//       setActiveError(e.message || "Failed to load active research");
//     } finally {
//       setLoadingActive(false);
//     }
//   };

//   const calculateStats = (researcher) => {
//     const researches = researcher.researches || [];
//     setStats({
//       totalResearches: researches.length,
//       currentSupervision: researches.filter(r => r.status === "Current").length,
//       finishedResearches: researches.filter(r => r.status === "Finished").length,
//       pendingResearches: researches.filter(r => r.status === "Pending").length,
//     });
//   };

//   const getStatusBadge = (status) => {
//     const variants = {
//       Current: "primary",
//       Finished: "success",
//       Pending: "warning",
//     };
//     return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
//   };

//   if (loading) {
//     return (
//       <>
//         <DashboardHeader />
//         <Container className="my-5 text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-3">Loading dashboard...</p>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <DashboardHeader  />
//         <Container className="my-5">
//           <Alert variant="danger">{error}</Alert>
//           <Button onClick={fetchProfile}>Retry</Button>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   return (
//     <>
//       <DashboardHeader />
//       <Container className="my-5">
//         {/* Welcome Section */}
//         <Row className="mb-4">
//           <Col>
//             <Card className="bg-primary text-white p-4 shadow">
//               <h2 className="mb-2">
//                 <User className="me-2" size={32} />
//                 Welcome, {profile?.researcher?.fullName}!
//               </h2>
//               <p className="mb-0">
//                 Track your research projects, supervision status, and funding requests
//               </p>
//             </Card>
//           </Col>
//         </Row>

//         {/* Statistics Cards */}
//         <Row className="mb-4">
//           <Col md={3} sm={6} className="mb-3">
//             <Card className="shadow-sm h-100">
//               <Card.Body className="text-center">
//                 <FileText size={40} className="text-primary mb-3" />
//                 <h3 className="mb-1">{stats.totalResearches}</h3>
//                 <p className="text-muted mb-0">Total Researches</p>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={3} sm={6} className="mb-3">
//             <Card className="shadow-sm h-100">
//               <Card.Body className="text-center">
//                 <TrendingUp size={40} className="text-primary mb-3" />
//                 <h3 className="mb-1">{stats.currentSupervision}</h3>
//                 <p className="text-muted mb-0">Current Supervision</p>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={3} sm={6} className="mb-3">
//             <Card className="shadow-sm h-100">
//               <Card.Body className="text-center">
//                 <CheckCircle size={40} className="text-success mb-3" />
//                 <h3 className="mb-1">{stats.finishedResearches}</h3>
//                 <p className="text-muted mb-0">Finished</p>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={3} sm={6} className="mb-3">
//             <Card className="shadow-sm h-100">
//               <Card.Body className="text-center">
//                 <Clock size={40} className="text-warning mb-3" />
//                 <h3 className="mb-1">{stats.pendingResearches}</h3>
//                 <p className="text-muted mb-0">Pending</p>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Current Supervision Status */}
//         {profile?.currentSupervision && (
//           <Row className="mb-4">
//             <Col>
//               <Card className="shadow">
//                 <Card.Header className="bg-primary text-white">
//                   <h5 className="mb-0">
//                     <Users className="me-2" />
//                     Current Supervision
//                   </h5>
//                 </Card.Header>
//                 <Card.Body>
//                   <Row>
//                     <Col md={6}>
//                       <p><strong>Research:</strong> {profile.currentSupervision.research?.title}</p>
//                       <p><strong>Supervisor:</strong> {profile.currentSupervision.supervisor?.fullName}</p>
//                     </Col>
//                     <Col md={6}>
//                       <p><strong>Status:</strong> {getStatusBadge(profile.currentSupervision.status)}</p>
//                       <p><strong>Started:</strong> {new Date(profile.currentSupervision.createdAt).toLocaleDateString()}</p>
//                     </Col>
//                   </Row>
//                   <Button 
//                     variant="primary" 
//                     onClick={() => navigate(`/researcher/supervision/${profile.currentSupervision._id}`)}
//                   >
//                     View Details
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {/* Recent Researches */}
//         <Row>
//           <Col>
//             <Card className="shadow">
//               <Card.Header className="bg-light">
//                 <h5 className="mb-0">
//                   <BookOpen className="me-2" />
//                   My Research Projects
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 {profile?.researcher?.researches?.length === 0 ? (
//                   <p className="text-muted text-center">No research projects found</p>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-hover">
//                       <thead>
//                         <tr>
//                           <th>Title</th>
//                           <th>Domains</th>
//                           <th>Status</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {profile?.researcher?.researches?.map((research) => (
//                           <tr key={research._id}>
//                             <td>{research.title}</td>
//                             <td>
//                               {research.domains?.map((domain, idx) => (
//                                 <Badge key={idx} bg="info" className="me-1">
//                                   {domain}
//                                 </Badge>
//                               ))}
//                             </td>
//                             <td>{getStatusBadge(research.status)}</td>
//                             <td>
//                               <Button
//                                 size="sm"
//                                 variant="outline-primary"
//                                 onClick={() => navigate(`/researcher/research/${research._id}`)}
//                               >
//                                 View
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
                
//                 <div className="text-center mt-3">
//                   <Button 
//                     variant="primary"
//                     onClick={() => navigate("/researcher/find-supervisors")}
//                   >
//                     Find Supervisors
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <DashboardFooter />
//     </>
//   );
// };

// export default ResearcherDashboard;


// src/pages/ResearcherDashboard.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Spinner,
//   Modal,
//   Badge,
//   Alert,
//   ListGroup,
//   Form,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// /*
//   Assumed endpoints (change if backend differs):
//   GET  /researchers/profile                 -> researcher profile
//   GET  /researchers/projects                -> list of researcher's projects
//   GET  /supervisors?domains=dom1,dom2       -> list supervisors filtered by domains (or /supervisors)
//   GET  /supervisors/:id                     -> detailed supervisor profile (or use /supervisors endpoint)
//   POST /supervisions/request                -> send supervision request { projectId, supervisorId, message }
//   GET  /supervisions?researcher=me          -> get supervision records for researcher (alternatively /researchers/supervisions)
//   POST /funding/request                     -> request funding { projectId, reason } (only if finished && feasible)
// */

// function fetchWithAuth(url, opts = {}) {
//   const token = localStorage.getItem("researcherToken");
//   return fetch(url, {
//     ...opts,
//     headers: {
//       ...(opts.headers || {}),
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

// const SupervisorCard = ({ sup, onView, onRequest, projectEligible }) => {
//   const availableSlots = Math.max(0, (sup.maxSupervisions || 5) - (sup.currentSupervisions || 0));
//   return (
//     <Card className="mb-3">
//       <Card.Body>
//         <Row>
//           <Col md={8}>
//             <h5>{sup.name}</h5>
//             <div className="mb-2">
//               {sup.domains?.slice(0, 3).map((d, i) => (
//                 <Badge key={i} bg="info" className="me-1">{d}</Badge>
//               ))}
//             </div>
//             <p className="mb-1"><strong>Affiliation:</strong> {sup.affiliation || "—"}</p>
//             <p className="mb-1"><strong>Experience:</strong> {sup.experience ?? "—"} years</p>
//             <p className="mb-0 text-muted small">
//               Current supervisions: {sup.currentSupervisions ?? 0} / {sup.maxSupervisions ?? 5}
//             </p>
//           </Col>

//           <Col md={4} className="d-flex flex-column justify-content-center align-items-end">
//             <div className="mb-2">
//               <Badge bg={availableSlots > 0 ? "success" : "secondary"}>
//                 {availableSlots > 0 ? "Available" : "Full"}
//               </Badge>
//             </div>
//             <div>
//               <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onView(sup)}>
//                 View
//               </Button>

//               <Button
//                 variant="primary"
//                 size="sm"
//                 disabled={!projectEligible || availableSlots <= 0}
//                 onClick={() => onRequest(sup)}
//                 title={!projectEligible ? "Select a single eligible project first" : availableSlots <= 0 ? "Supervisor has no capacity" : "Request supervision"}
//               >
//                 Request
//               </Button>
//             </div>
//           </Col>
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

// const ProjectCard = ({ project, onSelect, selected }) => {
//   const statusColor = project.status === "finished" ? "success" : project.status === "current" ? "warning" : "secondary";
//   return (
//     <Card className={`mb-3 ${selected ? "border-primary" : ""}`}>
//       <Card.Body>
//         <Row>
//           <Col>
//             <div className="d-flex justify-content-between align-items-start">
//               <div>
//                 <h6>{project.title}</h6>
//                 <div className="mb-1">
//                   {project.domains?.map((d, i) => <Badge bg="info" className="me-1" key={i}>{d}</Badge>)}
//                 </div>
//                 <p className="mb-1 text-muted small">Co-authors: {(project.coResearchers || []).join(", ") || "None"}</p>
//                 <p className="mb-1 text-muted small">Funding: {project.funding?.status || "N/A"}</p>
//               </div>
//               <div className="text-end">
//                 <Badge bg={statusColor} className="mb-2 text-capitalize">{project.status || "pending"}</Badge>
//                 <div>
//                   <Button size="sm" variant={selected ? "outline-secondary" : "outline-primary"} onClick={() => onSelect(project)}>
//                     {selected ? "Selected" : "Select"}
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* feedback inspection */}
//             {(project.status === "current" || project.status === "finished") && project.feedbacks?.length > 0 && (
//               <Card className="mt-3">
//                 <Card.Body>
//                   <strong>Feedbacks</strong>
//                   <ListGroup variant="flush" className="mt-2">
//                     {project.feedbacks.map((f, idx) => (
//                       <ListGroup.Item key={idx}>
//                         <div className="small text-muted">{new Date(f.date).toLocaleString()}</div>
//                         <div>{f.comment}</div>
//                         <div className="small text-muted">By: {f.byName || f.by || "Supervisor"}</div>
//                       </ListGroup.Item>
//                     ))}
//                   </ListGroup>
//                 </Card.Body>
//               </Card>
//             )}
//           </Col>
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

// const ResearcherDashboard = ({ auth, setAuth }) => {
//   const [profile, setProfile] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [supervisors, setSupervisors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingSup, setLoadingSup] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [showSupModal, setShowSupModal] = useState(false);
//   const [modalSupervisor, setModalSupervisor] = useState(null);
//   const [actionMsg, setActionMsg] = useState("");
//   const [requesting, setRequesting] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadAll = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("researcherToken");
//         if (!token) {
//           navigate("/researcher/auth");
//           return;
//         }

//         // 1) fetch profile
//         const pRes = await fetchWithAuth(`${API_BASE}/researchers/profile`);
//         if (pRes.status === 401) {
//           // token invalid
//           localStorage.removeItem("researcherToken");
//           localStorage.removeItem("researcherInfo");
//           navigate("/researcher/auth");
//           return;
//         }
//         const pData = await pRes.json();
//         if (!pRes.ok) throw new Error(pData.message || "Failed to load profile");
//         // The backend might return { success: true, data: researcher } OR researcher object directly
//         const researcher = pData.data || pData;
//         setProfile(researcher);

//         // 2) fetch researcher's projects
//         // adapt endpoint if your backend uses a different path
//         const researcherProjects = researcher.researches || [];
//         setProjects(researcherProjects);

//         // 3) fetch supervisors filtered by researcher's domains (union of all project domains)
//         const domainSet = new Set();
//         (researcher.domains || []).forEach(d => domainSet.add(d));
//         // also include domains from projects (if profile.domains are empty)
//         researcherProjects.forEach((pr) => (pr.domains || []).forEach(d => domainSet.add(d)));

//         const domainQuery = Array.from(domainSet).slice(0, 3).join(","); // up to 3
//         setLoadingSup(true);
//         const supUrl = domainQuery ? `${API_BASE}/supervisors?domains=${encodeURIComponent(domainQuery)}` : `${API_BASE}/supervisors`;
//         const supRes = await fetchWithAuth(supUrl);
//         const supData = await supRes.json();
//         if (!supRes.ok) {
//           if (Array.isArray(supData)) setSupervisors(supData);
//           else throw new Error(supData.message || "Failed to fetch supervisors");
//         } else {
//           setSupervisors(supData.data || supData);
//         }
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//         setLoadingSup(false);
//       }
//     };

//     loadAll();
//   }, [navigate]);

//   const handleSelectProject = (proj) => {
//     // Only one project can be under supervision at a time
//     setSelectedProject((prev) => (prev && prev._id === proj._id ? null : proj));
//   };

//   const handleViewSupervisor = (sup) => {
//     // If you want extra details, call GET /supervisors/:id
//     setModalSupervisor(sup);
//     setShowSupModal(true);
//   };

//   const handleRequestSupervision = async (sup) => {
//     if (!selectedProject) {
//       setActionMsg("Please select one project to request supervision for.");
//       return;
//     }
//     // Check project status rules: can't request if current or finished?
//     if (selectedProject.status === "current") {
//       setActionMsg("This project is already under supervision.");
//       return;
//     }
//     if (selectedProject.status === "finished") {
//       setActionMsg("Finished project cannot request new supervision.");
//       return;
//     }

//     setRequesting(true);
//     setActionMsg("");
//     try {
//       const payload = {
//         projectId: selectedProject._id,
//         supervisorId: sup._id,
//         message: `Requesting supervision for project "${selectedProject.title}"`,
//       };
//       const res = await fetchWithAuth(`${API_BASE}/supervisions/request`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to send request");

//       setActionMsg("Request sent. Status: pending.");
//       // optimistic update: mark project's supervision request state (if your frontend expects it)
//       setProjects((prev) => prev.map(p => p._id === selectedProject._id ? { ...p, status: "pending" } : p));
//     } catch (err) {
//       console.error(err);
//       setActionMsg(err.message || "Request failed");
//     } finally {
//       setRequesting(false);
//     }
//   };

//   const handleRequestFunding = async (projectId, reason) => {
//     // Only allowed if project.status === 'finished' and project.feasible === true
//     const proj = projects.find((p) => p._id === projectId);
//     if (!proj) return setActionMsg("Project not found");
//     if (proj.status !== "finished") return setActionMsg("Funding can only be requested for finished projects");
//     if (!proj.feasible) return setActionMsg("Project is not feasible for funding");

//     setRequesting(true);
//     try {
//       const res = await fetchWithAuth(`${API_BASE}/funding/request`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectId, reason }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Funding request failed");
//       setActionMsg("Funding request submitted. Waiting for supervisor & ministry approval.");
//       // update project funding status optimistically
//       setProjects(prev => prev.map(p => p._id === projectId ? { ...p, funding: { status: "requested" } } : p));
//     } catch (err) {
//       setActionMsg(err.message || "Failed to request funding");
//     } finally {
//       setRequesting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <DashboardHeader auth={auth} setAuth={setAuth} />
//         <Container className="py-5 text-center">
//           <Spinner animation="border" /> <div>Loading dashboard...</div>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <DashboardHeader auth={auth} setAuth={setAuth} />
//         <Container className="py-5">
//           <Alert variant="danger">{error}</Alert>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   // Determine if selected project is eligible to request supervision:
//   // - Only one project under supervision allowed at a time (we check project's status)
//   // - Project status must be 'pending' (not 'current' or 'finished')
//   const projectEligible = selectedProject && selectedProject.status === "pending";

//   return (
//     <>
//       <DashboardHeader auth={auth} setAuth={setAuth} />
//       <Container className="py-4">
//         <Row>
//           <Col md={4}>
//             <Card className="mb-3 p-3">
//               <h5>{profile?.fullName || profile?.name || "Researcher"}</h5>
//               <p className="mb-1 text-muted">{profile?.degree || ""}</p>
//               <div className="mb-2">
//                 {profile?.domains?.map((d, i) => <Badge bg="info" className="me-1" key={i}>{d}</Badge>)}
//               </div>
//               <p className="small text-muted">Email: {profile?.email}</p>
//               <hr />
//               <h6>Selected project</h6>
//               {selectedProject ? (
//                 <>
//                   <div><strong>{selectedProject.title}</strong></div>
//                   <div className="small text-muted">Status: {selectedProject.status}</div>
//                 </>
//               ) : <div className="small text-muted">No project selected (select one from 'My Projects')</div>}
//               <div className="mt-3">
//                 <small className="text-muted">Note: Only researchers already present in the ministry database can login.</small>
//               </div>
//             </Card>

//             <Card className="p-3">
//               <h6>Actions</h6>
//               <div className="d-grid gap-2">
//                 <Button variant="primary" disabled={!projectEligible || supervisors.length === 0}>
//                   {projectEligible ? "Request a Supervisor (pick one from list)" : "Select an eligible project"}
//                 </Button>
//                 <Button variant="outline-secondary" onClick={() => {
//                   // refresh supervisors and projects
//                   setLoading(true);
//                   window.location.reload();
//                 }}>
//                   Refresh
//                 </Button>
//               </div>

//               {actionMsg && <Alert className="mt-3" variant="info">{actionMsg}</Alert>}
//             </Card>
//           </Col>

//           <Col md={8}>
//             <Card className="mb-3 p-3">
//               <h5>My Projects</h5>
//               <div className="mb-2 text-muted small">Only one project can be supervised at a time. Select a project to send a supervision request.</div>

//               {projects.length === 0 ? (
//                 <div className="text-muted">No projects found.</div>
//               ) : (
//                 projects.map((proj) => (
//                   <ProjectCard
//                     key={proj._id}
//                     project={proj}
//                     onSelect={handleSelectProject}
//                     selected={selectedProject?._id === proj._id}
//                   />
//                 ))
//               )}
//             </Card>

//             <Card className="p-3">
//               <h5>Supervisors matching your domains</h5>
//               {loadingSup ? (
//                 <div className="text-center"><Spinner animation="border" /></div>
//               ) : supervisors.length === 0 ? (
//                 <div className="text-muted">No supervisors found for your domains.</div>
//               ) : (
//                 supervisors.map((sup) => (
//                   <SupervisorCard
//                     key={sup._id}
//                     sup={sup}
//                     onView={handleViewSupervisor}
//                     onRequest={(s) => handleRequestSupervision(s)}
//                     projectEligible={!!selectedProject}
//                   />
//                 ))
//               )}
//             </Card>
//           </Col>
//         </Row>

//         {/* Supervisor Modal */}
//         <Modal show={showSupModal} onHide={() => setShowSupModal(false)} size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>Supervisor Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {!modalSupervisor ? (
//               <div>Loading...</div>
//             ) : (
//               <>
//                 <h5>{modalSupervisor.name}</h5>
//                 <div className="mb-2">
//                   {modalSupervisor.domains?.map((d, i) => <Badge bg="info" className="me-1" key={i}>{d}</Badge>)}
//                 </div>
//                 <p><strong>Affiliation:</strong> {modalSupervisor.affiliation}</p>
//                 <p><strong>Experience:</strong> {modalSupervisor.experience} years</p>

//                 <hr />
//                 <h6>Researches</h6>
//                 {modalSupervisor.researches?.length > 0 ? (
//                   <ListGroup>
//                     {modalSupervisor.researches.map((r) => (
//                       <ListGroup.Item key={r._id}>
//                         <div><strong>{r.title}</strong></div>
//                         <div className="small text-muted">Domains: {(r.domains || []).join(", ")}</div>
//                         <div className="small text-muted">Co-researchers: {(r.coResearchers || []).join(", ") || "None"}</div>
//                       </ListGroup.Item>
//                     ))}
//                   </ListGroup>
//                 ) : (
//                   <div className="text-muted">No research records listed</div>
//                 )}

//                 <hr />
//                 <h6>Co-researchers / Collaborators</h6>
//                 <div className="small text-muted">{(modalSupervisor.coResearchers || []).join(", ") || "None listed"}</div>
//               </>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowSupModal(false)}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>

//       <DashboardFooter />
//     </>
//   );
// };

// export default ResearcherDashboard;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Spinner,
//   Alert,
//   Badge,
//   Button,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// function fetchWithAuth(url, opts = {}) {
//   const token = localStorage.getItem("researcherToken");
//   return fetch(url, {
//     ...opts,
//     headers: {
//       ...(opts.headers || {}),
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

// const ProjectCard = ({ project }) => {
//   const statusColor =
//     project.status === "Finished"
//       ? "success"
//       : project.status === "Current"
//       ? "warning"
//       : "secondary";

//   return (
//     <Card className="mb-3">
//       <Card.Body>
//         <Row>
//           <Col>
//             <div className="d-flex justify-content-between align-items-start">
//               <div>
//                 <h6>{project.title}</h6>
//                 <div className="mb-1">
//                   {project.domains?.map((d, i) => (
//                     <Badge bg="info" className="me-1" key={i}>
//                       {d}
//                     </Badge>
//                   ))}
//                 </div>
//                 <p className="mb-1 text-muted small">
//                   Co-authors: {(project.coResearchers || []).join(", ") || "None"}
//                 </p>
//                 <p className="mb-1 text-muted small">
//                   Funding: {project.funding?.status || "N/A"}
//                 </p>
//               </div>
//               <div className="text-end">
//                 <Badge bg={statusColor} className="mb-2 text-capitalize">
//                   {project.status || "Pending"}
//                 </Badge>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

// const ResearcherDashboard = ({ auth, setAuth }) => {
//   const [profile, setProfile] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadProfile = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("researcherToken");
//         if (!token) {
//           navigate("/researcher/auth");
//           return;
//         }

//         const res = await fetchWithAuth(`${API_BASE}/researchers/profile`);
//         if (res.status === 401) {
//           localStorage.removeItem("researcherToken");
//           navigate("/researcher/auth");
//           return;
//         }

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to load profile");

//         const researcher = data.data || data;
//         setProfile(researcher);
//         setProjects(researcher.researches || []);
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <>
//         <DashboardHeader auth={auth} setAuth={setAuth} />
//         <Container className="py-5 text-center">
//           <Spinner animation="border" /> <div>Loading dashboard...</div>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <DashboardHeader auth={auth} setAuth={setAuth} />
//         <Container className="py-5">
//           <Alert variant="danger">{error}</Alert>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   return (
//     <>
//       <DashboardHeader auth={auth} setAuth={setAuth} />
//       <Container className="py-4">
//         <Row>
//           {/* Left Column: Researcher Profile */}
//           <Col md={4}>
//             <Card className="mb-3 p-3">
//               <h5>{profile?.fullName || "Researcher"}</h5>
//               <p className="mb-1 text-muted">{profile?.degree || ""}</p>
//               <div className="mb-2">
//                 {profile?.domains?.map((d, i) => (
//                   <Badge bg="info" className="me-1" key={i}>
//                     {d}
//                   </Badge>
//                 ))}
//               </div>
//               <p className="small text-muted">Email: {profile?.email}</p>
//               <hr />
//               <h6>Notes</h6>
//               <p className="small text-muted">
//                 Only researchers already present in the ministry database can login.
//               </p>
//             </Card>

//             <Card className="p-3">
//               <h6>Actions</h6>
//               <div className="d-grid gap-2">
//                 <Button
//                   variant="outline-secondary"
//                   onClick={() => window.location.reload()}
//                 >
//                   Refresh Projects
//                 </Button>
//               </div>
//             </Card>
//           </Col>

//           {/* Right Column: Projects */}
//           <Col md={8}>
//             <Card className="mb-3 p-3">
//               <h5>My Projects</h5>
//               <div className="mb-2 text-muted small">
//                 Projects you are involved in will appear here.
//               </div>

//               {projects.length === 0 ? (
//                 <div className="text-muted">No projects found.</div>
//               ) : (
//                 projects.map((proj) => <ProjectCard key={proj._id} project={proj} />)
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <DashboardFooter />
//     </>
//   );
// };

// export default ResearcherDashboard;

// src/pages/researcher/ResearcherDashboard.jsx
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
  const [activeList, setActiveList] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [activeError, setActiveError] = useState("");
  const [stats, setStats] = useState({
    totalResearches: 0,
    currentSupervision: 0,
    finishedResearches: 0,
    pendingResearches: 0,
  });
  const navigate = useNavigate();
  const activeRef = useRef(null);
  const ongoingRef = useRef(null);
  const [activeUploads, setActiveUploads] = useState({}); // { [id]: File }

  useEffect(() => {
    fetchProfile();
    fetchPendingRequests();
    const id = setInterval(fetchPendingRequests, 10000);
    // Listen for immediate refresh requests fired from other pages
    const onUpdated = () => fetchPendingRequests();
    window.addEventListener('pending-requests-updated', onUpdated);
    fetchActiveResearch();
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

        {/* Active Research moved below Ongoing Projects */}

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
                            <td>{getStatusBadge((r.approval === 'Accepted') ? 'Accepted' : r.status)}</td>
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

        {/* Active Research */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Active Research</h5>
              </Card.Header>
              <Card.Body>
                {loadingActive ? (
                  <div className="text-center"><Spinner animation="border" /></div>
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
                                <Button size="sm" variant="primary" disabled={!activeUploads[r._id]} onClick={() => setToasts((t)=>[...t,{id:Date.now(),bg:"success",text:"Paper selected (stub)."}])}>Upload</Button>
                                {r.researchPaper ? (
                                  <a href={r.researchPaper} target="_blank" rel="noreferrer">Open</a>
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
