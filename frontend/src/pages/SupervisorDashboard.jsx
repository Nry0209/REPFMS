// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { CheckCircle, XCircle, Clock, Trash2, Users, Award, TrendingUp, BookOpen, FileText, BarChart3 } from "lucide-react";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";


// const SupervisorDashboard = ({ auth }) => {
//   const [requests, setRequests] = useState([]);
//   const [feedbackText, setFeedbackText] = useState({});
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//   const fetchRequests = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:5000/api/supervision/requests", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setRequests(data.requests || []);
//     } catch (err) {
//       console.error("Error fetching supervision requests:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchRequests();
// }, []);

//  const handleStatusChange = async (id, status) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`http://localhost:5000/api/supervision/update/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ status }),
//     });

//     if (!res.ok) throw new Error("Failed to update status");

//     const data = await res.json();
//     setRequests((prev) =>
//       prev.map((r) => (r._id === id ? data.supervision : r))
//     );
//   } catch (err) {
//     console.error("Error updating status:", err);
//     alert("Error updating status. Try again.");
//   }
// };


// const handleFeedbackSave = async (id) => {
//   try {
//     const token = localStorage.getItem("token");
//     const feedback = feedbackText[id];

//     const res = await fetch(`http://localhost:5000/api/supervision/update/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ feedback }),
//     });

//     if (!res.ok) throw new Error("Failed to save feedback");

//     const data = await res.json();
//     setRequests((prev) =>
//       prev.map((r) => (r._id === id ? data.supervision : r))
//     );

//     alert("Feedback saved successfully!");
//   } catch (err) {
//     console.error("Error saving feedback:", err);
//     alert("Error saving feedback. Try again.");
//   }
// };

//   const handleFeedbackDelete = (id) => {
//     setFeedbackText(prev => ({ ...prev, [id]: "" }));
//     setRequests(prev => prev.map(r => (r._id === id ? { ...r, feedback: "" } : r)));
//     alert("Feedback deleted");
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: "#f59e0b", color: "#fff" }}><Clock className="me-1" size={14} />Pending Review</span>;
//       case "accepted":
//         return <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: "#10b981", color: "#fff" }}><CheckCircle className="me-1" size={14} />Active</span>;
//       case "finished":
//         return <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: "#00798c", color: "#fff" }}><Award className="me-1" size={14} />Completed</span>;
//       case "rejected":
//         return <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: "#dc2626", color: "#fff" }}><XCircle className="me-1" size={14} />Rejected</span>;
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8fafc" }}>
//         <div className="text-center">
//           <div className="spinner-border" style={{ width: "3rem", height: "3rem", color: "#00798c" }} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <h4 className="mt-3" style={{ color: "#0d3b66" }}>Loading Dashboard...</h4>
//         </div>
//       </div>
//     );
//   }

//   // Extract last name from auth.name like "Dr. Noora" => "Noora"
//   const dashboardName = (() => {
//     if (!auth.name) return "Supervisor";
//     const parts = auth.name.trim().split(" ");
//     // If starts with Dr., Professor or such, safely skip
//     if (parts.length > 1 && parts[0].toLowerCase().startsWith("dr")) return parts.slice(1).join(" ");
//     return auth.name;
//   })();

//   return (
//     <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc" }}>
//       <DashboardHeader auth={auth} />

//       <main className="flex-grow-1" style={{ paddingBottom: "50px" }}>
//         <div className="d-flex">
//           {/* Sidebar */}
//           <div className="text-white position-sticky top-0" style={{
//             width: "300px",
//             minHeight: "100vh",
//             height: "auto",
//             background: "linear-gradient(180deg, #0d3b66 0%, #00798c 100%)",
//             boxShadow: "4px 0 15px rgba(13, 59, 102, 0.2)"
//           }}>
//             <div className="py-4 px-4" style={{ minHeight: "100vh" }}>
//               {/* Logo and Header */}
//               <div className="text-center mb-4 pb-4" style={{ borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
//                 <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg" style={{ width: "80px", height: "80px" }}>
//                   <img src="/emblem.png" alt="Ministry Logo" className="rounded-circle" style={{ width: "55px", height: "55px" }} />
//                 </div>
//                 <h5 className="fw-bold mb-2" style={{ fontSize: "1.2rem", lineHeight: "1.4" }}>Ministry of Science & Technology</h5>
//                 <small className="text-light opacity-90 d-block mb-1" style={{ fontSize: "0.9rem" }}>Research Supervision Portal</small>
//                 <small className="text-light opacity-90" style={{ fontSize: "0.9rem" }}>Sri Lanka</small>
//               </div>

