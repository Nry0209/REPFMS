import React, { useEffect, useState } from "react";
import {Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";
import Message from "../components/common/Message";
import axios from "axios";
import { User, Award, Clock, CheckCircle, Edit2, Star } from "lucide-react";


const SupervisorProfile = ({ auth }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingAll, setEditingAll] = useState(false);
  const [editing, setEditing] = useState({
    skills: false,
    awards: false,
    qualifications: false,
    languages: false,
    researchInterests: false,
  });
  const [inputs, setInputs] = useState({
    phone: "",
    skills: "",
    awards: "",
    qualifications: "",
    languages: [],
    researchInterests: [],
    otherInterest: "",
  });
  const [message, setMessage] = useState({ text: "", variant: "info" });

  const showMessage = (text, variant = "info", duration = 3000) => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: "", variant: "info" }), duration);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        if (!token) throw new Error("Authentication token not found");
        const res = await axios.get("http://localhost:5000/api/supervisors/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data?.supervisor) throw new Error("Profile not found");
        const sup = res.data.supervisor;
        setProfile(sup);
        setInputs({
          phone: sup.phone || "",
          skills: (sup.skills || []).join(", "),
          awards: (sup.awards || []).join(", "),
          qualifications: (sup.qualifications || []).join(", "),
          languages: sup.languages || [],
          researchInterests: sup.researchInterests || [],
          otherInterest: "",
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleSaveImage(file);
    };
    input.click();
  };

  const handleSaveImage = async (file, remove = false) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("supervisorToken");
      const fd = new FormData();
      if (remove) fd.append("removeProfileImage", true);
      else fd.append("profileImage", file);
      const res = await axios.put(
        "http://localhost:5000/api/supervisors/profile",
        fd,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.supervisor) {
        setProfile(res.data.supervisor);
        showMessage(remove ? "Profile picture removed." : "Profile picture updated.", "success");
      }
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge bg="success">
            <CheckCircle size={14} className="me-1" />
            Active
          </Badge>
        );
      case "Completed":
        return (
          <Badge bg="info">
            <Award size={14} className="me-1" />
            Completed
          </Badge>
        );
      case "Under Review":
        return (
          <Badge bg="warning">
            <Clock size={14} className="me-1" />
            Under Review
          </Badge>
        );
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleSaveField = async (field) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("supervisorToken");
      let payload = {};
      if (field === "researchInterests") {
        const finalInterests =
          inputs.researchInterests.includes("Others") && inputs.otherInterest
            ? [...inputs.researchInterests.filter((i) => i !== "Others"), inputs.otherInterest]
            : inputs.researchInterests;
        payload[field] = finalInterests;
      } else if (field === "languages") {
        payload[field] = inputs.languages;
      } else if (field === "phone") {
        payload[field] = inputs.phone;
      } else {
        payload[field] = inputs[field].split(",").map((i) => i.trim());
      }
      const res = await axios.put("http://localhost:5000/api/supervisors/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.supervisor) {
        setProfile(res.data.supervisor);
        setEditing((prev) => ({ ...prev, [field]: false }));
        showMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`, "success");
      }
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || err.message || "Update failed", "danger");
    } finally {
      setSaving(false);
    }
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
      <div className="text-center mb-4">
        <div
          className="rounded-circle mx-auto mb-3 shadow d-flex align-items-center justify-content-center"
          style={{ width: 140, height: 140, backgroundColor: "#f0f4f8", border: "4px solid white" }}
        >
          <img
            src={getImageUrl()}
            alt="Profile"
            className="rounded-circle shadow-sm"
            style={{ width: 120, height: 120, objectFit: "cover", border: "2px solid #00798c" }}
          />
        </div>
        {editingAll && (
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button size="sm" variant="primary" onClick={handleImageUpload} disabled={saving}>
              {saving ? "Uploading..." : "Upload Image"}
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleSaveImage(null, true)}
              disabled={saving}
            >
              {saving ? "Removing..." : "Remove Picture"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderEditableField = (label, field, type = "text") => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={inputs[field]}
        onChange={(e) => setInputs({ ...inputs, [field]: e.target.value })}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      <Button
        size="sm"
        variant="success"
        className="mt-1"
        onClick={() => handleSaveField(field)}
        disabled={saving}
      >
        {saving ? "Saving..." : `Save ${label}`}
      </Button>
    </Form.Group>
  );

  const renderArrayField = (title, field) => {
    const array = profile[field] || [];
    const isEditing = editingAll || editing[field];
    return (
      <Card className="shadow-sm mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          {title}
          {!isEditing ? (
            <Button size="sm" variant="light" onClick={() => setEditing({ ...editing, [field]: true })}>
              <Edit2 size={14} /> Edit
            </Button>
          ) : (
            <div className="d-flex gap-2">
              <Button size="sm" variant="success" onClick={() => handleSaveField(field)} disabled={saving}>
                Save
              </Button>
              {!editingAll && (
                <Button size="sm" variant="outline-light" onClick={() => setEditing({ ...editing, [field]: false })}>
                  Cancel
                </Button>
              )}
            </div>
          )}
        </Card.Header>
        <Card.Body>
          {!isEditing ? (
            array.length ? (
              <div className="d-flex flex-wrap gap-2">
                {array.map((item, i) => (
                  <Badge key={i} bg="light" text="dark" className="px-3 py-2 border">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No {title.toLowerCase()} added yet.</p>
            )
          ) : (
            <Form.Control
              as="textarea"
              rows={2}
              value={inputs[field]}
              onChange={(e) => setInputs({ ...inputs, [field]: e.target.value })}
              placeholder={`Comma-separated ${title.toLowerCase()}`}
            />
          )}
        </Card.Body>
      </Card>
    );
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <>
      <DashboardHeader auth={auth} />
      <Container className="my-4">
        {message.text && <Message variant={message.variant}>{message.text}</Message>}

        <Row className="g-4">
          {/* Left: Static Personal Info Card */}
          <Col lg={4}>
            <Card className="shadow-lg h-100 border-0">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <User className="me-2" /> Personal Information
                <Button size="sm" variant="light" onClick={() => setEditingAll(!editingAll)}>
                  <Edit2 size={14} className="me-1" /> {editingAll ? "Cancel Edit" : "Edit Details"}
                </Button>
              </Card.Header>
              <Card.Body>
                <ProfileImage />
                <div className="mt-3 text-start px-2">
                  <div className="mb-2"><strong>Name:</strong> {profile.name}</div>
                  <div className="mb-2"><strong>Email:</strong> {profile.email}</div>
                  <div className="mb-2"><strong>Phone:</strong> {profile.phone || "N/A"}</div>
                </div>

                <div className="mt-3">
                  <h6>Research Domains:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {(profile.domains || []).length ? profile.domains.map((d,i)=>(
                      <Badge key={i} bg="light" text="dark" className="border px-3 py-2">{d}</Badge>
                    )):<div className="text-muted">No domains added yet.</div>}
                  </div>
                </div>

                <div className="mt-3">
                  <h6>Supervisions:</h6>
                  {(profile.supervisions?.length)?profile.supervisions.map((s,i)=>(
                    <ListGroup.Item key={i} className="mb-2 rounded shadow-sm" style={{ border: "1px solid #e0e0e0" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{s.title}</div>
                          <small className="text-muted">{s.researcher}</small>
                        </div>
                        <div>{getStatusBadge(s.status)}</div>
                      </div>
                    </ListGroup.Item>
                  )):<div className="text-muted">No supervisions yet.</div>}
                </div>
              </Card.Body>
            </Card>
          </Col>


          {/* Right: Editable Panel */}
{editingAll && (
  <>
    <Col lg={8}>
      <Card className="shadow-lg h-100 border-0">
        <Card.Header className="bg-primary text-white">Edit Details</Card.Header>
        <Card.Body>
          {renderEditableField("Phone", "phone")}
          {renderArrayField("Skills", "skills")}
          {renderArrayField("Awards", "awards")}
          {renderArrayField("Qualifications", "qualifications")}

          <Form.Group className="mt-3">
            <Form.Label>Languages</Form.Label>
            <Form.Control
              type="text"
              value={inputs.languages?.join(", ") || ""}
              onChange={(e) =>
                setInputs({ ...inputs, languages: e.target.value.split(",").map((l) => l.trim()) })
              }
              placeholder="English, Tamil, Sinhala"
            />
            <Button
              size="sm"
              variant="success"
              className="mt-1"
              onClick={() => handleSaveField("languages")}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Languages"}
            </Button>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Research Interests</Form.Label>
            {["AI","Data Science","Cyber Security","IoT","Cloud Computing","Software Engineering","Bioinformatics","Others"].map((interest) => (
              <Form.Check
                key={interest}
                type="checkbox"
                label={interest}
                checked={inputs.researchInterests.includes(interest)}
                onChange={(e) => {
                  let updated = [...inputs.researchInterests];
                  if(e.target.checked) updated.push(interest);
                  else updated = updated.filter(i=>i!==interest);
                  setInputs({...inputs, researchInterests: updated, otherInterest: updated.includes("Others")?inputs.otherInterest:""});
                }}
              />
            ))}
            {inputs.researchInterests.includes("Others") && (
              <Form.Control
                type="text"
                placeholder="Enter your research interest"
                value={inputs.otherInterest}
                onChange={(e) => setInputs({...inputs, otherInterest:e.target.value})}
                className="mt-2"
              />
            )}
            <Button
              size="sm"
              variant="success"
              className="mt-2"
              onClick={() => handleSaveField("researchInterests")}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Research Interests"}
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>
    </Col>

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
  </>
)}

        </Row>
      </Container>
      <DashboardFooter />
    </>
  );
};

export default SupervisorProfile;
