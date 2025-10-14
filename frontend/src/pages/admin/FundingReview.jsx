import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Modal, Spinner, Alert, ProgressBar, Tabs, Tab } from 'react-bootstrap';
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

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchFundingRequests = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
            justification: 'This funding will support the development of AI models for early disease detection using medical imaging, which has the potential to significantly improve patient outcomes and reduce healthcare costs.'
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

  const handleStatusChange = (id, status, recommendedAmount = null) => {
    setFundingRequests(fundingRequests.map(request => {
      if (request.id === id) {
        const updatedRequest = { ...request, status };
        if (recommendedAmount !== null) {
          updatedRequest.recommendedAmount = recommendedAmount;
        }
        return updatedRequest;
      }
      return request;
    }));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleApproveFunding = (id, recommendedAmount) => {
    handleStatusChange(id, 'approved', recommendedAmount);
    setShowDetails(false);
  };

  const handleRejectFunding = (id) => {
    handleStatusChange(id, 'rejected');
    setShowDetails(false);
  };

  const filteredRequests = fundingRequests.filter(request => {
    const matchesSearch = 
      request.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return request.status === activeTab && matchesSearch;
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
          <p className="text-muted mb-0">Review and manage research funding requests</p>
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
              <h4 className="mb-0">LKR {budgetAllocation.remaining.toLocaleString()}</h4>
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
              Allocated: LKR {budgetAllocation.allocated.toLocaleString()}
            </small>
            <small className="text-muted">
              Total Budget: LKR {budgetAllocation.totalBudget.toLocaleString()}
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
                <Badge bg="warning" className="ms-2">
                  {fundingRequests.filter(r => r.status === 'pending').length}
                </Badge>
              </>
            } />
            <Tab eventKey="approved" title={
              <>
                <CheckCircle className="me-1" /> Approved
                <Badge bg="success" className="ms-2">
                  {fundingRequests.filter(r => r.status === 'approved').length}
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
                  <th>Project Title</th>
                  <th>Researcher</th>
                  <th>Department</th>
                  <th>Requested Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="fw-semibold">{request.projectTitle}</div>
                        <small className="text-muted">
                          {new Date(request.submissionDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td>{request.researcher}</td>
                      <td>{request.department}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <span>LKR {request.requestedAmount.toLocaleString()}</span>
                          {request.status === 'approved' && (
                            <small className="text-success">
                              Approved: LKR {request.recommendedAmount?.toLocaleString()}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <FileText className="me-1" /> Review
                          </Button>
                          {request.status === 'pending' && (
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleApproveFunding(request.id, request.requestedAmount)}
                            >
                              <CheckCircle className="me-1" /> Approve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">No funding requests found matching your criteria</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Funding Request Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Funding Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <h4>{selectedRequest.projectTitle}</h4>
              <div className="row mb-4">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Researcher:</strong> {selectedRequest.researcher}</p>
                  <p className="mb-1"><strong>Supervisor:</strong> {selectedRequest.supervisor}</p>
                  <p className="mb-1"><strong>Department:</strong> {selectedRequest.department}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Requested Amount:</strong> LKR {selectedRequest.requestedAmount.toLocaleString()}</p>
                  <p className="mb-1"><strong>Submission Date:</strong> {new Date(selectedRequest.submissionDate).toLocaleDateString()}</p>
                  <p className="mb-0"><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                </div>
              </div>

              <h5>Budget Breakdown</h5>
              <div className="table-responsive mb-4">
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedRequest.budgetBreakdown || {}).map(([category, amount]) => (
                      <tr key={category}>
                        <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                        <td>LKR {amount.toLocaleString()}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                              <div 
                                className="progress-bar bg-primary" 
                                role="progressbar" 
                                style={{ width: `${(amount / selectedRequest.requestedAmount) * 100}%` }}
                                aria-valuenow={(amount / selectedRequest.requestedAmount) * 100}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span>{(amount / selectedRequest.requestedAmount * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="table-active">
                      <td><strong>Total</strong></td>
                      <td colSpan="2"><strong>LKR {selectedRequest.requestedAmount.toLocaleString()}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <h5>Justification</h5>
              <p className="mb-4">{selectedRequest.justification}</p>

              <h5>Attachments</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {selectedRequest.documents?.map((doc, index) => (
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

              {selectedRequest.status === 'pending' && (
                <div className="mb-3">
                  <h5>Funding Decision</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Recommended Amount</Form.Label>
                    <div className="input-group">
                      <span className="input-text">LKR</span>
                      <Form.Control
                        type="number"
                        min="0"
                        max={selectedRequest.requestedAmount}
                        defaultValue={selectedRequest.recommendedAmount || selectedRequest.requestedAmount}
                        id="recommendedAmount"
                      />
                    </div>
                    <Form.Text className="text-muted">
                      Adjust the amount if necessary (max: LKR {selectedRequest.requestedAmount.toLocaleString()})
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Comments (Optional)</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Add any comments or notes..." />
                  </Form.Group>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          {selectedRequest?.status === 'pending' && (
            <>
              <Button 
                variant="danger"
                onClick={() => handleRejectFunding(selectedRequest.id)}
              >
                <XCircle className="me-1" /> Reject
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  const recommendedAmount = document.getElementById('recommendedAmount').value;
                  handleApproveFunding(selectedRequest.id, parseFloat(recommendedAmount));
                }}
              >
                <CheckCircle className="me-1" /> Approve
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FundingReview;
