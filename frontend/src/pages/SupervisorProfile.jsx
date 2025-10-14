// import React, { useEffect, useState } from "react";
// import {Card,Container,Row,Col,Badge,ListGroup,Button,Form,Modal} from "react-bootstrap";
// import {User,Mail,Phone,Calendar,Award,Star,Building,Clock,CheckCircle,Edit2} from "lucide-react";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";
// import axios from "axios";

// const SupervisorProfile = ({ auth }) => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState(false);

//   // Edit modal states
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editField, setEditField] = useState("");
//   const [editValue, setEditValue] = useState("");
//   const [editType, setEditType] = useState("text");
//   const [imageFile, setImageFile] = useState(null);

//   // Editing state for inline edits
//   const [editing, setEditing] = useState({
//     skills: false,
//     awards: false,
//     qualifications: false,
//     profileImage: false,
//   });

//   // Form inputs for arrays (comma-separated)
//   const [inputs, setInputs] = useState({
//     skills: "",
//     awards: "",
//     qualifications: "",
//   });

//   // File input for profile image
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Active":
//         return (
//           <Badge bg="success">
//             <CheckCircle size={14} className="me-1" />
//             Active
//           </Badge>
//         );
//       case "Completed":
//         return (
//           <Badge bg="info">
//             <Award size={14} className="me-1" />
//             Completed
//           </Badge>
//         );
//       case "Under Review":
//         return (
//           <Badge bg="warning">
//             <Clock size={14} className="me-1" />
//             Under Review
//           </Badge>
//         );
//       default:
//         return <Badge bg="secondary">{status}</Badge>;
//     }
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // 🔥 FIX: Get token directly from localStorage - same way your dashboard does it
//         const token = localStorage.getItem("supervisorToken");

//         console.log("=== Profile Debug ===");
//         console.log("Token from localStorage:", token ? "EXISTS" : "MISSING");
//         console.log("Token length:", token?.length);
//         console.log("First 20 chars:", token?.substring(0, 20));

//         if (!token) {
//           console.error("❌ No token found in localStorage");
//           setError("Authentication token not found. Please sign in again.");
//           setLoading(false);
//           return;
//         }

//         const apiUrl = "http://localhost:5000";
        
//         console.log("Making request to:", `${apiUrl}/api/supervisors/profile`);
//         console.log("Authorization header:", `Bearer ${token.substring(0, 20)}...`);

//         const res = await axios.get(`${apiUrl}/api/supervisors/profile`, {
//           headers: { 
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         });

//         console.log("✅ Profile response received:", res.data);

//         if (res.data && res.data.supervisor) {
//           setProfile(res.data.supervisor);
//           setInputs({
//             skills: (res.data.supervisor.skills || []).join(", "),
//             awards: (res.data.supervisor.awards || []).join(", "),
//             qualifications: (res.data.supervisor.qualifications || []).join(", ")
//           });
//         } else {
//           console.error("❌ Invalid response structure");
//           setError("Invalid response from server");
//         }
//       } catch (err) {
//         console.error("❌ Fetch profile error:", err);
//         console.error("Error response:", err.response?.data);
//         console.error("Error status:", err.response?.status);
        
//         if (err.response?.status === 401) {
//           setError("Session expired. Please log in again.");
//           // Optionally clear localStorage and redirect
//           localStorage.removeItem("supervisorToken");
//           localStorage.removeItem("supervisorInfo");
//         } else if (err.response?.status === 404) {
//           setError("Profile not found.");
//         } else {
//           setError(err.response?.data?.message || "Failed to load profile.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const startEdit = (field) => setEditing((prev) => ({ ...prev, [field]: true }));

//   const cancelEdit = (field) => {
//     setEditing((prev) => ({ ...prev, [field]: false }));
//     setInputs({
//       skills: (profile?.skills || []).join(", "),
//       awards: (profile?.awards || []).join(", "),
//       qualifications: (profile?.qualifications || []).join(", ")
//     });
//     setSelectedImage(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setInputs((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setSelectedImage(file);
//   };

//   const handleSave = async (field) => {
//     setSaving(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("supervisorToken");
//       if (!token) throw new Error("Not authenticated");

