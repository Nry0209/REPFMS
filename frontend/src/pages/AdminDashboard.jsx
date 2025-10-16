import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Nav, 
  Button, 
  Badge,
  ProgressBar,
  ListGroup
} from 'react-bootstrap';
import { 
  LayoutSidebar, 
  HouseDoor, 
  People, 
  FileEarmarkText, 
  CurrencyDollar, 
  Gear, 
  BoxArrowRight,
  GraphUp,
  Calendar,
  Envelope,
  Bell,
  Search,
  PersonCircle,
  ThreeDotsVertical,
  ArrowUp,
  ArrowDown,
  PersonCheck, 
  Cash,
  PersonPlus,
  PersonX,
  FileText,
  Clock,
  FileEarmarkArrowDown as FileExport,
  ArrowRepeat as RefreshCw
} from 'react-bootstrap-icons';
import SupervisorApprovals from './admin/SupervisorApprovals';
import ResearchProposals from './admin/ResearchProposals';
import FundingReview from './admin/FundingReview';
import SupervisionAllocation from './admin/SupervisionAllocation';
import AnalyticsReports from './admin/AnalyticsReports';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ auth, setAuth }) => {
  const theme = {
    primary: '#0d3b66',
    success: '#28a745',
    warning: '#ffc107',
    accent: '#0dcaf0'
  };
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Navigation items for Ministry Admin
  const navItems = [
    { id: 'dashboard', icon: <HouseDoor size={20} />, label: 'Dashboard' },
    { id: 'supervisors', icon: <People size={20} />, label: 'Supervisor Approvals', badge: 5 },
    { id: 'proposals', icon: <FileEarmarkText size={20} />, label: 'Research Proposals' },
    { id: 'funding', icon: <CurrencyDollar size={20} />, label: 'Funding Review', badge: 12 },
    { id: 'supervision', icon: <People size={20} />, label: 'Supervision Allocation' },
    { id: 'reports', icon: <GraphUp size={20} />, label: 'Analytics & Reports' },
  ];

  // Stats data for Ministry Dashboard
  const stats = [
    { 
      title: 'Pending Supervisor Approvals', 
      value: '17', 
      change: '+3', 
      trend: 'up',
      icon: <People size={24} className="text-warning" />,
      link: '#supervisors',
      onClick: () => navigate('/admin/supervisors')
    },
    { 
      title: 'Proposals for Review', 
      value: '24', 
      change: '+8', 
      trend: 'up',
      icon: <FileEarmarkText size={24} className="text-info" />,
      link: '#proposals',
      onClick: () => navigate('/admin/proposals')
    },
    { 
      title: 'Funding Requests', 
      value: '12', 
      change: '-4', 
      trend: 'down',
      icon: <CurrencyDollar size={24} className="text-primary" />,
      link: '#funding',
      onClick: () => navigate('/admin/funding')
    },
    { 
      title: 'Supervision Slots Used', 
      value: '84%', 
      change: '+5%', 
      trend: 'up',
      icon: <People size={24} className="text-success" />,
      progress: 84
    },
  ];

  // Recent activities for Ministry Dashboard
  const activities = [
    { 
      id: 1, 
      user: 'Dr. Sarah Johnson', 
      action: 'applied for supervisor role', 
      time: '15 min ago', 
      type: 'approval',
      status: 'pending',
      onClick: () => navigate('/admin/supervisors')
    },
    { 
      id: 2, 
      user: 'Research Team Alpha', 
      action: 'submitted proposal for funding', 
      details: 'AI in Healthcare', 
      time: '1 hour ago', 
      type: 'proposal',
      status: 'review',
      onClick: () => navigate('/admin/proposals')
    },
    { 
      id: 3, 
      user: 'Dr. Michael Chen', 
      action: 'reached 90% supervision capacity', 
      time: '3 hours ago', 
      type: 'alert',
      status: 'warning',
      onClick: () => navigate('/admin/allocations')
    },
    { 
      id: 4, 
      user: 'Funding Committee', 
      action: 'approved funding for', 
      details: 'Renewable Energy Project', 
      amount: 'LKR 15,000',
      time: '1 day ago', 
      type: 'funding',
      status: 'approved',
      onClick: () => navigate('/admin/funding')
    },
  ];

  // Quick actions for Ministry Admin
  const quickActions = [
    { 
      id: 1, 
      title: 'Review New Supervisors', 
      icon: <PersonCheck size={24} />, 
      variant: 'primary',
      onClick: () => navigate('/admin/supervisors')
    },
    { 
      id: 2, 
      title: 'Process Proposals', 
      icon: <FileEarmarkText size={24} />, 
      variant: 'info',
      onClick: () => navigate('/admin/proposals')
    },
    { 
      id: 3, 
      title: 'Approve Funding', 
      icon: <Cash size={24} />, 
      variant: 'success',
      onClick: () => navigate('/admin/funding')
    },
    { 
      id: 4, 
      title: 'Manage Allocations', 
      icon: <People size={24} />, 
      variant: 'warning',
      onClick: () => navigate('/admin/allocations')
    },
  ];

  // System stats for Ministry Dashboard
  const systemStats = [
    { 
      title: 'Supervisor Capacity', 
      value: '78%', 
      progress: 78, 
      variant: 'warning',
      onClick: () => navigate('/admin/allocations')
    },
    { 
      title: 'Funding Utilization', 
      value: '65%', 
      progress: 65, 
      variant: 'info',
      onClick: () => navigate('/admin/funding')
    },
    { 
      title: 'Proposal Review Time', 
      value: '3.2 days', 
      progress: 68, 
      variant: 'success',
      onClick: () => navigate('/admin/proposals')
    },
  ];

  const handleStatClick = (stat) => {
    if (stat.onClick) {
      stat.onClick();
    } else {
      console.log(`Stat clicked: ${stat.title}`);
    }
  };

  const handleActivityClick = (activity) => {
    if (activity.onClick) {
      activity.onClick();
    } else {
      console.log(`Activity clicked: ${activity.action}`);
    }
  };

  const handleQuickAction = (action) => {
    if (action.onClick) {
      action.onClick();
    } else {
      console.log(`Action clicked: ${action.title}`);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}
        style={{
          width: sidebarOpen ? '280px' : '80px',
          transition: 'all 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
          overflowY: 'auto',
          backgroundColor: '#0d3b66',
          borderRight: `1px solid #e2e8f0`,
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
        }}
      >
        <div className="d-flex align-items-center p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h4 className={`m-0 text-white ${!sidebarOpen ? 'd-none' : ''}`} style={{ fontWeight: 600 }}>Admin Panel</h4>
          <Button 
            variant="link" 
            className="text-decoration-none p-0 ms-auto"
            onClick={toggleSidebar}
            style={{ color: 'white' }}
          >
            <LayoutSidebar size={24} />
          </Button>
        </div>
        
        <Nav className="flex-column p-3">
          {navItems.map((item) => (
            <Nav.Link
              key={item.id}
              href={`#${item.id}`}
              className={`d-flex align-items-center py-3 px-3 mb-1 rounded-3 ${
                activeTab === item.id ? 'active-nav-item' : ''
              }`}
              style={{
                backgroundColor: activeTab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'rgba(255,255,255,0.8)',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id);
              }}
            >
              <span className="me-3">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Nav.Link>
          ))}
          
          <div className="mt-auto pt-3 border-top">
            <Nav.Link 
              className="d-flex align-items-center py-3 px-3 rounded-3"
              style={{
                color: '#dc3545',
                ':hover': {
                  backgroundColor: 'rgba(220, 53, 69, 0.1)'
                }
              }}
              onClick={() => {
                // Handle logout
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminInfo');
                setAuth({ ...auth, admin: false });
              }}
            >
              <BoxArrowRight size={20} className="me-3" />
              {sidebarOpen && <span>Logout</span>}
            </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content */}
      <div 
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? '280px' : '80px',
          transition: 'margin 0.3s ease',
          padding: '24px',
          backgroundColor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0" style={{ color: '#0d3b66', fontWeight: 600 }}>
            {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <div className="d-flex align-items-center">
            <div className="position-relative me-3">
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input 
                type="text" 
                className="form-control ps-5" 
                placeholder="Search..." 
                style={{ minWidth: '250px' }}
              />
            </div>
            <Button variant="light" className="rounded-circle p-2 me-2 position-relative">
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Button>
            <Button variant="light" className="rounded-circle p-2 me-2">
              <Envelope size={20} />
            </Button>
            <div className="dropdown">
              <Button 
                variant="light" 
                className="d-flex align-items-center"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <PersonCircle size={32} className="me-2" />
                <span className="d-none d-md-inline">Admin User</span>
                <ThreeDotsVertical className="ms-2" />
              </Button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#profile">Profile</a></li>
                <li><a className="dropdown-item" href="#settings">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a 
                    className="dropdown-item text-danger" 
                    href="#logout"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.removeItem('adminToken');
                      localStorage.removeItem('adminInfo');
                      setAuth({ ...auth, admin: false });
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <Row className="g-4 mb-4">
              {stats.map((stat, index) => (
                <Col key={index} md={6} lg={3}>
                  <Card className="h-100 border-0 shadow-sm" style={{ 
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(13, 59, 102, 0.1)'
                    }
                  }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="text-muted mb-1">{stat.title}</h6>
                          <h3 className="mb-0">{stat.value}</h3>
                        </div>
                        <div style={{
                          backgroundColor: stat.trend === 'up' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: stat.trend === 'up' ? '#34c759' : '#e53e3e',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}>
                            {stat.trend === 'up' ? <ArrowUp size={14} className="me-1" /> : <ArrowDown size={14} className="me-1" />}
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {stat.icon}
                        </div>
                        <div className="flex-grow-1">
                          <ProgressBar 
                            now={stat.progress} 
                            variant={index % 2 === 0 ? 'primary' : 'accent'}
                            style={{
                              backgroundColor: index % 2 === 0 ? '#0d3b66' : '#168aad',
                              height: '6px',
                              borderRadius: '3px'
                            }} 
                            className="mb-0"
                          />
                          <small className="text-muted">{stat.progress}% Complete</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Main Content Area */}
            <Row className="g-4">
              {/* Recent Activities */}
              <Col lg={8}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Ministry Activities</h5>
                      <Button variant="link" className="text-decoration-none p-0">View All</Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      {activities.map(activity => (
                        <ListGroup.Item key={activity.id} className="border-0 px-0 py-3" onClick={() => handleActivityClick(activity)}>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: 'rgba(49, 130, 206, 0.1)',
                                width: '40px',
                                height: '40px',
                                color: '#168aad'
                              }}
                            >
                              <PersonCircle size={20} className="text-muted" />
                            </div>
                            <div className="ms-3 flex-grow-1">
                              <p className="mb-0">
                                <strong>{activity.user}</strong> {activity.action}
                                {activity.project && <span>: {activity.project}</span>}
                                {activity.amount && <span> of {activity.amount}</span>}
                              </p>
                              <small className="text-muted">{activity.time}</small>
                            </div>
                            <Badge 
                              style={{
                                backgroundColor: activity.type === 'project' 
                                  ? '#0d3b66' 
                                  : activity.type === 'funding'
                                    ? '#34c759'
                                    : '#168aad',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                              className="text-uppercase"
                            >
                              {activity.type}
                            </Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Quick Actions */}
              <Col lg={4}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Ministry Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      {quickActions.map(action => (
                        <Col key={action.id} xs={6}>
                          <Button 
                            className="w-100 d-flex flex-column align-items-center justify-content-center p-4 rounded-3"
                            style={{ 
                              height: '120px',
                              backgroundColor: action.variant === 'primary' 
                                ? theme.primary 
                                : action.variant === 'success'
                                  ? theme.success
                                  : action.variant === 'warning'
                                    ? theme.warning
                                    : theme.accent,
                              color: 'white',
                              border: 'none',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }
                            }}
                          >
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                                 style={{ 
                                   width: '48px', 
                                   height: '48px',
                                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                   backdropFilter: 'blur(5px)'
                                 }}>
                              {action.icon}
                            </div>
                            <span className="mt-2">{action.title}</span>
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>

                {/* System Status */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Supervision Capacity</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Supervisor Capacity</span>
                        <span>84% Used</span>
                      </div>
                      <ProgressBar now={84} variant={84 > 80 ? 'danger' : 'primary'} style={{ height: '8px', borderRadius: '4px' }} />
                      <small className="text-muted">High: Dr. Smith (92%)</small>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Funding Utilization</span>
                        <span>68% Allocated</span>
                      </div>
                      <ProgressBar now={68} variant="info" style={{ height: '8px', borderRadius: '4px' }} />
                      <small className="text-muted">LKR 245,000 remaining</small>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Proposal Review Time</span>
                        <span>3.2 days</span>
                      </div>
                      <ProgressBar now={65} variant="success" style={{ height: '8px', borderRadius: '4px' }} />
                      <small className="text-muted">Target: 5 days</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Tab Content */}
        {activeTab === 'supervisors' && <SupervisorApprovals />}
        {activeTab === 'proposals' && <ResearchProposals />}
        {activeTab === 'funding' && <FundingReview />}
        {activeTab === 'supervision' && <SupervisionAllocation />}
        {activeTab === 'reports' && <AnalyticsReports />}
        {activeTab === 'settings' && (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4>System Settings</h4>
              <p className="text-muted">System configuration and preferences.</p>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;