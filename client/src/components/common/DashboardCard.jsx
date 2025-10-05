// client/src/components/common/DashboardCard.jsx
import React from "react";
import "./DashboardCard.css";

function DashboardCard({ title, value, icon, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default DashboardCard;
