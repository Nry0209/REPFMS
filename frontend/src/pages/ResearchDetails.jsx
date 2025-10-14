// src/pages/ResearchDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, ListGroup, Image } from "react-bootstrap";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";
import { getResearchById, getAssignedPapers, getSupervisorsByDomain, requestSupervision } from "../api/researcher";

const ResearchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [research, setResearch] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [requesting, setRequesting] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const r = await getResearchById(id);
        setResearch(r);
        const [papers, sups] = await Promise.all([
          getAssignedPapers(id),
          getSupervisorsByDomain(r.domains || []),
        ]);
        setAssigned(papers);
        setSupervisors(sups);
      } catch (e) {
        setError(e.message || "Failed to load research");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRequest = async (sup) => {
    try {
      setRequesting(sup._id);
      setError("");
      setSuccess("");
      const res = await requestSupervision(id, sup);
      if (!res.success) {
        setError(res.message || "Unable to send request");
      } else {
        setSuccess(`Request sent to ${sup.fullName}`);
        // Notify dashboard to refresh pending requests immediately
        try { window.dispatchEvent(new Event('pending-requests-updated')); } catch (_) {}
      }
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setRequesting(null);
    }
  };

  return (
    <>
      <DashboardHeader />
      <Container className="my-4">
        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <Row className="mb-3">
              <Col>
                <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
              </Col>
            </Row>

            <Row>
              <Col lg={8} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">{research.title}</h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted">{research.description}</p>
                    <div className="mb-3">
                      {(research.domains || []).map((d, i) => (
                        <Badge key={i} bg="info" className="me-1">{d}</Badge>
                      ))}
                    </div>

                    <h6 className="mt-3">System Assigned Papers</h6>
                    {assigned.length === 0 ? (
                      <p className="text-muted">No assigned papers.</p>
                    ) : (
                      <ListGroup className="mb-2">
                        {assigned.map(p => (
                          <ListGroup.Item key={p.id}>
                            <a href={p.url} target="_blank" rel="noreferrer">{p.title}</a>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}

                    {/* Researcher uploads are shown on the dashboard; omitted here */}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}
                {error && !loading && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Available Supervisors (by domain)</h6>
                  </Card.Header>
                  <Card.Body>
                    {supervisors.length === 0 ? (
                      <p className="text-muted mb-0">No supervisors available for these domains.</p>
                    ) : (
                      <ListGroup>
                        {supervisors.map((s) => (
                          <ListGroup.Item key={s._id} className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              {s.photo ? (
                                <Image src={s.photo} alt={s.fullName} roundedCircle width={36} height={36} className="me-2" />
                              ) : (
                                <div className="bg-secondary bg-opacity-25 rounded-circle me-2" style={{ width: 36, height: 36 }} />
                              )}
                              <div>
                                <div className="fw-semibold">{s.fullName}</div>
                                <div className="small text-muted">{s.domain} • {s.available ? 'Available' : 'Unavailable'}</div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              disabled={!s.available || requesting === s._id}
                              onClick={() => handleRequest(s)}
                              variant="primary"
                            >
                              {requesting === s._id ? 'Requesting...' : 'Request'}
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <DashboardFooter />
    </>
  );
};

export default ResearchDetail;
