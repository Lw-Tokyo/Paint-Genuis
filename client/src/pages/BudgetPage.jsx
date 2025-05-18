// client/src/pages/BudgetPage.jsx
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
  const [budget, setBudget] = useState(null);
  const [roomDimensions, setRoomDimensions] = useState(null);
  const [estimate, setEstimate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showDimensionsForm, setShowDimensionsForm] = useState(false);

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
        if (res.data && res.data.min !== undefined && res.data.max !== undefined) {
          const { min, max, dimensions, estimate, recommendations, history = [] } = res.data;
          setBudget({ min, max, history });
          setRoomDimensions(dimensions);
          setEstimate(estimate || 0);
          setRecommendations(recommendations || []);
        } else {
          // Initialize with empty budget for new users
          setBudget({ min: 0, max: 0, history: [] });
          setShowBudgetForm(true);
        }
      } catch (err) {
        // Handle 404 (no budget found) gracefully
        if (err.response && err.response.status === 404) {
          setBudget({ min: 0, max: 0, history: [] });
          setShowBudgetForm(true);
        } else {
          console.error("Error fetching budget data:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [user, navigate]);

  const handleBudgetSubmit = async (min, max, dimensions = null) => {
    try {
      const res = await axios.post("http://localhost:5000/api/budget", {
        userId: user._id,
        min,
        max,
        dimensions,
      });

      setBudget({
        min: res.data.min,
        max: res.data.max,
        history: res.data.history || [],
      });
      
      if (res.data.estimate) {
        setEstimate(res.data.estimate);
      }
      
      if (res.data.recommendations) {
        setRecommendations(res.data.recommendations);
      }
      
      if (dimensions) {
        setRoomDimensions(dimensions);
      }
      
      // Hide the forms after successful submission
      setShowBudgetForm(false);
      setShowDimensionsForm(false);
    } catch (err) {
      console.error("Error saving budget:", err.message);
    }
  };

  const handleRoomDimensionsSubmit = (dimensions) => {
    handleBudgetSubmit(budget.min, budget.max, dimensions);
  };

  const handleHistoryDelete = async (index) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/budget/${user._id}/history/${index}`);
      setBudget({
        ...budget,
        history: res.data.history || [],
      });
    } catch (err) {
      console.error("Error deleting history entry:", err.message);
    }
  };

  const handleChangeBudget = () => {
    setShowBudgetForm(true);
    setShowDimensionsForm(false);
  };

  const handleChangeDimensions = () => {
    setShowDimensionsForm(true);
    setShowBudgetForm(false);
  };

  const isOverBudget = estimate > (budget?.max || 0);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  
  // Make sure budget state is properly initialized before rendering
  if (!budget) return <div className="text-center mt-5">Initializing budget...</div>;

  const hasBudget = budget?.min > 0 && budget?.max > 0;

  return (
    <div className="budget-page-container">
      <h2 className="mb-4 text-center">Manage Your Painting Budget</h2>

      {/* Budget Management Controls */}
      {hasBudget && (
        <div className="budget-controls d-flex justify-content-center mb-4">
          <button 
            className="btn btn-outline-primary me-3"
            onClick={handleChangeBudget}
          >
            Change Budget
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={handleChangeDimensions}
          >
            Change Dimensions
          </button>
        </div>
      )}

      {/* Current Budget & Dimensions Display */}
      {hasBudget && !showBudgetForm && !showDimensionsForm && (
        <div className="current-settings p-3 mb-4 bg-light rounded">
          <div className="row">
            <div className="col-md-6">
              <h5>Current Budget</h5>
              <p>Minimum: {budget.min} PKR</p>
              <p>Maximum: {budget.max} PKR</p>
            </div>
            {roomDimensions && (
              <div className="col-md-6">
                <h5>Current Dimensions</h5>
                <p>Length: {roomDimensions.length} ft</p>
                <p>Width: {roomDimensions.width} ft</p>
                <p>Height: {roomDimensions.height} ft</p>
                <p>Area: {roomDimensions.length * roomDimensions.width} sq ft</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forms */}
      {(!hasBudget || showBudgetForm) && (
        <div className="budget-section">
          <h4 className="text-center mb-3">Set Your Budget</h4>
          <BudgetInputForm onSubmit={handleBudgetSubmit} initialMin={hasBudget ? budget.min : ""} initialMax={hasBudget ? budget.max : ""} />
        </div>
      )}

      {hasBudget && !showBudgetForm && (!roomDimensions || showDimensionsForm) && (
        <div className="room-dimensions-section">
          <h4 className="text-center mb-3">Enter Room Dimensions</h4>
          <RoomDimensionsForm 
            onSubmit={handleRoomDimensionsSubmit} 
            initialDimensions={roomDimensions ? {
              length: roomDimensions.length,
              width: roomDimensions.width,
              height: roomDimensions.height
            } : null}
          />
        </div>
      )}

      {/* Results */}
      {roomDimensions && !showBudgetForm && !showDimensionsForm && (
        <>
          <BudgetAlert estimate={estimate} budget={budget} isOver={isOverBudget} />
          <BudgetRecommendations recommendations={recommendations} />
          <BudgetComparisonTable budget={budget} />
        </>
      )}

      {/* Budget History Section */}
      <div className="history-section">
        <h4 className="text-center mt-4">Your Budget History</h4>
        <BudgetHistory history={budget.history} onDelete={handleHistoryDelete} />
      </div>
    </div>
  );
}

export default BudgetPage;