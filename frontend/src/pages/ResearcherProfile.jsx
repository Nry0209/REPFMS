// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, Image } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { User, Linkedin, BookOpen, Award } from "lucide-react";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const ResearcherProfile = ({ auth, setAuth }) => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     degree: "",
//     domains: [],
//     linkedin: "",
//     scopus: "",
//     googleScholar: "",
//     collaborations: "",
//     awards: "",
//     skills: "",
//   });
//   const [files, setFiles] = useState({
//     profileImage: null,
//     cv: null,
//     transcripts: [],
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("researcherToken");
//       if (!token) {
//         navigate("/researcher/auth");
//         return;
//       }
//       const res = await fetch("http://localhost:5000/api/researchers/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

//       if (data.success) {
//         setProfile(data.data.researcher);
//         setFormData({
//           fullName: data.data.researcher.fullName || "",
//           email: data.data.researcher.email || "",
//           degree: data.data.researcher.degree || "",
//           domains: data.data.researcher.domains || [],
//           linkedin: data.data.researcher.linkedin || "",
//           scopus: data.data.researcher.scopus || "",
//           googleScholar: data.data.researcher.googleScholar || "",
//           collaborations: data.data.researcher.collaborations || "",
//           awards: data.data.researcher.awards || "",
//           skills: data.data.researcher.skills || "",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//       if (err.message.includes("authorized")) {
//         localStorage.removeItem("researcherToken");
//         localStorage.removeItem("researcherInfo");
//         navigate("/researcher/auth");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     if (name === "transcripts") {
//       setFiles((prev) => ({ ...prev, transcripts: selectedFiles }));
//     } else {
//       setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const token = localStorage.getItem("researcherToken");
//       if (!token) throw new Error("Not authorized");

//       const form = new FormData();
//       Object.keys(formData).forEach((key) => form.append(key, formData[key]));

//       if (files.profileImage) form.append("profileImage", files.profileImage);
//       if (files.cv) form.append("cv", files.cv);
//       if (files.transcripts.length > 0) {
//         Array.from(files.transcripts).forEach((file) => form.append("transcripts", file));
//       }

//       const res = await fetch("http://localhost:5000/api/researchers/profile/update", {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update profile");

