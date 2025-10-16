import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const FundingRequestForm = ({ show, onHide, request, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    researcher: '',
    supervisor: '',
    department: '',
    requestedAmount: '',
    recommendedAmount: '',
    budgetBreakdown: {
      personnel: 0,
      equipment: 0,
      materials: 0,
      travel: 0,
      other: 0
    },
    justification: '',
    status: 'pending'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [researches, setResearches] = useState([]);
  const [researchers, setResearchers] = useState({});
  const [supervisors, setSupervisors] = useState([]);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch researches with researcher info
        const [researchesRes, supervisorsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/researches/titles'),
          axios.get('http://localhost:5000/api/supervisors/list')
        ]);
        
        setResearches(researchesRes.data);
        setSupervisors(supervisorsRes.data);
        
        // Create a map of research IDs to researcher info
        const researchersMap = {};
        researchesRes.data.forEach(research => {
          if (research.researcher) {
            researchersMap[research._id] = research.researcher;
          }
        });
        setResearchers(researchersMap);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load form data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize form with request data if editing
  useEffect(() => {
    if (request) {
      setFormData({
        projectTitle: request.projectTitle || '',
        researcher: request.researcher?._id || request.researcher || '',
        researcherName: request.researcher?.fullName || request.researcherName || '',
        supervisor: request.supervisor?._id || request.supervisor || '',
        department: request.department || '',
        requestedAmount: request.requestedAmount || '',
        recommendedAmount: request.recommendedAmount || request.requestedAmount || '',
        budgetBreakdown: {
          personnel: request.budgetBreakdown?.personnel || 0,
          equipment: request.budgetBreakdown?.equipment || 0,
          materials: request.budgetBreakdown?.materials || 0,
          travel: request.budgetBreakdown?.travel || 0,
          other: request.budgetBreakdown?.other || 0
        },
        justification: request.justification || '',
        status: request.status || 'pending',
        reason: request.reason || ''
      });
    }
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If project title is being changed, update the researcher as well
    if (name === 'projectTitle') {
      const selectedResearch = researches.find(r => r.title === value);
      if (selectedResearch && selectedResearch.researcher) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          researcher: selectedResearch.researcher._id,
          researcherName: selectedResearch.researcher.fullName,
          department: selectedResearch.researcher.department || ''
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      budgetBreakdown: {
        ...prev.budgetBreakdown,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const calculateTotal = () => {
    const { budgetBreakdown } = formData;
    return Object.values(budgetBreakdown).reduce((sum, amount) => sum + parseFloat(amount || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Get the selected research to get the researcher ID
      const selectedResearch = researches.find(r => r.title === formData.projectTitle);
      
      if (!selectedResearch || !selectedResearch.researcher) {
        setError('Please select a valid research project with an associated researcher');
        return;
      }
      
      // Validate budget breakdown matches requested amount if editing
      if (isEditing) {
        const totalBreakdown = Object.values(formData.budgetBreakdown || {}).reduce(
          (sum, amount) => sum + parseFloat(amount || 0), 0
        );
        
        if (Math.abs(totalBreakdown - formData.requestedAmount) > 0.01) {
          setError('Budget breakdown total must match the requested amount');
          return;
        }
      }
      
      setIsSubmitting(true);
      
      // Prepare the form data for submission
      const submissionData = {
        ...formData,
        // Ensure we're using the researcher ID from the selected research
        researcher: selectedResearch.researcher._id,
        // Remove the researcherName field as it's not needed in the API
        researcherName: undefined,
        // Ensure budget breakdown values are numbers
        budgetBreakdown: formData.budgetBreakdown ? {
          personnel: parseFloat(formData.budgetBreakdown.personnel) || 0,
          equipment: parseFloat(formData.budgetBreakdown.equipment) || 0,
          materials: parseFloat(formData.budgetBreakdown.materials) || 0,
          travel: parseFloat(formData.budgetBreakdown.travel) || 0,
          other: parseFloat(formData.budgetBreakdown.other) || 0
        } : undefined,
        // Ensure numeric values are properly formatted
        requestedAmount: parseFloat(formData.requestedAmount) || 0,
        recommendedAmount: formData.recommendedAmount ? parseFloat(formData.recommendedAmount) : null,
        // Include other necessary fields
        justification: formData.justification,
        status: formData.status,
        reason: formData.reason || ''
      };
      
      console.log('Submitting form data:', submissionData);
      
      // Call the parent component's onSubmit handler with the prepared data
      onSubmit(submissionData);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while submitting the form');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit' : 'Add New'} Funding Request</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row className="mb-3">
            <Form.Group as={Col} controlId="projectTitle">
              <Form.Label>Project Title</Form.Label>
              {isLoading ? (
                <div className="text-center p-3">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <Form.Select
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a project</option>
                  {researches.map((research) => (
                    <option key={research._id} value={research.title}>
                      {research.title}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="researcher">
              <Form.Label>Researcher</Form.Label>
              <Form.Control
                type="text"
                name="researcher"
                value={formData.researcherName || formData.researcher || ''}
                readOnly
                placeholder="Select a project to auto-fill"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="supervisor">
              <Form.Label>Supervisor</Form.Label>
              <Form.Select
                name="supervisor"
                value={formData.supervisor}
                onChange={handleChange}
                required
              >
                <option value="">Select Supervisor</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor._id} value={supervisor._id}>
                    {supervisor.name} {supervisor.department ? `(${supervisor.department})` : ''}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="department">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="requestedAmount">
              <Form.Label>Requested Amount (LKR)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleChange}
                required
                disabled={isEditing}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="recommendedAmount">
              <Form.Label>Recommended Amount (LKR)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                name="recommendedAmount"
                value={formData.recommendedAmount}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <h5 className="mt-4 mb-3">Budget Breakdown</h5>
          <Row className="mb-3">
            {Object.entries(formData.budgetBreakdown).map(([key, value]) => (
              <Form.Group as={Col} md={4} key={key} className="mb-3">
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  name={key}
                  value={value}
                  onChange={handleBudgetChange}
                  disabled={isEditing}
                />
              </Form.Group>
            ))}
          </Row>

          <div className="mb-3">
            <strong>Total: LKR {calculateTotal().toFixed(2)}</strong>
          </div>

          <Form.Group className="mb-3" controlId="justification">
            <Form.Label>Justification</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* File upload would go here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FundingRequestForm;
