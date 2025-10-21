// import React, { useEffect, useState } from "react";
// import { Card, Button, Badge, Form, Spinner, Row, Col } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const SupervisorFeedback = () => {
//   const [loading, setLoading] = useState(true);
//   const [requests, setRequests] = useState([]);
//   const [drafts, setDrafts] = useState({});
//   const [saving, setSaving] = useState({});
//   const navigate = useNavigate();

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("supervisorToken");
//       const res = await fetch("http://localhost:5000/api/supervisions/requests", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setRequests(Array.isArray(data.requests) ? data.requests : []);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const saveFeedback = async (id) => {
//     const feedback = drafts[id];
//     if (!feedback || !feedback.trim()) return;
//     try {
//       setSaving((prev) => ({ ...prev, [id]: true }));
//       const token = localStorage.getItem("supervisorToken");
//       const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ feedback }),
//       });
//       const data = await res.json();
//       if (data?.supervision) {
//         setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
//         setDrafts((prev) => ({ ...prev, [id]: "" }));
//       }
//     } catch (e) {
//       console.error("Failed to save feedback", e);
//     } finally {
//       setSaving((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const markFinished = async (id) => {
//     try {
//       setSaving((prev) => ({ ...prev, [id]: true }));
//       const token = localStorage.getItem("supervisorToken");
//       const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: "Finished" }),
//       });
//       const data = await res.json();
//       if (data?.supervision) {
//         setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
//       }
//     } catch (e) {
//       console.error("Failed to update status", e);
//     } finally {
//       setSaving((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   const statusBadge = (status) => {
//     const map = {
//       Pending: "warning",
//       Current: "primary",
//       Finished: "success",
//     };
//     return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
//   };

//   const pending = requests.filter(r => r.status === "Pending");
//   const current = requests.filter(r => r.status === "Current");
//   const finished = requests.filter(r => r.status === "Finished");

//   return (

//     <div className="p-3" style={{ backgroundColor: '#f5f7fb', minHeight: '100vh' }}>
//       <Card className="border-0 shadow mb-3" style={{ borderRadius: 16 }}>
//         <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
//           <h3 className="mb-0">Feedback Management</h3>
//           <div className="text-white-50">Review requests, add feedback to current supervisions, and finish projects</div>
//         </div>
//       </Card>

//       {loading ? (
//         <div className="text-center p-5"><Spinner animation="border" /></div>
//       ) : (
//         <>
//           <Card className="mb-3 shadow-sm border-0" style={{ borderRadius: 14 }}>
//             <Card.Header className="text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)' }}>
//               <h5 className="mb-0">Pending Supervisions</h5>
//             </Card.Header>
//             <Card.Body>
//               {pending.length === 0 ? (
//                 <p className="text-muted mb-0">No pending items.</p>
//               ) : (
//                 <div className="d-grid gap-2">
//                   {pending.map((r) => (
//                     <div key={r._id} className="p-3 border rounded bg-light" style={{ borderRadius: 12 }}>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <strong>{r.projectTitle}</strong>
//                         {statusBadge(r.status)}
//                       </div>
//                       <div className="small text-muted mt-1">Researcher: {r.researcher?.name || r.researcher?.fullName || '-'}</div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </Card.Body>
//           </Card>

//           <Card className="mb-3 shadow-sm border-0" style={{ borderRadius: 14 }}>
//             <Card.Header className="text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)' }}>
//               <h5 className="mb-0">Current Supervisions</h5>
//             </Card.Header>
//             <Card.Body>
//               {current.length === 0 ? (
//                 <p className="text-muted mb-0">No current items.</p>
//               ) : (
//                 <div className="d-grid gap-3">
//                   {current.map((r) => (
//                     <div key={r._id} className="p-3 border rounded bg-light" style={{ borderRadius: 12 }}>
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <div>
//                           <strong>{r.projectTitle}</strong>
//                           <span className="ms-2">{statusBadge(r.status)}</span>
//                         </div>
//                         <Button size="sm" variant="outline-secondary" disabled={!!saving[r._id]} onClick={() => markFinished(r._id)}>Mark Finished</Button>
//                       </div>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         placeholder="Add feedback..."
//                         value={drafts[r._id] || ""}
//                         onChange={(e) => setDrafts((d) => ({ ...d, [r._id]: e.target.value }))}
//                       />
//                       <div className="mt-2 d-flex gap-2">
//                         <Button size="sm" onClick={() => saveFeedback(r._id)} disabled={saving[r._id] || !(drafts[r._id] || '').trim()}>Save</Button>
//                         <Button size="sm" variant="outline-danger" onClick={() => setDrafts((d) => ({ ...d, [r._id]: "" }))}>Clear</Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </Card.Body>
//           </Card>

