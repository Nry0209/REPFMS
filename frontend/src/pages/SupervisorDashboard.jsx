import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Nav, Badge } from 'react-bootstrap';
import {
  HouseDoor,
  FileEarmarkText,
  PersonCircle,
  FileEarmark,
  LayoutSidebar,
  BoxArrowRight
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard = ({ auth, setAuth }) => {
  const [requests, setRequests] = useState([]);
  const [feedbackText, setFeedbackText] = useState({});
  const [fundingStatus, setFundingStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('supervisorToken');
        const res = await fetch('http://localhost:5000/api/supervisions/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('supervisorToken');
      const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleFeedbackSave = async (id) => {
    try {
      const token = localStorage.getItem('supervisorToken');
      const feedback = feedbackText[id];
      const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ feedback }),
      });
      const data = await res.json();
      setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
      alert('Feedback saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving feedback');
    }
  };

  const handleFeedbackDelete = (id) => {
    setFeedbackText((prev) => ({ ...prev, [id]: '' }));
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, feedback: '' } : r)));
    alert('Feedback deleted');
  };

  const handleFundingChange = async (id, viable, reason) => {
    try {
      const token = localStorage.getItem('supervisorToken');
      const feasibility = viable ? 'Feasible' : 'Not Feasible';
      const res = await fetch(`http://localhost:5000/api/supervisions/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ feasibility, reason }),
      });
      const data = await res.json();
      if (data?.supervision) {
        setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
      }
      setFundingStatus((prev) => ({ ...prev, [id]: { viable, reason } }));
      alert('Funding decision saved!');
    } catch (err) {
      console.error(err);
      alert('Error updating funding status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'Current':
        return <Badge bg="success">Current</Badge>;
      case 'Finished':
        return <Badge bg="primary">Finished</Badge>;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center p-5">Loading Dashboard...</div>;

  const dashboardName = auth?.name || 'Supervisor';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HouseDoor /> },
    { id: 'requests', label: 'Supervision Requests', icon: <FileEarmarkText /> },
    { id: 'feedback', label: 'Feedback', icon: <FileEarmarkText /> },
    { id: 'fundingRequest', label: 'Funding Requests', icon: <FileEarmark /> },
    { id: 'profile', label: 'Profile', icon: <PersonCircle /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f7fb' }}>
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
        {/* Header Section */}
        <div
          className="text-center px-3 pt-4 pb-3 position-relative"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
        >
          {/* Toggle button */}
          <Button
            variant="link"
            className="position-absolute top-0 end-0 mt-3 me-3 p-0"
            onClick={toggleSidebar}
            style={{ color: 'white' }}
          >
            <LayoutSidebar size={22} />
          </Button>

          {/* Logo */}
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
            style={{ width: '70px', height: '70px' }}
          >
            <img
              src="/emblem.png"
              alt="Ministry Logo"
              className="rounded-circle"
              style={{ width: '48px', height: '48px' }}
            />
          </div>

          {/* Title */}
          {sidebarOpen && (
            <>
              <h5 className="fw-bold mb-1 text-white" style={{ fontSize: '1.1rem' }}>
                Supervisor Panel
              </h5>
              <small className="text-light d-block" style={{ lineHeight: '1.3' }}>
                Ministry of Science & Technology
                <br />
                Sri Lanka
              </small>
            </>
          )}
        </div>

        {/* Sidebar Links */}
        <Nav className="flex-column flex-grow-1 px-2">
          {navItems.map((item) => (
            <Nav.Link
              key={item.id}
              onClick={() => {
                if (item.id === 'profile') {
                  navigate('/supervisor/profile');
                } else if (item.id === 'feedback') {
                  navigate('/supervisor/feedback');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`text-white d-flex align-items-center gap-2 my-1 p-2 rounded ${
                activeTab === item.id ? 'fw-bold bg-white bg-opacity-10' : ''
              }`}
              style={{ transition: '0.2s' }}
            >
              {item.icon}
              <span className={`${!sidebarOpen ? 'd-none' : ''}`}>{item.label}</span>
            </Nav.Link>
          ))}

          {/* Logout */}
          <div className="mt-auto pt-3 border-top">
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3"
              style={{
                color: '#dc3545',
                transition: '0.2s',
              }}
              onClick={() => {
                localStorage.removeItem('supervisorToken');
                localStorage.removeItem('supervisorInfo');
                setAuth({ ...auth, supervisor: false });
                navigate('/login');
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <BoxArrowRight size={20} className="me-3" />
              {sidebarOpen && <span>Logout</span>}
            </Nav.Link>
            <Nav.Link
                          className="d-flex align-items-center py-3 px-3 rounded-3 mt-2"
                          style={{ color: "#f8fafc", transition: "0.2s", cursor: "pointer" }}
                          onClick={() => {
                            navigate(-1); // navigate backward
                          }}
                        >
                     <BoxArrowRight
                      size={20}
                      className="me-3"
                      style={{ transform: "rotate(180deg)" }}
                    />
                    <span>Go Back</span>
               </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {activeTab === 'dashboard' && (
          <>
            <Card className="border-0 shadow" style={{ borderRadius: 16 }}>
              <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <h2 className="mb-0">Welcome, {dashboardName}</h2>
                <div className="text-white-50">Overview of your supervisions and actions</div>
              </div>
            </Card>
            <Row className="g-4 mt-1">
              {['Pending', 'Current', 'Finished'].map((status) => (
                <Col key={status} md={3}>
                  <Card className="shadow-sm border-0" style={{ borderRadius: 14 }}>
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-0 text-muted">{status}</h6>
                        {getStatusBadge(status)}
                      </div>
                      <div className="display-6 fw-bold mt-2">{requests.filter((r) => r.status === status).length}</div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: 14 }}>
                  <Card.Body>
                    <h5 className="mb-2">Quick Tips</h5>
                    <div className="text-muted small">Use the sidebar to manage supervision requests, add feedback to Current items, and record feasibility for Finished projects.</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {activeTab === 'requests' && (
          <Card className="shadow-lg border-0" style={{ borderRadius: 14 }}>
            <Card.Header className="text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)' }}>
              <h5 className="mb-0">Supervision Requests</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Researcher</th>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, i) => (
                      <React.Fragment key={req._id}>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{req.researcher?.name}</td>
                          <td>{req.projectTitle}</td>
                          <td>{req.durationMonths || 'N/A'}</td>
                          <td>{getStatusBadge(req.status)}</td>
                          <td>
                            {req.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleStatusChange(req._id, 'Current')}
                                >
                                  Approve (Make Current)
                                </Button>{' '}
                              </>
                            )}
                          </td>
                        </tr>

                        {req.status === 'Current' && (
                          <tr>
                            <td colSpan="6">
                              <div className="p-3 bg-light border rounded" style={{ borderRadius: 12 }}>
                                <h6 className="mb-2">Add Feedback</h6>
                                <textarea
                                  className="form-control mb-2"
                                  placeholder="Provide feedback..."
                                  value={feedbackText[req._id] || ''}
                                  onChange={(e) =>
                                    setFeedbackText({
                                      ...feedbackText,
                                      [req._id]: e.target.value,
                                    })
                                  }
                                />
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleFeedbackSave(req._id)}
                                  >
                                    Save Feedback
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleFeedbackDelete(req._id)}
                                  >
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'fundingRequest' && (
          <Card className="shadow-lg border-0" style={{ borderRadius: 14 }}>
            <Card.Header className="text-white" style={{ background: 'linear-gradient(135deg, #0d3b66, #00798c)' }}>
              <h5 className="mb-0">Funding Feasibility</h5>
            </Card.Header>
            <Card.Body>
              {requests.filter((r) => r.status === 'Finished').length === 0 && (
                <p className="text-muted mb-0">No finished projects to validate.</p>
              )}
              {requests
                .filter((r) => r.status === 'Finished')
                .map((req, i) => (
                  <div key={req._id} className="mb-3 p-3 border rounded bg-light" style={{ borderRadius: 12 }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{i + 1}. {req.projectTitle}</h6>
                      <div className="text-muted small">Researcher: {req.researcher?.name}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <Button
                        variant={
                          fundingStatus[req._id]?.viable ? 'success' : 'outline-success'
                        }
                        size="sm"
                        onClick={() =>
                          handleFundingChange(req._id, true, 'Viable for funding')
                        }
                      >
                        Viable
                      </Button>
                      <Button
                        variant={
                          fundingStatus[req._id]?.viable === false
                            ? 'danger'
                            : 'outline-danger'
                        }
                        size="sm"
                        onClick={() =>
                          handleFundingChange(req._id, false, 'Not viable')
                        }
                      >
                        Not Viable
                      </Button>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Reason (optional)"
                        value={fundingStatus[req._id]?.reason || ''}
                        onChange={(e) =>
                          setFundingStatus((prev) => ({
                            ...prev,
                            [req._id]: {
                              ...prev[req._id],
                              reason: e.target.value,
                            },
                          }))
                        }
                        style={{ maxWidth: '300px' }}
                      />
                    </div>
                  </div>
                ))}
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;


