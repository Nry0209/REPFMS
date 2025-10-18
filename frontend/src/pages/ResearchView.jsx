import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

export default function ResearchView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [research, setResearch] = useState(null);
  const [supervisors, setSupervisors] = useState([]);

  // Use same storage key your login sets
  const token =
    localStorage.getItem("researcherToken") || localStorage.getItem("token");

  // Normalize URLs coming from backend (serve absolute when needed)
  const toAbsolute = (u) => {
    if (!u) return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    const path = u.startsWith("/") ? u : `/${u}`;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const API = "http://localhost:5000"; // absolute URL avoids proxy issues
        const [r1, r2] = await Promise.all([
          fetch(`${API}/api/researchers/research/${id}`, { headers }).then((r) => r.json()),
          fetch(`${API}/api/researchers/research/${id}/supervisors`, { headers }).then((r) => r.json()),
        ]);
        if (!cancelled) {
          if (!r1?.success) throw new Error(r1?.message || "Failed to load research");
          setResearch(r1.data);
          if (r2?.success) setSupervisors(r2.data || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const requestSupervision = async (supervisorId) => {
    try {
      const API = "http://localhost:5000";
      const res = await fetch(`${API}/api/researchers/research/${id}/request-supervision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supervisorId }),
      }).then((r) => r.json());

      if (!res?.success) throw new Error(res?.message || "Request failed");
      // Navigate to Pending Requests or show a success notice
      alert("Request sent successfully");
      navigate("/researcher/dashboard");
    } catch (e) {
      alert(e.message || "Failed to send request");
    }
  };

  if (loading) return (
    <>
      <DashboardHeader auth={{ researcher: true }} setAuth={() => {}} />
      <div className="container py-3">Loading...</div>
      <DashboardFooter />
    </>
  );
  if (error) return (
    <>
      <DashboardHeader auth={{ researcher: true }} setAuth={() => {}} />
      <div className="container py-3 text-danger">{error}</div>
      <DashboardFooter />
    </>
  );

  return (
    <>
      <DashboardHeader auth={{ researcher: true }} setAuth={() => {}} />
      <div className="container py-3">
        <button onClick={() => navigate(-1)} className="btn btn-link p-0 mb-3">
          ← Back
        </button>

        <div className="card mb-3">
          <div className="card-body">
            <h4 className="card-title mb-3">Ongoing Research</h4>
            {research && (
              <div className="row g-2 align-items-center">
                <div className="col-12"><b>Title:</b> {research.title}</div>
                <div className="col-12"><b>Domains:</b> {(research.domains || []).join(", ")}</div>
                {research.paperUrl && (
                  <div className="col-12">
                    <b>Paper:</b>{" "}
                    <a
                      className="btn btn-sm btn-outline-primary ms-2"
                      href={toAbsolute(research.paperUrl)}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      Download Research Paper
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <h5 className="mb-3">Compatible Supervisors</h5>
        {supervisors.length === 0 && (
          <div className="alert alert-warning">No compatible supervisors found.</div>
        )}

        <div className="row g-3">
          {supervisors.map((s) => {
            const img = s.profileImage ? toAbsolute(s.profileImage) : "/profile-placeholder.png";
            return (
              <div className="col-12 col-sm-6 col-lg-4" key={s._id}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={img}
                        alt={s.name}
                        style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
                        onError={(e) => { e.currentTarget.src = "/profile-placeholder.png"; }}
                      />
                      <div>
                        <div className="fw-semibold">{s.name}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{s.domain}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      {s.googleScholar && (
                        <a href={s.googleScholar} target="_blank" rel="noreferrer" className="me-2">
                          Google Scholar
                        </a>
                      )}
                      {s.scopus && (
                        <a href={s.scopus} target="_blank" rel="noreferrer">
                          Scopus
                        </a>
                      )}
                    </div>
                    <div className="mt-auto">
                      <button
                        disabled={!s.available}
                        onClick={() => requestSupervision(s._id)}
                        className={`btn btn-sm mt-3 ${s.available ? "btn-primary" : "btn-secondary"}`}
                      >
                        {s.available ? "Request Supervision" : "Not Available"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DashboardFooter />
    </>
  );
}
