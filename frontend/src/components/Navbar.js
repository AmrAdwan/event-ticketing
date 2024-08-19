// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthContext from "../context/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav
//       className="navbar navbar-expand-lg navbar-dark"
//       // style={{ backgroundColor: "#aaaaaa6d" }}
//       style={{ backgroundColor: "#4682B4" }}
//     >
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Event Ticketing
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/">
//                 Home
//               </Link>
//             </li>
//             {user ? (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/tickets">
//                     Tickets
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/add-ticket">
//                     Add Ticket
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <button
//                     className="btn btn-link nav-link"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">
//                     Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register">
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//           <div id="google_translate_element" className="ms-auto"></div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// frontend/src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#4682B4" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Event Ticketing
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-ticket">
                    Add Ticket
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tickets">
                    Tickets
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div id="google_translate_element" className="ms-auto"></div>
      </div>
    </nav>
  );
};

export default Navbar;
