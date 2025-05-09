import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

function ContractorDashboardPage() {
  return (
    <DashboardLayout role="contractor">
      <h2 className="mb-4">Welcome Contractor</h2>
      <p>This is your dashboard. You can manage painters, view jobs, and communicate with clients here.</p>
    </DashboardLayout>
  );
}

export default ContractorDashboardPage;
