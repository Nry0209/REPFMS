import React, { useState, useEffect } from "react";
import {CheckCircle,XCircle,Clock,Award,TrendingUp,FileText,BarChart3,
} from "lucide-react";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

const SupervisorDashboard = ({ auth }) => {
  const [requests, setRequests] = useState([]);
  const [feedbackText, setFeedbackText] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/supervision/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Error fetching supervision requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/supervision/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? data.supervision : r))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status. Try again.");
    }
  };

  const handleFeedbackSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const feedback = feedbackText[id];

      const res = await fetch(`http://localhost:5000/api/supervision/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback }),
      });

      if (!res.ok) throw new Error("Failed to save feedback");

      const data = await res.json();
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? data.supervision : r))
      );

      alert("Feedback saved successfully!");
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("Error saving feedback. Try again.");
    }
  };

  const handleFeedbackDelete = (id) => {
    setFeedbackText((prev) => ({ ...prev, [id]: "" }));
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, feedback: "" } : r))
    );
    alert("Feedback deleted");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span
            className="badge fs-6 px-3 py-2"
            style={{ backgroundColor: "#f59e0b", color: "#fff" }}
          >
            <Clock className="me-1" size={14} /> Pending Review
          </span>
        );
      case "accepted":
        return (
          <span
            className="badge fs-6 px-3 py-2"
            style={{ backgroundColor: "#10b981", color: "#fff" }}
          >
            <CheckCircle className="me-1" size={14} /> Active
          </span>
        );
      case "finished":
        return (
          <span
            className="badge fs-6 px-3 py-2"
            style={{ backgroundColor: "#00798c", color: "#fff" }}
          >
            <Award className="me-1" size={14} /> Completed
          </span>
        );
      case "rejected":
        return (
          <span
            className="badge fs-6 px-3 py-2"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
          >
            <XCircle className="me-1" size={14} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{ width: "3rem", height: "3rem", color: "#00798c" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3" style={{ color: "#0d3b66" }}>
            Loading Dashboard...
          </h4>
        </div>
      </div>
    );
  }

  const dashboardName = (() => {
    if (!auth.name) return "Supervisor";
    const parts = auth.name.trim().split(" ");
    if (parts.length > 1 && parts[0].toLowerCase().startsWith("dr"))
      return parts.slice(1).join(" ");
    return auth.name;
  })();

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <DashboardHeader  />

      <main className="flex-grow-1" style={{ paddingBottom: "50px" }}>
        <div className="d-flex">
          {/* Sidebar */}
          <div
            className="text-white"
            style={{
              width: "300px",
              position: "static",
              minHeight: "100vh",
              background:
                "linear-gradient(180deg, #0d3b66 0%, #00798c 100%)",
              boxShadow: "4px 0 15px rgba(13, 59, 102, 0.2)",
            }}
          >
            <div className="py-4 px-4" style={{ minHeight: "100vh" }}>
              {/* Logo and Header */}
              <div
                className="text-center mb-4 pb-4"
                style={{
                  borderBottom: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg"
                  style={{ width: "80px", height: "80px" }}
                >
                  <img
                    src="/emblem.png"
                    alt="Ministry Logo"
                    className="rounded-circle"
                    style={{ width: "55px", height: "55px" }}
                  />
                </div>
                <h5 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
                  Research Supervision Portal
                </h5>
                <small className="text-light d-block mb-1">
                  Ministry of Science & Technology
                </small>
                <small className="text-light">Sri Lanka</small>
              </div>

              {/* Scroll-based Nav Links */}
              <nav className="nav flex-column gap-2 mt-3">
                {[
                  { id: "overview-section", icon: BarChart3, label: "Dashboard Overview" },
                  { id: "requests-section", icon: FileText, label: "Supervision Requests" },
                  { id: "feedback-section", icon: TrendingUp, label: "Feedback Management" },
                  { id: "ongoing-section", icon: Clock, label: "Ongoing Projects" },
                  { id: "completed-section", icon: Award, label: "Completed Projects" },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    className="nav-link text-white d-flex align-items-center py-3 px-4 rounded government-nav-link border-0 bg-transparent text-start"
                    onClick={() =>
                      document
                        .getElementById(id)
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    style={{ transition: "all 0.3s ease", fontSize: "0.95rem" }}
                  >
                    <Icon className="me-3" size={18} />
                    <span className="fw-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow-1 p-4">
            {/* Overview Section */}
            <section id="overview-section" className="mb-5">
              <div className="card border-0 shadow-lg mb-4" style={{ background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
                <div className="card-body text-white p-5 d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="fw-bold">Supervision Dashboard</h1>
                    <p className="mb-1">Welcome, {dashboardName}</p>
                    <p className="opacity-75">Ministry of Science & Technology - Research Division</p>
                  </div>
                  <div className="text-end">
                    <small className="text-light d-block">Today's Date</small>
                    <strong>{new Date().toLocaleDateString("en-GB")}</strong>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="row g-4">
                {[
                  { status: "pending", color: "#f59e0b", icon: Clock, title: "Pending Requests", subtitle: "Requires Review" },
                  { status: "accepted", color: "#10b981", icon: TrendingUp, title: "Active Projects", subtitle: "In Progress" },
                  { status: "finished", color: "#00798c", icon: Award, title: "Completed", subtitle: "Successfully Finished" },
                  { status: "rejected", color: "#dc2626", icon: XCircle, title: "Rejected", subtitle: "Not Approved" },
                ].map(({ status, color, icon: Icon, title, subtitle }) => (
                  <div className="col-lg-3 col-md-6" key={status}>
                    <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `5px solid ${color}` }}>
                      <div className="card-body d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "60px", height: "60px", backgroundColor: `${color}22` }}>
                          <Icon style={{ color }} size={28} />
                        </div>
                        <div>
                          <h3 className="fw-bold mb-1" style={{ color: "#0d3b66" }}>{requests.filter(r => r.status === status).length}</h3>
                          <h6 className="fw-semibold text-muted mb-0">{title}</h6>
                          <small className="text-muted">{subtitle}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Requests Section */}
            <section id="requests-section" className="mb-5">
              <div className="card border-0 shadow-lg">
                <div className="card-header text-white p-4" style={{ background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
                  <h3 className="fw-bold mb-1">Research Supervision Requests Management</h3>
                  <p className="mb-0">Ministry of Science & Technology - Research Funding Division</p>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                        <tr>
                          <th>#</th>
                          <th>Researcher</th>
                          <th>Research Title</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req, i) => (
                          <React.Fragment key={req._id}>
                            <tr>
                              <td>{i + 1}</td>
                              <td>{req.researcher?.name}</td>
                              <td>{req.projectTitle}</td>
                              <td>{req.durationMonths || "N/A"}</td>
                              <td>{getStatusBadge(req.status)}</td>
                              <td>
                                {req.status === "pending" ? (
                                  <>
                                    <button
                                      className="btn btn-sm btn-success me-2"
                                      onClick={() => handleStatusChange(req._id, "accepted")}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleStatusChange(req._id, "rejected")}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button className="btn btn-sm btn-secondary" disabled>
                                    Processed
                                  </button>
                                )}
                              </td>
                            </tr>

                            {/* Feedback Section */}
                            {req.status === "accepted" && (
                              <tr style={{ backgroundColor: "#f8fafc" }}>
                                <td colSpan="6">
                                  <div className="p-4">
                                    <label className="fw-semibold text-dark">Supervisor Feedback</label>
                                    <textarea
                                      value={feedbackText[req._id] || ""}
                                      onChange={(e) =>
                                        setFeedbackText({ ...feedbackText, [req._id]: e.target.value })
                                      }
                                      className="form-control mb-3"
                                      rows="3"
                                      placeholder="Provide feedback for this research..."
                                    />
                                    <button
                                      onClick={() => handleFeedbackSave(req._id)}
                                      className="btn btn-primary me-2"
                                    >
                                      Save Feedback
                                    </button>
                                    <button
                                      onClick={() => handleFeedbackDelete(req._id)}
                                      className="btn btn-outline-danger"
                                    >
                                      Clear
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default SupervisorDashboard;

// import React, { useState, useEffect } from "react";
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   Award,
//   TrendingUp,
//   FileText,
//   BarChart3,
// } from "lucide-react";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const SupervisorDashboard = ({ auth }) => {
//   const [requests, setRequests] = useState([]);
//   const [feedbackText, setFeedbackText] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [toasts, setToasts] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("http://localhost:5000/api/supervision/requests", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setRequests(data.requests || []);
//       } catch (err) {
//         console.error("Error fetching supervision requests:", err);
//         setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Failed to fetch requests." }]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const handleStatusChange = async (id, status) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`http://localhost:5000/api/supervision/update/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ status }),
//       });
//       if (!res.ok) throw new Error("Failed to update status");
//       const data = await res.json();
//       setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
//       setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Status updated successfully." }]);
//     } catch (err) {
//       console.error("Error updating status:", err);
//       setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Failed to update status." }]);
//     }
//   };

//   const handleFeedbackSave = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const feedback = feedbackText[id];
//       const res = await fetch(`http://localhost:5000/api/supervision/update/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ feedback }),
//       });
//       if (!res.ok) throw new Error("Failed to save feedback");
//       const data = await res.json();
//       setRequests((prev) => prev.map((r) => (r._id === id ? data.supervision : r)));
//       setToasts((t) => [...t, { id: Date.now(), bg: "success", text: "Feedback saved successfully." }]);
//     } catch (err) {
//       console.error("Error saving feedback:", err);
//       setToasts((t) => [...t, { id: Date.now(), bg: "danger", text: "Failed to save feedback." }]);
//     }
//   };

//   const handleFeedbackDelete = (id) => {
//     setFeedbackText((prev) => ({ ...prev, [id]: "" }));
//     setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, feedback: "" } : r)));
//     setToasts((t) => [...t, { id: Date.now(), bg: "warning", text: "Feedback cleared." }]);
//   };

//   const getStatusBadge = (status) => {
//     const variants = {
//       pending: { color: "#f59e0b", label: "Pending Review", Icon: Clock },
//       accepted: { color: "#10b981", label: "Active", Icon: CheckCircle },
//       finished: { color: "#00798c", label: "Completed", Icon: Award },
//       rejected: { color: "#dc2626", label: "Rejected", Icon: XCircle },
//     };
//     const v = variants[status];
//     if (!v) return null;
//     return (
//       <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: v.color, color: "#fff" }}>
//         <v.Icon className="me-1" size={14} /> {v.label}
//       </span>
//     );
//   };

//   const dashboardName = (() => {
//     if (!auth.name) return "Supervisor";
//     const parts = auth.name.trim().split(" ");
//     if (parts.length > 1 && parts[0].toLowerCase().startsWith("dr"))
//       return parts.slice(1).join(" ");
//     return auth.name;
//   })();

//   if (loading) {
//     return (
//       <>
//         <DashboardHeader auth={auth} />
//         <div className="my-5 text-center">
//           <div className="spinner-border text-primary" role="status"></div>
//           <p className="mt-3">Loading Dashboard...</p>
//         </div>
//         <DashboardFooter />
//       </>
//     );
//   }

//   return (
//     <>
//       <DashboardHeader auth={auth} />

//       <div className="container my-5">
//         {/* Welcome Card */}
//         <div className="card bg-primary text-white shadow mb-4 p-4">
//           <h2>Welcome, {dashboardName}!</h2>
//           <p>Manage research supervision requests and track project status.</p>
//         </div>

//         {/* Status Overview Cards */}
//         <div className="row mb-4">
//           {["pending", "accepted", "finished", "rejected"].map((status) => (
//             <div className="col-md-3 mb-3" key={status}>
//               <div className="card shadow-sm h-100 p-3">
//                 <h5>{status.charAt(0).toUpperCase() + status.slice(1)}</h5>
//                 <p className="mb-0">{requests.filter((r) => r.status === status).length}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Requests Table */}
//         <div className="card shadow mb-4">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Supervision Requests</h5>
//           </div>
//           <div className="card-body table-responsive">
//             <table className="table table-hover">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Researcher</th>
//                   <th>Title</th>
//                   <th>Duration</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {requests.map((req, i) => (
//                   <React.Fragment key={req._id}>
//                     <tr>
//                       <td>{i + 1}</td>
//                       <td>{req.researcher?.name}</td>
//                       <td>{req.projectTitle}</td>
//                       <td>{req.durationMonths || "N/A"}</td>
//                       <td>{getStatusBadge(req.status)}</td>
//                       <td>
//                         {req.status === "pending" ? (
//                           <>
//                             <button
//                               className="btn btn-sm btn-success me-2"
//                               onClick={() => handleStatusChange(req._id, "accepted")}
//                             >
//                               Approve
//                             </button>
//                             <button
//                               className="btn btn-sm btn-danger"
//                               onClick={() => handleStatusChange(req._id, "rejected")}
//                             >
//                               Reject
//                             </button>
//                           </>
//                         ) : (
//                           <button className="btn btn-sm btn-secondary" disabled>
//                             Processed
//                           </button>
//                         )}
//                       </td>
//                     </tr>

//                     {req.status === "accepted" && (
//                       <tr style={{ backgroundColor: "#f8fafc" }}>
//                         <td colSpan="6">
//                           <textarea
//                             value={feedbackText[req._id] || ""}
//                             onChange={(e) =>
//                               setFeedbackText({ ...feedbackText, [req._id]: e.target.value })
//                             }
//                             className="form-control mb-2"
//                             rows="3"
//                             placeholder="Provide feedback..."
//                           />
//                           <button
//                             className="btn btn-primary me-2"
//                             onClick={() => handleFeedbackSave(req._id)}
//                           >
//                             Save
//                           </button>
//                           <button
//                             className="btn btn-outline-danger"
//                             onClick={() => handleFeedbackDelete(req._id)}
//                           >
//                             Clear
//                           </button>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <DashboardFooter />

//       {/* Toast Container */}
//       <div
//         aria-live="polite"
//         aria-atomic="true"
//         className="position-fixed bottom-0 end-0 p-3"
//         style={{ zIndex: 2000 }}
//       >
//         {toasts.map((t) => (
//           <div
//             key={t.id}
//             className={`toast show text-white bg-${t.bg}`}
//             role="alert"
//             style={{ minWidth: "250px", marginBottom: "5px" }}
//           >
//             <div className="toast-body">{t.text}</div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default SupervisorDashboard;