//       setSuccess("Profile updated successfully!");
//       fetchProfile(); // Refresh profile
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return (
//     <>
//       <DashboardHeader auth={auth} setAuth={setAuth} />
//       <Container className="my-5 text-center">
//         <Spinner animation="border" /> <p>Loading profile...</p>
//       </Container>
//       <DashboardFooter />
//     </>
//   );

//   return (
//     <>
//       <DashboardHeader auth={auth} setAuth={setAuth} />
//       <Container className="my-5">
//         <Row>
//           <Col md={4}>
//             <Card className="p-3 text-center shadow-sm">
//               <Image
//                 src={profile?.profileImage ? `http://localhost:5000/${profile.profileImage}` : "/default-avatar.png"}
//                 roundedCircle
//                 width={150}
//                 height={150}
//                 className="mb-3"
//               />
//               <h5>{profile.fullName}</h5>
//               <p className="text-muted">{profile.degree}</p>
//               <p>Domains: {profile.domains?.map((d, idx) => <Badge key={idx} bg="info" className="me-1">{d}</Badge>)}</p>
//             </Card>
//           </Col>

//           <Col md={8}>
//             <Card className="p-3 shadow-sm">
//               <h5>Edit Profile</h5>
//               {error && <Alert variant="danger">{error}</Alert>}
//               {success && <Alert variant="success">{success}</Alert>}

//               <Form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <Form.Group className="mb-2">
//                   <Form.Label>Full Name</Form.Label>
//                   <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Email (read-only)</Form.Label>
//                   <Form.Control type="email" name="email" value={formData.email} readOnly />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Degree</Form.Label>
//                   <Form.Control type="text" name="degree" value={formData.degree} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Domains (comma separated)</Form.Label>
//                   <Form.Control type="text" name="domains" value={formData.domains.join(", ")} onChange={(e) => setFormData(prev => ({ ...prev, domains: e.target.value.split(",").map(d => d.trim()) }))} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>LinkedIn</Form.Label>
//                   <Form.Control type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Scopus</Form.Label>
//                   <Form.Control type="text" name="scopus" value={formData.scopus} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Google Scholar</Form.Label>
//                   <Form.Control type="text" name="googleScholar" value={formData.googleScholar} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Skills</Form.Label>
//                   <Form.Control type="text" name="skills" value={formData.skills} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Awards</Form.Label>
//                   <Form.Control type="text" name="awards" value={formData.awards} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Collaborations</Form.Label>
//                   <Form.Control type="text" name="collaborations" value={formData.collaborations} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Profile Image</Form.Label>
//                   <Form.Control type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>CV</Form.Label>
//                   <Form.Control type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Transcripts</Form.Label>
//                   <Form.Control type="file" name="transcripts" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} />
//                 </Form.Group>

//                 <Button type="submit" className="mt-3" disabled={saving}>
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Button>
//               </Form>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <DashboardFooter />
//     </>
//   );
// };

// export default ResearcherProfile;



// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, Image } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const ResearcherProfile = ({ auth, setAuth }) => {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     degree: "",
//     domains: [],
//     linkedin: "",
//     scopus: "",
//     googleScholar: "",
//     collaborations: "",
//     awards: "",
//     skills: "",
//   });
//   const [files, setFiles] = useState({
//     profileImage: null,
//     cv: null,
//     transcripts: [],
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("researcherToken");
//       if (!token) {
//         navigate("/researcher/auth");
//         return;
//       }

//       const res = await fetch(`${API_BASE_URL}/researchers/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

//       // Backend returns researcher object directly
//       setProfile(data);
//       setFormData({
//         fullName: data.fullName || "",
//         email: data.email || "",
//         degree: data.degree || "",
//         domains: data.domains || [],
//         linkedin: data.linkedin || "",
//         scopus: data.scopus || "",
//         googleScholar: data.googleScholar || "",
//         collaborations: data.collaborations || "",
//         awards: data.awards || "",
//         skills: data.skills || "",
//       });
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//       if (err.message.toLowerCase().includes("unauthorized")) {
//         localStorage.removeItem("researcherToken");
//         localStorage.removeItem("researcherInfo");
//         navigate("/researcher/auth");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     if (name === "transcripts") {
//       setFiles((prev) => ({ ...prev, transcripts: selectedFiles }));
//     } else {
//       setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const token = localStorage.getItem("researcherToken");
//       if (!token) throw new Error("Not authorized");

//       const form = new FormData();
//       Object.keys(formData).forEach((key) => form.append(key, formData[key]));

//       if (files.profileImage) form.append("profileImage", files.profileImage);
//       if (files.cv) form.append("cvFile", files.cv); // match backend field name
//       if (files.transcripts.length > 0) {
//         Array.from(files.transcripts).forEach((file) => form.append("transcripts", file));
//       }

//       const res = await fetch(`${API_BASE_URL}/researchers/profile`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: form,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update profile");

//       setSuccess("Profile updated successfully!");
//       fetchProfile(); // Refresh profile
//     } catch (err) {
//       setError(err.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading)
//     return (
//       <>
//         <DashboardHeader auth={auth} setAuth={setAuth} />
//         <Container className="my-5 text-center">
//           <Spinner animation="border" /> <p>Loading profile...</p>
//         </Container>
//         <DashboardFooter />
//       </>
//     );

//   return (
//     <>
//       <DashboardHeader auth={auth} setAuth={setAuth} />
//       <Container className="my-5">
//         <Row>
//           <Col md={4}>
//             <Card className="p-3 text-center shadow-sm">
//               <Image
//                 src={profile?.profileImage ? `http://localhost:5000${profile.profileImage}` : "/default-avatar.png"}
//                 roundedCircle
//                 width={150}
//                 height={150}
//                 className="mb-3"
//               />
//               <h5>{profile?.fullName || "N/A"}</h5>
//               <p className="text-muted">{profile?.degree || "N/A"}</p>
//               <p>
//                 Domains:{" "}
//                 {profile?.domains?.length > 0
//                   ? profile.domains.map((d, idx) => (
//                       <Badge key={idx} bg="info" className="me-1">
//                         {d}
//                       </Badge>
//                     ))
//                   : "N/A"}
//               </p>
//             </Card>
//           </Col>

//           <Col md={8}>
//             <Card className="p-3 shadow-sm">
//               <h5>Edit Profile</h5>
//               {error && <Alert variant="danger">{error}</Alert>}
//               {success && <Alert variant="success">{success}</Alert>}

//               <Form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <Form.Group className="mb-2">
//                   <Form.Label>Full Name</Form.Label>
//                   <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Email (read-only)</Form.Label>
//                   <Form.Control type="email" name="email" value={formData.email} readOnly />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Degree</Form.Label>
//                   <Form.Control type="text" name="degree" value={formData.degree} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Domains (comma separated)</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="domains"
//                     value={formData.domains.join(", ")}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         domains: e.target.value.split(",").map((d) => d.trim()),
//                       }))
//                     }
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>LinkedIn</Form.Label>
//                   <Form.Control type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Scopus</Form.Label>
//                   <Form.Control type="text" name="scopus" value={formData.scopus} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Google Scholar</Form.Label>
//                   <Form.Control type="text" name="googleScholar" value={formData.googleScholar} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Skills</Form.Label>
//                   <Form.Control type="text" name="skills" value={formData.skills} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Awards</Form.Label>
//                   <Form.Control type="text" name="awards" value={formData.awards} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Collaborations</Form.Label>
//                   <Form.Control type="text" name="collaborations" value={formData.collaborations} onChange={handleChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Profile Image</Form.Label>
//                   <Form.Control type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>CV</Form.Label>
//                   <Form.Control type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Transcripts</Form.Label>
//                   <Form.Control type="file" name="transcripts" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} />
//                 </Form.Group>

//                 <Button type="submit" className="mt-3" disabled={saving}>
//                   {saving ? "Saving..." : "Save Changes"}
//                 </Button>
//               </Form>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <DashboardFooter />
//     </>
//   );
// };

// export default ResearcherProfile;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
// import DashboardHeader from "../components/layout/DashboardHeader";
// import DashboardFooter from "../components/layout/DashboardFooter";

// const ResearcherProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   // Fetch researcher profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("researcherToken");
//         if (!token) {
//           setError("Authentication required. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         const res = await fetch("http://localhost:5000/api/researchers/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.json();
//         if (data.success) {
//           setProfile(data.data);
//         } else {
//           setError(data.message || "Failed to load profile");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Error fetching profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   // Handle file uploads
//   const handleFileChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.files[0] });
//   };

//   // Update researcher profile
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     setMessage("");
//     setError("");

//     try {
//       const token = localStorage.getItem("researcherToken");
//       const formData = new FormData();

//       for (let key in profile) {
//         if (profile[key]) formData.append(key, profile[key]);
//       }

//       const res = await fetch("http://localhost:5000/api/researchers/profile", {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (data.success) {
//         setMessage("Profile updated successfully!");
//         setProfile(data.data);
//       } else {
//         setError(data.message || "Update failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error updating profile");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <DashboardHeader />
//         <Container className="py-5 text-center">
//           <h5>Loading profile...</h5>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <DashboardHeader />
//         <Container className="py-5 text-center">
//           <Alert variant="danger">{error}</Alert>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   if (!profile) {
//     return (
//       <>
//         <DashboardHeader />
//         <Container className="py-5 text-center">
//           <Alert variant="warning">No profile data found.</Alert>
//         </Container>
//         <DashboardFooter />
//       </>
//     );
//   }

//   return (
//     <>
//       <DashboardHeader />
//       <Container className="py-5">
//         <Row className="justify-content-center">
//           <Col md={8}>
//             <Card className="shadow-lg p-4 rounded-4">
//               <h3 className="mb-4 text-center">Researcher Profile</h3>

//               {message && <Alert variant="success">{message}</Alert>}
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleUpdate}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Full Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="fullName"
//                     value={profile.fullName || ""}
//                     onChange={handleChange}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={profile.email || ""}
//                     onChange={handleChange}
//                     disabled
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Institution</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="institution"
//                     value={profile.institution || ""}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Profile Image</Form.Label>
//                   <Form.Control
//                     type="file"
//                     name="profileImage"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>CV File</Form.Label>
//                   <Form.Control
//                     type="file"
//                     name="cvFile"
//                     accept=".pdf,.doc,.docx"
//                     onChange={handleFileChange}
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Transcripts</Form.Label>
//                   <Form.Control
//                     type="file"
//                     name="transcripts"
//                     multiple
//                     accept=".pdf,.doc,.docx"
//                     onChange={handleFileChange}
//                   />
//                 </Form.Group>