//           <Card className="shadow-sm border-0" style={{ borderRadius: 14 }}>
//             <Card.Header className="text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)' }}>
//               <h5 className="mb-0">Finished Supervisions</h5>
//             </Card.Header>
//             <Card.Body>
//               {finished.length === 0 ? (
//                 <div className="text-muted">No finished supervisions.</div>
//               ) : (
//                 <Row className="g-3">
//                   {finished.map((req) => (
//                     <Col md={6} key={req._id}>
//                       <Card className="h-100 border-1">
//                         <Card.Body>
//                           <div className="d-flex justify-content-between align-items-start mb-2">
//                             <div>
//                               <div className="fw-semibold">{req.projectTitle}</div>
//                               <div className="text-muted small">Researcher: {req.researcher?.name || '-'}</div>
//                             </div>
//                             {statusBadge(req.status)}
//                           </div>
//                           <div className="mb-3">
//                             <div className="fw-semibold mb-1">Final Feedback</div>
//                             {req.feedbacks?.length ? (
//                               <ul className="list-unstyled mb-0 small">
//                                 {req.feedbacks.map((f, i) => (
//                                   <li key={i} className="mb-1">
//                                     <span className="text-muted">{new Date(f.date).toLocaleString()}:</span> {f.comment}
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <div className="text-muted small">No feedback recorded.</div>
//                             )}
//                           </div>
//                           <div className="small text-muted">Funding requests are initiated by researchers after supervisor verification and ministry approval.</div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//               )}
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default SupervisorFeedback;

import React, { useEffect, useState } from "react";
import { Card, Button, Badge, Form, Spinner, Row, Col, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FileEarmarkText, PersonCircle, BoxArrowRight } from "react-bootstrap-icons";