//       const apiUrl = "http://localhost:5000";
//       const formData = new FormData();

//       if (field === "skills") {
//         formData.append(
//           "skills",
//           JSON.stringify(
//             inputs.skills.split(",").map((s) => s.trim()).filter(Boolean)
//           )
//         );
//       }

//       if (field === "awards") {
//         formData.append(
//           "awards",
//           JSON.stringify(
//             inputs.awards.split(",").map((s) => s.trim()).filter(Boolean)
//           )
//         );
//       }

//       if (field === "qualifications") {
//         formData.append(
//           "qualifications",
//           JSON.stringify(
//             inputs.qualifications.split(",").map((s) => s.trim()).filter(Boolean)
//           )
//         );
//       }

//       if (field === "profileImage" && selectedImage) {
//         console.log("Uploading profile image:", selectedImage);
//         formData.append("profileImage", selectedImage);
//       }

//       console.log("Sending update request for field:", field);

//       const res = await axios.put(`${apiUrl}/api/supervisors/profile`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       console.log("Update response:", res.data);

//       if (res.data && res.data.supervisor) {
//         setProfile(res.data.supervisor);
//         setInputs({
//           skills: (res.data.supervisor.skills || []).join(", "),
//           awards: (res.data.supervisor.awards || []).join(", "),
//           qualifications: (res.data.supervisor.qualifications || []).join(", ")
//         });
//         setEditing((prev) => ({ ...prev, [field]: false }));
//         setSelectedImage(null);
//         alert("Updated successfully!");
//       } else {
//         throw new Error(res.data?.message || "Update failed");
//       }
//     } catch (err) {
//       console.error("Save error:", err.response?.data || err.message || err);
//       setError(err.response?.data?.message || err.message || "Update failed");
//       alert("Error: " + (err.response?.data?.message || err.message || "Update failed"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleProfileUpdate = async (field, value) => {
//     try {
//       setUpdating(true);
//       const token = localStorage.getItem("supervisorToken");

//       let formData = new FormData();
//       if (field === "profileImage") {
//         if (!imageFile) throw new Error("No image file selected");
//         formData.append("profileImage", imageFile);
//       } else {
//         formData.append(field, value);
//       }

//       const response = await axios.put(
//         "http://localhost:5000/api/supervisors/profile",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//           }
//         }
//       );

//       if (response.data.success || response.data.supervisor) {
//         setProfile(response.data.supervisor);
//         setShowEditModal(false);
//         setImageFile(null);
//         setError(null);
//         alert("Profile updated successfully!");
//       } else {
//         throw new Error(response.data.message || "Update failed");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       setError(error.response?.data?.message || error.message || "Failed to update profile");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Edit Modal Component
//   const EditModal = () => (
//     <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit {editField}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {editType === "file" ? (
//           <Form.Group>
//             <Form.Control
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files[0])}
//             />
//           </Form.Group>
//         ) : (
//           <Form.Group>
//             <Form.Control
//               type={editType}
//               value={editValue}
//               onChange={(e) => setEditValue(e.target.value)}
//             />
//           </Form.Group>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={() => handleProfileUpdate(editField, editValue)}
//           disabled={updating}
//         >
//           {updating ? "Saving..." : "Save Changes"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   const InfoRow = ({ icon, label, value, editable, field, type = "text" }) => (
//     <div className="d-flex align-items-center mb-3 justify-content-between">
//       <div className="d-flex align-items-center">
//         <div className="me-3 text-muted">{icon}</div>
//         <div>
//           <small className="text-muted d-block">{label}</small>
//           <span className="fw-medium">{value || "-"}</span>
//         </div>
//       </div>
//       {editable && (
//         <Button
//           variant="link"
//           className="p-0 text-primary"
//           onClick={() => {
//             setEditField(field);
//             setEditValue(value || "");
//             setEditType(type);
//             setShowEditModal(true);
//           }}
//         >
//           <Edit2 size={16} />
//         </Button>
//       )}
//     </div>
//   );

//   const ProfileImage = () => {
//     const getImageUrl = () => {
//       console.log("Profile image value:", profile.profileImage);
      
