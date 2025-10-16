// // src/App.jsx
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// // Common / Landing Page
// import AboutPage from "./pages/AboutPage";

// // Supervisor Pages
// import SupervisorAuth from "./pages/SupervisorAuth";
// import SupervisorDashboard from "./pages/SupervisorDashboard";
// import SupervisorProfile from "./pages/SupervisorProfile";
// import FundingRequests from "./pages/FundingRequests";

// // Admin Pages
// import AdminAuth from "./pages/AdminAuth";
// import AdminDashboard from "./pages/AdminDashboard";

// // Researcher Pages
// import ResearcherAuth from "./pages/ResearcherAuth";
// import ResearcherDashboard from "./pages/ResearcherDashboard";

// const App = () => {
//   const [auth, setAuth] = useState({
//     supervisor: false,
//     supervisorId: null,
//     name: null,
//     email: null,
//     admin: false,
//     researcher: false,
//   });

//   useEffect(() => {
//     // Supervisor Auth Check
//     const supToken = localStorage.getItem("supervisorToken");
//     const supInfo = localStorage.getItem("supervisorInfo");

//     // Admin Auth Check
//     const adminToken = localStorage.getItem("adminToken");
//     const adminInfo = localStorage.getItem("adminInfo");

//     // Researcher Auth Check
//     const resToken = localStorage.getItem("researcherToken");
//     const resInfo = localStorage.getItem("researcherInfo");

//     if (supToken && supInfo) {
//       try {
//         const parsed = JSON.parse(supInfo);
//         setAuth({
//           supervisor: true,
//           supervisorId: parsed._id,
//           name: parsed.name,
//           email: parsed.email,
//           admin: false,
//           researcher: false,
//         });
//       } catch (error) {
//         console.error("Error parsing supervisor info:", error);
//         // Clear invalid data
//         localStorage.removeItem("supervisorToken");
//         localStorage.removeItem("supervisorInfo");
//       }
//     } else if (adminToken && adminInfo) {
//       try {
//         const parsed = JSON.parse(adminInfo);
//         setAuth({
//           supervisor: false,
//           supervisorId: null,
//           admin: true,
//           researcher: false,
//           name: parsed.name,
//           email: parsed.email,
//         });
//       } catch (error) {
//         console.error("Error parsing admin info:", error);
//         localStorage.removeItem("adminToken");
//         localStorage.removeItem("adminInfo");
//       }
//     } else if (resToken && resInfo) {
//       try {
//         const parsed = JSON.parse(resInfo);
//         setAuth({
//           supervisor: false,
//           supervisorId: null,
//           admin: false,
//           researcher: true,
//           name: parsed.name,
//           email: parsed.email,
//         });
//       } catch (error) {
//         console.error("Error parsing researcher info:", error);
//         localStorage.removeItem("researcherToken");
//         localStorage.removeItem("researcherInfo");
//       }
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* 🔹 Common Landing / About Pages */}
//         <Route path="/" element={<AboutPage />} />
//         <Route path="/about" element={<AboutPage />} />

//         {/* 🔹 Supervisor Routes */}
//         <Route path="/supervisor/auth" element={<SupervisorAuth setAuth={setAuth} />} />
//         <Route
//           path="/supervisor/dashboard"
//           element={
//             auth.supervisor ? (
//               <SupervisorDashboard auth={auth} setAuth={setAuth} />
//             ) : (
//               <Navigate to="/supervisor/auth?mode=login" />
//             )
//           }
//         />
//         <Route
//           path="/supervisor/profile"
//           element={
//             auth.supervisor ? (
//               <SupervisorProfile auth={auth} setAuth={setAuth} />
//             ) : (
//               <Navigate to="/supervisor/auth?mode=login" />
//             )
//           }
//         />
//         <Route
//           path="/supervisor/funding-requests"
//           element={
//             auth.supervisor ? (
//               <FundingRequests auth={auth} setAuth={setAuth} />
//             ) : (
//               <Navigate to="/supervisor/auth?mode=login" />
//             )
//           }
//         />

//         {/* 🔹 Researcher Routes
//         <Route path="/researcher/auth" element={<ResearcherAuth setAuth={setAuth} />} />
//         <Route
//           path="/researcher/dashboard"
//           element={
//             auth.researcher ? (
//               <ResearcherDashboard auth={auth} setAuth={setAuth} />
//             ) : (
//               <Navigate to="/researcher/auth?mode=login"  />
//             )
//           }
//         /> */}
//            <Route
//           path="/researcher/auth"
//           element={<ResearcherAuth setAuth={setAuth} />}
//         />

