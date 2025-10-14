import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { Search, Funnel as Filter, PersonCheck, PersonX, Envelope, ThreeDotsVertical as ThreeDots, FileEarmarkText } from 'react-bootstrap-icons';

const SupervisorApprovals = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = [
          {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            department: 'Computer Science',
            specialization: 'Artificial Intelligence',
            status: 'pending',
            experience: 8,
            dateSubmitted: '2023-10-10',
            documents: ['cv.pdf', 'qualifications.pdf'],
            bio: 'Expert in machine learning and neural networks with 8+ years of experience in AI research.'
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
    // Update the status in the local state
    setSupervisors(supervisors.map(supervisor => 
      supervisor.id === id ? { ...supervisor, status: 'approved' } : supervisor
    ));
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    
    // Update the status in the local state
    setSupervisors(supervisors.map(supervisor => 
      supervisor.id === selectedSupervisor.id 
        ? { 
            ...supervisor, 
            status: 'rejected',
            rejectionReason 
          } 
        : supervisor
    ));
    
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedSupervisor(null);
  };

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = 
      supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return supervisor.status === statusFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge bg="warning" text="dark">Pending Review</Badge>;
    }
  };

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
        <div>
          <h2 className="mb-0">Supervisor Approvals</h2>
          <p className="text-muted mb-0">Review and manage supervisor applications</p>
        </div>
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
          <Form.Select 
            className="ms-2" 
            style={{ width: '200px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupervisors.length > 0 ? (
                  filteredSupervisors.map((supervisor) => (
                    <tr key={supervisor.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
                            <PersonCheck className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-semibold">{supervisor.name}</div>
                            <small className="text-muted">{supervisor.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{supervisor.department}</td>
                      <td>{supervisor.specialization}</td>
                      <td>{supervisor.experience} years</td>
                      <td>{getStatusBadge(supervisor.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              setSelectedSupervisor(supervisor);
                              setShowDetails(true);
                            }}
                          >
                            View
                          </Button>
                          {supervisor.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => handleApprove(supervisor.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  setSelectedSupervisor(supervisor);
                                  setShowRejectModal(true);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">No supervisors found matching your criteria</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Supervisor Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Supervisor Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSupervisor && (
            <div className="row">
              <div className="col-md-4 text-center mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                  <PersonCheck size={48} className="text-primary" />
                </div>
                <h5>{selectedSupervisor.name}</h5>
                <p className="text-muted mb-0">{selectedSupervisor.email}</p>
                <p className="text-muted">{selectedSupervisor.department}</p>
                {getStatusBadge(selectedSupervisor.status)}
              </div>
              <div className="col-md-8">
                <h6>Professional Information</h6>
                <div className="mb-3">
                  <p className="mb-1"><strong>Specialization:</strong> {selectedSupervisor.specialization}</p>
                  <p className="mb-1"><strong>Experience:</strong> {selectedSupervisor.experience} years</p>
                  <p className="mb-1"><strong>Date Submitted:</strong> {new Date(selectedSupervisor.dateSubmitted).toLocaleDateString()}</p>
                </div>
                
                <h6>Biography</h6>
                <p className="text-muted">{selectedSupervisor.bio}</p>
                
                <h6>Documents</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedSupervisor.documents.map((doc, index) => (
                    <Button 
                      key={index} 
                      variant="outline-primary" 
                      size="sm"
                      className="d-flex align-items-center"
                    >
                      <FileEarmarkText className="me-1" />
                      {doc}
                    </Button>
                  ))}
                </div>
                
                {selectedSupervisor.status === 'rejected' && selectedSupervisor.rejectionReason && (
                  <div className="alert alert-danger">
                    <strong>Rejection Reason:</strong> {selectedSupervisor.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          {selectedSupervisor?.status === 'pending' && (
            <>
              <Button 
                variant="success"
                onClick={() => {
                  handleApprove(selectedSupervisor.id);
                  setShowDetails(false);
                }}
              >
                Approve Application
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  setShowDetails(false);
                  setShowRejectModal(true);
                }}
              >
                Reject Application
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Please provide a reason for rejecting this application..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupervisorApprovals;