//       // If no profile image or it's the default placeholder
//       if (!profile.profileImage || profile.profileImage === "/profile-placeholder.png") {
//         return "/profile-placeholder.png";
//       }
      
//       // If it's a string path (updated from backend)
//       if (typeof profile.profileImage === 'string') {
//         if (profile.profileImage.startsWith("/uploads")) {
//           return `http://localhost:5000${profile.profileImage}`;
//         }
//         if (profile.profileImage.startsWith("http")) {
//           return profile.profileImage;
//         }
//         return `http://localhost:5000/uploads/supervisors/profileImages/${profile.profileImage}`;
//       }
      
//       // If it's an object with path property (from database)
//       if (profile.profileImage?.path) {
//         if (profile.profileImage.path === "/profile-placeholder.png") {
//           return "/profile-placeholder.png";
//         }
//         return `http://localhost:5000${profile.profileImage.path}`;
//       }

//       return "/profile-placeholder.png";
//     };

//     return (
//       <div className="text-center mb-4 position-relative">
//         <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
//              style={{ width: "120px", height: "120px" }}>
//           <img
//             src={getImageUrl()}
//             alt="Profile"
//             className="rounded-circle shadow-sm"
//             style={{ 
//               width: "100px", 
//               height: "100px", 
//               objectFit: "cover",
//               border: "2px solid #fff"
//             }}
//             onError={(e) => {
//               console.error("Failed to load image:", e.target.src);
//               e.target.src = "/profile-placeholder.png";
//             }}
//           />
//           <Button
//             variant="primary"
//             size="sm"
//             className="position-absolute"
//             style={{ bottom: "0", right: "0" }}
//             onClick={() => {
//               setEditField("profileImage");
//               setEditType("file");
//               setShowEditModal(true);
//             }}
//           >
//             <Edit2 size={14} />
//           </Button>
//         </div>
//         <h4 className="fw-bold">{profile.name}</h4>
//         <p className="text-muted mb-2">{profile.title || 'No title'}</p>
//         <div className="mb-3">
//           <Badge bg={profile.availability === "Available" ? "success" : "warning"}>
//             {profile.availability || "Unavailable"}
//           </Badge>
//         </div>
//       </div>
//     );
//   };

//   const StatBox = ({ value, label, color }) => (
//     <Col md={3}>
//       <div className="text-center p-3 rounded" style={{ backgroundColor: "#f0f9ff", border: `1px solid ${color}` }}>
//         <h3 className="fw-bold mb-1" style={{ color }}>{value || 0}</h3>
//         <small className="text-muted">{label}</small>
//       </div>
//     </Col>
//   );

