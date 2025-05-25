
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
      <h3 className="text-center mb-4">Admin Panel</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/messages">Messages</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/login">Login</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/signup">Sign Up</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
