import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./ContractorDashboard.css"; // import CSS file

const ContractorDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("view"); // view | update

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>
          Welcome, <span>{user?.name || "Contractor"}</span>
        </h1>
      </header>

      {/* Stats Section */}
      <div className="stats">
        <div className="stat-card">
          <h2>24</h2>
          <p>Projects Completed</p>
        </div>
        <div className="stat-card">
          <h2>$12,300</h2>
          <p>Total Earnings</p>
        </div>
        <div className="stat-card">
          <h2>4.9⭐</h2>
          <p>Client Rating</p>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle">
        <button
          className={activeTab === "view" ? "active" : ""}
          onClick={() => setActiveTab("view")}
        >
          👤 View Profile
        </button>
        <button
          className={activeTab === "update" ? "active" : ""}
          onClick={() => setActiveTab("update")}
        >
          ✏️ Update Profile
        </button>
      </div>

      {/* Content Section */}
      <div className="card">
        {activeTab === "view" ? (
          <div>
            <h2>Profile Overview</h2>
            <p>
              <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone || "N/A"}
            </p>
            <p>
              <strong>Specialization:</strong>{" "}
              {user?.specialization || "Painting Contractor"}
            </p>
          </div>
        ) : (
          <form className="form">
            <h2>Update Profile</h2>
            <input
              type="text"
              placeholder="Full Name"
              defaultValue={user?.name}
            />
            <input
              type="email"
              placeholder="Email"
              defaultValue={user?.email}
            />
            <input
              type="text"
              placeholder="Phone"
              defaultValue={user?.phone}
            />
            <input
              type="text"
              placeholder="Specialization"
              defaultValue={user?.specialization}
            />
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
