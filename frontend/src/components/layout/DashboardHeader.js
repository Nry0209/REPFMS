// // src/components/layout/DashboardHeader.jsx
// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
// import { Search } from "lucide-react";

// const DashboardHeader = ({ auth, setAuth }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isSupervisorRoute = location.pathname.startsWith("/supervisor");

//   const handleLogout = () => {
//     setAuth({ supervisor: false });
//     navigate("/supervisor/auth?mode=login");
//   };

//   return (
//     <header style={{ position: "", top: 0, zIndex: 1030 }}>
//       {/* Topbar */}
//       <div
//         className="py-2"
//         style={{ backgroundColor: "#0d3b66", fontSize: "14px", color: "#fff" }}
//       >
//         <Container className="d-flex justify-content-between align-items-center">
//           {/* Left */}
//           <div className="d-flex align-items-center gap-2">
//             <img src="/lion.png" alt="Logo" style={{ height: "40px" }} className="me-2" />
//             <a
//               href="https://www.gov.lk/"
//               target="_blank"
//               rel="noreferrer"
//               className="fw-bold text-white text-decoration-none"
//             >
//               GOV.lk
//             </a>

//             {/* Search */}
//             <div className="top-bar d-flex align-items-left justify-content-between px-3">
//               <div className="search-container position-relative">
//                 <input
//                   type="search"
//                   className="form-control form-control-sm rounded-pill ps-4 search-input"
//                   placeholder="Search"
//                 />
//                 <Search
//                   size={16}
//                   className="position-absolute text-secondary"
//                   style={{ left: "8px", top: "50%", transform: "translateY(-50%)" }}
//                 />
//               </div>
//             </div>

//             <style jsx>{`
//               .search-container {
//                 opacity: 0;
//                 visibility: hidden;
//                 transition: all 0.3s ease-in-out;
//               }
//               .top-bar:hover .search-container {
//                 opacity: 1;
//                 visibility: visible;
//               }
//             `}</style>
//           </div>

//           {/* Right */}
//           <div className="d-flex align-items-center gap-3">
//             <div className="d-flex align-items-center">
//               <span style={{ fontSize: "14px" }}>A</span>
//               <span style={{ fontSize: "18px", marginLeft: "8px" }}>A</span>
//               <span style={{ fontSize: "22px", marginLeft: "8px" }}>A</span>
//             </div>

//             <span className="text-white">සිංහල</span>
//             <span className="text-white">தமிழ்</span>

//             {/* Auth buttons */}
//             {!auth.supervisor ? (
//               <>
//                 <Button
//                   as={Link}
//                   to="/supervisor/auth?mode=login"
//                   variant="outline-light"
//                   size="sm"
//                   className="fw-semibold me-2"
//                 >
//                   Login
//                 </Button>

//                 <Button
//                   as={Link}
//                   to="/supervisor/auth?mode=register"
//                   variant="warning"
//                   size="sm"
//                   className="fw-semibold text-dark"
//                 >
//                   Register
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 onClick={handleLogout}
//                 variant="danger"
//                 size="sm"
//                 className="fw-semibold"
//               >
//                 Logout
//               </Button>
//             )}
//             <Link
//             to="/supervisor/auth?mode=login"
//             className="text-white me-3 text-decoration-none fw-semibold"
//           >
//             Login
//           </Link>
//           </div>
//         </Container>
//       </div>

//       {/* Subbar */}
//       <div
//         className="py-1 border-bottom"
//         style={{ backgroundColor: "#00798c", fontSize: "14px", color: "#fff" }}
//       >
//         <Container className="d-flex justify-content-end gap-4">
//           <Link to="#" className="text-white text-decoration-none">
//             FAQs
//           </Link>
//           <Link to="#" className="text-white text-decoration-none">
//             Downloads
//           </Link>
//           <Link to="/news" className="text-white text-decoration-none">
//             News
//           </Link>
//           <Link to="#" className="text-white text-decoration-none">
//             Sitemap
//           </Link>
//         </Container>
//       </div>

