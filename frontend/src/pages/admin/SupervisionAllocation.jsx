import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Spinner, Tabs, Tab, ListGroup, ProgressBar } from 'react-bootstrap';
import { Search, Filter, PersonPlus, People, PersonCheck, PersonX, ThreeDotsVertical } from 'react-bootstrap-icons';

const SupervisionAllocation = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showReallocationModal, setShowReallocationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // Mock data for supervisors
        const mockSupervisors = [
          {
            id: 1,
            name: 'Dr. Robert Johnson',
            department: 'Computer Science',
            maxStudents: 5,
            currentStudents: 3,
            status: 'active',
            expertise: ['AI', 'Machine Learning', 'Data Science'],
            students: [101, 102]
          },
          // Add more mock data as needed
        ];

        // Mock data for students
        const mockStudents = [
          {
            id: 101,
            name: 'John Smith',
            program: 'PhD in Computer Science',
            status: 'assigned',
            supervisorId: 1,
            researchTopic: 'Deep Learning for Medical Imaging'
          },
          // Add more mock data as needed
        ];

        setSupervisors(mockSupervisors);
        setStudents(mockStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAllocateStudent = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowAllocationModal(true);
  };

  const handleReallocateStudent = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowReallocationModal(true);
  };

  const handleAssignSupervisor = (studentId, supervisorId) => {
    // Handle assignment logic
    console.log(`Assigned student ${studentId} to supervisor ${supervisorId}`);
    setShowAllocationModal(false);
    setShowReallocationModal(false);
  };

  const filteredSupervisors = supervisors.filter(supervisor => 
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAvailableStudents = () => {
    // Return students not assigned to any supervisor
    return students.filter(student => !student.supervisorId);
  };

  const getSupervisorStudents = (supervisorId) => {
    return students.filter(student => student.supervisorId === supervisorId);
  };

  const getUtilizationPercentage = (supervisor) => {
    return (supervisor.currentStudents / supervisor.maxStudents) * 100;
  };

  const getUtilizationVariant = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
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
          <h2 className="mb-0">Supervision Allocation</h2>
          <p className="text-muted mb-0">Manage supervisor-student allocations and capacity</p>
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
            <Tab eventKey="all" title="All Supervisors" />
            <Tab eventKey="available" title="Available Capacity" />
            <Tab eventKey="full" title={
              <>
                <PersonX className="me-1" /> At Capacity
                <Badge bg="danger" className="ms-2">2</Badge>
              </>
            } />
          </Tabs>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Supervisor</th>
                  <th>Department</th>
                  <th>Expertise</th>
                  <th>Students</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupervisors.map((supervisor) => {
                  const utilization = getUtilizationPercentage(supervisor);
                  const variant = getUtilizationVariant(utilization);
                  const isFull = supervisor.currentStudents >= supervisor.maxStudents;
                  
                  if (activeTab === 'available' && isFull) return null;
                  if (activeTab === 'full' && !isFull) return null;
                  
                  return (
                    <tr key={supervisor.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
                            <People className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-semibold">{supervisor.name}</div>
                            <small className="text-muted">{supervisor.department}</small>
                          </div>
                        </div>
                      </td>
                      <td>{supervisor.department}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {supervisor.expertise.slice(0, 2).map((exp, idx) => (
                            <Badge key={idx} bg="light" text="dark" className="fw-normal">
                              {exp}
                            </Badge>
                          ))}
                          {supervisor.expertise.length > 2 && (
                            <Badge bg="light" text="dark" className="fw-normal">
                              +{supervisor.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <span className="fw-semibold">{supervisor.currentStudents}</span>
                            <span className="text-muted">/{supervisor.maxStudents}</span>
                          </div>
                          <div className="flex-grow-1" style={{ width: '80px' }}>
                            <ProgressBar
                              now={utilization}
                              variant={variant}
                              style={{ height: '6px', borderRadius: '3px' }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg={isFull ? 'danger' : 'success'} className="text-uppercase">
                          {isFull ? 'Full' : 'Available'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleAllocateStudent(supervisor)}
                            disabled={isFull}
                            title={isFull ? 'Supervisor at capacity' : 'Allocate student'}
                          >
                            <PersonPlus className="me-1" /> Allocate
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleReallocateStudent(supervisor)}
                            disabled={supervisor.currentStudents === 0}
                            title={supervisor.currentStudents === 0 ? 'No students to reallocate' : 'Reallocate student'}
                          >
                            <ThreeDotsVertical />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Allocation Modal */}
      <Modal show={showAllocationModal} onHide={() => setShowAllocationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Allocate Student to {selectedSupervisor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Select a student to allocate to {selectedSupervisor?.name}. 
            Current capacity: {selectedSupervisor?.currentStudents}/{selectedSupervisor?.maxStudents}
          </p>
          
          <div className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="Search students..." 
              className="mb-3"
            />
            
            <h6 className="mb-2">Available Students</h6>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {getAvailableStudents().length > 0 ? (
                  getAvailableStudents().map(student => (
                    <ListGroup.Item key={student.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{student.name}</div>
                        <small className="text-muted">{student.program}</small>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleAssignSupervisor(student.id, selectedSupervisor.id)}
                      >
                        Assign
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    No available students found.
                  </div>
                )}
              </ListGroup>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAllocationModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reallocation Modal */}
      <Modal show={showReallocationModal} onHide={() => setShowReallocationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reallocate Students from {selectedSupervisor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Select students to reallocate from {selectedSupervisor?.name} to another supervisor.
          </p>
          
          <div className="mb-3">
            <h6 className="mb-2">Current Students</h6>
            {selectedSupervisor && getSupervisorStudents(selectedSupervisor.id).length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <ListGroup variant="flush">
                  {getSupervisorStudents(selectedSupervisor.id).map(student => (
                    <ListGroup.Item key={student.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{student.name}</div>
                        <small className="text-muted">{student.researchTopic}</small>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleAssignSupervisor(student.id, null)}
                      >
                        Unassign
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                No students currently assigned.
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReallocationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupervisionAllocation;
