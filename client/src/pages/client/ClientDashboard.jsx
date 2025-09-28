import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

function ClientDashboardPage() {
  return (
    <DashboardLayout role="client">
      <h2 className="mb-4">Welcome Client</h2>
      <p>This is your dashboard. You can send messages, request quotes, and review painter profiles here.</p>
    </DashboardLayout>
  );
}

export default ClientDashboardPage;
