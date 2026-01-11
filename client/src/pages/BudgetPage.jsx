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
  const [coats, setCoats] = useState(3);

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
          const { min, max, dimensions, estimate, recommendations, history = [], coats = 3 } = res.data;
          setBudget({ min, max, history });
          setRoomDimensions(dimensions);
          setEstimate(estimate || 0);
          setRecommendations(recommendations || []);
          setCoats(coats);
        } else {
          setBudget({ min: 0, max: 0, history: [] });
          setShowBudgetForm(true);
        }
      } catch (err) {
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
      
      if (res.data.coats) {
        setCoats(res.data.coats);
      }
      
      setShowBudgetForm(false);
      setShowDimensionsForm(false);
    } catch (err) {
      console.error("Error saving budget:", err.message);
    }
  };

  const handleRoomDimensionsSubmit = (dimensionsData) => {
    const { coats: newCoats, ...dimensions } = dimensionsData;
    setCoats(newCoats);
    handleBudgetSubmit(budget.min, budget.max, { ...dimensions, coats: newCoats });
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

  if (loading) {
    return (
      <div className="budget-page-wrapper">
        <div className="budget-content">
          <div className="budget-loading-card budget-slide-in-up">
            <div className="budget-loading-spinner"></div>
            <p className="budget-loading-text">Loading your budget...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!budget) {
    return (
      <div className="budget-page-wrapper">
        <div className="budget-content">
          <div className="budget-loading-card budget-slide-in-up">
            <p className="budget-loading-text">Initializing budget...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasBudget = budget?.min > 0 && budget?.max > 0;

  return (
    <div className="budget-page-wrapper">
      <div className="budget-content">
        {/* Page Header */}
        <header className="budget-page-header budget-slide-in-down">
          <h1 className="budget-page-title">
            <span className="budget-gradient-text">💰 Budget Management</span>
          </h1>
          <p className="budget-page-subtitle">Plan and track your painting project budget</p>
        </header>

        {/* Budget Controls */}
        {hasBudget && (
          <div className="budget-controls-container budget-slide-in-up-delay-1">
            <button 
              className="budget-primary-button"
              onClick={handleChangeBudget}
            >
              <span className="budget-button-icon">📊</span>
              Change Budget
            </button>
            <button 
              className="budget-secondary-button"
              onClick={handleChangeDimensions}
            >
              <span className="budget-button-icon">📐</span>
              Change Dimensions
            </button>
          </div>
        )}

        {/* Current Settings Display */}
        {hasBudget && !showBudgetForm && !showDimensionsForm && (
          <div className="budget-glass-card budget-slide-in-up-delay-2">
            <div className="budget-settings-grid">
              <div className="budget-settings-section">
                <div className="budget-section-header">
                  <span className="budget-section-icon">💵</span>
                  <h3 className="budget-section-title">Current Budget</h3>
                </div>
                <div className="budget-info">
                  <div className="budget-item">
                    <span className="budget-label">Minimum</span>
                    <span className="budget-value budget-gradient-text">
                      {budget.min.toLocaleString()} PKR
                    </span>
                  </div>
                  <div className="budget-item">
                    <span className="budget-label">Maximum</span>
                    <span className="budget-value budget-gradient-text">
                      {budget.max.toLocaleString()} PKR
                    </span>
                  </div>
                </div>
              </div>
              
              {roomDimensions && (
                <div className="budget-settings-section">
                  <div className="budget-section-header">
                    <span className="budget-section-icon">📏</span>
                    <h3 className="budget-section-title">Current Dimensions</h3>
                  </div>
                  <div className="budget-dimensions-grid">
                    <div className="budget-dimension-item">
                      <span className="budget-dimension-label">Length</span>
                      <span className="budget-dimension-value">{roomDimensions.length} ft</span>
                    </div>
                    <div className="budget-dimension-item">
                      <span className="budget-dimension-label">Width</span>
                      <span className="budget-dimension-value">{roomDimensions.width} ft</span>
                    </div>
                    <div className="budget-dimension-item">
                      <span className="budget-dimension-label">Height</span>
                      <span className="budget-dimension-value">{roomDimensions.height} ft</span>
                    </div>
                    <div className="budget-dimension-item">
                      <span className="budget-dimension-label">Area</span>
                      <span className="budget-dimension-value budget-gradient-text budget-area-value">
                        {roomDimensions.length * roomDimensions.width} sq ft
                      </span>
                    </div>
                    <div className="budget-dimension-item">
                      <span className="budget-dimension-label">Coats</span>
                      <span className="budget-dimension-value">{coats}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budget Form */}
        {(!hasBudget || showBudgetForm) && (
          <div className="budget-glass-card budget-slide-in-up-delay-3">
            <div className="budget-form-header">
              <span className="budget-form-icon">💰</span>
              <h2 className="budget-form-title">
                <span className="budget-gradient-text">Set Your Budget</span>
              </h2>
            </div>
            <BudgetInputForm 
              onSubmit={handleBudgetSubmit} 
              initialMin={hasBudget ? budget.min : ""} 
              initialMax={hasBudget ? budget.max : ""} 
            />
          </div>
        )}

        {/* Dimensions Form */}
        {hasBudget && !showBudgetForm && (!roomDimensions || showDimensionsForm) && (
          <div className="budget-glass-card budget-slide-in-up-delay-3">
            <div className="budget-form-header">
              <span className="budget-form-icon">📐</span>
              <h2 className="budget-form-title">
                <span className="budget-gradient-text">Enter Room Dimensions</span>
              </h2>
            </div>
            <RoomDimensionsForm 
              onSubmit={handleRoomDimensionsSubmit} 
              initialDimensions={roomDimensions ? {
                length: roomDimensions.length,
                width: roomDimensions.width,
                height: roomDimensions.height
              } : null}
              initialCoats={coats}
            />
          </div>
        )}

        {/* Budget Analysis */}
        {roomDimensions && !showBudgetForm && !showDimensionsForm && (
          <div className="budget-slide-in-up-delay-4">
            <BudgetAlert estimate={estimate} budget={budget} isOver={isOverBudget} />
            <BudgetRecommendations recommendations={recommendations} />
            <BudgetComparisonTable budget={budget} recommendations={recommendations} />
          </div>
        )}

        {/* Budget History */}
        <div className="budget-glass-card budget-history-section budget-slide-in-up-delay-5">
          <div className="budget-history-header">
            <span className="budget-history-icon">📜</span>
            <h2 className="budget-history-title">
              <span className="budget-gradient-text">Budget History</span>
            </h2>
          </div>
          <BudgetHistory history={budget.history} onDelete={handleHistoryDelete} />
        </div>
      </div>
    </div>
  );
}

export default BudgetPage;