//       {/* Main Navbar */}
//       <Navbar expand="lg" bg="white" className="shadow-sm mt-2">
//         <Container>
//           <Navbar.Brand
//             as={Link}
//             to="/supervisor/dashboard"
//             className="d-flex align-items-center p-2 rounded shadow-sm"
//             style={{ backgroundColor: "#f8f9fa" }}
//           >
//             <img
//               src="/emblem.png"
//               alt="Logo"
//               style={{ height: "60px", marginRight: "15px", borderRadius: "8px" }}
//             />
//             <div className="d-flex flex-column">
//               <span
//                 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#0d3b66" }}
//               >
//                 Research Expert Pooling System
//               </span>
//               <span style={{ fontSize: "1rem", color: "#555" }}>
//                 Ministry of Science & Technology
//               </span>
//             </div>
//           </Navbar.Brand>

//           <Navbar.Toggle aria-controls="main-navbar" />
//           <Navbar.Collapse id="main-navbar">
//             <Nav className="mx-auto fw-semibold">
//               <Nav.Link as={Link} to="/supervisor/dashboard">
//                 Dashboard
//               </Nav.Link>
//               <Nav.Link as={Link} to="/supervisor/profile">
//                 Profile
//               </Nav.Link>
//               <Nav.Link as={Link} to="/about">
//                 About Us
//               </Nav.Link>
              
//               {/* <Nav.Link as={Link} to="/divisions">
//                 Divisions
//               </Nav.Link>
//               <Nav.Link as={Link} to="/institutions">
//                 Institutions
//               </Nav.Link> */}

//               <NavDropdown title="Gallery" id="galleryDropdown">
//                 <NavDropdown.Item
//                   as="a"
//                   href="https://most.gov.lk/web/index.php?option=com_phocagallery&view=categories&Itemid=108&lang=en"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Image Gallery
//                 </NavDropdown.Item>
//                 <NavDropdown.Item
//                   as="a"
//                   href="https://most.gov.lk/web/index.php?option=com_content&view=article&id=29&Itemid=152&lang=en"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Video Gallery
//                 </NavDropdown.Item>
//               </NavDropdown>

//               <Nav.Link as={Link} to="/contact">
//                 Contact Us
//               </Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Events & Notices Strip — Only show on supervisor routes */}
//       {isSupervisorRoute && (
//         <div className="d-flex flex-wrap align-items-center" style={{ fontSize: "0.9rem" }}>
//           <div
//             style={{
//               backgroundColor: "#00798c",
//               color: "#fff",
//               padding: "0.6rem 1.2rem",
//               fontWeight: "600",
//             }}
//           >
//             Supervisor Research Topics
//           </div>

//           <div
//             className="scroll-container"
//             style={{
//               backgroundColor: "#f0f4f8",
//               color: "#0d3b66",
//               padding: "0.6rem 1.2rem",
//               flex: 1,
//               overflow: "hidden",
//               position: "relative",
//             }}
//           >
//             <div className="scroll-text">
//               Artificial Intelligence in Healthcare • Renewable Energy Systems •
//               Climate Change Impact Analysis • Data Mining in Agriculture •
//               Nanotechnology for Materials • Robotics in Manufacturing
//             </div>
//           </div>

//           <style jsx>{`
//             .scroll-container {
//               white-space: nowrap;
//             }
//             .scroll-text {
//               display: inline-block;
//               animation: scroll-left 60s linear infinite;
//             }
//             @keyframes scroll-left {
//               0% {
//                 transform: translateX(100%);
//               }
//               100% {
//                 transform: translateX(-100%);
//               }
//             }
//           `}</style>
//         </div>
//       )}
//     </header>
//   );
// };

// export default DashboardHeader;


// src/components/layout/DashboardHeader.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Search } from "lucide-react";

