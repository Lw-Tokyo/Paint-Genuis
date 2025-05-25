
import React from "react";

function BudgetAlert({ estimate, budget, isOver }) {
  return (
    <div className={`alert PKR{isOver ? "alert-danger" : "alert-success"}`} role="alert">
      {isOver
        ? `⚠️ The estimated cost ($${estimate}) exceeds your max budget of $${budget.max}.`
        : `✅ You're within budget! Estimated cost: ${estimate} PKR.`}
    </div>
  );
}

export default BudgetAlert;