//         <Route
//           path="/researcher/dashboard"
//           element={
//             auth.researcher ? (
//               <ResearcherDashboard auth={auth} setAuth={setAuth} />
//             ) : (
//               <Navigate to="/researcher/auth?mode=login" />
//             )
//           }
//         />

//         {/* 🔹 Admin Routes */}
//         <Route path="/admin/auth" element={<AdminAuth setAuth={setAuth} />} />
//         <Route
//           path="/admin/dashboard"
//           element={
//             auth.admin ? (
//               <AdminDashboard auth={auth} setAuth={setAuth} />
//             ) : (
//               <Navigate to="/admin/auth" />
//             )
//           }
//         />

//         {/* 🔹 404 Page */}
//         <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
//       </Routes>

//           </Router>
//         );
//       };

// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Common / Landing Page
import AboutPage from "./pages/AboutPage";

// Supervisor Pages
import SupervisorAuth from "./pages/SupervisorAuth";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import SupervisorProfile from "./pages/SupervisorProfile";
import FundingRequests from "./pages/FundingRequests";

// Admin Pages
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";

// Researcher Pages
import ResearcherAuth from "./pages/ResearcherAuth";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResearcherProfile from "./pages/ResearcherProfile";

const App = () => {
  const [auth, setAuth] = useState({
    supervisor: false,
    admin: false,
    researcher: false,
    supervisorId: null,
    name: null,
    email: null,
  });

  useEffect(() => {
    // Supervisor
    const supToken = localStorage.getItem("supervisorToken");
    const supInfo = localStorage.getItem("supervisorInfo");

    // Admin
    const adminToken = localStorage.getItem("adminToken");
    const adminInfo = localStorage.getItem("adminInfo");

    // Researcher
    const resToken = localStorage.getItem("researcherToken");
    const resInfo = localStorage.getItem("researcherInfo");

    if (supToken && supInfo) {
      try {
        const parsed = JSON.parse(supInfo);
        setAuth({
          supervisor: true,
          admin: false,
          researcher: false,
          supervisorId: parsed._id,
          name: parsed.name,
          email: parsed.email,
        });
      } catch {
        localStorage.removeItem("supervisorToken");
        localStorage.removeItem("supervisorInfo");
      }
    } else if (adminToken && adminInfo) {
      try {
        const parsed = JSON.parse(adminInfo);
        setAuth({
          supervisor: false,
          admin: true,
          researcher: false,
          supervisorId: null,
          name: parsed.name,
          email: parsed.email,
        });
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
      }
    } else if (resToken && resInfo) {
      try {
        const parsed = JSON.parse(resInfo);
        setAuth({
          supervisor: false,
          admin: false,
          researcher: true,
          supervisorId: null,
          name: parsed.name,
          email: parsed.email,
        });
      } catch {
        localStorage.removeItem("researcherToken");
        localStorage.removeItem("researcherInfo");
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Common */}
        <Route path="/" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Supervisor */}
        <Route path="/supervisor/auth" element={<SupervisorAuth setAuth={setAuth} />} />
        <Route
          path="/supervisor/dashboard"
          element={
            auth.supervisor ? <SupervisorDashboard auth={auth} setAuth={setAuth} /> : <Navigate to="/supervisor/auth?mode=login" />
          }
        />
        <Route
          path="/supervisor/profile"
          element={
            auth.supervisor ? <SupervisorProfile auth={auth} setAuth={setAuth} /> : <Navigate to="/supervisor/auth?mode=login" />
          }
        />
        <Route
          path="/supervisor/funding-requests"
          element={
            auth.supervisor ? <FundingRequests auth={auth} setAuth={setAuth} /> : <Navigate to="/supervisor/auth?mode=login" />
          }
        />

        {/* Researcher */}
        <Route path="/researcher/auth" element={<ResearcherAuth setAuth={setAuth} />} />
        <Route
          path="/researcher/dashboard"
          element={
            auth.researcher ? <ResearcherDashboard auth={auth} setAuth={setAuth} /> : <Navigate to="/researcher/auth?mode=login" />
          }
        />
        <Route
          path="/researcher/profile"
          element={
            auth.researcher ? <ResearcherProfile auth={auth} setAuth={setAuth} /> : <Navigate to="/researcher/auth?mode=login" />
          }
        />

        {/* Admin */}
        <Route path="/admin/auth" element={<AdminAuth setAuth={setAuth} />} />
        <Route
          path="/admin/dashboard"
          element={
            auth.admin ? <AdminDashboard auth={auth} setAuth={setAuth} /> : <Navigate to="/admin/auth" />
          }
        />

        {/* 404 */}
        <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