const DashboardHeader = ({ auth = {}, setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSupervisorRoute = location.pathname.startsWith("/supervisor");
  const isResearcherRoute = location.pathname.startsWith("/researcher");

  const handleLogout = () => {
    // Clear localStorage for all types
    localStorage.removeItem("supervisorToken");
    localStorage.removeItem("supervisorInfo");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("researcherToken");
    localStorage.removeItem("researcherInfo");

    // Reset auth state
    setAuth({
      supervisor: false,
      admin: false,
      researcher: false,
      name: null,
      email: null,
    });

    // Redirect to appropriate login
    if (isSupervisorRoute) navigate("/supervisor/auth?mode=login");
    else if (isResearcherRoute) navigate("/researcher/auth?mode=login");
    else navigate("/admin/auth");
  };

  return (
    <header style={{ position: "relative", top: 0, zIndex: 1030 }}>
      {/* Topbar */}
      <div
        className="py-2"
        style={{ backgroundColor: "#0d3b66", fontSize: "14px", color: "#fff" }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          {/* Left */}
          <div className="d-flex align-items-center gap-2">
            <img src="/lion.png" alt="Logo" style={{ height: "40px" }} className="me-2" />
            <a
              href="https://www.gov.lk/"
              target="_blank"
              rel="noreferrer"
              className="fw-bold text-white text-decoration-none"
            >
              GOV.lk
            </a>

            {/* Search */}
            <div className="top-bar d-flex align-items-left justify-content-between px-3">
              <div className="search-container position-relative">
                <input
                  type="search"
                  className="form-control form-control-sm rounded-pill ps-4 search-input"
                  placeholder="Search"
                />
                <Search
                  size={16}
                  className="position-absolute text-secondary"
                  style={{ left: "8px", top: "50%", transform: "translateY(-50%)" }}
                />
              </div>
            </div>

            <style jsx>{`
              .search-container {
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease-in-out;
              }
              .top-bar:hover .search-container {
                opacity: 1;
                visibility: visible;
              }
            `}</style>
          </div>

          {/* Right */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <span style={{ fontSize: "14px" }}>A</span>
              <span style={{ fontSize: "18px", marginLeft: "8px" }}>A</span>
              <span style={{ fontSize: "22px", marginLeft: "8px" }}>A</span>
            </div>

            <span className="text-white">සිංහල</span>
            <span className="text-white">தமிழ்</span>

            {/* Auth buttons */}
            {!(auth?.supervisor || auth?.researcher || auth?.admin) ? (
              <>
                {isSupervisorRoute && (
                  <>
                    <Button
                      as={Link}
                      to="/supervisor/auth?mode=login"
                      variant="outline-light"
                      size="sm"
                      className="fw-semibold me-2"
                    >
                      Login
                    </Button>
                    <Button
                      as={Link}
                      to="/supervisor/auth?mode=register"
                      variant="warning"
                      size="sm"
                      className="fw-semibold text-dark"
                    >
                      Register
                    </Button>
                  </>
                )}
                {isResearcherRoute && (
                  <Button
                    as={Link}
                    to="/researcher/auth?mode=login"
                    variant="outline-light"
                    size="sm"
                    className="fw-semibold"
                  >
                    Login
                  </Button>
                )}
                {!isSupervisorRoute && !isResearcherRoute && (
                  <Button
                    as={Link}
                    to="/admin/auth"
                    variant="outline-light"
                    size="sm"
                    className="fw-semibold"
                  >
                    Login
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleLogout}
                variant="danger"
                size="sm"
                className="fw-semibold"
              >
                Logout
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* Subbar */}
      <div
        className="py-1 border-bottom"
        style={{ backgroundColor: "#00798c", fontSize: "14px", color: "#fff" }}
      >
        <Container className="d-flex justify-content-end gap-4">
          <Link to="#" className="text-white text-decoration-none">FAQs</Link>
          <Link to="#" className="text-white text-decoration-none">Downloads</Link>
          <Link to="/news" className="text-white text-decoration-none">News</Link>
          <Link to="#" className="text-white text-decoration-none">Sitemap</Link>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" bg="white" className="shadow-sm mt-2">
        <Container>
          <Navbar.Brand
            as={Link}
            to={isSupervisorRoute ? "/supervisor/dashboard" : isResearcherRoute ? "/researcher/dashboard" : "/admin/dashboard"}
            className="d-flex align-items-center p-2 rounded shadow-sm"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <img
              src="/emblem.png"
              alt="Logo"
              style={{ height: "60px", marginRight: "15px", borderRadius: "8px" }}
            />
            <div className="d-flex flex-column">
              <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#0d3b66" }}>
                Research Expert Pooling System
              </span>
              <span style={{ fontSize: "1rem", color: "#555" }}>
                Ministry of Science & Technology
              </span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto fw-semibold">
              <Nav.Link as={Link} to={isSupervisorRoute ? "/supervisor/dashboard" : "/researcher/dashboard"}>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to={isSupervisorRoute ? "/supervisor/profile" : "/researcher/profile"}>
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default DashboardHeader;
