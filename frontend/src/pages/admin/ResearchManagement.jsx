import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Badge, Button, Form, Modal, Container } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { 
  getResearches, 
  getAvailableSupervisors, 
  assignSupervisor,
  updateSupervisorStatus,
  deleteResearch,
  generateReport 
} from '../../api/researchService';
import { toast } from 'react-toastify';

const ResearchManagement = () => {
  const navigate = useNavigate();
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [viewingResearch, setViewingResearch] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingReport, setDownloadingReport] = useState(false);
  
  // Filter researches based on search term
  const filteredResearches = researches.filter(research => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      research.title?.toLowerCase().includes(searchLower) ||
      research.researcher?.fullName?.toLowerCase().includes(searchLower) ||
      research.supervisor?.name?.toLowerCase().includes(searchLower) ||
      research.domains?.some(domain => domain.toLowerCase().includes(searchLower))
    );
  });

  // Handle report download as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add logo and title
    const logo = new Image();
    logo.src = '/emblem.png';
    
    // Wait for the image to load
    logo.onload = function() {
      // Add logo and header
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);
      
      // Add title and date
      doc.setFontSize(20);
      doc.setTextColor(40, 62, 80);
      doc.text('Research Projects Report', 45, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 45, 27);
      
      // Add a line
      doc.setDrawColor(200, 200, 200);
      doc.line(10, 40, 200, 40);
      
      // Add summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 62, 80);
      doc.text('Research Projects Summary', 10, 50);
      
      // Add summary table
      const total = filteredResearches.length;
      const approved = filteredResearches.filter(r => r.supervisorStatus === 'accepted').length;
      const rejected = filteredResearches.filter(r => r.supervisorStatus === 'rejected').length;
      const pending = filteredResearches.filter(r => !r.supervisorStatus || r.supervisorStatus === 'pending').length;
      
      autoTable(doc, {
        startY: 60,
        head: [['Status', 'Count']],
        body: [
          ['Total Projects', total],
          ['Approved', approved],
          ['Pending', pending],
          ['Rejected', rejected],
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { top: 10 }
      });
      
      // Add detailed projects table
      doc.setFontSize(14);
      doc.setTextColor(40, 62, 80);
      doc.text('Research Projects', 10, doc.lastAutoTable.finalY + 15);
      
      // Prepare data for the table
      const tableData = filteredResearches.map((research, index) => [
        `RE-${String(index + 1).padStart(5, '0')}`,
        research.title,
        research.researcher?.fullName || 'N/A',
        research.supervisor?.name || 'Not Assigned',
        research.supervisorStatus || 'pending',
        research.domains?.join(', ') || 'N/A'
      ]);
      
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [
          ['ID', 'Title', 'Researcher', 'Supervisor', 'Status', 'Domains']
        ],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 40 }
        },
        margin: { top: 10 },
        didDrawPage: function(data) {
          // Footer
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(
            `Page ${data.pageCount}`, 
            data.settings.margin.left, 
            pageHeight - 10
          );
        }
      });
      
      // Save the PDF
      doc.save(`research-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };
  };

  const fetchResearches = async () => {
    try {
      setLoading(true);
      const data = await getResearches();
      setResearches(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching researches:', err);
      setError('Failed to load research data');
      toast.error('Failed to load research data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearches();
  }, []);

  const handleView = async (research) => {
    try {
      // If you want to fetch fresh data for the research
      // const response = await getResearchById(research._id);
      // setViewingResearch(response);
      setViewingResearch(research);
    } catch (error) {
      console.error('Error fetching research details:', error);
      toast.error('Failed to load research details');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/research/${id}/edit`);
  };

  const handleDeleteClick = (id) => {
    setSelectedResearch(id);
    setShowDeleteConfirm(true);
  };

  const handleAssignClick = async (research) => {
    setSelectedResearch(research);
    try {
      const data = await getAvailableSupervisors();
      setSupervisors(data);
      setSelectedSupervisor(research.supervisor?._id || '');
      setShowAssignModal(true);
    } catch (error) {
      console.error('Error loading supervisors:', error);
      toast.error('Failed to load supervisors');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResearch) return;

    setAssigning(true);
    try {
      const { research } = await assignSupervisor(
        selectedResearch._id,
        selectedSupervisor || null
      );
      
      // Update the research in the list
      setResearches(researches.map(r => 
        r._id === research._id ? { ...r, supervisor: research.supervisor } : r
      ));
      
      toast.success('Supervisor assigned successfully');
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      toast.error(error.message || 'Failed to assign supervisor');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (researchId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this supervisor?`)) return;
    
    setUpdatingStatus(prev => ({ ...prev, [researchId]: true }));
    try {
      const { research } = await updateSupervisorStatus(researchId, status);
      
      // Update local state with the updated research
      setResearches(researches.map(r => 
        r._id === research._id ? research : r
      ));
      
      toast.success(`Supervisor ${status} successfully`);
    } catch (error) {
      console.error('Error updating supervisor status:', error);
      toast.error(error.message || 'Failed to update supervisor status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [researchId]: false }));
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteResearch(selectedResearch);
      setResearches(researches.filter(r => r._id !== selectedResearch));
      setShowDeleteConfirm(false);
      setSelectedResearch(null);
      toast.success('Research deleted successfully');
    } catch (error) {
      console.error('Error deleting research:', error);
      toast.error(error.response?.data?.message || 'Failed to delete research');
      setSelectedResearch(null);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        const data = await getResearches();
        setResearches(data);
      } catch (err) {
        console.error('Error fetching researches:', err);
        setError('Failed to load researches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Current': 'primary',
      'Finished': 'success'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getSupervisorName = (supervisor) => {
    if (!supervisor) return 'Not Assigned';
    return `${supervisor.name}${supervisor.title ? ` (${supervisor.title})` : ''}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Assign Supervisor Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Supervisor</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAssignSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Supervisor</Form.Label>
              <Form.Select 
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)}
                required
              >
                <option value="">-- Select Supervisor --</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor._id} value={supervisor._id}>
                    {supervisor.name} {supervisor.title ? `(${supervisor.title})` : ''}
                    {supervisor.domains?.length > 0 && ` - ${supervisor.domains.join(', ')}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowAssignModal(false)}
                disabled={assigning}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={assigning}
              >
                {assigning ? 'Assigning...' : 'Assign Supervisor'}
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this research? This action cannot be undone.</p>
          <p className="text-danger">This will permanently remove all research data including any associated files and records.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {deleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Deleting...
              </>
            ) : (
              'Delete Permanently'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Research Modal */}
      <Modal 
        show={!!viewingResearch} 
        onHide={() => setViewingResearch(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Research Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingResearch && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <h5>Research Information</h5>
                <p className="mb-1"><strong>Title:</strong> {viewingResearch.title}</p>
                <p className="mb-1"><strong>Status:</strong> 
                  <Badge 
                    bg={
                      viewingResearch.supervisorStatus === 'accepted' ? 'success' : 
                      viewingResearch.supervisorStatus === 'rejected' ? 'danger' : 'secondary'
                    }
                    className="text-capitalize ms-2"
                  >
                    {viewingResearch.supervisorStatus || 'pending'}
                  </Badge>
                </p>
                <p className="mb-1"><strong>Domains:</strong> {viewingResearch.domains?.join(', ')}</p>
                <p className="mb-1"><strong>Description:</strong></p>
                <p className="text-muted">{viewingResearch.description}</p>
              </div>
              <div className="col-md-6">
                <h5>People</h5>
                <div className="mb-3">
                  <p className="mb-1"><strong>Researcher:</strong></p>
                  {viewingResearch.researcher ? (
                    <div className="ps-3">
                      <p className="mb-0">{viewingResearch.researcher.fullName}</p>
                      <small className="text-muted">{viewingResearch.researcher.email}</small>
                    </div>
                  ) : (
                    <p className="text-muted ps-3">Not assigned</p>
                  )}
                </div>
                <div>
                  <p className="mb-1"><strong>Supervisor:</strong></p>
                  {viewingResearch.supervisor ? (
                    <div className="ps-3">
                      <p className="mb-0">{viewingResearch.supervisor.name}</p>
                      <small className="text-muted">{viewingResearch.supervisor.email}</small>
                    </div>
                  ) : (
                    <p className="text-muted ps-3">Not assigned</p>
                  )}
                </div>
                
                {viewingResearch.supervisorStatus && (
                  <div className="mt-3">
                    <h5>Approval Details</h5>
                    <p className="mb-1">
                      <strong>Status:</strong> 
                      <Badge 
                        bg={
                          viewingResearch.supervisorStatus === 'accepted' ? 'success' : 'danger'
                        }
                        className="text-capitalize ms-2"
                      >
                        {viewingResearch.supervisorStatus}
                      </Badge>
                    </p>
                    {viewingResearch.comments && (
                      <p className="mb-0">
                        <strong>Comments:</strong> {viewingResearch.comments}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewingResearch(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">Research Management</h4>
              <p className="text-muted mb-0">View and manage research projects</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="input-group input-group-sm" style={{ width: '250px' }}>
                <span className="input-group-text" id="search-addon">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search researches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
              </div>
              
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleDownloadPDF}
                disabled={researches.length === 0}
                title="Download PDF Report"
              >
                <i className="bi bi-file-earmark-pdf me-1"></i> Download PDF
              </button>
              
              <button 
                className="btn btn-outline-secondary btn-sm" 
                onClick={fetchResearches}
                disabled={loading}
                title="Refresh Data"
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Research ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Supervisor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResearches.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      {searchTerm ? 'No matching researches found' : 'No research projects available'}
                    </td>
                  </tr>
                ) : (
                  filteredResearches.map((research, index) => (
                    <tr key={research._id}>
                      <td>RE-{String(index + 1).padStart(5, '0')}</td>
                      <td>{research.title}</td>
                      <td>
                        <Badge 
                          bg={
                            research.supervisorStatus === 'accepted' ? 'success' : 
                            research.supervisorStatus === 'rejected' ? 'danger' : 'secondary'
                          }
                          className="text-capitalize"
                        >
                          {research.supervisorStatus || 'pending'}
                        </Badge>
                      </td>
                      <td>
                        {research.supervisor ? (
                          <div>
                            <div>{research.supervisor.name}</div>
                            <small className="text-muted">{research.supervisor.email}</small>
                          </div>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleView(research)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          
                          {!['accepted', 'rejected'].includes(research.supervisorStatus) ? (
                            <>
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleAssignClick(research)}
                                title="Assign Supervisor"
                              >
                                <i className="bi bi-person-plus"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleStatusUpdate(research._id, 'accepted')}
                                disabled={updatingStatus[research._id]}
                                title="Accept Research"
                              >
                                {updatingStatus[research._id] ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                  <i className="bi bi-check-lg"></i>
                                )}
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleStatusUpdate(research._id, 'rejected')}
                                disabled={updatingStatus[research._id]}
                                title="Reject Research"
                              >
                                {updatingStatus[research._id] ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                  <i className="bi bi-x-lg"></i>
                                )}
                              </button>
                            </>
                          ) : (
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(research._id)}
                              title="Delete Research"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResearchManagement;
