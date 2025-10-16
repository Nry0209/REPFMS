// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css"; // icons
// import "./footer.css"; // custom footer styles

// const Footer = () => {
//   const year = new Date().getFullYear();
//   const lastUpdate = new Date().toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

//   return (
//     <footer className="text-white mt-5">
//       {/* Top section */}
//       <div style={{ backgroundColor: "#0d3b66" }} className="p-5">
//         <div className="container">
//           <div className="row">
//             {/* Left: Ministry Info */}
//             <div className="col-md-6 mb-4">
//               <h4 className="fw-bold">Ministry of Science &amp; Technology</h4>
//               <p>
//                 3rd Floor, Sethsiripaya Stage I,
//                 <br />
//                 Battaramulla,
//                 <br />
//                 Sri Lanka
//               </p>
//               <p>
//                 <i className="bi bi-envelope"></i>{" "}
//                 <a href="mailto:info@mostr.gov.lk" className="footer-link">
//                   info@mostr.gov.lk
//                 </a>
//                 <br />
//                 <i className="bi bi-telephone"></i>{" "}
//                 <a href="tel:+94112879410" className="footer-link">
//                   (+94) 112 879 410
//                 </a>
//                 <br />
//                 <i className="bi bi-printer"></i> (+94) 112 879 412
//               </p>
//               <div>
//                 <a href="#" className="footer-icon">
//                   <i className="bi bi-facebook"></i>
//                 </a>
//                 <a href="#" className="footer-icon">
//                   <i className="bi bi-twitter"></i>
//                 </a>
//                 <a href="#" className="footer-icon">
//                   <i className="bi bi-google"></i>
//                 </a>
//                 <a href="#" className="footer-icon">
//                   <i className="bi bi-youtube"></i>
//                 </a>
//               </div>
//             </div>

//             {/* Right: Related Links */}
//             <div className="col-md-6">
//               <h4 className="fw-bold">Related Links</h4>
//               <div className="row">
//                 <div className="col-6">
//                   <ul className="list-unstyled">
//                     <li>
//                       <a
//                         href="https://president.gov.lk"
//                         target="_blank"
//                         rel="noreferrer"
//                         className="footer-link"
//                       >
//                         &gt; President of Sri Lanka
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="https://www.presidentsoffice.gov.lk"
//                         target="_blank"
//                         rel="noreferrer"
//                         className="footer-link"
//                       >
//                         &gt; Presidential Secretariat
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="https://www.mostr.gov.lk"
//                         target="_blank"
//                         rel="noreferrer"
//                         className="footer-link"
//                       >
//                         &gt; STR Developments
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="col-6">
//                   <ul className="list-unstyled">
//                     <li>
//                       <a
//                         href="https://www.pmd.gov.lk"
//                         target="_blank"
//                         rel="noreferrer"
//                         className="footer-link"
//                       >
//                         &gt; President's Media Division
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="https://www.pmoffice.gov.lk"
//                         target="_blank"
//                         rel="noreferrer"
//                         className="footer-link"
//                       >
//                         &gt; Prime Minister's Office
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="https://www.mostr.gov.lk"
//                         target="_blank"
//                         rel="noreferrer"
//                         className="footer-link"
//                       >
//                         &gt; STR Developments
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom strip */}
//       <div style={{ backgroundColor: "#00798c" }} className="p-3">
//         <div className="container d-flex justify-content-between align-items-left flex-wrap text-left text-md-start">
//           <p className="mb-1 small">
//             Copyright © {year} Ministry of Science &amp; Technology. All Rights
//             Reserved.
//             <br />
//             Design &amp; Developed by <span className="fw-bold">SLIIT - ISE</span>
//           </p>
//           <div className="d-flex align-items-left mt-2 mt-md-1">
//             <i className="bi bi-telephone me-2"></i>
//             <a href="tel:1919" className="footer-link fw-bold me-3">
//               Know 1919
//             </a>
//             <div className="last modified ms-3">
//               <span>Last Update :</span>
//               <br />
//               {lastUpdate}
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // icons
import "./footer.css"; // custom footer styles

const Footer = () => {
  const year = new Date().getFullYear();
  const lastUpdate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="mt-5 text-light">
      {/* Top section */}
      <div style={{ backgroundColor: "#0d3b66" }} className="p-5">
        <div className="container">
          <div className="row">
            {/* Left: Ministry Info */}
            <div className="col-md-6 mb-4">
              <h4 className="fw-bold">Ministry of Science &amp; Technology</h4>
              <p>
                3rd Floor, Sethsiripaya Stage I,
                <br />
                Battaramulla,
                <br />
                Sri Lanka
              </p>
              <p>
                <i className="bi bi-envelope"></i>{" "}
                <a href="mailto:info@mostr.gov.lk" className="footer-link text-light">
                  info@mostr.gov.lk
                </a>
                <br />
                <i className="bi bi-telephone"></i>{" "}
                <a href="tel:+94112879410" className="footer-link text-light">
                  (+94) 112 879 410
                </a>
                <br />
                <i className="bi bi-printer"></i> (+94) 112 879 412
              </p>
              <div>
                <a href="#" className="footer-icon text-light me-3">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="footer-icon text-light me-3">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="footer-icon text-light me-3">
                  <i className="bi bi-google"></i>
                </a>
                <a href="#" className="footer-icon text-light">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

            {/* Right: Related Links */}
            <div className="col-md-6">
              <h4 className="fw-bold">Related Links</h4>
              <div className="row">
                <div className="col-6">
                  <ul className="list-unstyled">
                    <li>
                      <a
                        href="https://president.gov.lk"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link text-light"
                      >
                        &gt; President of Sri Lanka
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.presidentsoffice.gov.lk"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link text-light"
                      >
                        &gt; Presidential Secretariat
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.mostr.gov.lk"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link text-light"
                      >
                        &gt; STR Developments
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-6">
                  <ul className="list-unstyled">
                    <li>
                      <a
                        href="https://www.pmd.gov.lk"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link text-light"
                      >
                        &gt; President's Media Division
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.pmoffice.gov.lk"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link text-light"
                      >
                        &gt; Prime Minister's Office
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.mostr.gov.lk"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link text-light"
                      >
                        &gt; STR Developments
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ backgroundColor: "#00798c" }} className="p-3">
        <div className="container d-flex justify-content-between align-items-left flex-wrap text-left text-md-start">
          <p className="mb-1 small text-light">
            Copyright © {year} Ministry of Science &amp; Technology. All Rights Reserved.
            <br />
            Design &amp; Developed by <span className="fw-bold text-light">SLIIT - ISE</span>
          </p>
          <div className="d-flex align-items-left mt-2 mt-md-1">
            <i className="bi bi-telephone me-2 text-light"></i>
            <a href="tel:1919" className="footer-link fw-bold me-3 text-light">
              Know 1919
            </a>
            <div className="last modified ms-3 text-light">
              <span>Last Update :</span>
              <br />
              {lastUpdate}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
