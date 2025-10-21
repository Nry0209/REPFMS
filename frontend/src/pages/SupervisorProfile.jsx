import React, { useEffect, useState } from "react";
import {Row,Col,Card,Button,Badge,Form,Spinner,Nav,} from "react-bootstrap";
import {User,Award,Clock,CheckCircle,Edit2,Star,Save,} from "lucide-react";
import {HouseDoor,FileEarmarkText,FileEarmark,PersonCircle,BoxArrowRight,} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupervisorProfile = ({ auth, setAuth }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingAll, setEditingAll] = useState(false);
  const [inputs, setInputs] = useState({
    phone: "",
    skills: [],
    skillsOther: "",
    awards: [],
    qualifications: [],
    qualificationsOther: "",
    languages: [],
    languagesOther: "",
    researchInterests: [],
    otherInterest: "",
  });
  const [message, setMessage] = useState({ text: "", variant: "info" });
  const [activeTab, setActiveTab] = useState("profile");

  const navigate = useNavigate();
  const gradient = "linear-gradient(135deg, #0d3b66, #00798c)";

  const showMessage = (text, variant = "info", duration = 3000) => {
    setMessage({ text, variant });
    setTimeout(() => setMessage({ text: "", variant: "info" }), duration);
  };

  // Helper option lists for checkboxes
  const predefinedSkills = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Machine Learning",
    "Others",
  ];
  const predefinedQualifications = [
    "BSc",
    "MSc",
    "PhD",
    "Postdoc",
    "Others",
  ];
  const predefinedLanguages = ["English", "Sinhala", "Tamil", "Others"];

  // Fetch supervisor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        if (!token) throw new Error("Authentication token not found");
        const res = await axios.get(
          "http://localhost:5000/api/supervisors/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.data?.supervisor) throw new Error("Profile not found");
        const sup = res.data.supervisor;
        setProfile(sup);

        // Initialize inputs from profile data, split to arrays if strings
        // For skills, qualifications, languages: if any item is not in predefined, treat as 'Others' and set skillsOther etc accordingly
        const skillsArr = sup.skills || [];
        let skillsOthersVal = "";
        const skillsFiltered = skillsArr.filter((s) => {
          if (predefinedSkills.includes(s)) return true;
          skillsOthersVal = s;
          return false;
        });

        const qualificationsArr = sup.qualifications || [];
        let qualificationsOthersVal = "";
        const qualificationsFiltered = qualificationsArr.filter((q) => {
          if (predefinedQualifications.includes(q)) return true;
          qualificationsOthersVal = q;
          return false;
        });

        const languagesArr = sup.languages || [];
        let languagesOthersVal = "";
        const languagesFiltered = languagesArr.filter((l) => {
          if (predefinedLanguages.includes(l)) return true;
          languagesOthersVal = l;
          return false;
        });

        setInputs({
          phone: sup.phone || "",
          skills: skillsFiltered,
          skillsOther: skillsOthersVal,
          awards: sup.awards || [],
          qualifications: qualificationsFiltered,
          qualificationsOther: qualificationsOthersVal,
          languages: languagesFiltered,
          languagesOther: languagesOthersVal,
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

  // Save updates to backend
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("supervisorToken");

      // Prepare array fields concatenating 'Others' if any
      let finalSkills = [...inputs.skills];
      if (
        inputs.skills.includes("Others") &&
        inputs.skillsOther.trim() !== ""
      ) {
        finalSkills = finalSkills.filter((s) => s !== "Others");
        finalSkills.push(inputs.skillsOther.trim());
      }

      let finalQualifications = [...inputs.qualifications];
      if (
        inputs.qualifications.includes("Others") &&
        inputs.qualificationsOther.trim() !== ""
      ) {
        finalQualifications = finalQualifications.filter(
          (q) => q !== "Others"
        );
        finalQualifications.push(inputs.qualificationsOther.trim());
      }

      let finalLanguages = [...inputs.languages];
      if (
        inputs.languages.includes("Others") &&
        inputs.languagesOther.trim() !== ""
      ) {
        finalLanguages = finalLanguages.filter((l) => l !== "Others");
        finalLanguages.push(inputs.languagesOther.trim());
      }

      const payload = {
        phone: inputs.phone,
        skills: finalSkills,
        awards: inputs.awards,
        qualifications: finalQualifications,
        languages: finalLanguages,
        researchInterests: inputs.researchInterests,
        otherInterest: inputs.otherInterest,
      };

      const res = await axios.put(
        "http://localhost:5000/api/supervisors/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        showMessage("Profile updated successfully!", "success");
        setEditingAll(false);
        setProfile((prev) => ({ ...prev, ...payload }));
      } else {
        showMessage("Failed to update profile.", "danger");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showMessage(
        err.response?.data?.message || "Error updating profile",
        "danger"
      );
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
      <div className="text-center mb-3">
        <div
          className="rounded-circle mx-auto mb-3 shadow d-flex align-items-center justify-content-center"
          style={{
            width: 140,
            height: 140,
            backgroundColor: "#0d3b66",
            border: "4px solid white",
          }}
        >
          <img
            src={getImageUrl()}
            alt="Profile"
            className="rounded-circle shadow-sm"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              border: "2px solid #00798c",
            }}
          />
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return <div className="text-center text-danger p-5">{error}</div>;

  // Sidebar items with changes: removed dashboard, supervision and funding requests; added About page
  const navItems = [
    { id: "profile", label: "Profile", path: "/supervisor/profile", icon: <PersonCircle /> },
    { id: 'requests', label: 'Supervision Requests', icon: <FileEarmarkText /> },
    { id: 'feedback', label: 'Feedback', icon: <FileEarmarkText /> },
    { id: 'fundingRequest', label: 'Funding Requests', icon: <FileEarmark /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column text-white position-relative"
        style={{
          width: "280px",
          minHeight: "100vh",
          backgroundColor: "#00798c",
          borderRight: "1px solid #e2e8f0",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="text-center px-3 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <div
            className="bg-white rounded-circle mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: 70, height: 70 }}
          >
            <img src="/emblem.png" alt="Logo" style={{ width: 48, height: 48 }} />
          </div>
          <h5 className="fw-bold mb-1 text-white">Supervisor Panel</h5>
          <small className="text-light">
            Ministry of Science & Technology
            <br />
            Sri Lanka
          </small>
        </div>

        {/* Navigation */}
        <Nav className="flex-column flex-grow-1 px-2 mt-3">
          {navItems.map((item) => (
            <Nav.Link
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={`text-white d-flex align-items-center gap-2 my-1 p-2 rounded ${
                activeTab === item.id ? "fw-bold bg-white bg-opacity-10" : ""
              }`}
              style={{ transition: "0.2s" }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Nav.Link>
          ))}

          {/* Logout and Backward-like button */}
          <div className="mt-auto pt-3 border-top">
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3"
              style={{ color: "#dc3545", transition: "0.2s", cursor: "pointer" }}
              onClick={() => {
                localStorage.removeItem("supervisorToken");
                setAuth?.({ ...auth, supervisor: false });
                navigate("/login");
              }}
            >
              <BoxArrowRight size={20} className="me-3" />
              <span>Logout</span>
            </Nav.Link>
            <Nav.Link
              className="d-flex align-items-center py-3 px-3 rounded-3 mt-2"
              style={{ color: "#f8fafc", transition: "0.2s", cursor: "pointer" }}
              onClick={() => {
                navigate(-1); // navigate backward
              }}
            >
              <BoxArrowRight
                size={20}
                className="me-3"
                style={{ transform: "rotate(180deg)" }}
              />
              <span>Go Back</span>
            </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h2 className="fw-bold mb-4 text-primary">
          <Star className="me-2" />
          Supervisor Profile
        </h2>

        {message.text && <div className={`alert alert-${message.variant}`}>{message.text}</div>}

        {/* Research Statistics */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header
            className="fw-bold text-white"
            style={{ background: gradient }}
          >
            <Star className="me-2" /> Research Statistics
          </Card.Header>
          <Card.Body>
            <Row className="g-3 text-center">
              <Col md={3}>
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: "#f0f9ff", border: "1px solid #00798c" }}
                >
                  <h3 className="fw-bold mb-1" style={{ color: "#00798c" }}>
                    {profile.statistics?.totalSupervisions || 0}
                  </h3>
                  <small className="text-muted">Total Projects</small>
                </div>
              </Col>
              <Col md={3}>
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: "#f0fff4", border: "1px solid #10b981" }}
                >
                  <h3 className="fw-bold mb-1" style={{ color: "#10b981" }}>
                    {profile.statistics?.completedProjects || 0}
                  </h3>
                  <small className="text-muted">Completed</small>
                </div>
              </Col>
              <Col md={3}>
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: "#fffbea", border: "1px solid #f59e0b" }}
                >
                  <h3 className="fw-bold mb-1" style={{ color: "#f59e0b" }}>
                    {profile.statistics?.activeProjects || 0}
                  </h3>
                  <small className="text-muted">Active</small>
                </div>
              </Col>
              <Col md={3}>
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: "#fff5f5", border: "1px solid #dc2626" }}
                >
                  <h3 className="fw-bold mb-1" style={{ color: "#dc2626" }}>
                    {profile.statistics?.successRate || "0%"}
                  </h3>
                  <small className="text-muted">Success Rate</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Personal Info */}
        <Card className="shadow-sm border-0">
          <Card.Header
            className="text-white d-flex justify-content-between align-items-center"
            style={{ background: gradient }}
          >
            <div>
              <User className="me-2" /> Personal Information
            </div>
            <div>
              <Button
                size="sm"
                variant="light"
                className="me-2"
                onClick={() => setEditingAll(!editingAll)}
              >
                <Edit2 size={14} className="me-1" />
                {editingAll ? "Cancel" : "Edit"}
              </Button>
              {editingAll && (
                <Button size="sm" variant="success" onClick={handleSave} disabled={saving}>
                  <Save size={14} className="me-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col md={4}>
                <ProfileImage />
              </Col>
              <Col md={8}>
                <div className="mb-2">
                  <strong>Name:</strong> {profile.name}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {profile.email}
                </div>
                <div className="mb-2">
                  <strong>Affiliation:</strong> {profile.affiliation || "N/A"}
                </div>
                <div className="mb-2">
                  <strong>Address:</strong> {profile.address || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Phone:</strong> {profile.phone || "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Skills:</strong>{" "}
                  {(profile.skills && profile.skills.length > 0)
                    ? profile.skills.join(", ")
                    : "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Qualifications:</strong>{" "}
                  {(profile.qualifications && profile.qualifications.length > 0)
                    ? profile.qualifications.join(", ")
                    : "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Awards:</strong>{" "}
                  {(profile.awards && profile.awards.length > 0)
                    ? profile.awards.join(", ")
                    : "N/A"}
                </div>
                <div className="mb-3">
                  <strong>Languages:</strong>{" "}
                  {(profile.languages && profile.languages.length > 0)
                    ? profile.languages.join(", ")
                    : "N/A"}
                </div>

                {/* Professional Profiles */}
                <div className="mb-2">
                  <strong>LinkedIn:</strong>{" "}
                  {profile.linkedin ? (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer">View Profile</a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong>Google Scholar:</strong>{" "}
                  {profile.googleScholar ? (
                    <a href={profile.googleScholar} target="_blank" rel="noreferrer">View Profile</a>
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </div>

                <h6>Research Domains</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {(profile.domains || []).length ? (
                    profile.domains.map((d, i) => (
                      <Badge
                        key={i}
                        bg="light"
                        text="dark"
                        className="px-3 py-2 border"
                      >
                        {d}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">No domains added yet.</span>
                  )}
                </div>
              </Col>
            </Row>

            {editingAll && (
              <div className="mt-4 border-top pt-3">
                <h5 className="fw-bold mb-3 text-primary">Edit Details</h5>

                {/* Editable Fields */}
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={inputs.phone}
                    onChange={(e) =>
                      setInputs({ ...inputs, phone: e.target.value })
                    }
                  />
                </Form.Group>

                {/* Skills Checkboxes with Others */}
                <Form.Group className="mb-3">
                  <Form.Label>Skills</Form.Label>
                  {predefinedSkills.map((skill) => (
                    <Form.Check
                      key={skill}
                      type="checkbox"
                      label={skill}
                      checked={inputs.skills.includes(skill)}
                      onChange={(e) => {
                        let updated = [...inputs.skills];
                        if (e.target.checked) updated.push(skill);
                        else updated = updated.filter((s) => s !== skill);
                        setInputs({ ...inputs, skills: updated });
                      }}
                    />
                  ))}
                  {inputs.skills.includes("Others") && (
                    <Form.Control
                      type="text"
                      placeholder="Enter other skills"
                      value={inputs.skillsOther}
                      onChange={(e) =>
                        setInputs({ ...inputs, skillsOther: e.target.value })
                      }
                      className="mt-2"
                    />
                  )}
                </Form.Group>

                {/* Awards (text area, unchanged) */}
                <Form.Group className="mb-3">
                  <Form.Label>Awards</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={inputs.awards.join(", ")}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        awards: e.target.value
                          .split(",")
                          .map((a) => a.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Form.Group>

                {/* Qualifications Checkboxes with Others */}
                <Form.Group className="mb-3">
                  <Form.Label>Qualifications</Form.Label>
                  {predefinedQualifications.map((qualification) => (
                    <Form.Check
                      key={qualification}
                      type="checkbox"
                      label={qualification}
                      checked={inputs.qualifications.includes(qualification)}
                      onChange={(e) => {
                        let updated = [...inputs.qualifications];
                        if (e.target.checked) updated.push(qualification);
                        else updated = updated.filter((q) => q !== qualification);
                        setInputs({ ...inputs, qualifications: updated });
                      }}
                    />
                  ))}
                  {inputs.qualifications.includes("Others") && (
                    <Form.Control
                      type="text"
                      placeholder="Enter other qualifications"
                      value={inputs.qualificationsOther}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          qualificationsOther: e.target.value,
                        })
                      }
                      className="mt-2"
                    />
                  )}
                </Form.Group>

                {/* Languages Checkboxes with Others */}
                <Form.Group className="mb-3">
                  <Form.Label>Languages</Form.Label>
                  {predefinedLanguages.map((language) => (
                    <Form.Check
                      key={language}
                      type="checkbox"
                      label={language}
                      checked={inputs.languages.includes(language)}
                      onChange={(e) => {
                        let updated = [...inputs.languages];
                        if (e.target.checked) updated.push(language);
                        else updated = updated.filter((l) => l !== language);
                        setInputs({ ...inputs, languages: updated });
                      }}
                    />
                  ))}
                  {inputs.languages.includes("Others") && (
                    <Form.Control
                      type="text"
                      placeholder="Enter other languages"
                      value={inputs.languagesOther}
                      onChange={(e) =>
                        setInputs({ ...inputs, languagesOther: e.target.value })
                      }
                      className="mt-2"
                    />
                  )}
                </Form.Group>

                {/* Research Interests unchanged */}
                <Form.Group>
                  <Form.Label>Research Interests</Form.Label>
                  {[
                    "AI",
                    "Data Science",
                    "Cyber Security",
                    "IoT",
                    "Cloud Computing",
                    "Software Engineering",
                    "Bioinformatics",
                    "Others",
                  ].map((interest) => (
                    <Form.Check
                      key={interest}
                      type="checkbox"
                      label={interest}
                      checked={inputs.researchInterests.includes(interest)}
                      onChange={(e) => {
                        let updated = [...inputs.researchInterests];
                        if (e.target.checked) updated.push(interest);
                        else
                          updated = updated.filter((i) => i !== interest);
                        setInputs({
                          ...inputs,
                          researchInterests: updated,
                          otherInterest: updated.includes("Others")
                            ? inputs.otherInterest
                            : "",
                        });
                      }}
                    />
                  ))}
                  {inputs.researchInterests.includes("Others") && (
                    <Form.Control
                      type="text"
                      placeholder="Enter your research interest"
                      value={inputs.otherInterest}
                      onChange={(e) =>
                        setInputs({ ...inputs, otherInterest: e.target.value })
                      }
                      className="mt-2"
                    />
                  )}
                </Form.Group>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* --- Current Supervisions --- */}
        <Card className="shadow-sm border-0 mt-4">
          <Card.Header className="text-white" style={{ background: gradient }}>
            <FileEarmarkText className="me-2" /> Current Supervisions
          </Card.Header>
          <Card.Body>
            {profile.currentSupervisions?.length > 0 ? (
              <Row className="g-3">
                {profile.currentSupervisions.map((supervision, idx) => (
                  <Col md={6} key={idx}>
                    <Card className="p-3 border-1 shadow-sm">
                      <h6 className="fw-bold mb-1">{supervision.projectTitle}</h6>
                      <div>
                        <strong>Status:</strong>{" "}
                        <Badge bg={supervision.status === "Active" ? "success" : "warning"}>
                          {supervision.status}
                        </Badge>
                      </div>
                      <div>
                        <strong>Student:</strong> {supervision.studentName}
                      </div>
                      <div>
                        <strong>Start Date:</strong> {new Date(supervision.startDate).toLocaleDateString()}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-muted">No active supervisions at the moment.</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorProfile;


