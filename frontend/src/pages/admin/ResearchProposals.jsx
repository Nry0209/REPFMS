import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Modal, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { Search, Filter, FileText, CheckCircle, XCircle, Clock, Download, Eye } from 'react-bootstrap-icons';

const ResearchProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [feedback, setFeedback] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
            summary: 'This research aims to develop AI models for early detection of chronic diseases using medical imaging.',
            objectives: [
              'Develop deep learning models for disease detection',
              'Improve accuracy of early diagnosis',
              'Create a scalable solution for healthcare providers'
            ],
            budgetBreakdown: {
              personnel: 8000,
              equipment: 3000,
              materials: 2000,
              travel: 1000,
              other: 1000
            }
          },
          // Add more mock data
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
    setProposals(proposals.map(proposal => 
      proposal.id === id ? { ...proposal, status } : proposal
    ));
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetails(true);
  };

  const handleSubmitReview = () => {
    if (!feedback.trim()) return;
    
    // Update the proposal with feedback
    setProposals(proposals.map(proposal => 
      proposal.id === selectedProposal.id 
        ? { 
            ...proposal, 
            status: 'revision',
            feedback 
          } 
        : proposal
    ));
    
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'revision':
        return <Badge bg="info">Needs Revision</Badge>;
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
          <h2 className="mb-0">Research Proposals</h2>
          <p className="text-muted mb-0">Review and manage research proposals</p>
        </div>
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
                <Badge bg="warning" className="ms-2">
                  {proposals.filter(p => p.status === 'pending').length}
                </Badge>
              </>
            } />
            <Tab eventKey="approved" title={
              <>
                <CheckCircle className="me-1" /> Approved
                <Badge bg="success" className="ms-2">
                  {proposals.filter(p => p.status === 'approved').length}
                </Badge>
              </>
            } />
            <Tab eventKey="revision" title={
              <>
                <FileText className="me-1" /> Needs Revision
                <Badge bg="info" className="ms-2">
                  {proposals.filter(p => p.status === 'revision').length}
                </Badge>
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
                  <th>Funding Requested</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td>
                        <div className="fw-semibold">{proposal.title}</div>
                        <small className="text-muted">
                          Submitted: {new Date(proposal.submissionDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td>{proposal.researcher}</td>
                      <td>{proposal.department}</td>
                      <td>LKR {proposal.fundingRequested.toLocaleString()}</td>
                      <td>{getStatusBadge(proposal.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewDetails(proposal)}
                          >
                            <Eye className="me-1" /> View
                          </Button>
                          {proposal.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => handleStatusChange(proposal.id, 'approved')}
                              >
                                <CheckCircle className="me-1" /> Approve
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleStatusChange(proposal.id, 'rejected')}
                              >
                                <XCircle className="me-1" /> Reject
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
                      <div className="text-muted">No proposals found matching your criteria</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Proposal Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Proposal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProposal && (
            <div>
              <h4>{selectedProposal.title}</h4>
              <div className="mb-4">
                <p className="mb-1"><strong>Researcher:</strong> {selectedProposal.researcher}</p>
                <p className="mb-1"><strong>Department:</strong> {selectedProposal.department}</p>
                <p className="mb-1"><strong>Supervisor:</strong> {selectedProposal.supervisor}</p>
                <p className="mb-1"><strong>Funding Requested:</strong> LKR {selectedProposal.fundingRequested.toLocaleString()}</p>
                <p className="mb-1"><strong>Duration:</strong> {selectedProposal.duration}</p>
                <p className="mb-0"><strong>Status:</strong> {getStatusBadge(selectedProposal.status)}</p>
              </div>

              <h5>Project Summary</h5>
              <p className="mb-4">{selectedProposal.summary}</p>

              <h5>Research Objectives</h5>
              <ul className="mb-4">
                {selectedProposal.objectives?.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>

              <h5>Budget Breakdown</h5>
              <Table striped bordered className="mb-4">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedProposal.budgetBreakdown || {}).map(([category, amount]) => (
                    <tr key={category}>
                      <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                      <td>LKR {amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="table-active">
                    <td><strong>Total</strong></td>
                    <td><strong>LKR {selectedProposal.fundingRequested.toLocaleString()}</strong></td>
                  </tr>
                </tbody>
              </Table>

              <h5>Attachments</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {selectedProposal.documents?.map((doc, index) => (
                  <Button 
                    key={index} 
                    variant="outline-primary" 
                    size="sm"
                    className="d-flex align-items-center"
                  >
                    <FileText className="me-1" />
                    {doc}
                  </Button>
                ))}
              </div>

              {selectedProposal.status === 'pending' && (
                <Form.Group className="mb-3">
                  <Form.Label>Feedback / Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Provide feedback or request revisions..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </Form.Group>
              )}

              {selectedProposal.feedback && (
                <Alert variant="info">
                  <strong>Previous Feedback:</strong> {selectedProposal.feedback}
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          {selectedProposal?.status === 'pending' && (
            <>
              <Button 
                variant="success"
                onClick={() => {
                  handleStatusChange(selectedProposal.id, 'approved');
                  setShowDetails(false);
                }}
              >
                <CheckCircle className="me-1" /> Approve
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  handleStatusChange(selectedProposal.id, 'rejected');
                  setShowDetails(false);
                }}
              >
                <XCircle className="me-1" /> Reject
              </Button>
              <Button 
                variant="primary"
                onClick={handleSubmitReview}
                disabled={!feedback.trim()}
              >
                Request Revisions
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResearchProposals;
