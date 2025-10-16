import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Form, 
  ProgressBar, 
  Spinner, 
  Modal, 
  Tabs, 
  Tab, 
  Dropdown, 
  ButtonGroup,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CurrencyDollar, 
  Download, 
  FileText,
  Plus,
  Pencil,
  Trash,
  ThreeDotsVertical,
  Funnel,
  FunnelFill,
  Filter
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import FundingRequestForm from '../../components/FundingRequestForm';
// Import jsPDF and autoTable
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const FundingReview = () => {
  // State for data and loading
  const [fundingRequests, setFundingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modals and forms
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // State for selected items
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);
  
  // State for CRUD operations
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for UI
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  
  // State for budget allocation
  const [budgetAllocation, setBudgetAllocation] = useState({
    totalBudget: 0,
    allocated: 0,
    remaining: 0,
    isLoading: true
  });

  // Fetch data function that can be called when needed
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Use full backend URL for development
      const baseUrl = 'http://localhost:5000';
      const fundingUrl = `${baseUrl}/api/funding`;
      const budgetUrl = `${baseUrl}/api/funding/budget`;
      
      console.log('Starting to fetch data from:', { fundingUrl, budgetUrl });
      
      // Fetch funding requests and budget in parallel
      const [requestsResponse, budgetResponse] = await Promise.all([
        fetch(fundingUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        .then(async (res) => {
          const text = await res.text();
          console.log('Funding API response:', { status: res.status, statusText: res.statusText });
          
          if (!res.ok) {
            const errorData = text ? JSON.parse(text) : {};
            console.error('Funding API error:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          
          try {
            const data = text ? JSON.parse(text) : {};
            return { response: res, data };
          } catch (e) {
            console.error('Failed to parse funding response:', { 
              status: res.status, 
              text,
              error: e.message 
            });
            throw new Error(`Invalid JSON response from API. Status: ${res.status}`);
          }
        })
        .catch(error => {
          console.error('Error in funding request:', error);
          throw new Error(`Failed to fetch funding data: ${error.message}`);
        }),
        
        fetch(budgetUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        .then(async (res) => {
          const text = await res.text();
          
          if (!res.ok) {
            const errorData = text ? JSON.parse(text) : {};
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          
          try {
            return { response: res, data: text ? JSON.parse(text) : {} };
          } catch (e) {
            console.error('Failed to parse budget response:', { 
              status: res.status, 
              text,
              error: e.message 
            });
            return { response: res, data: {} }; // Return empty data but don't fail the whole request
          }
        })
        .catch(error => {
          console.error('Error in budget request:', error);
          // Don't throw for budget errors, use defaults
          return { 
            response: { ok: false, status: 500, statusText: 'Budget data unavailable' },
            data: { totalBudget: 1000000, allocated: 0, remaining: 1000000 }
          };
        })
      ]);

      // Process funding requests
      if (!requestsResponse.response.ok) {
        throw new Error(requestsResponse.data?.message || 'Failed to load funding requests');
      }

      // Process budget data
      const budgetData = budgetResponse.data || {
        totalBudget: 1000000,
        allocated: 0,
        remaining: 1000000
      };

      console.log('Successfully fetched data:', {
        requestsCount: Array.isArray(requestsResponse.data?.data) ? 
          requestsResponse.data.data.length : 0,
        budgetData
      });

      // Update state with the fetched data
      setFundingRequests(Array.isArray(requestsResponse.data?.data) ? 
        requestsResponse.data.data : 
        (Array.isArray(requestsResponse.data) ? requestsResponse.data : [])
      );
      
      setBudgetAllocation({
        totalBudget: budgetData.totalBudget || 1000000,
        allocated: budgetData.allocated || 0,
        remaining: budgetData.remaining || (budgetData.totalBudget || 1000000) - (budgetData.allocated || 0)
      });
      
    } catch (error) {
      console.error('Error in fetchData:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      toast.error(`Error loading data: ${error.message}`, {
        autoClose: 5000,
        position: 'top-right',
      });
      
      // Reset to empty state on error
      setFundingRequests([]);
      setBudgetAllocation({
        totalBudget: 1000000,
        allocated: 0,
        remaining: 1000000
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Handle create/update funding request
  const handleSubmitRequest = async (formData) => {
    try {
      const url = isEditing && selectedRequest 
        ? `http://localhost:5000/api/funding/${selectedRequest._id}`
        : 'http://localhost:5000/api/funding';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare the request body
      const requestBody = {
        ...formData,
        // Ensure we're sending the correct data types
        requestedAmount: parseFloat(formData.requestedAmount) || 0,
        recommendedAmount: formData.recommendedAmount ? parseFloat(formData.recommendedAmount) : null,
        // Ensure budget breakdown values are numbers
        budgetBreakdown: formData.budgetBreakdown ? {
          personnel: parseFloat(formData.budgetBreakdown.personnel) || 0,
          equipment: parseFloat(formData.budgetBreakdown.equipment) || 0,
          materials: parseFloat(formData.budgetBreakdown.materials) || 0,
          travel: parseFloat(formData.budgetBreakdown.travel) || 0,
          other: parseFloat(formData.budgetBreakdown.other) || 0
        } : undefined
      };
      
      console.log('Submitting form data:', requestBody); // Debug log
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save funding request');
      }
      
      console.log('API Response:', result); // Debug log
      
      // Update local state with the updated request
      if (isEditing) {
        setFundingRequests(prevRequests => 
          prevRequests.map(req => 
            req._id === result.data._id ? { ...req, ...result.data } : req
          )
        );
        // Update selectedRequest if it's currently being viewed
        if (selectedRequest && selectedRequest._id === result.data._id) {
          setSelectedRequest(prev => ({ ...prev, ...result.data }));
        }
      } else {
        // For new requests, add to the beginning of the list
        setFundingRequests(prevRequests => [result.data, ...prevRequests]);
      }

      // Refresh budget data
      const budgetResponse = await fetch('http://localhost:5000/api/funding/budget', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        setBudgetAllocation({
          totalBudget: budgetData.totalBudget || 0,
          allocated: budgetData.allocated || 0,
          remaining: budgetData.remaining || 0
        });
      }

      toast.success(`Funding request ${isEditing ? 'updated' : 'created'} successfully`);
      setShowForm(false);
      setSelectedRequest(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving funding request:', error);
      toast.error(error.message || 'Failed to save funding request');
    }
  };

  // Handle delete funding request
  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/funding/${selectedRequest._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete funding request');
      }

      // Remove the deleted request from the list
      setFundingRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
      
      // Close the modals and reset state
      setShowDetails(false);
      setShowDeleteConfirm(false);
      
      toast.success('Funding request deleted successfully');
    } catch (error) {
      console.error('Error deleting funding request:', error);
      toast.error(error.message || 'Failed to delete funding request');
    }
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    await handleDeleteRequest();
  };

  // Handle initiate delete
  const confirmDelete = (request) => {
    setSelectedRequest(request);
    setShowDeleteConfirm(true);
  };

  // Handle viewing request details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  // Handle opening the form for editing
  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle opening the form for a new request
  const handleAddRequest = () => {
    setSelectedRequest(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleStatusChange = async (id, status, recommendedAmount = null) => {
    try {
      // Optimistically update the UI
      setFundingRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === id 
            ? { ...req, status, recommendedAmount: recommendedAmount || req.recommendedAmount }
            : req
        )
      );

      // Update selected request if it's the one being updated
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(prev => ({
          ...prev,
          status,
          recommendedAmount: recommendedAmount || prev.recommendedAmount
        }));
      }

      // Make the API call
      const response = await fetch(`http://localhost:5000/api/funding/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          recommendedAmount: recommendedAmount || undefined
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedRequest = await response.json();
      
      // Update local state with server response
      setFundingRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === updatedRequest._id ? updatedRequest : req
        )
      );

      // Show success message
      toast.success(`Request ${status} successfully`);
      
      return updatedRequest;
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
      
      // Revert optimistic update on error
      fetchData(); // Refetch data to ensure consistency
      throw error;
    }
  };

  const handleApproveFunding = async (id, recommendedAmount) => {
    try {
      await handleStatusChange(id, 'approved', recommendedAmount);
      setShowDetails(false);
    } catch (error) {
      // Error is already handled in handleStatusChange
    }
  };

  const handleRejectFunding = async (id) => {
    try {
      await handleStatusChange(id, 'rejected');
      setShowDetails(false);
    } catch (error) {
      // Error is already handled in handleStatusChange
    }
  };

  // Filter requests based on search term and active tab
  const filteredRequests = fundingRequests.filter(request => {
    if (!request) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (request.projectTitle?.toLowerCase().includes(searchLower) ||
      (request.researcher?.name?.toLowerCase().includes(searchLower)) ||
      (request.researcher?.email?.toLowerCase().includes(searchLower)) ||
      (request.department?.toLowerCase().includes(searchLower))) ||
      searchLower === '';
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && request.status === activeTab;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const allocationPercentage = (budgetAllocation.allocated / budgetAllocation.totalBudget) * 100;

  // Export table data to PDF with professional formatting
  const exportToPDF = async () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      toast.warning('No data to export');
      return;
    }

    setIsExportingPDF(true);
    
    try {
      // Create a new PDF with landscape orientation
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set document properties
      doc.setProperties({
        title: 'Funding Requests Report',
        subject: 'Funding Requests Export',
        author: 'Research Portal',
        keywords: 'funding, requests, report',
        creator: 'Research Portal'
      });
      
      // Add header with title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(40, 62, 80);
      doc.text('Funding Requests Report', 10, 15);
      
      // Add date and summary
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 22);
      
      // Add summary section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Summary', 10, 32);
      
      // Add summary data
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Requests: ${filteredRequests.length}`, 10, 38);
      doc.text(`Total Amount Requested: $${filteredRequests.reduce((sum, req) => sum + (parseFloat(req.requestedAmount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 44);
      
      // Prepare data for the table
      const tableData = filteredRequests.map((request, index) => [
        `FR-${String(index + 1).padStart(5, '0')}`,
        request.projectTitle || 'N/A',
        request.researcher?.name || request.researcher?.fullName || 'N/A',
        request.requestedAmount ? `$${parseFloat(request.requestedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
        request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending',
        request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'
      ]);
      
      // Add table to PDF with custom styling
      autoTable(doc, {
        startY: 50,
        head: [['ID', 'Project Title', 'Researcher', 'Amount', 'Status', 'Date']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 50, halign: 'left' },
          2: { cellWidth: 40, halign: 'left' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 25, halign: 'center' },
          5: { cellWidth: 20, halign: 'center' }
        },
        margin: { top: 10 },
        didDrawPage: function(data) {
          // Footer
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageCount}`,
            pageSize.width / 2,
            pageHeight - 10,
            { align: 'center' }
          );
          
          // Add watermark on first page
          if (doc.internal.getCurrentPageInfo().pageNumber === 1) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(60);
            doc.setTextColor(240, 240, 240);
            doc.setFont('helvetica', 'bold');
            doc.text('CONFIDENTIAL', 
              pageWidth / 2, 
              pageHeight / 2,
              { angle: 45, align: 'center', opacity: 0.1 }
            );
          }
        }
      });
      
      // Add a final summary row
      const yPos = doc.lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      // Use the same left margin as defined in the table options (15mm)
      doc.text(`End of Report - ${filteredRequests.length} requests processed`, 15, yPos);
      
      // Save the PDF with a timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      doc.save(`Funding_Requests_Report_${timestamp}.pdf`);
      
      toast.success('Professional PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Export table data to CSV
  const exportToCSV = () => {
    if (filteredRequests.length === 0) {
      toast.warning('No data to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Define CSV headers
      const headers = [
        'Project Title',
        'Researcher',
        'Requested Amount (LKR)',
        'Status',
        'Date Submitted',
        'Description'
      ];

      // Convert data to CSV format
      const csvContent = [
        headers.join(','),
        ...filteredRequests.map(request => (
          [
            `"${(request.projectTitle || '').replace(/"/g, '""')}"`,
            `"${(request.researcher?.name || request.researcher?.fullName || '').replace(/"/g, '""')}"`,
            request.requestedAmount || '0',
            `"${(request.status || '').charAt(0).toUpperCase() + (request.status || '').slice(1)}"`,
            `"${new Date(request.createdAt).toLocaleDateString()}"`,
            `"${(request.description || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ').trim()}"`
          ].join(',')
        ))
      ].join('\n');

      // Create download link
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `funding-requests-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
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
              <h4 className="mb-0">
                LKR {budgetAllocation.remaining?.toLocaleString?.() || '0'}
              </h4>
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
              Allocated: LKR {budgetAllocation.allocated?.toLocaleString?.() || '0'}
            </small>
            <small className="text-muted">
              Total Budget: LKR {budgetAllocation.totalBudget?.toLocaleString?.() || '0'}
            </small>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between align-items-center px-3 pt-3">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-0"
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
            
            <ButtonGroup size="sm" className="me-2">
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grid-3x3-gap" viewBox="0 0 16 16">
                  <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z"/>
                </svg>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-ul" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
              </Button>
              </ButtonGroup>
              
              <ButtonGroup className="ms-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={exportToCSV}
                  disabled={isExporting || filteredRequests.length === 0}
                  title="Export to CSV"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '500'
                  }}
                >
                  {isExporting ? (
                    <>
                      <Spinner as="span" size="sm" animation="border" role="status" />
                      <span>CSV...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={14} />
                      <span>CSV</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={exportToPDF}
                  disabled={isExportingPDF || filteredRequests.length === 0}
                  title="Export to PDF"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '500'
                  }}
                >
                  {isExportingPDF ? (
                    <>
                      <Spinner as="span" size="sm" animation="border" role="status" />
                      <span>PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={14} />
                      <span>PDF</span>
                    </>
                  )}
                </Button>
              </ButtonGroup>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-2">Loading funding requests...</div>
            </div>
          ) : fundingRequests.length > 0 ? (
            <div className="p-3">
              {viewMode === 'grid' ? (
                <Row xs={1} md={2} lg={3} className="g-3">
                  {fundingRequests.map((request) => (
                    <Col key={request._id}>
                      <Card className="h-100 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="mb-1 text-truncate" style={{ maxWidth: '80%' }}>
                              {request.projectTitle || 'Untitled Project'}
                            </Card.Title>
                            <Badge 
                              bg={
                                request.status === 'approved' ? 'success' : 
                                request.status === 'rejected' ? 'danger' : 'warning'
                              }
                              className="text-uppercase"
                            >
                              {request.status || 'pending'}
                            </Badge>
                          </div>
                          
                          <div className="mb-2">
                            <div className="text-muted small">Researcher</div>
                            <div className="fw-medium">
                              {request.researcher?.fullName || request.researcher?.name || 'N/A'}
                            </div>
                            {request.researcher?.email && (
                              <div className="text-muted small text-truncate">
                                {request.researcher.email}
                              </div>
                            )}
                          </div>
                          
                          <div className="d-flex justify-content-between mb-2">
                            <div>
                              <div className="text-muted small">Requested</div>
                              <div className="fw-medium">
                                LKR {request.requestedAmount?.toLocaleString() || '0'}
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="text-muted small">Date</div>
                              <div className="fw-medium">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="d-flex gap-2 mt-3">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                              className="flex-grow-1"
                            >
                              <FileText className="me-1" /> View
                            </Button>
                            
                            {request.status === 'pending' && (
                              <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-actions">
                                  <ThreeDotsVertical />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => handleApproveFunding(request._id, request.requestedAmount)}>
                                    <CheckCircle className="text-success me-2" /> Approve
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleRejectFunding(request._id)}>
                                    <XCircle className="text-danger me-2" /> Reject
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Researcher</th>
                      <th>Supervisor Approval</th>
                      <th>Status</th>
                      <th>Request Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundingRequests.map((request) => (
                      <tr key={request._id}>
                        <td>
                          <div className="fw-semibold">{request.projectTitle || 'N/A'}</div>
                          <small className="text-muted">
                            {request.reason ? 
                              `${request.reason.substring(0, 50)}${request.reason.length > 50 ? '...' : ''}` : 
                              'No description'}
                          </small>
                        </td>
                        <td>
                          {request.researcher?.fullName || request.researcher?.name || 'N/A'}
                          {request.researcher?.email && (
                            <div className="text-muted small">{request.researcher.email}</div>
                          )}
                        </td>
                        <td>
                          <Badge bg={request.supervisorApproval === 'Approved' ? 'success' : 'warning'}>
                            {request.supervisorApproval || 'Pending'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={
                            request.status === 'approved' ? 'success' : 
                            request.status === 'rejected' ? 'danger' : 'warning'
                          }>
                            {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                          </Badge>
                        </td>
                        <td>
                          {new Date(request.createdAt).toLocaleDateString()}
                          <div className="text-muted small">
                            {new Date(request.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                              title="View Details"
                            >
                              <FileText className="me-1" /> View
                            </Button>
                            {request.status === 'pending' && (
                              <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-actions">
                                  <ThreeDotsVertical />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => handleApproveFunding(request._id, request.requestedAmount)}>
                                    <CheckCircle className="text-success me-2" /> Approve
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleRejectFunding(request._id)}>
                                    <XCircle className="text-danger me-2" /> Reject
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <FileText size={48} className="text-muted mb-2" />
              <h5>No funding requests found</h5>
              <p className="text-muted">When you create funding requests, they'll appear here.</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  setSelectedRequest(null);
                  setIsEditing(false);
                  setShowForm(true);
                }}
              >
                <Plus className="me-1" /> Create Request
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Funding Request Modal */}
      <FundingRequestForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setSelectedRequest(null);
          setIsEditing(false);
        }}
        request={selectedRequest}
        onSubmit={handleSubmitRequest}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the funding request for <strong>{selectedRequest?.projectTitle}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Request'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Funding Request Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Funding Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4>{selectedRequest.projectTitle}</h4>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setShowDetails(false);
                      handleEditRequest(selectedRequest);
                    }}
                  >
                    <Pencil size={16} className="me-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={handleDeleteClick}
                  >
                    <Trash size={16} className="me-1" /> Delete
                  </Button>
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Researcher:</strong> {selectedRequest.researcher?.fullName || selectedRequest.researcher?.name || 'N/A'}</p>
                  <p className="mb-1"><strong>Supervisor:</strong> {selectedRequest.supervisor?.name || 'N/A'}</p>
                  <p className="mb-1"><strong>Department:</strong> {selectedRequest.department || 'N/A'}</p>
                  <p className="mb-1">
                    <strong>Status:</strong> {getStatusBadge(selectedRequest.status)}
                    {selectedRequest.approvedAt && (
                      <span className="text-muted ms-2">
                        (Approved on {new Date(selectedRequest.approvedAt).toLocaleDateString()})
                      </span>
                    )}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Requested Amount:</strong> {formatCurrency(selectedRequest.requestedAmount)}
                  </p>
                  {selectedRequest.status === 'approved' && (
                    <p className="mb-1 text-success">
                      <strong>Approved Amount:</strong> {formatCurrency(selectedRequest.recommendedAmount)}
                    </p>
                  )}
                  <p className="mb-1">
                    <strong>Submission Date:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h5>Budget Breakdown</h5>
              <div className="table-responsive mb-4">
                <Table striped bordered className="mb-4">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.budgetBreakdown && Object.entries(selectedRequest.budgetBreakdown).map(([category, amount]) => (
                      <tr key={category}>
                        <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                        <td>{formatCurrency(amount)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                              <div 
                                className="progress-bar bg-primary" 
                                role="progressbar" 
                                style={{ 
                                  width: `${(amount / (selectedRequest.requestedAmount || 1)) * 100}%` 
                                }}
                              />
                            </div>
                            <small>{
                              ((amount / (selectedRequest.requestedAmount || 1)) * 100).toFixed(1)
                            }%</small>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="table-active">
                      <td><strong>Total</strong></td>
                      <td colSpan="2"><strong>LKR {selectedRequest?.requestedAmount?.toLocaleString?.() || '0'}</strong></td>
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
                      Adjust the amount if necessary (max: LKR {selectedRequest?.requestedAmount?.toLocaleString?.() || '0'})
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
          <Button 
            variant="outline-danger" 
            onClick={handleDeleteClick}
            className="me-auto"
          >
            <Trash className="me-1" /> Delete Request
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowDetails(false)}
          >
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

      {/* Floating Add Button */}
      <Button 
        variant="primary" 
        className="position-fixed rounded-circle" 
        style={{
          bottom: '2rem',
          right: '2rem',
          width: '4rem',
          height: '4rem',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
        onClick={handleAddRequest}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default FundingReview;
