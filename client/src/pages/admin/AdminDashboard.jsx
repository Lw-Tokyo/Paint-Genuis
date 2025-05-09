import React from "react";
import { FaEnvelope, FaUsers, FaCalculator } from "react-icons/fa";
//import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";

function AdminDashboardPage() {
  const cardData = [
    {
      title: "Total Messages",
      value: 10,
      icon: <FaEnvelope size={28} />,
      bg: "bg-primary"
    },
    {
      title: "Total Users",
      value: 5,
      icon: <FaUsers size={28} />,
      bg: "bg-success"
    },
    {
      title: "Total Estimates",
      value: 7,
      icon: <FaCalculator size={28} />,
      bg: "bg-warning"
    }
  ];

  return (
    <DashboardLayout role="admin">
      <h2 className="mb-4">Welcome Admin</h2>
      <div className="row">
        {cardData.map((card, idx) => (
          <div className="col-md-4 mb-4" key={idx}>
            <div
              className={`card text-white ${card.bg}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              style={{ borderRadius: "1rem", boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text fs-4">{card.value}</p>
                </div>
                <div>{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboardPage;
