import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Spinner, Badge, Button, Modal } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  getResearches, 
  deleteResearch
} from '../../api/researchService';
import { toast } from 'react-toastify';

const ResearchManagement = () => {
  // const navigate = useNavigate();
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [viewingResearch, setViewingResearch] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [downloadingReport, setDownloadingReport] = useState(false);
  const [verifying, setVerifying] = useState({}); // { [supervisionId]: true }
  const [rejecting, setRejecting] = useState({}); // { [supervisionId]: true }
  
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

  // Ministry actions from Admin dashboard: approve (verify domains) / reject
  const handleApprove = async (research) => {
    const supRef = research?.supervisionRef?._id;
    if (!supRef) {
      toast.warn('No supervision request linked to this research');
      return;
    }
    try {
      setVerifying((m) => ({ ...m, [supRef]: true }));
      const res = await fetch(`http://localhost:5000/api/ministry/supervisions/${supRef}/verify-domain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Approval failed');
      toast.success('Approved. Supervisor notified.');
      // Refresh list to reflect Accepted status and supervisor shown
      const updated = await getResearches();
      setResearches(updated);
    } catch (err) {
      console.error('Approve error:', err);
      toast.error(err.message || 'Failed to approve');
    } finally {
      setVerifying((m) => ({ ...m, [supRef]: false }));
    }
  };

  const handleReject = async (research) => {
    const supRef = research?.supervisionRef?._id;
    if (!supRef) {
      toast.warn('No supervision request linked to this research');
      return;
    }
    const reason = window.prompt('Enter rejection reason (optional):', 'Domain mismatch');
    try {
      setRejecting((m) => ({ ...m, [supRef]: true }));
      const res = await fetch(`http://localhost:5000/api/ministry/supervisions/${supRef}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason || 'Rejected by ministry' }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Rejection failed');
      toast.success('Rejected. Researcher notified.');
      // Refresh list to reflect Rejected badge
      const updated = await getResearches();
      setResearches(updated);
    } catch (err) {
      console.error('Reject error:', err);
      toast.error(err.message || 'Failed to reject');
    } finally {
      setRejecting((m) => ({ ...m, [supRef]: false }));
    }
  };


  const fetchResearches = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchResearches();
  }, [fetchResearches]);

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

  // const handleEdit = (id) => {
  //   navigate(`/admin/research/${id}/edit`);
  // };

  const handleDeleteClick = (id) => {
    setSelectedResearch(id);
    setShowDeleteConfirm(true);
  };

  // Removed admin assignment and status update functions to align with researcher-chosen supervisor flow

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

  // Removed duplicate useEffect; using the single fetchResearches effect above

  // Helpers inlined in JSX; removed unused badge/name helpers

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
      {/* Admin no longer assigns supervisors; ministry only verifies domain and supervisors decide */}

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
                          
                          {/* Ministry approve/reject supervision for researcher-selected supervisor */}
                          <button
                            className="btn btn-sm btn-success"
                            title="Approve (verify domain)"
                            disabled={!research?.supervisionRef?._id || verifying[research?.supervisionRef?._id]}
                            onClick={() => handleApprove(research)}
                          >
                            {verifying[research?.supervisionRef?._id] ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <i className="bi bi-check-lg"></i>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            title="Reject"
                            disabled={!research?.supervisionRef?._id || rejecting[research?.supervisionRef?._id]}
                            onClick={() => handleReject(research)}
                          >
                            {rejecting[research?.supervisionRef?._id] ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <i className="bi bi-x-lg"></i>
                            )}
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(research._id)}
                            title="Delete Research"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
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