//   const renderArrayField = (title, field, placeholder) => {
//     const array = profile[field] || [];
//     return (
//       <Card className="shadow-sm mb-3">
//         <div className="card-header d-flex justify-content-between align-items-center bg-white">
//           <strong>{title}</strong>
//           <div>
//             {editing[field] ? (
//               <>
//                 <Button size="sm" variant="success" className="me-2" onClick={() => handleSave(field)} disabled={saving}>
//                   {saving ? "Saving..." : "Save"}
//                 </Button>
//                 <Button size="sm" variant="outline-secondary" onClick={() => cancelEdit(field)}>Cancel</Button>
//               </>
//             ) : (
//               <Button size="sm" variant="outline-primary" onClick={() => startEdit(field)}>
//                 <Edit2 size={14} className="me-1" />
//                 Edit
//               </Button>
//             )}
//           </div>
//         </div>
//         <ListGroup variant="flush">
//           <ListGroup.Item>
//             {editing[field] ? (
//               <Form.Control
//                 as="textarea"
//                 rows={2}
//                 name={field}
//                 value={inputs[field]}
//                 onChange={handleInputChange}
//                 placeholder={placeholder || "Comma separated list (e.g. Python, ML, Data Science)"}
//               />
//             ) : (
//               array.length ? (
//                 <div className="d-flex flex-wrap gap-2">
//                   {array.map((it, i) => <Badge key={i} bg="light" text="dark" className="border px-3 py-2">{it}</Badge>)}
//                 </div>
//               ) : <div className="text-muted">No {title.toLowerCase()} added yet.</div>
//             )}
//           </ListGroup.Item>
//         </ListGroup>
//       </Card>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8fafc" }}>
//         <div className="text-center">
//           <div className="spinner-border" style={{ width: "3rem", height: "3rem", color: "#00798c" }} role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <h4 className="mt-3" style={{ color: "#0d3b66" }}>Loading Profile...</h4>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc" }}>
//         <DashboardHeader auth={auth} />
//         <main className="flex-grow-1 d-flex align-items-center justify-content-center">
//           <Container>
//             <div className="card shadow-lg border-0">
//               <div className="card-body text-center p-5">
//                 <div className="text-danger mb-4">
//                   <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <circle cx="12" cy="12" r="10"/>
//                     <line x1="12" y1="8" x2="12" y2="12"/>
//                     <line x1="12" y1="16" x2="12.01" y2="16"/>
//                   </svg>
//                 </div>
//                 <h3 className="fw-bold mb-3" style={{ color: "#0d3b66" }}>Failed to Load Profile</h3>
//                 <p className="text-muted mb-4">{error}</p>
//                 <div className="d-flex gap-3 justify-content-center">
//                   <Button onClick={() => window.location.reload()} variant="primary">Try Again</Button>
//                   <Button variant="outline-secondary" onClick={() => window.location.href = "/supervisor/dashboard"}>Go to Dashboard</Button>
//                 </div>
//               </div>
//             </div>
//           </Container>
//         </main>
//         <DashboardFooter />
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8fafc" }}>
//         <h4 style={{ color: "#0d3b66" }}>Profile data not available.</h4>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc" }}>
//       <DashboardHeader auth={auth} />
//       <main className="flex-grow-1" style={{ paddingBottom: "100px" }}>
//         <Container className="py-4">
//           {/* Header */}
//           <div className="mb-4">
//             <div className="card shadow-lg border-0" style={{ background: "linear-gradient(135deg, #0d3b66 0%, #00798c 100%)" }}>
//               <div className="card-body text-white p-5 d-flex justify-content-between align-items-center">
//                 <div className="d-flex align-items-center">
//                   <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-4 shadow" style={{ width: "80px", height: "80px" }}>
//                     <User style={{ color: "#0d3b66" }} size={40} />
//                   </div>
//                   <div>
//                     <h1 className="h2 fw-bold">Supervisor Profile</h1>
//                     <p className="mb-1 opacity-90">Academic & Research Information</p>
//                     <p className="mb-0 opacity-75">Ministry of Science & Technology - Research Division</p>
//                   </div>
//                 </div>
//                 <div className="text-end">
//                   <div className="bg-opacity-20 rounded p-3">
//                     <small className="text-light d-block">Profile ID</small>
//                     <strong className="d-block">{profile._id || profile.id}</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Personal Info */}
//           <Row className="g-4 mb-4">
//             <Col lg={4}>
//               <Card className="shadow-lg h-100">
//                 <div className="card-header text-white" style={{ background: "linear-gradient(135deg, #0d3b66 0%, #00798c 100%)" }}>
//                   <h5 className="fw-bold d-flex align-items-center"><User className="me-2" size={20} /> Personal Information</h5>
//                 </div>
//                 <Card.Body>
//                   <ProfileImage />

//                   <div className="space-y-3">
//                     <InfoRow icon={<Building />} label="Institution" value={profile.institution || profile.affiliation} />
//                     <InfoRow icon={<Mail />} label="Email" value={profile.email} />
//                     <InfoRow icon={<Phone />} label="Phone" value={profile.phone} />
//                     <InfoRow icon={<Calendar />} label="Experience" value={`${profile.experience || 0} years`} />
//                   </div>

