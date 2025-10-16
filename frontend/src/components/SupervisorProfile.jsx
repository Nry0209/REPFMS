import React from 'react';
import { 
  Modal, 
  Button, 
  Card, 
  Row, 
  Col, 
  Badge, 
  ListGroup,
  Tab,
  Tabs,
  Image,
  Container,
  Stack
} from 'react-bootstrap';
import { format as formatDate } from 'date-fns/format';
import { 
  Briefcase, 
  Envelope, 
  Telephone, 
  Building, 
  ClockHistory,
  FileEarmarkText,
  FileEarmarkPdf,
  XCircle,
  CheckCircle,
  Clock
} from 'react-bootstrap-icons';

const SupervisorProfile = ({ supervisor, show, onHide }) => {
  if (!supervisor) return null;

  const formatDateString = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return formatDate(date, 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      approved: { bg: 'success', icon: <CheckCircle className="me-1" />, label: 'Approved' },
      rejected: { bg: 'danger', icon: <XCircle className="me-1" />, label: 'Rejected' },
      pending: { bg: 'warning', icon: <Clock className="me-1" />, label: 'Pending' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge bg={config.bg} className="d-inline-flex align-items-center px-3 py-2">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const DocumentCard = ({ title, documents, emptyMessage }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <Card.Title className="fs-6 text-uppercase text-muted mb-3">
          {title}
        </Card.Title>
        {documents?.length > 0 ? (
          <ListGroup variant="flush" className="small">
            {documents.map((doc, index) => (
              <ListGroup.Item key={index} className="border-0 px-0 py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FileEarmarkText className="text-primary me-2" />
                    <span className="text-truncate" style={{ maxWidth: '200px' }}>
                      {doc.name || `Document ${index + 1}`}
                    </span>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    href={`${process.env.REACT_APP_API_URL}/${doc.path || doc}`}
                    target="_blank"
                    className="p-0"
                  >
                    <FileEarmarkPdf className="text-danger" />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted small mb-0">{emptyMessage}</p>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold">Supervisor Profile</Modal.Title>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onHide}
          aria-label="Close"
        />
      </Modal.Header>
      <Modal.Body className="pt-0">
        <div className="bg-light p-4 rounded-3 mb-4">
          <Row className="g-3">
            <Col xs="auto">
              <div className="position-relative">
                <Image 
                  src={supervisor.profileImage?.url || '/default-avatar.png'}
                  alt={supervisor.name}
                  width={100}
                  height={100}
                  className="rounded-circle border border-3 border-white shadow-sm"
                />
                <div className="position-absolute bottom-0 end-0">
                  <StatusBadge status={supervisor.status} />
                </div>
              </div>
            </Col>
            <Col>
              <h2 className="h4 mb-1">{supervisor.name}</h2>
              <p className="text-muted mb-2">
                {supervisor.title || 'No title provided'}
              </p>
              <div className="d-flex flex-wrap gap-3 small">
                <div className="d-flex align-items-center text-muted">
                  <Envelope className="me-2" />
                  <span>{supervisor.email}</span>
                </div>
                {supervisor.phone && (
                  <div className="d-flex align-items-center text-muted">
                    <Telephone className="me-2" />
                    <span>{supervisor.phone}</span>
                  </div>
                )}
                {supervisor.affiliation && (
                  <div className="d-flex align-items-center text-muted">
                    <Building className="me-2" />
                    <span>{supervisor.affiliation}</span>
                  </div>
                )}
                {supervisor.experience && (
                  <div className="d-flex align-items-center text-muted">
                    <Briefcase className="me-2" />
                    <span>{supervisor.experience} years experience</span>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="expertise" className="mb-3">
          <Tab eventKey="expertise" title="Expertise">
            <Row className="g-3">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <Card.Title className="fs-6 text-uppercase text-muted mb-3">
                      Domains of Expertise
                    </Card.Title>
                    {supervisor.domains?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {supervisor.domains.map((domain, index) => (
                          <Badge 
                            key={index} 
                            bg="light" 
                            text="dark" 
                            className="py-2 px-3 fw-normal border"
                          >
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small mb-0">No domains specified</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <Card.Title className="fs-6 text-uppercase text-muted mb-3">
                      Research Areas
                    </Card.Title>
                    {supervisor.studies?.length > 0 ? (
                      <ListGroup variant="flush" className="small">
                        {supervisor.studies.map((study, index) => (
                          <ListGroup.Item key={index} className="border-0 px-0 py-2">
                            <div className="d-flex align-items-center">
                              <div className="bullet bg-primary rounded-circle me-2" style={{ width: '6px', height: '6px' }} />
                              {study}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted small mb-0">No research areas specified</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
          
          <Tab eventKey="documents" title="Documents">
            <Row className="g-3">
              <Col md={6}>
                <DocumentCard 
                  title="Curriculum Vitae"
                  documents={supervisor.cvFile ? [{ path: supervisor.cvFile }] : []}
                  emptyMessage="No CV uploaded"
                />
              </Col>
              <Col md={6}>
                <DocumentCard 
                  title="Transcripts"
                  documents={Array.isArray(supervisor.transcripts) 
                    ? supervisor.transcripts.map(t => (typeof t === 'string' ? { path: t } : t))
                    : []}
                  emptyMessage="No transcripts uploaded"
                />
              </Col>
            </Row>
          </Tab>
        </Tabs>

        {supervisor.status === 'rejected' && supervisor.rejectionReason && (
          <Card className="border-0 bg-light-danger bg-opacity-10">
            <Card.Body>
              <div className="d-flex">
                <div className="flex-shrink-0 text-danger me-3">
                  <XCircle size={20} />
                </div>
                <div>
                  <h6 className="text-danger mb-2">Rejection Reason</h6>
                  <p className="mb-2">{supervisor.rejectionReason}</p>
                  {supervisor.rejectedAt && (
                    <div className="d-flex align-items-center text-muted small">
                      <ClockHistory className="me-1" size={14} />
                      <span>Rejected on {formatDateString(supervisor.rejectedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="light" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupervisorProfile;
