import React, { useEffect, useState } from "react";
import { getSupervisorFeedback, giveFeedback } from "../../api/supervisors";

const Feedback = ({ supervisorId = 1 }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupervisorFeedback(supervisorId)
      .then((data) => setFeedbacks(data))
      .finally(() => setLoading(false));
  }, [supervisorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    const response = await giveFeedback(Date.now(), newFeedback);
    if (response.success) {
      setFeedbacks([
        ...feedbacks,
        { id: response.id, supervisorId, researcher: "You", feedback: newFeedback }
      ]);
      setNewFeedback("");
    }
  };

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="p-2 border rounded">
              <p className="font-medium">{fb.researcher}:</p>
              <p className="text-gray-700">{fb.feedback}</p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newFeedback}
          onChange={(e) => setNewFeedback(e.target.value)}
          placeholder="Write feedback..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Feedback;
