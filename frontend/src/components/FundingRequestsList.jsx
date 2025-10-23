import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const FundingRequestsList = ({ onValidate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasonById, setReasonById] = useState({});

  const fetchPending = useCallback(async () => {
    try {
      const token = localStorage.getItem('supervisorToken');
      const res = await fetch('http://localhost:5000/api/funding/supervisor/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load funding requests');
      setItems(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  if (loading) return <div>Loading...</div>;

  if (!items.length) return <div className="text-muted">No pending funding requests.</div>;

  return (
    <div className="table-responsive">
      <Table hover size="sm" className="align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Project</th>
            <th>Researcher</th>
            <th>Requested</th>
            <th>Justification</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it._id}>
              <td>{i + 1}</td>
              <td>{it.projectTitle}</td>
              <td>{it.researcher?.fullName || '-'}</td>
              <td>{it.requestedAmount}</td>
              <td className="text-truncate" style={{ maxWidth: 240 }}>{it.justification || '-'}</td>
              <td style={{ minWidth: 220 }}>
                <Form.Control
                  size="sm"
                  placeholder="Optional reason"
                  value={reasonById[it._id] || ''}
                  onChange={(e) => setReasonById((p) => ({ ...p, [it._id]: e.target.value }))}
                />
              </td>
              <td>
                <Button
                  size="sm"
                  variant="success"
                  className="me-2"
                  onClick={async () => {
                    await onValidate?.(it._id, true, reasonById[it._id] || '');
                    fetchPending();
                  }}
                >
                  Validate
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={async () => {
                    await onValidate?.(it._id, false, reasonById[it._id] || '');
                    fetchPending();
                  }}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FundingRequestsList;
