// src/pages/ResearcherPendingProjects.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

const ResearcherPendingProjects = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/researcher/auth?mode=login");
          return;
        }
        const res = await fetch("http://localhost:5000/api/researchers/pending-projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to load projects");
        setProjects(data.data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [navigate]);

  const getStatusBadge = (status) => (
    <Badge bg={status === "Pending" ? "warning" : status === "Current" ? "primary" : "success"}>{status}</Badge>
  );

  return (
    <>
      <DashboardHeader />
      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h3>Pending Projects Matching Your Domains</h3>
            <p className="text-muted">Browse projects from other researchers that align with your domains.</p>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : projects.length === 0 ? (
          <p className="text-muted">No pending projects found. Try again later.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Domains</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>
                      {p.domains?.map((d, i) => (
                        <Badge key={i} bg="info" className="me-1">{d}</Badge>
                      ))}
                    </td>
                    <td>{p.researcher?.fullName || "-"}</td>
                    <td>{getStatusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/researcher/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </Container>
      <DashboardFooter />
    </>
  );
};

export default ResearcherPendingProjects;
