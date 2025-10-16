import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav, Form, Badge } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  PeopleFill, 
  FileEarmarkText, 
  CashStack, 
  BarChart, 
  Gear, 
  BoxArrowRight,
  ClockHistory,
  CheckCircle,
  XCircle,
  Clock,
  PersonCheck,
  PersonX,
  GraphUp,
  FileEarmarkBarGraph,
  ClipboardData
} from 'react-bootstrap-icons';

// Modern Color Palette
const colors = {
  // Primary Colors
  // Primary Colors
  primary: '#4f46e5',
  primaryLight: '#818cf8',
  primaryDark: '#4338ca',
  // Secondary Colors
  secondary: '#7c3aed',
  secondaryLight: '#a78bfa',
  // Status Colors
  success: '#10b981',
  info: '#0ea5e9',
  warning: '#f59e0b',
  danger: '#ef4444',
  // Grayscale
  dark: '#111827',
  darkGray: '#4b5563',
  gray: '#6b7280',
  lightGray: '#e5e7eb',
  light: '#f9fafb',
  white: '#ffffff',
  black: '#212529',
  // Backgrounds
  background: '#f3f4f6',
  cardBg: '#ffffff',
  // Text
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280'
};

// Styled Components
// Modern Card Component
const StyledCard = styled(Card)`
  border: none;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${colors.lightGray};
  margin-bottom: 1.5rem;
  overflow: hidden;
  background: ${colors.cardBg};
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
    border-color: ${colors.primaryLight};
  }
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 1.5rem;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    background: ${colors.white};
    border-bottom: 1px solid ${colors.lightGray};
    padding: 1.25rem 2rem;
    font-weight: 600;
    color: ${colors.textPrimary};
    letter-spacing: -0.01em;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
`;

// Stat Card Component
const StatCard = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${colors.lightGray};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color || colors.primary};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }
  
  .icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;
    font-size: 1.5rem;
    color: ${props => props.iconColor || colors.white};
    background: ${props => `linear-gradient(135deg, ${props.color || colors.primary}, ${props.color ? `${props.color}cc` : colors.primaryDark})`};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
    
    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }
  
  .stat-content {
    h3 {
      margin: 0;
      font-weight: 700;
      color: ${colors.textPrimary};
      font-size: 1.75rem;
      letter-spacing: -0.5px;
      line-height: 1.2;
      font-feature-settings: 'tnum';
    }
    
    p {
      margin: 0.4rem 0 0;
      color: ${colors.textSecondary};
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
  }
`;

// Navigation Item
const NavItem = styled(Nav.Item)`
  margin: 0.25rem 0.5rem;
  
  .nav-link {
    color: ${colors.textSecondary};
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    position: relative;
    overflow: hidden;
    border: 1px solid transparent;
    
    &:hover {
      background: rgba(79, 70, 229, 0.05);
      color: ${colors.primary};
      transform: translateX(4px);
      border-color: ${colors.primaryLight};
    }
    
    &.active {
      background: ${colors.primary}15;
      color: ${colors.primary};
      font-weight: 600;
      border-color: ${colors.primaryLight};
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: ${colors.primary};
        border-radius: 0 4px 4px 0;
      }
    }
    
    svg {
      margin-right: 0.75rem;
    }
    
    .badge {
      margin-left: auto;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
    }
  }
