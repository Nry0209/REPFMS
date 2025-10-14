import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Dropdown, Tabs, Tab, Table, Badge, Button, Form } from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Download, Funnel, BarChart as BarChartIcon, PieChart as PieChartIcon, 
  GraphUp as LineChartIcon, FileText, Calendar, ArrowRepeat as RefreshCw, 
  FileEarmarkArrowDown as FileExport, People
} from 'react-bootstrap-icons';

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('last_year');
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('summary');
  
  // Mock data - replace with actual API calls
  const [reportData, setReportData] = useState({
    fundingTrends: [],
    researchDomains: [],
    supervisorLoad: [],
    rejectionReasons: []
  });

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      setLoading(true);
      try {
        // This would be replaced with actual API calls
        setTimeout(() => {
          // Mock data based on time range
          const mockData = {
            fundingTrends: getFundingTrendsData(timeRange),
            researchDomains: getResearchDomainsData(timeRange),
            supervisorLoad: getSupervisorLoadData(timeRange),
            rejectionReasons: getRejectionReasonsData(timeRange)
          };
          setReportData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Mock data generation functions
  const getFundingTrendsData = (range) => {
    // This would be replaced with actual data from the API
    if (range === 'last_year') {
      return [
        { name: 'Jan', amount: 40000 },
        { name: 'Feb', amount: 30000 },
        { name: 'Mar', amount: 50000 },
        { name: 'Apr', amount: 27800 },
        { name: 'May', amount: 18900 },
        { name: 'Jun', amount: 23900 },
        { name: 'Jul', amount: 34900 },
        { name: 'Aug', amount: 42000 },
        { name: 'Sep', amount: 38000 },
        { name: 'Oct', amount: 45000 },
        { name: 'Nov', amount: 52000 },
        { name: 'Dec', amount: 48000 },
      ];
    } else {
      // Other time ranges would have different data
      return [];
    }
  };

  const getResearchDomainsData = () => {
    return [
      { name: 'AI & Machine Learning', value: 35 },
      { name: 'Data Science', value: 25 },
      { name: 'Cybersecurity', value: 20 },
      { name: 'Cloud Computing', value: 15 },
      { name: 'Other', value: 5 },
    ];
  };

  const getSupervisorLoadData = () => {
    return [
      { name: 'Dr. Smith', current: 4, max: 5, utilization: 80 },
      { name: 'Dr. Johnson', current: 3, max: 6, utilization: 50 },
      { name: 'Dr. Williams', current: 5, max: 5, utilization: 100 },
      { name: 'Dr. Brown', current: 2, max: 5, utilization: 40 },
      { name: 'Dr. Davis', current: 4, max: 5, utilization: 80 },
    ];
  };

  const getRejectionReasonsData = () => {
    return [
      { reason: 'Incomplete Documentation', count: 15 },
      { reason: 'Insufficient Justification', count: 12 },
      { reason: 'Budget Mismatch', count: 8 },
      { reason: 'Scope Too Broad', count: 6 },
      { reason: 'Methodology Issues', count: 4 },
    ];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm">
          <p className="mb-0 fw-semibold">{label}</p>
          <p className="mb-0">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const renderOverviewTab = () => (
    <Row className="g-4">
      <Col xl={8}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Funding Trends</h5>
              <div className="d-flex gap-2">
                <Form.Select 
                  size="sm" 
                  style={{ width: '150px' }}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="last_month">Last Month</option>
                  <option value="last_quarter">Last Quarter</option>
                  <option value="last_year">Last Year</option>
                  <option value="all_time">All Time</option>
                </Form.Select>
                <Button variant="outline-secondary" size="sm">
                  <Download />
                </Button>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={reportData.fundingTrends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0d6efd" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    name="Funding Amount"
                    stroke="#0d6efd"
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xl={4}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Research Domains</h5>
              <Button variant="outline-secondary" size="sm">
                <Download />
              </Button>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.researchDomains}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportData.researchDomains.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xl={6}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Supervisor Load</h5>
              <Button variant="outline-secondary" size="sm">
                <Download />
              </Button>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.supervisorLoad}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'utilization') {
                        return [`${value}%`, 'Utilization'];
                      }
                      return [value, name === 'current' ? 'Current' : 'Max'];
                    }}
                  />
                  <Bar dataKey="current" name="Current" fill="#0d6efd" radius={[0, 4, 4, 0]}
                    label={{ position: 'insideRight', fill: 'white' }}>
                    {reportData.supervisorLoad.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.utilization >= 90 ? '#dc3545' : entry.utilization >= 75 ? '#ffc107' : '#198754'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xl={6}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Rejection Reasons</h5>
              <Button variant="outline-secondary" size="sm">
                <Download />
              </Button>
            </div>
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Reason</th>
                  <th className="text-end">Count</th>
                  <th className="text-end">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {reportData.rejectionReasons.map((item, index) => {
                  const total = reportData.rejectionReasons.reduce((sum, curr) => sum + curr.count, 0);
                  const percentage = ((item.count / total) * 100).toFixed(1);
                  
                  return (
                    <tr key={index}>
                      <td>{item.reason}</td>
                      <td className="text-end">{item.count}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end">
                          <span className="me-2">{percentage}%</span>
                          <div style={{ width: '100px' }}>
                            <div 
                              className="bg-primary rounded" 
                              style={{ 
                                width: `${percentage}%`, 
                                height: '8px',
                                backgroundColor: COLORS[index % COLORS.length] 
                              }} 
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderReportsTab = () => (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Generate Reports</h5>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm">
              <RefreshCw size={16} className="me-1" /> Refresh Data
            </Button>
          </div>
        </div>
        
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100 border">
              <Card.Body className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <BarChartIcon size={32} className="text-primary" />
                </div>
                <h5>Funding Report</h5>
                <p className="text-muted mb-4">Detailed breakdown of funding allocations, expenditures, and trends.</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary">
                    <Download className="me-2" /> Generate Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 border">
              <Card.Body className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <PieChartIcon size={32} className="text-success" />
                </div>
                <h5>Research Domain Analysis</h5>
                <p className="text-muted mb-4">Analysis of research areas, trends, and publication metrics.</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-success">
                    <Download className="me-2" /> Generate Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 border">
              <Card.Body className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <People size={32} className="text-info" />
                </div>
                <h5>Supervisor Performance</h5>
                <p className="text-muted mb-4">Evaluation of supervisor workload, student progress, and outcomes.</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-info">
                    <Download className="me-2" /> Generate Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 border">
              <Card.Body className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <FileText size={32} className="text-warning" />
                </div>
                <h5>Proposal Status Report</h5>
                <p className="text-muted mb-4">Status tracking and analysis of research proposals.</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-warning">
                    <Download className="me-2" /> Generate Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 border">
              <Card.Body className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <Calendar size={32} className="text-danger" />
                </div>
                <h5>Annual Performance</h5>
                <p className="text-muted mb-4">Comprehensive annual performance and activity report.</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-danger">
                    <Download className="me-2" /> Generate Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 border">
              <Card.Body className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <FileExport size={32} className="text-secondary" />
                </div>
                <h5>Custom Report</h5>
                <p className="text-muted mb-4">Create a custom report with your specific criteria.</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-secondary">
                    <Download className="me-2" /> Create Custom Report
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Analytics & Reports</h2>
          <p className="text-muted mb-0">Gain insights and generate detailed reports</p>
        </div>
        <div>
          <Button variant="outline-primary" className="me-2">
            <Download className="me-2" /> Export Data
          </Button>
          <Button variant="primary">
            <FileText className="me-2" /> Create Custom Report
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="overview" title="Overview" />
        <Tab eventKey="reports" title="Reports" />
        <Tab eventKey="custom" title="Custom Analytics" />
      </Tabs>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'reports' && renderReportsTab()}
          {activeTab === 'custom' && (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="py-5">
                  <BarChartIcon size={48} className="text-muted mb-3" />
                  <h4>Custom Analytics</h4>
                  <p className="text-muted mb-4">
                    Create custom analytics dashboards and queries based on your specific needs.
                  </p>
                  <Button variant="primary">
                    Create Custom Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsReports;
