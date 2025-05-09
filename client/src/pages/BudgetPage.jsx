import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BudgetInputForm from "../components/budget/BudgetInputForm";
import RoomDimensionsForm from "../components/budget/RoomDimensionsForm";
import BudgetAlert from "../components/budget/BudgetAlert";
import BudgetRecommendations from "../components/budget/BudgetRecommendations";
import BudgetHistory from "../components/budget/BudgetHistory";
import BudgetComparisonTable from "../components/budget/BudgetComparisonTable";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "./BudgetPage.css";

function BudgetPage() {
  const [budget, setBudget] = useState({ min: 0, max: 0, history: [] });
  const [roomDimensions, setRoomDimensions] = useState(null);
  const [estimate, setEstimate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchBudget = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/budget/${user._id}`);
    if (res.data) {
      const { min, max, dimensions, estimate, recommendations, history = [] } = res.data;
      setBudget({ min, max, history });
      setRoomDimensions(dimensions);
      setEstimate(estimate);
      setRecommendations(recommendations);
    }
  } catch (err) {
    console.error("Error fetching budget data:", err.message);
  } finally {
    setLoading(false);
  }
};

    fetchBudget();
  }, [user, navigate]);

  const handleBudgetSubmit = async (min, max) => {
    try {
      const res = await axios.post("http://localhost:5000/api/budget", {
        userId: user._id,
        min,
        max,
        dimensions: roomDimensions,
      });

      setBudget({
        min: res.data.min,
        max: res.data.max,
        history: res.data.history,
      });
      setEstimate(res.data.estimate);
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error("Error saving budget:", err.message);
    }
  };

  const handleRoomDimensionsSubmit = (dimensions) => {
    handleBudgetSubmit(budget.min, budget.max, dimensions);
  };

  const isOverBudget = estimate > budget.max;

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="budget-page-container">
      <h2 className="mb-4 text-center">Manage Your Painting Budget</h2>

      {!budget.min && !budget.max ? (
        <div className="budget-section">
          <h4 className="text-center mb-3">Set Your Budget</h4>
          <BudgetInputForm onSubmit={handleBudgetSubmit} />
        </div>
      ) : (
        <div className="room-dimensions-section">
          <h4 className="text-center mb-3">Enter Room Dimensions</h4>
          <RoomDimensionsForm onSubmit={handleRoomDimensionsSubmit} />
        </div>
      )}

      {roomDimensions && (
        <>
          <BudgetAlert estimate={estimate} budget={budget} isOver={isOverBudget} />
          <BudgetRecommendations recommendations={recommendations} />
          <BudgetComparisonTable budget={budget} />
        </>
      )}

      {/* Budget History Section */}
      <div className="history-section">
        <h4 className="text-center mt-4">Your Budget History</h4>
        <BudgetHistory history={budget.history} />
      </div>
    </div>
  );
}

export default BudgetPage;
