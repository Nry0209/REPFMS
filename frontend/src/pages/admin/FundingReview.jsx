import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Spinner, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { Search, Filter, CheckCircle, XCircle, Clock, CurrencyDollar, Download, FileText } from 'react-bootstrap-icons';

const FundingReview = () => {
  const [fundingRequests, setFundingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [budgetAllocation, setBudgetAllocation] = useState({
    totalBudget: 1000000,
    allocated: 650000,
    remaining: 350000
  });

  useEffect(() => {
    // Simulate API call
    const fetchFundingRequests = async () => {
      try {
        // Replace with actual API call
        const mockData = [
          {
            id: 1,
            projectTitle: 'AI in Healthcare: Early Disease Detection',
            researcher: 'Dr. Emily Chen',
            supervisor: 'Dr. Robert Johnson',
            department: 'Computer Science',
            requestedAmount: 25000,
            recommendedAmount: 20000,
            status: 'pending',
            submissionDate: '2023-10-10',
            documents: ['budget_proposal.pdf', 'cost_breakdown.xlsx'],
            budgetBreakdown: {
              personnel: 12000,
              equipment: 5000,
              materials: 2000,
              travel: 3000,
              other: 3000
            },
            justification: 'This funding will support the development of AI models for early disease detection...'
          },
          // Add more mock data as needed
        ];
        setFundingRequests(mockData);
      } catch (error) {
        console.error('Error fetching funding requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundingRequests();
  }, []);

  const handleStatusChange = (id, status) => {
    // Handle status change logic
    console.log(`Changed status of funding request ${id} to ${status}`);
    // Update UI or make API call
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleApproveFunding = () => {
    // Handle funding approval logic
    console.log('Funding approved for:', selectedRequest.id);
    setShowDetails(false);
  };

  const handleRejectFunding = () => {
    // Handle funding rejection logic
    console.log('Funding rejected for:', selectedRequest.id);
    setShowDetails(false);
  };

  const handleRecommendAmount = (id, amount) => {
    // Handle recommended amount update
    console.log(`Recommended amount for ${id} updated to ${amount}`);
  };

  const filteredRequests = fundingRequests.filter(request => {
    const matchesSearch = 
      request.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return request.status === activeTab && matchesSearch;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      case 'under_review':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const allocationPercentage = (budgetAllocation.allocated / budgetAllocation.totalBudget) * 100;

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
          <h2 className="mb-0">Funding Review</h2>
          <p className="text-muted mb-0">Manage and review research funding requests</p>
        </div>
        <div className="d-flex">
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white">
              <Search />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search funding requests..."
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

      {/* Budget Allocation Summary */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Budget Allocation</h5>
            <div className="text-end">
              <h4 className="mb-0">${budgetAllocation.remaining.toLocaleString()}</h4>
              <small className="text-muted">Remaining Budget</small>
            </div>
          </div>
          <ProgressBar 
            now={allocationPercentage} 
            variant={allocationPercentage > 80 ? 'danger' : 'success'}
            label={`${allocationPercentage.toFixed(1)}%`} 
            className="mb-2" 
            style={{ height: '24px', borderRadius: '4px' }}
          />
          <div className="d-flex justify-content-between">
            <small className="text-muted">
              Allocated: ${budgetAllocation.allocated.toLocaleString()}
            </small>
            <small className="text-muted">
              Total Budget: ${budgetAllocation.totalBudget.toLocaleString()}
            </small>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3 px-3 pt-2"
          >
            <Tab eventKey="all" title="All Requests" />
            <Tab eventKey="pending" title={
              <>
                <Clock className="me-1" /> Pending
                <Badge bg="warning" className="ms-2">8</Badge>
              </>
            } />
            <Tab eventKey="approved" title={
              <>
                <CheckCircle className="me-1" /> Approved
                <Badge bg="success" className="ms-2">12</Badge>
              </>
            } />
            <Tab eventKey="rejected" title={
              <>
                <XCircle className="me-1" /> Rejected
                <Badge bg="danger" className="ms-2">3</Badge>
              </>
            } />
          </Tabs>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Researcher</th>
                  <th>Supervisor</th>
                  <th>Requested Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="fw-semibold">{request.projectTitle}</div>
                      <small className="text-muted">
                        {request.department}
                      </small>
                    </td>
                    <td>{request.researcher}</td>
                    <td>{request.supervisor}</td>
                    <td>
                      <div className="fw-semibold">${request.requestedAmount.toLocaleString()}</div>
                      {request.recommendedAmount && (
                        <small className="text-success">
                          Recommended: ${request.recommendedAmount.toLocaleString()}
                        </small>
                      )}
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(request.status)} className="text-uppercase">
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <FileText className="me-1" /> Review
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'approved')}
                          disabled={request.status === 'approved'}
                        >
                          <CheckCircle className="me-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          disabled={request.status === 'rejected'}
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

      {/* Funding Request Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Funding Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div className="row">
              <div className="col-md-8">
                <h4>{selectedRequest.projectTitle}</h4>
                <div className="d-flex align-items-center mb-4">
                  <Badge bg={getStatusVariant(selectedRequest.status)} className="me-2 text-uppercase">
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                  <small className="text-muted">
                    Submitted: {new Date(selectedRequest.submissionDate).toLocaleDateString()}
                  </small>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                        <div className="mb-3">
                          <h6>Researcher</h6>
                          <p className="mb-0">{selectedRequest.researcher}</p>
                        </div>
                        <div className="mb-3">
                          <h6>Supervisor</h6>
                          <p className="mb-0">{selectedRequest.supervisor}</p>
                        </div>
                        <div className="mb-3">
                          <h6>Department</h6>
                          <p className="mb-0">{selectedRequest.department}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <h6>Budget Summary</h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Requested Amount:</span>
                              <strong>${selectedRequest.requestedAmount.toLocaleString()}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Recommended Amount:</span>
                              <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                <span className="input-group-text">$</span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  value={selectedRequest.recommendedAmount || ''}
                                  onChange={(e) => handleRecommendAmount(selectedRequest.id, e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-top">
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="w-100"
                                onClick={handleApproveFunding}
                              >
                                <CheckCircle className="me-2" /> Approve Funding
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="w-100 mt-2"
                                onClick={handleRejectFunding}
                              >
                                <XCircle className="me-2" /> Reject Request
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5>Budget Breakdown</h5>
                    <Table bordered className="mb-4">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedRequest.budgetBreakdown).map(([category, amount]) => (
                          <tr key={category}>
                            <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                            <td>${amount.toLocaleString()}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-2" style={{ width: '100px' }}>
                                  <ProgressBar 
                                    now={(amount / selectedRequest.requestedAmount) * 100} 
                                    variant="primary" 
                                    style={{ height: '8px' }} 
                                  />
                                </div>
                                <span>{(amount / selectedRequest.requestedAmount * 100).toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <h5>Justification</h5>
                    <Card className="mb-4">
                      <Card.Body>
                        <p className="mb-0">{selectedRequest.justification}</p>
                      </Card.Body>
                    </Card>

                    <h5>Supporting Documents</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedRequest.documents.map((doc, idx) => (
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
                    <Card className="shadow-sm mb-3">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Review Notes</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Internal Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={8}
                            placeholder="Add private notes about this funding request..."
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Funding History</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="timeline">
                          <div className="timeline-item">
                            <div className="timeline-marker bg-primary"></div>
                            <div className="timeline-content">
                              <p className="mb-0 fw-semibold">Request Submitted</p>
                              <small className="text-muted">
                                {new Date(selectedRequest.submissionDate).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                          {/* Add more timeline items as needed */}
                        </div>
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
              <Button variant="primary" onClick={handleApproveFunding}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    };
    
    export default FundingReview;
