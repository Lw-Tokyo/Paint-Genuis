// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
// import { motion } from 'framer-motion';
import { FaPaintRoller, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const context = useContext(UserContext);
  const navigate = useNavigate();

   if (!context) return null;

  const { user, setUser } = context;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaPaintRoller className="me-2" />
          Paint Genius
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/estimate">Estimate Cost</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/WallColorVisualizer">Visualizer</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/coverage-calculator">Coverage</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>

            {user ? (
              <>
                {user.role === "client" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/budget">Budget</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/client/dashboard">Dashboard</Link>
                    </li>
                  </>
                )}
                {user.role === "contractor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/contractor/dashboard">Dashboard</Link>
                  </li>
                )}
                {user.role === "painter" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/painter/dashboard">Dashboard</Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">Admin Panel</Link>
                  </li>
                )}
                <li className="nav-item d-flex align-items-center text-white ms-3">
                  <span className="nav-link disabled">Hi, <strong>{user.username || user.name || user.email?.split('@')[0]}</strong></span>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/auth">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