//               {/* Nav Links */}
//               <nav className="nav flex-column gap-2 mt-3">
//                 <Link className="nav-link text-white d-flex align-items-center py-3 px-4 rounded government-nav-link" to="/dashboard/overview" style={{ transition: "all 0.3s ease", fontSize: "0.95rem" }}>
//                   <BarChart3 className="me-3" size={18} />
//                   <span className="fw-medium">Dashboard Overview</span>
//                 </Link>
//                 <Link className="nav-link text-white d-flex align-items-center py-3 px-4 rounded government-nav-link" to="/dashboard/requests" style={{ transition: "all 0.3s ease", fontSize: "0.95rem" }}>
//                   <FileText className="me-3" size={18} />
//                   <span className="fw-medium">Supervision Requests</span>
//                 </Link>
//                 <Link className="nav-link text-white d-flex align-items-center py-3 px-4 rounded government-nav-link" to="/dashboard/feedback" style={{ transition: "all 0.3s ease", fontSize: "0.95rem" }}>
//                   <TrendingUp className="me-3" size={18} />
//                   <span className="fw-medium">Feedback Management</span>
//                 </Link>
//                 <Link className="nav-link text-white d-flex align-items-center py-3 px-4 rounded government-nav-link" to="/dashboard/ongoing" style={{ transition: "all 0.3s ease", fontSize: "0.95rem" }}>
//                   <Clock className="me-3" size={18} />
//                   <span className="fw-medium">Ongoing Projects</span>
//                 </Link>
//                 <Link className="nav-link text-white d-flex align-items-center py-3 px-4 rounded government-nav-link" to="/dashboard/completed" style={{ transition: "all 0.3s ease", fontSize: "0.95rem" }}>
//                   <Award className="me-3" size={18} />
//                   <span className="fw-medium">Completed Projects</span>
//                 </Link>
//               </nav>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-grow-1 p-4">
//             {/* Header */}
//             <div className="mb-4">
//               <div className="card border-0 shadow-lg" style={{ background: "linear-gradient(135deg, #0d3b66 0%, #00798c 100%)" }}>
//                 <div className="card-body text-white p-5">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center">
//                       <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-4 shadow" style={{ width: "80px", height: "80px" }}>
//                         <Users style={{ color: "#0d3b66" }} size={40} />
//                       </div>
//                       <div>
//                         <h1 className="h2 fw-bold mb-2">Supervision Dashboard</h1>
//                         <p className="mb-1 opacity-90" style={{ fontSize: "1.1rem" }}>Welcome, {dashboardName}</p>
//                         <p className="mb-0 opacity-75" style={{ fontSize: "0.95rem" }}>Ministry of Science & Technology - Research Division</p>
//                       </div>
//                     </div>
//                     <div className="text-end">
//                       <div className=" bg-opacity-20 rounded p-3">
//                         <small className="text-light d-block opacity-75">Today's Date</small>
//                         <strong>{new Date().toLocaleDateString('en-GB')}</strong>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stats cards and table */}
//             <div className="row g-4 mb-4">
//               {[
//                 { status: "pending", color: "#f59e0b", icon: Clock, title: "Pending Requests", subtitle: "Requires Review" },
//                 { status: "accepted", color: "#10b981", icon: TrendingUp, title: "Active Projects", subtitle: "In Progress" },
//                 { status: "finished", color: "#00798c", icon: Award, title: "Completed", subtitle: "Successfully Finished" },
//                 { status: "rejected", color: "#dc2626", icon: XCircle, title: "Rejected", subtitle: "Not Approved" }
//               ].map(({ status, color, icon: Icon, title, subtitle }) => (
//                 <div className="col-lg-3 col-md-6" key={status}>
//                   <div className="card border-0 shadow-sm h-100 government-stat-card" style={{ borderLeft: `5px solid ${color}` }}>
//                     <div className="card-body d-flex align-items-center">
//                       <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "60px", height: "60px", backgroundColor: `${color}22` }}>
//                         <Icon style={{ color }} size={28} />
//                       </div>
//                       <div>
//                         <h3 className="h2 fw-bold mb-1" style={{ color: "#0d3b66" }}>{requests.filter(r => r.status === status).length}</h3>
//                         <h6 className="fw-semibold text-muted mb-0">{title}</h6>
//                         <small className="text-muted">{subtitle}</small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Requests Management Table */}
//             <div className="card border-0 shadow-lg mb-4">
//               <div className="card-header text-white p-4" style={{ background: "linear-gradient(135deg, #0d3b66 0%, #00798c 100%)" }}>
//                 <div className="d-flex align-items-center justify-content-between">
//                   <div className="d-flex align-items-center">
//                     <BookOpen className="me-4" size={28} />
//                     <div>
//                       <h3 className="fw-bold mb-1" style={{ fontSize: "1.3rem" }}>Research Supervision Requests Management</h3>
//                       <p className="mb-0 opacity-90" style={{ fontSize: "0.9rem" }}>Ministry of Science & Technology - Research Funding Division</p>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <small className="opacity-75">Total Applications</small>
//                     <div className="h4 fw-bold mb-0">{requests.length}</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="card-body p-0">
//                 <div className="table-responsive">
//                   <table className="table table-hover mb-0 government-table">
//                     <thead style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
//                       <tr>
//                         <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>#</th>
//                         <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>Researcher</th>
//                         <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>Research Title</th>
//                         {/* <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>Budget (LKR)</th> */}
//                         <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>Duration</th>
//                         <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>Status</th>
//                         <th className="fw-bold text-uppercase py-4 px-4" style={{ color: "#0d3b66", fontSize: "0.8rem", letterSpacing: "1px" }}>Actions</th>
//                       </tr>
//                     </thead>
//                    <tbody>
//   {requests.map((req, index) => (
//     <React.Fragment key={req._id}>
//       <tr style={{ borderLeft: "4px solid transparent" }} className="government-table-row">
//         <td className="fw-bold py-4 px-4" style={{ color: "#0d3b66" }}>{String(index + 1).padStart(2, '0')}</td>