`;

const AdminDashboard = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    pendingSupervisors: 0,
    activeProposals: 0,
    fundingRequests: 0,
    totalResearchers: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // In a real app, fetch these from your API
    const fetchStats = async () => {
      // Mock data for now
      setStats({
        pendingSupervisors: 12,
        activeProposals: 45,
        fundingRequests: 28,
        totalResearchers: 156
      });
    };
    
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setAuth({
      supervisor: false,
      supervisorId: null,
      admin: false,
      researcher: false,
      name: null,
      email: null
    });
    navigate('/admin/auth');
  };

  const StatCardComponent = ({ title, value, icon: Icon, variant = 'primary' }) => {
    const variantConfig = {
      primary: { 
        color: colors.primary,
        iconColor: colors.white,
        bg: 'rgba(79, 70, 229, 0.1)'
      },
      success: { 
        color: colors.success,
        iconColor: colors.white,
        bg: 'rgba(16, 185, 129, 0.1)'
      },
      warning: { 
        color: colors.warning,
        iconColor: colors.white,
        bg: 'rgba(245, 158, 11, 0.1)'
      },
      danger: { 
        color: colors.danger,
        iconColor: colors.white,
        bg: 'rgba(239, 68, 68, 0.1)'
      },
      info: { 
        color: colors.info,
        iconColor: colors.white,
        bg: 'rgba(14, 165, 233, 0.1)'
      }
    };
    
    const config = variantConfig[variant] || variantConfig.primary;
    
    return (
      <StatCard color={config.color}>
        <div className="icon-wrapper" style={{ background: config.color }} color={config.color} iconColor={config.iconColor}>
          <Icon size={22} />
        </div>
        <div className="stat-content">
          <h3>{value}</h3>
          <p>{title}</p>
        </div>
      </StatCard>
    );
  };

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.6',
      color: colors.textPrimary,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale'
    }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        color: 'white',
        padding: '1rem 0',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: '1'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '60%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: '-1'
        }} />
        <Container>
          <Row className="align-items-center">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: '#3498db',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <ClipboardData color="white" size={20} />
                </div>
                <div>
                  <h2 className="mb-0" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Ministry Dashboard</h2>
                  <p className="mb-0" style={{ opacity: 0.8, fontSize: '0.9rem' }}>Welcome back, {auth.name}</p>
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <Button 
                variant="light" 
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }
                }}
              >
                <BoxArrowRight className="me-2" size={18} /> Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </header>

      <Container style={{ paddingBottom: '3rem' }}>
        {/* Quick Stats */}
        <Row className="mb-4 g-4">
          <Col xs={12} sm={6} lg={3}>
            <StatCardComponent 
              title="Pending Supervisors" 
              value={stats.pendingSupervisors} 
              icon={PersonCheck} 
              variant="warning"
              color="#ff9800"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCardComponent 
              title="Active Proposals" 
              value={stats.activeProposals} 
              icon={FileEarmarkText} 
              variant="info"
              color="#00bcd4"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCardComponent 
              title="Funding Requests" 
              value={stats.fundingRequests} 
              icon={CashStack} 
              variant="success"
              color="#4caf50"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCardComponent 
              title="Total Researchers" 
              value={stats.totalResearchers} 
              icon={PeopleFill} 
              variant="primary"
              color="#3498db"
            />
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row className="g-4">
            <Col lg={3}>
              <StyledCard>
                <Card.Header>
                  <h5 className="mb-0" style={{ fontWeight: '600' }}>Navigation</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Nav variant="pills" className="flex-column" style={{ padding: '0.75rem' }}>
                    <NavItem>
                      <Nav.Link eventKey="dashboard" className="d-flex align-items-center">
                        <BarChart size={18} />
                        <span>Dashboard</span>
                      </Nav.Link>
                    </NavItem>
                    <NavItem>
                      <Nav.Link eventKey="supervisors" className="d-flex align-items-center">
                        <PeopleFill size={18} />
                        <span>Supervisors</span>
                        {stats.pendingSupervisors > 0 && (
                          <Badge bg="danger" pill className="ms-auto">
                            {stats.pendingSupervisors}
                          </Badge>
                        )}
                      </Nav.Link>
                    </NavItem>
                    <NavItem>
                      <Nav.Link eventKey="proposals" className="d-flex align-items-center">
                        <FileEarmarkText size={18} />
                        <span>Research Proposals</span>
                        {stats.activeProposals > 0 && (
                          <Badge bg="info" pill className="ms-auto">
                            {stats.activeProposals}
                          </Badge>
                        )}
                      </Nav.Link>
                    </NavItem>
                    <NavItem>
                      <Nav.Link eventKey="funding" className="d-flex align-items-center">
                        <CashStack size={18} />
                        <span>Funding Requests</span>
                        {stats.fundingRequests > 0 && (
                          <Badge bg="success" pill className="ms-auto">
                            {stats.fundingRequests}
                          </Badge>
                        )}
                      </Nav.Link>
                    </NavItem>
                    <NavItem>
                      <Nav.Link eventKey="reports" className="d-flex align-items-center">
                        <ClipboardData size={18} />
                        <span>Reports & Analytics</span>
                      </Nav.Link>
                    </NavItem>
                    <NavItem>
                      <Nav.Link eventKey="settings" className="d-flex align-items-center">
                        <Gear size={18} />
                        <span>Settings</span>
                      </Nav.Link>
                    </NavItem>
                  </Nav>
                </Card.Body>
              </StyledCard>
            </Col>

            <Col lg={9}>
              <Tab.Content style={{ minHeight: 'calc(100vh - 300px)' }}>
                <Tab.Pane eventKey="dashboard">
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Quick Actions</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={4} className="mb-3">
                          <Button variant="outline-primary" className="w-100" onClick={() => setActiveTab('supervisors')}>
                            <PersonCheck className="me-2" /> Review Supervisors
                          </Button>
                        </Col>
                        <Col md={4} className="mb-3">
                          <Button variant="outline-info" className="w-100" onClick={() => setActiveTab('proposals')}>
                            <FileEarmarkText className="me-2" /> View Proposals
                          </Button>
                        </Col>
                        <Col md={4} className="mb-3">
                          <Button variant="outline-success" className="w-100" onClick={() => setActiveTab('funding')}>
                            <CashStack className="me-2" /> Process Funding
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Row>
                    <Col md={6}>
                      <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-white">
                          <h6 className="mb-0">Recent Activities</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                              <div className="bg-light rounded-circle p-2 me-3">
                                <PersonCheck size={20} className="text-primary" />
                              </div>
                            </div>
                            <div>
                              <p className="mb-0">5 new supervisor registrations pending review</p>
                              <small className="text-muted">10 minutes ago</small>
                            </div>
                          </div>
                          <div className="d-flex mb-3">
                            <div className="flex-shrink-0">
                              <div className="bg-light rounded-circle p-2 me-3">
                                <FileEarmarkText size={20} className="text-info" />
                              </div>
                            </div>
                            <div>
                              <p className="mb-0">3 new research proposals submitted</p>
                              <small className="text-muted">2 hours ago</small>
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="bg-light rounded-circle p-2 me-3">
                                <CashStack size={20} className="text-success" />
                              </div>
                            </div>
                            <div>
                              <p className="mb-0">Funding request #F-2023-045 approved</p>
                              <small className="text-muted">5 hours ago</small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="shadow-sm">
                        <Card.Header className="bg-white">
                          <h6 className="mb-0">Supervisor Workload</h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between mb-2">
                            <div>Dr. Sarah Johnson</div>
                            <div className="text-muted">4/5 slots used</div>
                          </div>
                          <div className="progress mb-3" style={{ height: '10px' }}>
                            <div 
                              className="progress-bar bg-warning" 
                              role="progressbar" 
                              style={{ width: '80%' }}
                              aria-valuenow={80} 
                              aria-valuemin={0} 
                              aria-valuemax={100}
                            ></div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-2">
                            <div>Prof. Michael Chen</div>
                            <div className="text-muted">2/5 slots used</div>
                          </div>
                          <div className="progress mb-3" style={{ height: '10px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: '40%' }}
                              aria-valuenow={40} 
                              aria-valuemin={0} 
                              aria-valuemax={100}
                            ></div>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-2">
                            <div>Dr. Emily Rodriguez</div>
                            <div className="text-muted">5/5 slots used</div>
                          </div>
                          <div className="progress" style={{ height: '10px' }}>
                            <div 
                              className="progress-bar bg-danger" 
                              role="progressbar" 
                              style={{ width: '100%' }}
                              aria-valuenow={100} 
                              aria-valuemin={0} 
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="supervisors">
                  <Card className="shadow-sm">
                    <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Supervisor Management</h5>
                      <Button size="sm" variant="outline-primary">
                        <PeopleFill className="me-1" /> Add New Supervisor
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted">Manage supervisor registrations and profiles.</p>
                      
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Institution</th>
                              <th>Status</th>
                              <th>Slots Used</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr. Sarah Johnson</td>
                              <td>National University</td>
                              <td><span className="badge bg-success">Active</span></td>
                              <td>4/5</td>
                              <td>
                                <Button variant="outline-primary" size="sm" className="me-1">View</Button>
                                <Button variant="outline-danger" size="sm">Deactivate</Button>
                              </td>
                            </tr>
                            <tr>
                              <td>Prof. Michael Chen</td>
                              <td>Tech Institute</td>
                              <td><span className="badge bg-warning text-dark">Pending</span></td>
                              <td>2/5</td>
                              <td>
                                <Button variant="outline-success" size="sm" className="me-1">Approve</Button>
                                <Button variant="outline-danger" size="sm">Reject</Button>
                              </td>
                            </tr>
                            <tr>
                              <td>Dr. Emily Rodriguez</td>
                              <td>State College</td>
                              <td><span className="badge bg-success">Active</span></td>
                              <td>5/5</td>
                              <td>
                                <Button variant="outline-primary" size="sm" className="me-1">View</Button>
                                <Button variant="outline-secondary" size="sm" disabled>Full</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="proposals">
                  <Card className="shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Research Proposals</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="btn-group" role="group">
                          <Button variant="outline-primary" size="sm" active>All (45)</Button>
                          <Button variant="outline-success" size="sm">Approved (32)</Button>
                          <Button variant="outline-warning" size="sm">Pending (8)</Button>
                          <Button variant="outline-danger" size="sm">Rejected (5)</Button>
                        </div>
                        <div>
                          <Button variant="primary" size="sm">
                            <FileEarmarkText className="me-1" /> Export Data
                          </Button>
                        </div>
                      </div>
                      
                      <div className="list-group">
                        <div className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Advanced AI in Healthcare</h6>
                            <small className="text-success">
                              <CheckCircle className="me-1" /> Approved
                            </small>
                          </div>
                          <p className="mb-1">Dr. Sarah Johnson (National University)</p>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">Submitted: Oct 10, 2023</small>
                            <Button variant="outline-primary" size="sm">View Details</Button>
                          </div>
                        </div>
                        
                        <div className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Renewable Energy Solutions</h6>
                            <small className="text-warning">
                              <Clock className="me-1" /> Pending Review
                            </small>
                          </div>
                          <p className="mb-1">Prof. Michael Chen (Tech Institute)</p>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">Submitted: Oct 12, 2023</small>
                            <Button variant="outline-primary" size="sm">Review</Button>
                          </div>
                        </div>
                        
                        <div className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Blockchain for Supply Chain</h6>
                            <small className="text-danger">
                              <XCircle className="me-1" /> Rejected
                            </small>
                          </div>
                          <p className="mb-1">Dr. Emily Rodriguez (State College)</p>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">Submitted: Oct 5, 2023</small>
                            <Button variant="outline-secondary" size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="funding">
                  <Card className="shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Funding Requests</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Request ID</th>
                              <th>Research Title</th>
                              <th>Researcher</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>#F-2023-045</td>
                              <td>Advanced AI in Healthcare</td>
                              <td>Dr. Sarah Johnson</td>
                              <td>$25,000</td>
                              <td><span className="badge bg-success">Approved</span></td>
                              <td>
                                <Button variant="outline-primary" size="sm">View</Button>
                              </td>
                            </tr>
                            <tr>
                              <td>#F-2023-046</td>
                              <td>Renewable Energy Solutions</td>
                              <td>Prof. Michael Chen</td>
                              <td>$18,500</td>
                              <td><span className="badge bg-warning text-dark">Pending</span></td>
                              <td>
                                <Button variant="outline-success" size="sm" className="me-1">Approve</Button>
                                <Button variant="outline-danger" size="sm">Reject</Button>
                              </td>
                            </tr>
                            <tr>
                              <td>#F-2023-044</td>
                              <td>Blockchain for Supply Chain</td>
                              <td>Dr. Emily Rodriguez</td>
                              <td>$32,000</td>
                              <td><span className="badge bg-danger">Rejected</span></td>
                              <td>
                                <Button variant="outline-secondary" size="sm">View</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="reports">
                  <Card className="shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">Reports & Analytics</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Card className="h-100">
                            <Card.Header className="bg-white">
                              <h6>Research Domains</h6>
                            </Card.Header>
                            <Card.Body className="text-center">
                              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                <div className="text-center">
                                  <GraphUp size={48} className="text-primary mb-2" />
                                  <p>Research domain distribution chart will be displayed here</p>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6} className="mb-4">
                          <Card className="h-100">
                            <Card.Header className="bg-white">
                              <h6>Funding Allocation</h6>
                            </Card.Header>
                            <Card.Body className="text-center">
                              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                <div className="text-center">
                                  <FileEarmarkBarGraph size={48} className="text-success mb-2" />
                                  <p>Funding allocation trends will be displayed here</p>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Card>
                            <Card.Header className="bg-white">
                              <h6>Supervisor Workload</h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                <div className="text-center">
                                  <PeopleFill size={48} className="text-warning mb-2" />
                                  <p>Supervisor workload distribution will be displayed here</p>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card>
                            <Card.Header className="bg-white">
                              <h6>Approval Rates</h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                <div className="text-center">
                                  <CheckCircle size={48} className="text-info mb-2" />
                                  <p>Proposal approval rates will be displayed here</p>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="settings">
                  <Card className="shadow-sm">
                    <Card.Header className="bg-white">
                      <h5 className="mb-0">System Settings</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>System Name</Form.Label>
                          <Form.Control type="text" defaultValue="REPFMS" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Max Supervisors per Researcher</Form.Label>
                          <Form.Control type="number" defaultValue="2" min="1" max="5" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Max Researchers per Supervisor</Form.Label>
                          <Form.Control type="number" defaultValue="5" min="1" max="10" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Default Funding Cycle (days)</Form.Label>
                          <Form.Control type="number" defaultValue="365" min="30" max="730" />
                        </Form.Group>
                        
                        <Button variant="primary">Save Settings</Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

// Global styles with createGlobalStyle
const GlobalStyles = createGlobalStyle`
  :root {
    --primary: ${colors.primary};
    --secondary: ${colors.secondary};
    --success: ${colors.success};
    --info: ${colors.info};
    --warning: ${colors.warning};
    --dark: ${colors.dark};
    --light: ${colors.light};
    --gray: ${colors.gray};
    --white: ${colors.white};
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${colors.dark};
    line-height: 1.6;
    background-color: ${colors.light};
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: ${colors.dark};
    letter-spacing: -0.02em;
  }
  
  .btn {
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.3px;
    
    &-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border: none;
      box-shadow: 0 4px 6px -1px rgba(67, 97, 238, 0.2), 0 2px 4px -1px rgba(67, 97, 238, 0.06);
      
      &:hover, &:focus {
        background: linear-gradient(135deg, var(--secondary), var(--primary));
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(67, 97, 238, 0.2), 0 4px 6px -2px rgba(67, 97, 238, 0.1);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    &-outline-primary {
      color: var(--primary);
      border-color: var(--primary);
      background: transparent;
      
      &:hover, &:focus {
        background: rgba(67, 97, 238, 0.05);
        color: var(--primary);
        border-color: var(--primary);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      }
    }
  }
  
  .table {
    th {
      font-weight: 600;
      color: ${colors.gray};
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.5px;
      border-top: none;
      padding: 1rem 1.25rem;
      background-color: ${colors.light};
    }
    
    td {
      padding: 1.25rem;
      vertical-align: middle;
      border-color: rgba(0, 0, 0, 0.03);
      color: ${colors.dark};
    }
    
    tr {
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.01);
      }
    }
  }
  
  .form-control, .form-select {
    padding: 0.625rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.2s;
    
    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.15);
    }
  }
  
  .nav-tabs {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    .nav-link {
      color: ${colors.gray};
      border: none;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: transparent;
        transition: all 0.2s;
      }
      
      &:hover, &.active {
        color: var(--primary);
        background: transparent;
        border: none;
        
        &::after {
          background: var(--primary);
        }
      }
    }
  }
`;

export default function AppWithStyles(props) {
  return (
    <>
      <GlobalStyles />
      <AdminDashboard {...props} />
    </>
  );
}