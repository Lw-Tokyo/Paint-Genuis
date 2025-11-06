// client/src/pages/client/ClientDashboard.jsx
import React, { useContext, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCard from "../../components/common/DashboardCard";
import { UserContext } from "../../context/UserContext";
import { FaEnvelope, FaUserTie, FaFileInvoice, FaClipboardList } from "react-icons/fa";
import "./ClientDashboard.css";
import SavedEstimates from '../../components/SavedEstimates';

function ClientDashboardPage() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout role="client">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || "Client"} 👋</h2>
        <p>Here's a quick look at your painting activities.</p>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FaClipboardList />
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === "estimates" ? "active" : ""}`}
          onClick={() => setActiveTab("estimates")}
        >
          <FaFileInvoice />
          Saved Estimates
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <div className="cards-container">
          <DashboardCard
            title="Active Quotes"
            value="3"
            icon={<FaFileInvoice />}
            onClick={() => window.location.href = "/quotes"}
          />
          <DashboardCard
            title="Messages"
            value="5"
            icon={<FaEnvelope />}
            onClick={() => window.location.href = "/messages"}
          />
          <DashboardCard
            title="Hired Contractors"
            value="2"
            icon={<FaUserTie />}
            onClick={() => window.location.href = "/contractors"}
          />
        </div>
      ) : (
        <div className="estimates-tab-content">
          <SavedEstimates />
        </div>
      )}
    </DashboardLayout>
  );
}

export default ClientDashboardPage;