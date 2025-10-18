import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Dropdown, Tabs, Tab, Table, Badge, Button, Form,
  Spinner, ProgressBar, ListGroup, ListGroupItem, Alert
} from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { 
  Download, Funnel, BarChart as BarChartIcon, PieChart as PieChartIcon, 
  GraphUp as LineChartIcon, FileText, Calendar, ArrowRepeat as RefreshCw, 
  FileEarmarkArrowDown as FileExport, People, Clock, CurrencyDollar, PersonCheck,
  GraphUp
} from 'react-bootstrap-icons';

// Create aliases for components to match the JSX
const Progress = ProgressBar;
const List = ListGroup;
const ListItem = ListGroup.Item;

// Make sure GraphUp is available
const GraphUpIcon = GraphUp;

const AnalyticsReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('last_year');
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('summary');
  
  // Empty datasets (no mock data)
  const [reportData, setReportData] = useState({
    fundingTrends: [],
    researchDomains: [],
    supervisorLoad: [],
    rejectionReasons: [],
    studentProgress: [],
    publicationTrends: []
  });

  useEffect(() => {
    // No mock fetching; keep empty until integrated with API
    setReportData({
      fundingTrends: [],
      researchDomains: [],
      supervisorLoad: [],
      rejectionReasons: [],
      studentProgress: [],
      publicationTrends: []
    });
    setLoading(false);
  }, [timeRange]);

  // No mock data generation functions

  const COLORS = ['#0d6efd', '#198754', '#ffc107', '#0dcaf0', '#6c757d'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded">
          <p className="mb-0 fw-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} className="mb-0" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'amount' ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderOverviewTab = () => (
    <Row className="g-4">
      {/* Funding Trends */}
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
      
      {/* Research Domains */}
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

      {/* Supervisor Load */}
      <Col xl={6}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Supervisor Workload</h5>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  <Download />
                </Button>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reportData.supervisorLoad}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  <Legend />
                  <Bar dataKey="utilization" name="Utilization" fill="#0d6efd" radius={[0, 4, 4, 0]}>
                    {reportData.supervisorLoad.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.utilization > 80 ? '#dc3545' : entry.utilization > 60 ? '#ffc107' : '#198754'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Student Progress */}
      <Col xl={6}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Student Progress</h5>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  <Download />
                </Button>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="months" 
                    name="Months Enrolled" 
                    unit="mos"
                    domain={[0, 60]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="progress" 
                    name="Progress" 
                    unit="%"
                    domain={[0, 100]}
                  />
                  <ZAxis dataKey="expected" name="Expected Duration" range={[60, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Legend />
                  <Scatter name="Students" data={reportData.studentProgress} fill="#0d6efd">
                    {reportData.studentProgress.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.progress > 80 ? '#198754' : entry.progress > 50 ? '#ffc107' : '#dc3545'} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderResearchTab = () => (
    <Row className="g-4">
      <Col xl={8}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Publication Trends</h5>
              <div className="d-flex gap-2">
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>Last 5 Years</option>
                  <option>Last 10 Years</option>
                  <option>All Time</option>
                </Form.Select>
                <Button variant="outline-secondary" size="sm">
                  <Download />
                </Button>
              </div>
            </div>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportData.publicationTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" stroke="#0d6efd" />
                  <YAxis yAxisId="right" orientation="right" stroke="#198754" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="publications" name="Publications" stroke="#0d6efd" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="citations" name="Citations" stroke="#198754" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xl={4}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Research Impact</h5>
              <Button variant="outline-secondary" size="sm">
                <Download />
              </Button>
            </div>
            <div className="text-center mb-4 text-muted">No research impact data available.</div>
            
            <div className="mt-4">
              <h6>Top Research Areas</h6>
              {reportData.researchDomains.map((domain, index) => (
                <div key={index} className="mb-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{domain.name}</span>
                    <span className="fw-semibold">{domain.value}%</span>
                  </div>
                  <ProgressBar 
                    now={domain.value} 
                    variant={index % 2 === 0 ? 'primary' : 'success'} 
                    style={{ height: '6px' }} 
                  />
                </div>
              ))}
              {reportData.researchDomains.length === 0 && (
                <div className="text-muted">No domain breakdown available.</div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderFinancialTab = () => (
    <Row className="g-4">
      <Col xl={8}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Budget Allocation</h5>
              <div className="d-flex gap-2">
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>Current Year</option>
                  <option>Last Year</option>
                  <option>Last 5 Years</option>
                </Form.Select>
                <Button variant="outline-secondary" size="sm">
                  <Download />
                </Button>
              </div>
            </div>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="used" name="Used" fill="#198754" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xl={4}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Financial Summary</h5>
              <Button variant="outline-secondary" size="sm">
                <Download />
              </Button>
            </div>
            <div className="text-muted">No financial summary available.</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderStudentTab = () => (
    <Row className="g-4">
      <Col xl={8}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Student Progress</h5>
              <div className="d-flex gap-2">
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>All Programs</option>
                  <option>PhD</option>
                  <option>MSc</option>
                </Form.Select>
                <Button variant="outline-secondary" size="sm">
                  <Download />
                </Button>
              </div>
            </div>
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="months" 
                    name="Months Enrolled" 
                    unit="mos"
                    domain={[0, 60]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="progress" 
                    name="Progress" 
                    unit="%"
                    domain={[0, 100]}
                  />
                  <ZAxis dataKey="expected" name="Expected Duration" range={[60, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Legend />
                  <Scatter name="Students" data={reportData.studentProgress} fill="#0d6efd">
                    {reportData.studentProgress.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.progress > 80 ? '#198754' : entry.progress > 50 ? '#ffc107' : '#dc3545'} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xl={4}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Student Statistics</h5>
              <Button variant="outline-secondary" size="sm">
                <Download />
              </Button>
            </div>
            
            <div className="row text-center mb-4">
              <div className="col-6 mb-3">
                <div className="p-3 bg-light rounded">
                  <div className="h2 mb-1">124</div>
                  <div className="text-muted small">Total Students</div>
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="p-3 bg-light rounded">
                  <div className="h2 mb-1">24</div>
                  <div className="text-muted small">New This Year</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded">
                  <div className="h2 mb-1">3.8</div>
                  <div className="text-muted small">Avg. GPA</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded">
                  <div className="h2 mb-1">92%</div>
                  <div className="text-muted small">Retention Rate</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h6>Program Distribution</h6>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'PhD', value: 45 },
                        { name: 'MSc', value: 55 },
                        { name: 'MPhil', value: 24 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#0d6efd" />
                      <Cell fill="#198754" />
                      <Cell fill="#ffc107" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h6>Upcoming Milestones</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">Thesis Defense</div>
                    <small className="text-muted">John Smith - May 15, 2023</small>
                  </div>
                  <Badge bg="primary">PhD</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">Proposal Defense</div>
                    <small className="text-muted">Emily Chen - June 2, 2023</small>
                  </div>
                  <Badge bg="success">MSc</Badge>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Analytics & Reports</h2>
          <p className="text-muted mb-0">Comprehensive insights and analytics</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <FileExport className="me-2" />
            Export Report
          </Button>
          <Button variant="primary">
            <RefreshCw className="me-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        id="analytics-tabs"
      >
        <Tab eventKey="overview" title={
          <span><GraphUp className="me-1" /> Overview</span>
        } />
        <Tab eventKey="research" title={
          <span><FileText className="me-1" /> Research Analytics</span>
        } />
        <Tab eventKey="financial" title={
          <span><CurrencyDollar className="me-1" /> Financial Reports</span>
        } />
        <Tab eventKey="students" title={
          <span><People className="me-1" /> Student Analytics</span>
        } />
      </Tabs>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'research' && renderResearchTab()}
          {activeTab === 'financial' && renderFinancialTab()}
          {activeTab === 'students' && renderStudentTab()}
        </>
      )}
    </div>
  );
};

export default AnalyticsReports;
