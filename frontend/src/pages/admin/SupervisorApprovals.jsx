import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { Search, Filter, CheckCircle, XCircle, Clock, Person, Mail, Award, FileText } from 'react-bootstrap-icons';

const SupervisorApprovals = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [decision, setDecision] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchSupervisors = async () => {
      try {
        // Replace with actual API call
        const mockData = [
          {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 's.johnson@university.edu',
            department: 'Computer Science',
            expertise: ['AI', 'Machine Learning', 'Data Science'],
            status: 'pending',
            applicationDate: '2023-10-10',
            documents: ['cv.pdf', 'publications.pdf']
          },
          // Add more mock data as needed
        ];
        setSupervisors(mockData);
      } catch (error) {
        console.error('Error fetching supervisors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  const handleApprove = (id) => {
    // Handle approval logic
    console.log(`Approved supervisor with ID: ${id}`);
    // Update UI or make API call
  };

  const handleReject = (id) => {
    // Handle rejection logic
    console.log(`Rejected supervisor with ID: ${id}`);
    // Update UI or make API call
  };

  const handleViewDetails = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowDetails(true);
  };

  const handleSubmitDecision = () => {
    // Handle decision submission
    if (decision === 'approve') {
      handleApprove(selectedSupervisor.id);
    } else if (decision === 'reject') {
      handleReject(selectedSupervisor.id);
    }
    setShowDetails(false);
  };

  const filteredSupervisors = supervisors.filter(supervisor =>
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Supervisor Approvals</h2>
        <div className="d-flex">
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white">
              <Search />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search supervisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline-secondary" className="ms-2">
            <Filter className="me-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Expertise</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
                          <Person size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">{supervisor.name}</div>
                          <small className="text-muted">{supervisor.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{supervisor.department}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {supervisor.expertise.slice(0, 2).map((exp, idx) => (
                          <Badge key={idx} bg="light" text="dark" className="fw-normal">
                            {exp}
                          </Badge>
                        ))}
                        {supervisor.expertise.length > 2 && (
                          <Badge bg="light" text="dark" className="fw-normal">
                            +{supervisor.expertise.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>{new Date(supervisor.applicationDate).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={supervisor.status === 'approved' ? 'success' : 'warning'} className="text-uppercase">
                        {supervisor.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewDetails(supervisor)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleApprove(supervisor.id)}
                        >
                          <CheckCircle className="me-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleReject(supervisor.id)}
                        >
                          <XCircle className="me-1" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Supervisor Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Supervisor Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSupervisor && (
            <div>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px' }}>
                  <Person size={32} className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-0">{selectedSupervisor.name}</h4>
                  <p className="text-muted mb-0">{selectedSupervisor.email}</p>
                  <p className="mb-0">{selectedSupervisor.department}</p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h5>Expertise</h5>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {selectedSupervisor.expertise.map((exp, idx) => (
                      <Badge key={idx} bg="light" text="dark" className="fw-normal">
                        {exp}
                      </Badge>
                    ))}
                  </div>

                  <h5>Documents</h5>
                  <ul className="list-unstyled">
                    {selectedSupervisor.documents.map((doc, idx) => (
                      <li key={idx} className="mb-1">
                        <a href={`#view-${doc}`} className="text-decoration-none">
                          <FileText className="me-2" />
                          {doc}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Review Application</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Decision</Form.Label>
                    <div className="d-flex gap-3 mb-3">
                      <Form.Check
                        type="radio"
                        id="approve"
                        label="Approve"
                        name="decision"
                        value="approve"
                        onChange={(e) => setDecision(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        id="reject"
                        label="Reject"
                        name="decision"
                        value="reject"
                        onChange={(e) => setDecision(e.target.value)}
                      />
                    </div>
                    <Form.Label>Feedback (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide feedback for the applicant..."
                    />
                  </Form.Group>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitDecision}>
            Submit Decision
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupervisorApprovals;
