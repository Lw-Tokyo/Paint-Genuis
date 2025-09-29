
// client/src/components/layout/DashboardLayout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();

  const user = AuthService.getCurrentUser(); // ✅ now we will use this


  const handleLogout = () => {
    AuthService.logout();
    navigate("/auth");
  };

  const navLinks = {
    admin: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Messages", to: "/admin/messages" },
    ],
    contractor: [
      { label: "Dashboard", to: "/contractor/dashboard" },
      { label: "Hire Painter", to: "/contractor/hire" },

      { label: "My Profile", to: "/contractor/create-profile" }, // ✅ added direct link
    ],
    painter: [
      { label: "Dashboard", to: "/painter/dashboard" },
      { label: "Availability", to: "/painter/availability" },
    ],
    client: [
      { label: "Dashboard", to: "/client/dashboard" },
      { label: "Estimates", to: "/client/estimates" },
    ],
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">

      {/* Sidebar */}
      <div className="bg-secondary p-3" style={{ width: "250px" }}>
        <h4 className="mb-4">Paint Genius</h4>
        <nav className="nav flex-column">
          {(navLinks[role] || []).map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="nav-link text-white mb-2"
            >
              {link.label}
            </Link>
          ))}

          <button className="btn btn-danger mt-4" onClick={handleLogout}>

            Logout
          </button>
        </nav>
      </div>


      {/* Main Content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        {/* ✅ User header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">
            Welcome {user?.name || role}
          </h2>
          <small className="text-muted">
            {user?.email}
          </small>
        </div>

        {children}
      </div>
    </div>
  );
}


export default DashboardLayout;