//         {/* Researcher */}
//         <td className="py-4 px-4">
//           <Link
//             to={`/researcher/${req.researcher?._id}`}
//             className="text-decoration-none fw-bold d-flex align-items-center"
//             style={{ color: "#00798c" }}
//           >
//             <div className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
//                  style={{ width: "40px", height: "40px", fontSize: "14px", backgroundColor: "#00798c" }}>
//               {req.researcher?.name?.split(' ').map(n => n[0]).join('')}
//             </div>
//             <div>
//               <div className="fw-bold">{req.researcher?.name || "Unknown"}</div>
//               <small className="text-muted">Principal Investigator</small>
//             </div>
//           </Link>
//         </td>

//         {/* Project Title */}
//         <td className="py-4 px-4">
//           <div className="fw-semibold" style={{ color: "#0d3b66" }}>{req.projectTitle}</div>
//           <small className="text-muted">Research Project</small>
//         </td>

//         {/* Duration */}
//         <td className="py-4 px-4">
//           <div className="fw-medium" style={{ color: "#0d3b66" }}>{req.durationMonths || "N/A"}</div>
//           <small className="text-muted">Project Duration</small>
//         </td>

//         {/* Status */}
//         <td className="py-4 px-4">{getStatusBadge(req.status)}</td>

//         {/* Actions */}
//         <td className="py-4 px-4">
//           {req.status === "pending" ? (
//             <div className="btn-group" role="group">
//               <button
//                 onClick={() => handleStatusChange(req._id, "accepted")}
//                 className="btn btn-sm fw-semibold px-3 py-2"
//                 style={{ backgroundColor: "#10b981", borderColor: "#10b981", color: "#fff" }}
//               >
//                 <CheckCircle size={14} className="me-1" />
//                 Approve
//               </button>
//               <button
//                 onClick={() => handleStatusChange(req._id, "rejected")}
//                 className="btn btn-sm fw-semibold px-3 py-2"
//                 style={{ backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff" }}
//               >
//                 <XCircle size={14} className="me-1" />
//                 Reject
//               </button>
//             </div>
//           ) : (
//             <button className="btn btn-sm px-3 py-2" style={{ backgroundColor: "#e2e8f0", color: "#64748b" }} disabled>
//               Processed
//             </button>
//           )}
//         </td>
//       </tr>