//                   {/* Profile image edit inline */}
//                   <div className="mt-4">
//                     {editing.profileImage ? (
//                       <>
//                         <Form.Group>
//                           <Form.Label className="fw-semibold">Upload New Photo</Form.Label>
//                           <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
//                         </Form.Group>
//                         <div className="mt-2 d-flex gap-2">
//                           <Button size="sm" variant="success" onClick={() => handleSave("profileImage")} disabled={saving}>
//                             {saving ? "Uploading..." : "Upload Image"}
//                           </Button>
//                           <Button size="sm" variant="outline-secondary" onClick={() => cancelEdit("profileImage")}>Cancel</Button>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="d-flex justify-content-center">
//                         <Button size="sm" variant="outline-primary" onClick={() => startEdit("profileImage")}>
//                           <Edit2 size={14} className="me-1" />
//                           Change Photo
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* Research Statistics */}
//             <Col lg={8}>
//               <Card className="shadow-lg h-100">
//                 <div className="card-header text-white" style={{ background: "linear-gradient(135deg, #0d3b66 0%, #00798c 100%)" }}>
//                   <h5 className="fw-bold d-flex align-items-center"><Star className="me-2" size={20} /> Research Statistics</h5>
//                 </div>
//                 <Card.Body>
//                   <Row className="g-3">
//                     <StatBox value={profile.statistics?.totalSupervisions || 0} label="Total Projects" color="#00798c" />
//                     <StatBox value={profile.statistics?.completedProjects || 0} label="Completed" color="#10b981" />
//                     <StatBox value={profile.statistics?.activeProjects || 0} label="Active" color="#f59e0b" />
//                     <StatBox value={profile.statistics?.successRate || "0%"} label="Success Rate" color="#dc2626" />
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Skills, Awards, Domains, Supervisions */}
//           <Row className="g-4">
//             <Col md={6}>
//               {renderArrayField("Skills", "skills", "List skills, comma separated")}
//               {renderArrayField("Awards", "awards", "List awards, comma separated")}
//               {renderArrayField("Qualifications", "qualifications", "List qualifications, comma separated")}
//             </Col>
//             <Col md={6}>
//               <Card className="shadow-sm mb-3">
//                 <div className="card-header bg-white">
//                   <strong>Research Domains</strong>
//                 </div>
//                 <ListGroup variant="flush">
//                   <ListGroup.Item>
//                     <div className="d-flex flex-wrap gap-2">
//                       {(profile.domains || []).length ? (
//                         profile.domains.map((d, i) => <Badge key={i} bg="light" text="dark" className="border px-3 py-2">{d}</Badge>)
//                       ) : (
//                         <div className="text-muted">No domains added yet.</div>
//                       )}
//                     </div>
//                   </ListGroup.Item>
//                 </ListGroup>
//               </Card>

//               <Card className="shadow-sm mb-3">
//                 <div className="card-header bg-white"><strong>Supervisions</strong></div>
//                 <ListGroup variant="flush">
//                   {profile.supervisions?.length ? (
//                     profile.supervisions.map((s, i) => (
//                       <ListGroup.Item key={i}>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <div>
//                             <div className="fw-bold">{s.title}</div>
//                             <small className="text-muted">{s.researcher}</small>
//                           </div>
//                           <div>{getStatusBadge(s.status)}</div>
//                         </div>
//                       </ListGroup.Item>
//                     ))
//                   ) : (
//                     <ListGroup.Item className="text-muted">No supervisions yet.</ListGroup.Item>
//                   )}
//                 </ListGroup>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </main>
//       <EditModal />
//       <DashboardFooter />
//     </div>
//   );
// };

// export default SupervisorProfile;

import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Badge, ListGroup, Button, Form } from "react-bootstrap";
import {User, Award, Star, Clock, CheckCircle, Edit2,
} from "lucide-react";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";
import axios from "axios";

