import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Modal, Spinner, ProgressBar, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { Search, PersonPlus, People, PersonCheck, PersonX, ThreeDotsVertical, ArrowUp, ArrowDown, Envelope } from 'react-bootstrap-icons';

const SupervisionAllocation = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showReallocationModal, setShowReallocationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentForReallocation, setSelectedStudentForReallocation] = useState('');
  const [newSupervisor, setNewSupervisor] = useState('');
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
          {
            id: 2,
            name: 'Dr. Sarah Williams',
            department: 'Computer Science',
            maxStudents: 6,
            currentStudents: 4,
            status: 'active',
            expertise: ['Cybersecurity', 'Networks'],
            students: [103]
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
            researchTopic: 'Deep Learning for Medical Imaging',
            email: 'john.smith@example.com',
            enrollmentDate: '2022-09-01',
            expectedGraduation: '2026-05-15'
          },
          {
            id: 102,
            name: 'Emily Chen',
            program: 'MSc in Data Science',
            status: 'assigned',
            supervisorId: 1,
            researchTopic: 'Natural Language Processing',
            email: 'emily.chen@example.com',
            enrollmentDate: '2023-01-15',
            expectedGraduation: '2024-12-15'
          },
          {
            id: 103,
            name: 'Michael Brown',
            program: 'PhD in Cybersecurity',
            status: 'assigned',
            supervisorId: 2,
            researchTopic: 'Blockchain Security',
            email: 'michael.brown@example.com',
            enrollmentDate: '2021-09-01',
            expectedGraduation: '2025-05-15'
          },
          {
            id: 104,
            name: 'Alex Johnson',
            program: 'MSc in Computer Science',
            status: 'unassigned',
            researchTopic: 'Computer Vision',
            email: 'alex.johnson@example.com',
            enrollmentDate: '2023-09-01',
            expectedGraduation: '2025-05-15'
          },
          // Add more mock data as needed
        ];

        setSupervisors(mockSupervisors);
        setStudents(mockStudents);
        setUnassignedStudents(mockStudents.filter(student => student.status === 'unassigned'));
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

  const handleAssignStudent = () => {
    if (!selectedStudent) return;
    
    // Update the student's supervisor
    const updatedStudents = students.map(student => 
      student.id === parseInt(selectedStudent)
        ? { ...student, supervisorId: selectedSupervisor.id, status: 'assigned' }
        : student
    );
    
    // Update the supervisor's student list
    const updatedSupervisors = supervisors.map(supervisor => 
      supervisor.id === selectedSupervisor.id
        ? { 
            ...supervisor, 
            currentStudents: supervisor.currentStudents + 1,
            students: [...supervisor.students, parseInt(selectedStudent)]
          }
        : supervisor
    );
    
    setStudents(updatedStudents);
    setSupervisors(updatedSupervisors);
    setUnassignedStudents(updatedStudents.filter(student => student.status === 'unassigned'));
    setShowAllocationModal(false);
    setSelectedStudent('');
  };

  const handleReallocate = () => {
    if (!selectedStudentForReallocation || !newSupervisor) return;
    
    // Get the current supervisor of the student
    const currentSupervisorId = students.find(s => s.id === parseInt(selectedStudentForReallocation))?.supervisorId;
    
    // Update the student's supervisor
    const updatedStudents = students.map(student => 
      student.id === parseInt(selectedStudentForReallocation)
        ? { ...student, supervisorId: parseInt(newSupervisor) }
        : student
    );
    
    // Update the previous supervisor's student count and list
    const updatedSupervisors = supervisors.map(supervisor => {
      if (supervisor.id === currentSupervisorId) {
        // Remove student from previous supervisor
        return {
          ...supervisor,
          currentStudents: supervisor.currentStudents - 1,
          students: supervisor.students.filter(id => id !== parseInt(selectedStudentForReallocation))
        };
      } else if (supervisor.id === parseInt(newSupervisor)) {
        // Add student to new supervisor
        return {
          ...supervisor,
          currentStudents: supervisor.currentStudents + 1,
          students: [...supervisor.students, parseInt(selectedStudentForReallocation)]
        };
      }
      return supervisor;
    });
    
    setStudents(updatedStudents);
    setSupervisors(updatedSupervisors);
    setShowReallocationModal(false);
    setSelectedStudentForReallocation('');
    setNewSupervisor('');
  };

  const viewStudentDetails = (student) => {
    setCurrentStudent(student);
    setShowStudentDetails(true);
  };

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = 
      supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'available') return supervisor.currentStudents < supervisor.maxStudents && matchesSearch;
    if (activeTab === 'full') return supervisor.currentStudents >= supervisor.maxStudents && matchesSearch;
    return matchesSearch;
  });

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
            <Tab eventKey="available" title={
              <>
                <PersonPlus className="me-1" /> Available
              </>
            } />
            <Tab eventKey="full" title={
              <>
                <PersonX className="me-1" /> At Capacity
                <Badge bg="danger" className="ms-2">
                  {supervisors.filter(s => s.currentStudents >= s.maxStudents).length}
                </Badge>
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
                          <span className="me-2">{supervisor.currentStudents} / {supervisor.maxStudents}</span>
                          <div className="progress flex-grow-1" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar bg-${variant}`}
                              role="progressbar"
                              style={{ width: `${utilization}%` }}
                              aria-valuenow={utilization}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
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
                            title={isFull ? 'Supervisor at capacity' : 'Assign student'}
                          >
                            <PersonPlus className="me-1" /> Assign
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleReallocateStudent(supervisor)}
                            disabled={supervisor.currentStudents === 0}
                            title={supervisor.currentStudents === 0 ? 'No students to reallocate' : 'Reallocate student'}
                          >
                            <People className="me-1" /> Reallocate
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

      {/* Student Assignment Modal */}
      <Modal show={showAllocationModal} onHide={() => setShowAllocationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Student to {selectedSupervisor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Student</Form.Label>
            <Form.Select 
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select a student...</option>
              {unassignedStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.program} ({student.researchTopic})
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              {unassignedStudents.length} unassigned students available
            </Form.Text>
          </Form.Group>
          
          {selectedStudent && (
            <div className="alert alert-info p-2">
              <small>
                <strong>Student:</strong> {unassignedStudents.find(s => s.id === parseInt(selectedStudent))?.name}<br />
                <strong>Program:</strong> {unassignedStudents.find(s => s.id === parseInt(selectedStudent))?.program}<br />
                <strong>Research Topic:</strong> {unassignedStudents.find(s => s.id === parseInt(selectedStudent))?.researchTopic}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAllocationModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignStudent}
            disabled={!selectedStudent}
          >
            Assign Student
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Reallocation Modal */}
      <Modal show={showReallocationModal} onHide={() => setShowReallocationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reallocate Student from {selectedSupervisor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Student to Reallocate</Form.Label>
            <Form.Select 
              value={selectedStudentForReallocation}
              onChange={(e) => setSelectedStudentForReallocation(e.target.value)}
            >
              <option value="">Select a student...</option>
              {students
                .filter(student => student.supervisorId === selectedSupervisor?.id)
                .map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.researchTopic}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>New Supervisor</Form.Label>
            <Form.Select 
              value={newSupervisor}
              onChange={(e) => setNewSupervisor(e.target.value)}
              disabled={!selectedStudentForReallocation}
            >
              <option value="">Select a new supervisor...</option>
              {supervisors
                .filter(supervisor => 
                  supervisor.id !== selectedSupervisor?.id && 
                  supervisor.currentStudents < supervisor.maxStudents
                )
                .map(supervisor => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name} ({supervisor.currentStudents}/{supervisor.maxStudents} students)
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          
          {selectedStudentForReallocation && newSupervisor && (
            <div className="alert alert-info mt-3 p-2">
              <small>
                <strong>Current Supervisor:</strong> {selectedSupervisor?.name}<br />
                <strong>New Supervisor:</strong> {supervisors.find(s => s.id === parseInt(newSupervisor))?.name}<br />
                <strong>Student:</strong> {students.find(s => s.id === parseInt(selectedStudentForReallocation))?.name}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReallocationModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleReallocate}
            disabled={!selectedStudentForReallocation || !newSupervisor}
          >
            Reallocate Student
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Details Modal */}
      <Modal show={showStudentDetails} onHide={() => setShowStudentDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStudent && (
            <div>
              <div className="text-center mb-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '80px', height: '80px' }}>
                  <People size={32} className="text-primary" />
                </div>
                <h5 className="mb-0">{currentStudent.name}</h5>
                <p className="text-muted mb-0">{currentStudent.email}</p>
                <Badge bg="info" className="mt-1">{currentStudent.program}</Badge>
              </div>
              
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Research Topic</span>
                    <span className="fw-semibold">{currentStudent.researchTopic}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Enrollment Date</span>
                    <span className="fw-semibold">{new Date(currentStudent.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Expected Graduation</span>
                    <span className="fw-semibold">{new Date(currentStudent.expectedGraduation).toLocaleDateString()}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Supervisor</span>
                    <span className="fw-semibold">
                      {supervisors.find(s => s.id === currentStudent.supervisorId)?.name || 'Unassigned'}
                    </span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
              
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  <Envelope className="me-1" /> Send Message
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SupervisionAllocation;
