import React, { useEffect, useState } from "react";
import { Container, Card, Table, Button, Badge, Spinner, Alert } from "react-bootstrap";

const DomainVerification = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/ministry/supervisions/pending-verification");
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to load pending verifications");
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError(e.message || "Failed to load data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (id) => {
    try {
      setVerifyingId(id);
      const res = await fetch(`http://localhost:5000/api/ministry/supervisions/${id}/verify-domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Verification failed");
      // remove item from list on success
      setItems((prev) => prev.filter((x) => String(x._id) !== String(id)));
    } catch (e) {
      alert(e.message || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Domain Verification</h2>
          <div className="text-muted">Approve supervision requests whose domains overlap</div>
        </div>
        <Button variant="outline-primary" onClick={fetchPending} disabled={loading}>
          Refresh
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <div className="mt-2">Loading pending verifications...</div>
            </div>
          ) : error ? (
            <Alert variant="danger" className="mb-0">{error}</Alert>
          ) : items.length === 0 ? (
            <div className="text-center text-muted py-5">No pending items</div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Researcher</th>
                    <th>Supervisor</th>
                    <th>Project Title</th>
                    <th>Research Domains</th>
                    <th>Supervisor Domains</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it._id}>
                      <td>
                        <div className="fw-medium">{it.researcher?.fullName || "-"}</div>
                        <div className="small text-muted">{it.researcher?.email || ""}</div>
                      </td>
                      <td>
                        <div className="fw-medium">{it.supervisor?.name || "-"}</div>
                        <div className="small text-muted">{it.supervisor?.email || ""}</div>
                      </td>
                      <td>{it.projectTitle || it.research?.title || '-'}</td>
                      <td>
                        {(it.research?.domains || it.researcher?.domains || []).map((d, i) => (
                          <Badge key={i} bg="info" className="me-1">{d}</Badge>
                        ))}
                      </td>
                      <td>
                        {(it.supervisor?.domains || []).map((d, i) => (
                          <Badge key={i} bg="secondary" className="me-1">{d}</Badge>
                        ))}
                      </td>
                      <td>
                        <Button size="sm" onClick={() => verify(it._id)} disabled={verifyingId === it._id}>
                          {verifyingId === it._id ? "Verifying..." : "Verify Domain"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DomainVerification;
