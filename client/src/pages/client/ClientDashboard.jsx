// client/src/pages/client/ClientDashboard.jsx
import React, { useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DashboardCard from "../../components/common/DashboardCard";
import { UserContext } from "../../context/UserContext";
import { FaEnvelope, FaUserTie, FaFileInvoice } from "react-icons/fa";
import "./ClientDashboard.css";

function ClientDashboardPage() {
  const { user } = useContext(UserContext);

  return (
    <DashboardLayout role="client">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || "Client"} 👋</h2>
        <p>Here’s a quick look at your painting activities.</p>
      </div>

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
    </DashboardLayout>
  );
}

export default ClientDashboardPage;