const SupervisorProfile = ({ auth }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [, setSelectedImage] = useState(null);
  const [editing, setEditing] = useState({ skills: false, awards: false, qualifications: false });
  const [inputs, setInputs] = useState({ skills: "", awards: "", qualifications: "" });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge bg="success"><CheckCircle size={14} className="me-1" />Active</Badge>;
      case "Completed":
        return <Badge bg="info"><Award size={14} className="me-1" />Completed</Badge>;
      case "Under Review":
        return <Badge bg="warning"><Clock size={14} className="me-1" />Under Review</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Fetch supervisor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        if (!token) throw new Error("Authentication token not found");
        const apiUrl = "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/supervisors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.supervisor) {
          setProfile(res.data.supervisor);
          setInputs({
            skills: (res.data.supervisor.skills || []).join(", "),
            awards: (res.data.supervisor.awards || []).join(", "),
            qualifications: (res.data.supervisor.qualifications || []).join(", "),
          });
        } else throw new Error("Invalid response from server");
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (file = null, remove = false) => {
  setSaving(true);
  try {
    const token = localStorage.getItem("supervisorToken");
    const apiUrl = "http://localhost:5000";
    const formData = new FormData();

    if (remove) {
      formData.append("removeProfileImage", true);
    } else if (file) {
      formData.append("profileImage", file);
    }

    const res = await axios.put(`${apiUrl}/api/supervisors/profile`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    if (res.data?.supervisor) {
      setProfile(res.data.supervisor);
      setSelectedImage(null);
      alert(remove ? "Profile picture removed" : "Profile image updated successfully");
    }
  } catch (err) {
    console.error("Save failed:", err);
    alert("Error: " + (err.response?.data?.message || err.message || "Update failed"));
  } finally {
    setSaving(false);
  }
};


  const handleImageButtonClick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);  // optional if you want preview
      handleSave(file);        // pass the file directly
    }
  };
  input.click();
};


  const renderArrayField = (title, field, placeholder) => {
    const array = profile[field] || [];
    return (
      <Card className="shadow-sm mb-3">
        <div className="card-header d-flex justify-content-between bg-white">
          <strong>{title}</strong>
          {editing[field] ? (
            <>
              <Button size="sm" variant="success" onClick={() => handleSave(field)} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline-secondary" onClick={() => setEditing((p) => ({ ...p, [field]: false }))}>
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline-primary" onClick={() => setEditing((p) => ({ ...p, [field]: true }))}>
              <Edit2 size={14} className="me-1" />Edit
            </Button>
          )}
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item>
            {editing[field] ? (
              <Form.Control
                as="textarea"
                rows={2}
                name={field}
                value={inputs[field]}
                onChange={(e) => setInputs((p) => ({ ...p, [e.target.name]: e.target.value }))}
                placeholder={placeholder}
              />
            ) : (
              array.length ? (
                <div className="d-flex flex-wrap gap-2">
                  {array.map((it, i) => (
                    <Badge key={i} bg="light" text="dark" className="border px-3 py-2">{it}</Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted">No {title.toLowerCase()} added yet.</div>
              )
            )}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    );
  };

  const ProfileImage = () => {
    const getImageUrl = () => {
      if (!profile.profileImage) return "/profile-placeholder.png";
      if (profile.profileImage.startsWith("/uploads"))
        return `http://localhost:5000${profile.profileImage}?t=${new Date().getTime()}`;
      if (profile.profileImage.startsWith("http")) return profile.profileImage;
      return "/profile-placeholder.png";
};


    return (
      <div className="text-center mb-4 position-relative">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
          style={{
            width: "140px",
            height: "140px",
            backgroundColor: "#f0f4f8",
            border: "4px solid white",
          }}
        >
          <img
            src={getImageUrl()}
            alt="Profile"
            className="rounded-circle shadow-sm"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "2px solid #00798c",
            }}
            onError={(e) => (e.target.src = "/profile-placeholder.png")}
          />
        </div>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <Button variant="primary" size="sm" onClick={handleImageButtonClick} disabled={saving}>
            {saving ? "Uploading..." : "Upload Image"}
          </Button>
          <Button variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleSave(null, true)}
                  disabled={saving}
                  >
                  {saving ? "Removing..." : "Remove Picture"}
          </Button>
        </div>

        <h4 className="fw-bold mt-3">{profile.name}</h4>
        <p className="text-muted mb-1">{profile.title || "No title"}</p>
        <Badge bg={profile.availability === "Available" ? "success" : "warning"}>
          {profile.availability || "Unavailable"}
        </Badge>
      </div>
    );
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc" }}>
      <DashboardHeader auth={auth} />
      <main className="flex-grow-1 pb-5">
        <Container className="py-4">
          {/* Header */}
          <div className="mb-4">
            <div className="card shadow-lg border-0" style={{ background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
              <div className="card-body text-white p-5 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle me-4 shadow d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                    <User style={{ color: "#0d3b66" }} size={40} />
                  </div>
                  <div>
                    <h1 className="h2 fw-bold">Supervisor Profile</h1>
                    <p className="mb-0 opacity-75">Ministry of Science & Technology - Research Division</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <Row className="g-4 mb-4">
            <Col lg={4}>
              <Card className="shadow-lg h-100 border-0">
                <div className="card-header text-white fw-bold" style={{ background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
                  <User className="me-2" /> Personal Information
                </div>
                <Card.Body className="p-4">
                  <ProfileImage />
                  <div className="mt-4 text-start px-2">
                    <div className="mb-3"><strong className="text-dark">Institution:</strong><br /> <span className="text-muted">{profile.institution || profile.affiliation}</span></div>
                    <div className="mb-3"><strong className="text-dark">Email:</strong><br /> <span className="text-muted">{profile.email}</span></div>
                    <div className="mb-3"><strong className="text-dark">Phone:</strong><br /> <span className="text-muted">{profile.phone}</span></div>
                    <div><strong className="text-dark">Experience:</strong><br /> <span className="text-muted">{profile.experience || 0} years</span></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Research Statistics */}
            <Col lg={8}>
              <Card className="shadow-lg h-100 border-0">
                <div className="card-header text-white fw-bold" style={{ background: "linear-gradient(135deg, #0d3b66, #00798c)" }}>
                  <Star className="me-2" /> Research Statistics
                </div>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="text-center p-3 rounded" style={{ backgroundColor: "#f0f9ff", border: "1px solid #00798c" }}>
                        <h3 className="fw-bold mb-1" style={{ color: "#00798c" }}>{profile.statistics?.totalSupervisions || 0}</h3>
                        <small className="text-muted">Total Projects</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3 rounded" style={{ backgroundColor: "#f0fff4", border: "1px solid #10b981" }}>
                        <h3 className="fw-bold mb-1" style={{ color: "#10b981" }}>{profile.statistics?.completedProjects || 0}</h3>
                        <small className="text-muted">Completed</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3 rounded" style={{ backgroundColor: "#fffbea", border: "1px solid #f59e0b" }}>
                        <h3 className="fw-bold mb-1" style={{ color: "#f59e0b" }}>{profile.statistics?.activeProjects || 0}</h3>
                        <small className="text-muted">Active</small>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3 rounded" style={{ backgroundColor: "#fff5f5", border: "1px solid #dc2626" }}>
                        <h3 className="fw-bold mb-1" style={{ color: "#dc2626" }}>{profile.statistics?.successRate || "0%"}</h3>
                        <small className="text-muted">Success Rate</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Skills, Awards, Qualifications, Domains, Supervisions */}
          <Row className="g-4">
            <Col md={6}>
              {renderArrayField("Skills", "skills", "Comma-separated skills")}
              {renderArrayField("Awards", "awards", "Comma-separated awards")}
              {renderArrayField("Qualifications", "qualifications", "Comma-separated qualifications")}
            </Col>
            <Col md={6}>
              <Card className="shadow-sm mb-3">
                <div className="card-header bg-white"><strong>Research Domains</strong></div>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div className="d-flex flex-wrap gap-2">
                      {(profile.domains || []).length ? profile.domains.map((d, i) => (
                        <Badge key={i} bg="light" text="dark" className="border px-3 py-2">{d}</Badge>
                      )) : <div className="text-muted">No domains added yet.</div>}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              <Card className="shadow-sm mb-3">
                <div className="card-header bg-white"><strong>Supervisions</strong></div>
                <ListGroup variant="flush">
                  {(profile.supervisions?.length) ? profile.supervisions.map((s, i) => (
                    <ListGroup.Item key={i}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{s.title}</div>
                          <small className="text-muted">{s.researcher}</small>
                        </div>
                        <div>{getStatusBadge(s.status)}</div>
                      </div>
                    </ListGroup.Item>
                  )) : <ListGroup.Item className="text-muted">No supervisions yet.</ListGroup.Item>}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <DashboardFooter />
    </div>
  );
};

export default SupervisorProfile;