const SupervisorFeedback = ({ auth, setAuth }) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState({});
  const [activeTab, setActiveTab] = useState("feedback");
  const navigate = useNavigate();

  const gradient = "linear-gradient(135deg, #0d3b66, #00798c)";

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch("http://localhost:5000/api/supervisions/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const saveFeedback = async (id) => {
    const feedback = drafts[id];
    if (!feedback || !feedback.trim()) return;
    try {
      setSaving((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback }),
      });
      const data = await res.json();
      if (data?.supervision) {
        setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
        setDrafts((prev) => ({ ...prev, [id]: "" }));
      }
    } catch (e) {
      console.error("Failed to save feedback", e);
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const markFinished = async (id) => {
    try {
      setSaving((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Finished" }),
      });
      const data = await res.json();
      if (data?.supervision) {
        setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
      }
    } catch (e) {
      console.error("Failed to update status", e);
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const statusBadge = (status) => {
    const map = {
      Pending: "warning",
      Current: "primary",
      Finished: "success",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  const pending = requests.filter((r) => r.status === "Pending");
  const current = requests.filter((r) => r.status === "Current");
  const finished = requests.filter((r) => r.status === "Finished");

  // Sidebar navigation (same as SupervisorProfile)
  const navItems = [
    { id: "profile", label: "Profile", path: "/supervisor/profile", icon: <PersonCircle /> },
    { id: "feedback", label: "Feedback", path: "/supervisor/feedback", icon: <FileEarmarkText /> },
    { id: "about", label: "About", path: "/supervisor/about", icon: <FileEarmarkText /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white position-relative"
        style={{
          width: "280px",
          minHeight: "100vh",
          backgroundColor: "#0d3b66",
          borderRight: "1px solid #e2e8f0",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="text-center px-3 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div
            className="bg-white rounded-circle mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: 70, height: 70 }}
          >
            <img src="/emblem.png" alt="Logo" style={{ width: 48, height: 48 }} />
          </div>
          <h5 className="fw-bold mb-1 text-white">Supervisor Panel</h5>
          <small className="text-light">
            Ministry of Science & Technology
            <br />
            Sri Lanka
          </small>
        </div>

        {/* Navigation */}
        <Nav className="flex-column flex-grow-1 px-2 mt-3">
          {navItems.map((item) => (
            <Nav.Link
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={`text-white d-flex align-items-center gap-2 my-1 p-2 rounded ${
                activeTab === item.id ? "fw-bold bg-white bg-opacity-10" : ""
              }`}
              style={{ transition: "0.2s" }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Nav.Link>
          ))}

          {/* Logout and Back */}
          <div className="mt-auto pt-3 border-top">
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3"
              style={{ color: "#dc3545", transition: "0.2s", cursor: "pointer" }}
              onClick={() => {
                localStorage.removeItem("supervisorToken");
                setAuth?.({ ...auth, supervisor: false });
                navigate("/login");
              }}
            >
              <BoxArrowRight size={20} className="me-3" />
              <span>Logout</span>
            </Nav.Link>
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3 mt-2"
              style={{ color: "#6c757d", transition: "0.2s", cursor: "pointer" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              <BoxArrowRight size={20} className="me-3" style={{ transform: "rotate(180deg)" }} />
              <span>Go Back</span>
            </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <Card className="border-0 shadow mb-3" style={{ borderRadius: 16 }}>
          <div
            className="p-4 text-white"
            style={{
              background: gradient,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <h3 className="mb-0">Feedback Management</h3>
            <div className="text-white-50">
              Review requests, add feedback to current supervisions, and finish projects
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* Pending */}
            <Card className="mb-3 shadow-sm border-0" style={{ borderRadius: 14 }}>
              <Card.Header className="text-white" style={{ background: gradient }}>
                <h5 className="mb-0">Pending Supervisions</h5>
              </Card.Header>
              <Card.Body>
                {pending.length === 0 ? (
                  <p className="text-muted mb-0">No pending items.</p>
                ) : (
                  <div className="d-grid gap-2">
                    {pending.map((r) => (
                      <div key={r._id} className="p-3 border rounded bg-light" style={{ borderRadius: 12 }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{r.projectTitle}</strong>
                          {statusBadge(r.status)}
                        </div>
                        <div className="small text-muted mt-1">
                          Researcher: {r.researcher?.name || r.researcher?.fullName || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Current */}
            <Card className="mb-3 shadow-sm border-0" style={{ borderRadius: 14 }}>
              <Card.Header className="text-white" style={{ background: gradient }}>
                <h5 className="mb-0">Current Supervisions</h5>
              </Card.Header>
              <Card.Body>
                {current.length === 0 ? (
                  <p className="text-muted mb-0">No current items.</p>
                ) : (
                  <div className="d-grid gap-3">
                    {current.map((r) => (
                      <div key={r._id} className="p-3 border rounded bg-light" style={{ borderRadius: 12 }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>{r.projectTitle}</strong>
                            <span className="ms-2">{statusBadge(r.status)}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            disabled={!!saving[r._id]}
                            onClick={() => markFinished(r._id)}
                          >
                            Mark Finished
                          </Button>
                        </div>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Add feedback..."
                          value={drafts[r._id] || ""}
                          onChange={(e) => setDrafts((d) => ({ ...d, [r._id]: e.target.value }))}
                        />
                        <div className="mt-2 d-flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveFeedback(r._id)}
                            disabled={saving[r._id] || !(drafts[r._id] || "").trim()}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => setDrafts((d) => ({ ...d, [r._id]: "" }))}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Finished */}
            <Card className="shadow-sm border-0" style={{ borderRadius: 14 }}>
              <Card.Header className="text-white" style={{ background: gradient }}>
                <h5 className="mb-0">Finished Supervisions</h5>
              </Card.Header>
              <Card.Body>
                {finished.length === 0 ? (
                  <div className="text-muted">No finished supervisions.</div>
                ) : (
                  <Row className="g-3">
                    {finished.map((req) => (
                      <Col md={6} key={req._id}>
                        <Card className="h-100 border-1">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <div className="fw-semibold">{req.projectTitle}</div>
                                <div className="text-muted small">
                                  Researcher: {req.researcher?.name || "-"}
                                </div>
                              </div>
                              {statusBadge(req.status)}
                            </div>
                            <div className="mb-3">
                              <div className="fw-semibold mb-1">Final Feedback</div>
                              {req.feedbacks?.length ? (
                                <ul className="list-unstyled mb-0 small">
                                  {req.feedbacks.map((f, i) => (
                                    <li key={i} className="mb-1">
                                      <span className="text-muted">
                                        {new Date(f.date).toLocaleString()}:
                                      </span>{" "}
                                      {f.comment}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="text-muted small">No feedback recorded.</div>
                              )}
                            </div>
                            <div className="small text-muted">
                              Funding requests are initiated by researchers after supervisor verification and ministry approval.
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SupervisorFeedback;