//                 <div className="text-center">
//                   <Button type="submit" variant="primary" disabled={updating}>
//                     {updating ? "Updating..." : "Update Profile"}
//                   </Button>
//                 </div>
//               </Form>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//       <DashboardFooter />
//     </>
//   );
// };

// export default ResearcherProfile;

// src/pages/researcher/ResearcherProfile.jsx
import React, { useState, useEffect } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Badge, 
  Spinner, 
  Alert,
  Modal 
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Award, 
  BookOpen, 
  Users, 
  Linkedin, 
  FileText,
  Edit,
  Save,
  X
} from "lucide-react";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

const ResearcherProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    degree: "",
    domains: [],
    linkedin: "",
    scopus: "",
    googleScholar: "",
    collaborations: "",
  });
  const [files, setFiles] = useState({
    cvFile: null,
    transcripts: [],
  });
  const [skillsEdit, setSkillsEdit] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [awardsEdit, setAwardsEdit] = useState(false);
  const [awardsInput, setAwardsInput] = useState("");
  const [qualsEdit, setQualsEdit] = useState(false);
  const [qualsInput, setQualsInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("researcherToken");
      if (!token) {
        navigate("/researcher/auth");
        return;
      }

      const res = await fetch("http://localhost:5000/api/researchers/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      if (data.success) {
        setProfile(data.data.researcher);
        setFormData({
          fullName: data.data.researcher.fullName || "",
          email: data.data.researcher.email || "",
          degree: data.data.researcher.degree || "",
          domains: data.data.researcher.domains || [],
          linkedin: data.data.researcher.linkedin || "",
          scopus: data.data.researcher.scopus || "",
          googleScholar: data.data.researcher.googleScholar || "",
          collaborations: data.data.researcher.collaborations || "",
        });
        setSkillsInput((data.data.researcher.skills || []).join(", "));
        setAwardsInput((data.data.researcher.awards || []).join(", "));
        setQualsInput((data.data.researcher.qualifications || []).join(", "));
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(err.message);
      if (err.message.includes("authorized")) {
        localStorage.removeItem("researcherToken");
        navigate("/researcher/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDomainChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    if (selected.length <= 3) {
      setFormData({ ...formData, domains: selected });
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (name === "cvFile") {
      setFiles({ ...files, cvFile: selectedFiles[0] });
    } else if (name === "transcripts") {
      setFiles({ ...files, transcripts: Array.from(selectedFiles) });
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUploading(true);
      const token = localStorage.getItem("researcherToken");
      const fd = new FormData();
      fd.append("profilePhoto", file);
      const res = await fetch("http://localhost:5000/api/researchers/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to upload photo");
      setSuccess("Profile photo updated");
      await fetchProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("researcherToken");
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "domains") {
          formData[key].forEach((domain) => {
            formDataToSend.append("domains[]", domain);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files
      if (files.cvFile) {
        formDataToSend.append("cvFile", files.cvFile);
      }
      if (files.transcripts.length > 0) {
        files.transcripts.forEach((file) => {
          formDataToSend.append("transcripts", file);
        });
      }

      const res = await fetch("http://localhost:5000/api/researchers/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const domainOptions = [
    "Information Technology",
    "Healthcare & Medicine",
    "Biotechnology & Life Sciences",
    "Agriculture & Food Security",
    "Engineering & Technology",
    "Environmental Science & Climate",
    "Education & Social Sciences",
    "Business & Economics",
  ];

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <Container className="my-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading profile...</p>
        </Container>
        <DashboardFooter/>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <Container className="my-4">
        {/* Banner Header (match supervisor style) */}
        <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div
            className="p-4 text-white"
            style={{
              background: "linear-gradient(90deg, #0d6efd 0%, #0aa2c0 100%)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Row className="align-items-center">
              <Col md="auto">
                <div
                  className="d-flex align-items-center justify-content-center bg-white bg-opacity-25"
                  style={{ width: 64, height: 64, borderRadius: "50%" }}
                >
                  <User size={32} />
                </div>
              </Col>
              <Col>
                <h4 className="mb-0">Researcher Profile</h4>
                <small>Academic & Research Information</small>
              </Col>
              <Col md="auto" className="text-end">
                <div>
                  <small>Profile ID</small>
                  <div className="fw-bold">{profile?._id}</div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

        <Row>
          <Col lg={4} className="mb-4">
            {/* Profile Card */}
            <Card className="shadow">
              <Card.Body className="text-center">
                <div className="mb-3 d-flex flex-column align-items-center">
                  {profile?.profilePhoto ? (
                    <img
                      src={`http://localhost:5000${profile.profilePhoto}`}
                      alt="Profile"
                      style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid #e9ecef" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-light"
                      style={{ width: 96, height: 96, borderRadius: "50%" }}
                    >
                      <User size={48} className="text-primary" />
                    </div>
                  )}
                  <div className="mt-2">
                    <Form.Label className="btn btn-outline-primary btn-sm mb-0">
                      {photoUploading ? "Uploading..." : "Change Photo"}
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={photoUploading}
                        style={{ display: "none" }}
                      />
                    </Form.Label>
                  </div>
                </div>
                <h4>{profile?.fullName}</h4>
                <p className="text-muted">{profile?.degree}</p>
                
                <div className="mb-3">
                  {profile?.domains?.map((domain, idx) => (
                    <Badge key={idx} bg="primary" className="me-1 mb-1">
                      {domain}
                    </Badge>
                  ))}
                </div>

                {!isEditing && (
                  <Button 
                    variant="primary" 
                    onClick={() => setIsEditing(true)}
                    className="w-100"
                  >
                    <Edit size={18} className="me-2" />
                    Edit Profile
                  </Button>
                )}
              </Card.Body>
            </Card>

            {/* Links Card */}
            <Card className="shadow mt-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Academic Links</h6>
              </Card.Header>
              <Card.Body>
                {profile?.linkedin && (
                  <div className="mb-2">
                    <Linkedin size={18} className="me-2 text-primary" />
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </div>
                )}
                {profile?.scopus && (
                  <div className="mb-2">
                    <Award size={18} className="me-2 text-primary" />
                    <a href={profile.scopus} target="_blank" rel="noopener noreferrer">
                      Scopus
                    </a>
                  </div>
                )}
                {profile?.googleScholar && (
                  <div className="mb-2">
                    <BookOpen size={18} className="me-2 text-primary" />
                    <a href={profile.googleScholar} target="_blank" rel="noopener noreferrer">
                      Google Scholar
                    </a>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {isEditing ? (
              /* Edit Form */
              <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Edit Profile</h5>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Degree</Form.Label>
                      <Form.Control
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Domains (Select up to 3)</Form.Label>
                      <Form.Select
                        multiple
                        name="domains"
                        value={formData.domains}
                        onChange={handleDomainChange}
                        size={5}
                      >
                        {domainOptions.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Hold Ctrl/Cmd to select multiple domains
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>LinkedIn Profile</Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Scopus Profile</Form.Label>
                      <Form.Control
                        type="url"
                        name="scopus"
                        value={formData.scopus}
                        onChange={handleChange}
                        placeholder="https://scopus.com/yourprofile"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Google Scholar Profile</Form.Label>
                      <Form.Control
                        type="url"
                        name="googleScholar"
                        value={formData.googleScholar}
                        onChange={handleChange}
                        placeholder="https://scholar.google.com/yourprofile"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Collaborations</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="collaborations"
                        value={formData.collaborations}
                        onChange={handleChange}
                        placeholder="List your collaborators"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upload CV</Form.Label>
                      <Form.Control
                        type="file"
                        name="cvFile"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upload Transcripts</Form.Label>
                      <Form.Control
                        type="file"
                        name="transcripts"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={handleFileChange}
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="me-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                      >
                        <X size={18} className="me-2" />
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              /* View Profile */
              <>
                <Card className="shadow mb-3">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Basic Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6} className="mb-3">
                        <strong>Full Name:</strong>
                        <p>{profile?.fullName}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <strong>Email:</strong>
                        <p>{profile?.email}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <strong>Degree:</strong>
                        <p>{profile?.degree || "Not specified"}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <strong>Collaborations:</strong>
                        <p>{profile?.collaborations || "None"}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Skills Section */}
                <Card className="shadow mb-3">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                    <h5 className="mb-0">Skills</h5>
                    {!skillsEdit ? (
                      <Button size="sm" variant="outline-primary" onClick={() => setSkillsEdit(true)}>
                        <Edit size={16} className="me-1" /> Edit
                      </Button>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={async () => {
                            try {
                              setSaving(true);
                              const token = localStorage.getItem("researcherToken");
                              const fd = new FormData();
                              fd.append("skills", skillsInput);
                              const res = await fetch("http://localhost:5000/api/researchers/profile", {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                                body: fd,
                              });
                              const data = await res.json();
                              if (!res.ok || !data.success) throw new Error(data.message || "Failed to save skills");
                              setSuccess("Skills updated");
                              setSkillsEdit(false);
                              await fetchProfile();
                            } catch (e) {
                              setError(e.message);
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                        >
                          <Save size={16} className="me-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline-secondary" onClick={() => setSkillsEdit(false)} disabled={saving}>
                          <X size={16} className="me-1" /> Cancel
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {!skillsEdit ? (
                      profile?.skills?.length ? (
                        <div>
                          {profile.skills.map((s, i) => (
                            <Badge key={i} bg="info" className="me-1 mb-1">{s}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">No skills added yet.</p>
                      )
                    ) : (
                      <div>
                        <Form.Label>Enter skills separated by commas</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          placeholder="e.g., Machine Learning, Data Analysis, TensorFlow"
                        />
                        <Form.Text className="text-muted">We'll save them as individual tags.</Form.Text>
                      </div>
                    )}
                  </Card.Body>
                </Card>
                
                {/* Awards Section */}
                <Card className="shadow mb-3">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                    <h5 className="mb-0">Awards</h5>
                    {!awardsEdit ? (
                      <Button size="sm" variant="outline-primary" onClick={() => setAwardsEdit(true)}>
                        <Edit size={16} className="me-1" /> Edit
                      </Button>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={async () => {
                            try {
                              setSaving(true);
                              const token = localStorage.getItem("token");
                              const fd = new FormData();
                              fd.append("awards", awardsInput);
                              const res = await fetch("http://localhost:5000/api/researchers/profile", {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                                body: fd,
                              });
                              const data = await res.json();
                              if (!res.ok || !data.success) throw new Error(data.message || "Failed to save awards");
                              setSuccess("Awards updated");
                              setAwardsEdit(false);
                              await fetchProfile();
                            } catch (e) {
                              setError(e.message);
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                        >
                          <Save size={16} className="me-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline-secondary" onClick={() => setAwardsEdit(false)} disabled={saving}>
                          <X size={16} className="me-1" /> Cancel
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {!awardsEdit ? (
                      profile?.awards?.length ? (
                        <div>
                          {profile.awards.map((s, i) => (
                            <Badge key={i} bg="secondary" className="me-1 mb-1">{s}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">No awards added yet.</p>
                      )
                    ) : (
                      <div>
                        <Form.Label>Enter awards separated by commas</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={awardsInput}
                          onChange={(e) => setAwardsInput(e.target.value)}
                          placeholder="e.g., Best Paper Award, Presidential Award"
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Qualifications Section */}
                <Card className="shadow mb-3">
                  <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                    <h5 className="mb-0">Qualifications</h5>
                    {!qualsEdit ? (
                      <Button size="sm" variant="outline-primary" onClick={() => setQualsEdit(true)}>
                        <Edit size={16} className="me-1" /> Edit
                      </Button>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={async () => {
                            try {
                              setSaving(true);
                              const token = localStorage.getItem("token");
                              const fd = new FormData();
                              fd.append("qualifications", qualsInput);
                              const res = await fetch("http://localhost:5000/api/researchers/profile", {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                                body: fd,
                              });
                              const data = await res.json();
                              if (!res.ok || !data.success) throw new Error(data.message || "Failed to save qualifications");
                              setSuccess("Qualifications updated");
                              setQualsEdit(false);
                              await fetchProfile();
                            } catch (e) {
                              setError(e.message);
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                        >
                          <Save size={16} className="me-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline-secondary" onClick={() => setQualsEdit(false)} disabled={saving}>
                          <X size={16} className="me-1" /> Cancel
                        </Button>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {!qualsEdit ? (
                      profile?.qualifications?.length ? (
                        <div>
                          {profile.qualifications.map((s, i) => (
                            <Badge key={i} bg="dark" className="me-1 mb-1">{s}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">No qualifications added yet.</p>
                      )
                    ) : (
                      <div>
                        <Form.Label>Enter qualifications separated by commas</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={qualsInput}
                          onChange={(e) => setQualsInput(e.target.value)}
                          placeholder="e.g., BSc Computer Science, MSc AI, PhD ML"
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Card className="shadow">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Research Projects</h5>
                  </Card.Header>
                  <Card.Body>
                    {profile?.researches?.length === 0 ? (
                      <p className="text-muted text-center">No research projects</p>
                    ) : (
                      profile?.researches?.map((research) => (
                        <Card key={research._id} className="mb-3">
                          <Card.Body>
                            <h6>{research.title}</h6>
                            <p className="text-muted mb-2">{research.description}</p>
                            <div>
                              {research.domains?.map((domain, idx) => (
                                <Badge key={idx} bg="info" className="me-1">
                                  {domain}
                                </Badge>
                              ))}
                              <Badge bg={research.status === "Finished" ? "success" : research.status === "Current" ? "primary" : "warning"}>
                                {research.status}
                              </Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      ))
                    )}
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <DashboardFooter/>
    </>
  );
};

export default ResearcherProfile;
