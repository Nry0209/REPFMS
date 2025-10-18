import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  Button, 
  Form, 
  InputGroup, 
  Spinner, 
  Alert, 
  Badge, 
  Modal,
  Row,
  Col,
  FormSelect,
  Card,
  Dropdown
} from 'react-bootstrap';
import { Clock, CheckCircle, XCircle, Download, ArrowClockwise } from 'react-bootstrap-icons';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import supervisorService from '../../api/supervisorService';
import SupervisorProfile from '../../components/SupervisorProfile';

const SupervisorApprovals = () => {
  const [supervisors, setSupervisors] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    title: '',
    affiliation: '',
    phone: '',
    status: 'pending',
    rejectionReason: ''
  });

  const handleView = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowProfileModal(true);
  };

  const handleEditClick = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setEditFormData({
      name: supervisor.name || '',
      email: supervisor.email || '',
      title: supervisor.title || '',
      affiliation: supervisor.affiliation || '',
      phone: supervisor.phone || '',
      status: supervisor.status || 'pending',
      rejectionReason: supervisor.rejectionReason || ''
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupervisor) return;

    // Set loading state
    setLoading(true);

    try {
          // Call the appropriate service method based on status
      let updatedSupervisor;
      
      if (editFormData.status === 'approved') {
        updatedSupervisor = await supervisorService.approveSupervisor(selectedSupervisor._id);
      } else if (editFormData.status === 'rejected') {
        if (!editFormData.rejectionReason?.trim()) {
          toast.error('Please provide a reason for rejection');
          setLoading(false);
          return;
        }
        updatedSupervisor = await supervisorService.rejectSupervisor(
          selectedSupervisor._id, 
          editFormData.rejectionReason
        );
      } else {
        // For pending status, use the update endpoint
        updatedSupervisor = await supervisorService.updateSupervisor(
          selectedSupervisor._id,
          { status: 'pending' }
        );
      }
      
      // Update the local state with the new data
      setSupervisors(prevSupervisors => 
        prevSupervisors.map(sup => 
          sup._id === selectedSupervisor._id 
            ? { 
                ...sup, 
                ...updatedSupervisor,
                // Ensure timestamps are properly set
                approvedAt: editFormData.status === 'approved' ? new Date() : sup.approvedAt,
                rejectedAt: editFormData.status === 'rejected' ? new Date() : sup.rejectedAt
              } 
            : sup
        )
      );
      
      toast.success(`Supervisor ${editFormData.status} successfully`);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating supervisor:', error);
      toast.error(error.response?.data?.message || 'Failed to update supervisor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supervisor? This action cannot be undone.')) {
      try {
        await supervisorService.deleteSupervisor(id);
        // Update the local state to remove the deleted supervisor
        setSupervisors(prevSupervisors => prevSupervisors.filter(sup => sup._id !== id));
        toast.success('Supervisor deleted successfully');
      } catch (error) {
        console.error('Error deleting supervisor:', error);
        toast.error(error.response?.data?.message || 'Failed to delete supervisor');
      }
    }
  };

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supervisorService.getAllSupervisors();
      // Make sure we're setting an array
      setSupervisors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching supervisors:', err);
      setError('Failed to load supervisors. Please try again.');
      setSupervisors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const handleRefresh = () => {
    fetchSupervisors();
  };

  const handleDownloadPDF = () => {
    // Create a new PDF document with proper autoTable initialization
    const doc = new jsPDF();
    
    // Add logo and title
    const logo = new Image();
    logo.src = '/emblem.png'; // Make sure this path is correct or use a direct URL
    
    // Wait for the image to load
    logo.onload = function() {
      // Add logo and header
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);
      
      // Add title and date
      doc.setFontSize(20);
      doc.setTextColor(40, 62, 80);
      doc.text('Supervisors Report', 45, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 45, 27);
      
      // Add a line
      doc.setDrawColor(200, 200, 200);
      doc.line(10, 40, 200, 40);
      
      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 62, 80);
      doc.text('Summary', 10, 50);
      
      // Add summary table
      autoTable(doc, {
        startY: 55,
        head: [['Status', 'Count']],
        body: [
          ['Pending', statusCounts.pending],
          ['Approved', statusCounts.approved],
          ['Rejected', statusCounts.rejected],
          ['Total', supervisors.length]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 55 }
      });
      
      // Add details section
      doc.setFontSize(14);
      doc.setTextColor(40, 62, 80);
      doc.text('Supervisor Details', 10, doc.lastAutoTable.finalY + 10);
      
      // Prepare data for the table
      const tableData = filteredSupervisors.map(supervisor => ({
        name: supervisor.name,
        email: supervisor.email,
        status: supervisor.status.charAt(0).toUpperCase() + supervisor.status.slice(1),
        title: supervisor.title || 'N/A',
        affiliation: supervisor.affiliation || 'N/A',
        date: new Date(supervisor.createdAt).toLocaleDateString()
      }));
      
      // Add details table
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Name', 'Email', 'Status', 'Title', 'Affiliation', 'Registered On']],
        body: tableData.map(item => [
          item.name,
          item.email,
          item.status,
          item.title,
          item.affiliation,
          item.date
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 10 },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          columnWidth: 'wrap'
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 45 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 35 },
          5: { cellWidth: 25 }
        }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Save the PDF
      doc.save(`supervisors-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };
  };

  const filteredSupervisors = supervisors 
    ? supervisors.filter(supervisor => {
        if (!supervisor) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          (supervisor.name?.toLowerCase().includes(searchLower) || false) ||
          (supervisor.email?.toLowerCase().includes(searchLower) || false) ||
          (supervisor.department?.toLowerCase().includes(searchLower) || false);

        const matchesStatus = statusFilter === 'all' || supervisor.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : []; // Return empty array if supervisors is null

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge bg="warning" text="dark">Pending</Badge>;
    }
  };

  const handleApprove = async (id) => {
    try {
      await supervisorService.approveSupervisor(id);
      await fetchSupervisors();
    } catch (err) {
      console.error('Error approving supervisor:', err);
      setError('Failed to approve supervisor. Please try again.');
    }
  };

  const handleStatusChange = async (id, status, reason = '') => {
    try {
      const updateData = { status };
      
      if (status === 'approved') {
        updateData.approvedAt = new Date();
        updateData.rejectedAt = undefined;
        updateData.rejectionReason = undefined;
      } else if (status === 'rejected') {
        updateData.rejectedAt = new Date();
        updateData.approvedAt = undefined;
        if (!reason) {
          setSelectedSupervisor({ _id: id });
          setShowRejectModal(true);
          return;
        }
        updateData.rejectionReason = reason;
      } else if (status === 'pending') {
        updateData.rejectedAt = undefined;
        updateData.approvedAt = undefined;
        updateData.rejectionReason = undefined;
      }

      await supervisorService.updateSupervisor(id, updateData);
      
      setSupervisors(prevSupervisors => 
        prevSupervisors.map(sup => 
          sup._id === id ? { ...sup, ...updateData } : sup
        )
      );
      
      toast.success(`Supervisor ${status} successfully`);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      setLoading(true);
      const updatedSupervisor = await supervisorService.rejectSupervisor(
        selectedSupervisor._id,
        rejectionReason
      );
      
      // Update local state
      setSupervisors(prevSupervisors => 
        prevSupervisors.map(sup => 
          sup._id === selectedSupervisor._id 
            ? { 
                ...sup, 
                status: 'rejected',
                rejectedAt: new Date(),
                rejectionReason: rejectionReason,
                approvedAt: undefined
              } 
            : sup
        )
      );
      
      toast.success('Supervisor rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting supervisor:', error);
      toast.error(error.response?.data?.message || 'Failed to reject supervisor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  // Calculate counts for each status
  const statusCounts = supervisors.reduce(
    (acc, supervisor) => {
      acc[supervisor.status] = (acc[supervisor.status] || 0) + 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  return (
    <div className="container-fluid py-4">
      <Container className="py-4">
        {/* Status Cards */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-start border-5 border-warning h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase text-muted mb-0">Pending</h6>
                    <h2 className="mt-2 mb-0">{statusCounts.pending}</h2>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <Clock className="text-warning" size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-start border-5 border-success h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase text-muted mb-0">Approved</h6>
                    <h2 className="mt-2 mb-0">{statusCounts.approved}</h2>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <CheckCircle className="text-success" size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-start border-5 border-danger h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase text-muted mb-0">Rejected</h6>
                    <h2 className="mt-2 mb-0">{statusCounts.rejected}</h2>
                  </div>
                  <div className="bg-danger bg-opacity-10 p-3 rounded">
                    <XCircle className="text-danger" size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Card className="mb-4">
          <Card.Body>
            <Row className="mb-3 align-items-center">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <FormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </FormSelect>
              </Col>
              <Col md={4} className="text-end">
                <Button 
                  variant="outline-primary" 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="me-2"
                  title="Refresh data"
                >
                  <ArrowClockwise className={`me-1 ${loading ? 'spin' : ''}`} /> Refresh
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={handleDownloadPDF}
                  disabled={loading || supervisors.length === 0}
                  title="Download Report"
                >
                  <Download className="me-1" /> Download Report
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {filteredSupervisors.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Affiliation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor._id}>
                    <td>
                      <div className="fw-medium">{supervisor.name}</div>
                      <div className="text-muted small">{supervisor.phone || 'N/A'}</div>
                    </td>
                    <td>{supervisor.email}</td>
                    <td>{supervisor.title || '-'}</td>
                    <td>{supervisor.affiliation || '-'}</td>
                    <td>
                      <span className={`badge ${
                        (supervisor.status || 'pending').toLowerCase() === 'approved' ? 'bg-success' :
                        (supervisor.status || 'pending').toLowerCase() === 'rejected' ? 'bg-danger' : 'bg-warning'
                      } text-white`}>
                        {(supervisor.status || 'pending').charAt(0).toUpperCase() + (supervisor.status || 'pending').slice(1)}
                      </span>
                      
                      {supervisor.status === 'rejected' && supervisor.rejectionReason && (
                        <div className="small text-danger mt-1">
                          <strong>Reason:</strong> {supervisor.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleView(supervisor)}
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleEditClick(supervisor)}
                          title="Edit"
                          className="me-1"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(supervisor._id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                        {supervisor.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleApprove(supervisor._id)}
                              title="Approve"
                            >
                              <i className="bi bi-check-lg"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                setSelectedSupervisor(supervisor);
                                setShowRejectModal(true);
                              }}
                              title="Reject"
                            >
                              <i className="bi bi-x-lg"></i>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-people display-4 text-muted mb-3"></i>
              <h5>No supervisors found</h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all' ? 
                  'Try adjusting your search or filter criteria' : 
                  'There are no supervisors to display'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5 mb-0">
            <i className="bi bi-x-circle text-danger me-2"></i>
            Reject Supervisor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSupervisor && (
            <div className="mb-3">
              <p className="mb-1">Supervisor: <strong>{selectedSupervisor.name}</strong></p>
              <p className="text-muted small mb-0">{selectedSupervisor.email}</p>
            </div>
          )}
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium">Reason for rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a detailed reason for rejection..."
              className="focus-ring"
              autoFocus
            />
            <Form.Text className="text-muted">
              This will be visible to the supervisor.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setShowRejectModal(false);
              setRejectionReason('');
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => {
              handleReject();
              setShowRejectModal(false);
            }}
            disabled={!rejectionReason.trim()}
            className="d-flex align-items-center"
          >
            <i className="bi bi-x-circle me-1"></i>
            Confirm Rejection
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Supervisor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Supervisor</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="affiliation" className="form-label">Affiliation</label>
              <input
                type="text"
                className="form-control"
                id="affiliation"
                name="affiliation"
                value={editFormData.affiliation}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={editFormData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {editFormData.status === 'rejected' && (
              <div className="mb-3">
                <label htmlFor="rejectionReason" className="form-label">Rejection Reason</label>
                <textarea
                  className="form-control"
                  id="rejectionReason"
                  name="rejectionReason"
                  rows="3"
                  value={editFormData.rejectionReason || ''}
                  onChange={handleInputChange}
                  placeholder="Please provide a reason for rejection"
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Supervisor Profile Modal */}
      <SupervisorProfile 
        supervisor={selectedSupervisor}
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
      />
    </div>
  );
};

// Add some global styles for the component
const styles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  .table th {
    white-space: nowrap;
    vertical-align: middle;
  }
  .table td {
    vertical-align: middle;
  }
  .focus-ring:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  }
  
  /* Spin animation for refresh icon */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spin {
    animation: spin 1s linear infinite;
    display: inline-block;
  }
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default SupervisorApprovals;
