import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Search, Filter, FileText, CheckCircle, XCircle, Clock, User, Download } from 'react-bootstrap-icons';

const ResearchProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchProposals = async () => {
      try {
        // Replace with actual API call
        const mockData = [
          {
            id: 1,
            title: 'AI in Healthcare: Early Disease Detection',
            researcher: 'Dr. Emily Chen',
            department: 'Computer Science',
            supervisor: 'Dr. Robert Johnson',
            status: 'pending',
            submissionDate: '2023-10-05',
            documents: ['proposal.pdf', 'budget.xlsx'],
            fundingRequested: 15000,
            duration: '12 months',
            summary: 'This research aims to develop AI models for early detection of chronic diseases using medical imaging.'
          },
          // Add more mock data as needed
        ];
        setProposals(mockData);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleStatusChange = (id, status) => {
    // Handle status change logic
    console.log(`Changed status of proposal ${id} to ${status}`);
    // Update UI or make API call
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetails(true);
  };

  const handleSubmitReview = () => {
    // Handle review submission
    console.log('Review submitted:', { proposalId: selectedProposal.id, feedback });
    setShowDetails(false);
    setFeedback('');
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return proposal.status === activeTab && matchesSearch;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      case 'revision':
        return 'info';
      default:
        return 'secondary';
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
        <h2 className="mb-0">Research Proposals</h2>
        <div className="d-flex">
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white">
              <Search />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search proposals..."
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

      <Card className="shadow-sm mb-4">
        <Card.Body className="p-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3 px-3 pt-2"
          >
            <Tab eventKey="all" title="All Proposals" />
            <Tab eventKey="pending" title={
              <>
                <Clock className="me-1" /> Pending
                <Badge bg="warning" className="ms-2">3</Badge>
              </>
            } />
            <Tab eventKey="approved" title={
              <>
                <CheckCircle className="me-1" /> Approved
                <Badge bg="success" className="ms-2">5</Badge>
              </>
            } />
            <Tab eventKey="revision" title={
              <>
                <FileText className="me-1" /> Needs Revision
                <Badge bg="info" className="ms-2">2</Badge>
              </>
            } />
            <Tab eventKey="rejected" title={
              <>
                <XCircle className="me-1" /> Rejected
              </>
            } />
          </Tabs>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Researcher</th>
                  <th>Department</th>
                  <th>Supervisor</th>
                  <th>Funding Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id}>
                    <td>
                      <div className="fw-semibold">{proposal.title}</div>
                      <small className="text-muted">
                        Submitted: {new Date(proposal.submissionDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td>{proposal.researcher}</td>
                    <td>{proposal.department}</td>
                    <td>{proposal.supervisor}</td>
                    <td>${proposal.fundingRequested.toLocaleString()}</td>
                    <td>
                      <Badge bg={getStatusVariant(proposal.status)} className="text-uppercase">
                        {proposal.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewDetails(proposal)}
                        >
                          <FileText className="me-1" /> Review
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleStatusChange(proposal.id, 'approved')}
                          disabled={proposal.status === 'approved'}
                        >
                          <CheckCircle className="me-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleStatusChange(proposal.id, 'rejected')}
                          disabled={proposal.status === 'rejected'}
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

      {/* Proposal Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Proposal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProposal && (
            <div className="row">
              <div className="col-md-8">
                <h4>{selectedProposal.title}</h4>
                <p className="text-muted">{selectedProposal.summary}</p>
                
                <h5 className="mt-4">Project Details</h5>
                <Table bordered className="mb-4">
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Researcher</th>
                      <td>{selectedProposal.researcher}</td>
                    </tr>
                    <tr>
                      <th>Department</th>
                      <td>{selectedProposal.department}</td>
                    </tr>
                    <tr>
                      <th>Supervisor</th>
                      <td>{selectedProposal.supervisor}</td>
                    </tr>
                    <tr>
                      <th>Funding Requested</th>
                      <td>${selectedProposal.fundingRequested.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th>Duration</th>
                      <td>{selectedProposal.duration}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        <Badge bg={getStatusVariant(selectedProposal.status)} className="text-uppercase">
                          {selectedProposal.status}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <h5>Documents</h5>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {selectedProposal.documents.map((doc, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline-primary" 
                      size="sm"
                      className="d-flex align-items-center"
                    >
                      <Download className="me-2" />
                      {doc}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="col-md-4">
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Review & Decision</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Decision</Form.Label>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-success" 
                          className="text-start mb-2"
                          onClick={() => handleStatusChange(selectedProposal.id, 'approved')}
                        >
                          <CheckCircle className="me-2" /> Approve Proposal
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          className="text-start mb-3"
                          onClick={() => handleStatusChange(selectedProposal.id, 'rejected')}
                        >
                          <XCircle className="me-2" /> Reject Proposal
                        </Button>
                      </div>
                    </Form.Group>
                    
                    <Form.Group>
                      <Form.Label>Feedback / Comments</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide detailed feedback for the researcher..."
                      />
                      <Form.Text className="text-muted">
                        This feedback will be shared with the researcher.
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitReview}>
            Save Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResearchProposals;