//                          {/* Feedback Section */}
//       {req.status === "accepted" && (
//         <tr style={{ backgroundColor: "#f8fafc" }}>
//           <td colSpan="7">
//             <div className="p-4">
//               <div className="card border shadow-sm" style={{ borderColor: "#00798c" }}>
//                 <div className="card-header py-3" style={{ backgroundColor: "#e0f7fa", borderColor: "#00798c" }}>
//                   <h6 className="card-title d-flex align-items-center mb-0" style={{ color: "#0d3b66" }}>
//                     <FileText size={18} className="me-2" />
//                     Official Supervision Feedback - {req.researcher?.name || "Unknown"}
//                   </h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="mb-3">
//                     <label className="form-label fw-semibold" style={{ color: "#0d3b66" }}>
//                       Supervisor Comments & Guidance
//                     </label>
//                     <textarea
//                       value={feedbackText[req._id] || ""}
//                       onChange={(e) => setFeedbackText({ ...feedbackText, [req._id]: e.target.value })}
//                       className="form-control"
//                       rows="4"
//                       placeholder="Provide official feedback, progress evaluation, and guidance for this research project..."
//                       style={{ borderColor: "#cbd5e1", fontSize: "0.95rem" }}
//                     />
//                   </div>
//                   <div className="btn-group" role="group">
//                     <button
//                       onClick={() => handleFeedbackSave(req._id)}
//                       className="btn fw-semibold px-4 py-2"
//                       style={{ backgroundColor: "#00798c", borderColor: "#00798c", color: "#fff" }}
//                     >
//                       <CheckCircle size={16} className="me-2" />
//                       Save Official Feedback
//                     </button>
//                     <button
//                       onClick={() => handleFeedbackDelete(req._id)}
//                       className="btn btn-outline-danger fw-semibold px-4 py-2"
//                     >
//                       <Trash2 size={16} className="me-2" />
//                       Clear Feedback
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </td>
//         </tr>
//       )}
//     </React.Fragment>
//   ))}
// </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <DashboardFooter />

//       <style jsx>{`
//         .government-nav-link:hover {
//           background-color: rgba(255, 255, 255, 0.15) !important;
//           transform: translateX(8px);
//           transition: all 0.3s ease;
//           border-left: 3px solid #fff;
//           padding-left: 1rem !important;
//         }

//         .government-stat-card:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 8px 25px rgba(13, 59, 102, 0.15) !important;
//           transition: all 0.3s ease;
//         }

//         .government-table-row:hover {
//           background-color: rgba(0, 121, 140, 0.05) !important;
//           border-left-color: #00798c !important;
//         }

//         .government-table tbody tr {
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .card {
//           transition: all 0.3s ease;
//         }

//         .btn:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SupervisorDashboard;


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
      <DashboardHeader auth={auth} />

      <main className="flex-grow-1" style={{ paddingBottom: "50px" }}>
        <div className="d-flex">
          {/* Sidebar */}
          <div
            className="text-white position-sticky top-0"
            style={{
              width: "300px",
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
                  Ministry of Science & Technology
                </h5>
                <small className="text-light d-block mb-1">
                  Research Supervision Portal
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

