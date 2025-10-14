import React, { useEffect, useState } from "react";
import { getSupervisionRequests } from "../../api/supervisors";

const SupervisionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupervisionRequests()
      .then((data) => setRequests(data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="p-4 bg-white shadow rounded mb-6">
      <h2 className="text-xl font-semibold mb-4">Supervision Requests</h2>
      {requests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{req.title}</p>
                <p className="text-sm text-gray-600">Researcher: {req.researcher}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  req.status === "Approved"
                    ? "bg-green-200 text-green-700"
                    : req.status === "Pending"
                    ? "bg-yellow-200 text-yellow-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {req.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SupervisionRequests;
