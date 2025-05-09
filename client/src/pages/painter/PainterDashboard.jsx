import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

function PainterDashboardPage() {
  return (
    <DashboardLayout role="painter">
      <h2 className="mb-4">Welcome Painter</h2>
      <p>This is your dashboard. Post your availability, check job requests, and manage your profile.</p>
    </DashboardLayout>
  );
}

export default PainterDashboardPage;
