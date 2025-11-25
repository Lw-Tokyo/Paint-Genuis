// client/src/pages/contractor/DiscountManagement.jsx
// Create this file in: client/src/pages/contractor/DiscountManagement.jsx

import React, { useState, useEffect } from 'react';
import './DiscountManagement.css';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    type: 'percentage',
    value: 0,
    maxDiscount: null,
    applicableTo: 'all',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    conditions: {
      minRooms: 0,
      minArea: 0,
      projectTypes: [],
      firstTimeUser: false
    },
    maxUsagePerUser: null,
    maxTotalUsage: null,
    stackable: false
  });

  useEffect(() => {
    fetchDiscounts();
    fetchAnalytics();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/discounts/my-discounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDiscounts(data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/discounts/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  const handleCreateDiscount = async () => {
    try {
      const response = await fetch('/api/discounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Discount created successfully!');
        setShowCreateModal(false);
        fetchDiscounts();
        fetchAnalytics();
        resetForm();
      } else {
        alert(data.message || 'Failed to create discount');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create discount');
    }
  };

  const handleToggleActive = async (discountId, currentStatus) => {
    try {
      const response = await fetch(`/api/discounts/${discountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchDiscounts();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleDelete = async (discountId) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;

    try {
      const response = await fetch(`/api/discounts/${discountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Discount deleted successfully');
        fetchDiscounts();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      type: 'percentage',
      value: 0,
      maxDiscount: null,
      applicableTo: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      conditions: {
        minRooms: 0,
        minArea: 0,
        projectTypes: [],
        firstTimeUser: false
      },
      maxUsagePerUser: null,
      maxTotalUsage: null,
      stackable: false
    });
  };

  if (loading) {
    return <div className="discount-loading">Loading discounts...</div>;
  }

  return (
    <div className="discount-dashboard-container">
      {/* Analytics Cards */}
      {analytics && (
        <div className="discount-analytics-grid">
          <div className="discount-analytics-card">
            <div className="discount-card-icon">📊</div>
            <div className="discount-card-content">
              <div className="discount-card-value">{analytics.totalDiscounts}</div>
              <div className="discount-card-label">Total Discounts</div>
            </div>
          </div>

          <div className="discount-analytics-card">
            <div className="discount-card-icon">✅</div>
            <div className="discount-card-content">
              <div className="discount-card-value">{analytics.activeDiscounts}</div>
              <div className="discount-card-label">Active Offers</div>
            </div>
          </div>

          <div className="discount-analytics-card">
            <div className="discount-card-icon">👥</div>
            <div className="discount-card-content">
              <div className="discount-card-value">{analytics.totalUsage}</div>
              <div className="discount-card-label">Times Used</div>
            </div>
          </div>

          <div className="discount-analytics-card">
            <div className="discount-card-icon">💰</div>
            <div className="discount-card-content">
              <div className="discount-card-value">${analytics.totalSavings.toFixed(0)}</div>
              <div className="discount-card-label">Total Savings Given</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="discount-dashboard-header">
        <div>
          <h2>My Discounts & Offers</h2>
          <p>Create and manage promotional offers for your customers</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="discount-btn-create">
          + Create Discount
        </button>
      </div>

      {/* Discounts List */}
      <div className="discount-discounts-table">
        {discounts.length === 0 ? (
          <div className="discount-empty-state">
            <div className="discount-empty-icon">🎁</div>
            <h3>No discounts yet</h3>
            <p>Create your first promotional offer to attract more customers</p>
            <button onClick={() => setShowCreateModal(true)} className="discount-btn-primary">
              Create Your First Discount
            </button>
          </div>
        ) : (
          <table className="discount-table">
            <thead>
              <tr>
                <th>Discount</th>
                <th>Type</th>
                <th>Value</th>
                <th>Usage</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount._id}>
                  <td>
                    <div className="discount-discount-info">
                      <strong>{discount.name}</strong>
                      {discount.code && (
                        <code className="discount-code-badge">{discount.code}</code>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="discount-type-badge">{discount.type}</span>
                  </td>
                  <td>
                    {discount.type === 'percentage' 
                      ? `${discount.value}%` 
                      : `$${discount.value}`}
                  </td>
                  <td>
                    {discount.currentUsageCount}
                    {discount.maxTotalUsage && ` / ${discount.maxTotalUsage}`}
                  </td>
                  <td>{new Date(discount.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`discount-status-badge ${discount.isActive ? 'active' : 'inactive'}`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="discount-action-buttons">
                      <button
                        onClick={() => handleToggleActive(discount._id, discount.isActive)}
                        className="discount-btn-icon"
                        title={discount.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {discount.isActive ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDelete(discount._id)}
                        className="discount-btn-icon discount-btn-danger"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="discount-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="discount-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="discount-modal-header">
              <h3>Create New Discount</h3>
              <button onClick={() => setShowCreateModal(false)} className="discount-close-btn">×</button>
            </div>

            <div className="discount-form-container">
              <div className="discount-form-row">
                <div className="discount-form-group">
                  <label>Discount Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Spring Sale 2024"
                  />
                </div>

                <div className="discount-form-group">
                  <label>Promo Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g., SPRING20"
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="discount-form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this offer to customers"
                  rows={3}
                />
              </div>

              <div className="discount-form-row">
                <div className="discount-form-group">
                  <label>Discount Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="tiered">Tiered (Bulk Discount)</option>
                    <option value="bundle">Bundle Deal</option>
                  </select>
                </div>

                <div className="discount-form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                    placeholder={formData.type === 'percentage' ? '20' : '100'}
                    min="0"
                    step="0.01"
                  />
                  <small>{formData.type === 'percentage' ? '%' : '$'}</small>
                </div>
              </div>

              {formData.type === 'percentage' && (
                <div className="discount-form-group">
                  <label>Max Discount Amount (Optional)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData({...formData, maxDiscount: parseFloat(e.target.value) || null})}
                    placeholder="e.g., 500"
                  />
                  <small>Maximum discount amount in dollars</small>
                </div>
              )}

              <div className="discount-form-row">
                <div className="discount-form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>

                <div className="discount-form-group">
                  <label>Valid Until *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    min={formData.startDate}
                  />
                </div>
              </div>

              <div className="discount-form-section">
                <h4>Conditions (Optional)</h4>
                
                <div className="discount-form-row">
                  <div className="discount-form-group">
                    <label>Minimum Rooms</label>
                    <input
                      type="number"
                      value={formData.conditions.minRooms}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: {...formData.conditions, minRooms: parseInt(e.target.value) || 0}
                      })}
                      min="0"
                    />
                  </div>

                  <div className="discount-form-group">
                    <label>Minimum Area (sq ft)</label>
                    <input
                      type="number"
                      value={formData.conditions.minArea}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: {...formData.conditions, minArea: parseInt(e.target.value) || 0}
                      })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="discount-form-group">
                  <label className="discount-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.conditions.firstTimeUser}
                      onChange={(e) => setFormData({
                        ...formData,
                        conditions: {...formData.conditions, firstTimeUser: e.target.checked}
                      })}
                    />
                    First-time customers only
                  </label>
                </div>
              </div>

              <div className="discount-form-section">
                <h4>Usage Limits (Optional)</h4>
                
                <div className="discount-form-row">
                  <div className="discount-form-group">
                    <label>Max uses per customer</label>
                    <input
                      type="number"
                      value={formData.maxUsagePerUser || ''}
                      onChange={(e) => setFormData({...formData, maxUsagePerUser: parseInt(e.target.value) || null})}
                      placeholder="Unlimited"
                      min="1"
                    />
                  </div>

                  <div className="discount-form-group">
                    <label>Max total uses</label>
                    <input
                      type="number"
                      value={formData.maxTotalUsage || ''}
                      onChange={(e) => setFormData({...formData, maxTotalUsage: parseInt(e.target.value) || null})}
                      placeholder="Unlimited"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="discount-form-actions">
                <button onClick={() => setShowCreateModal(false)} className="discount-btn-secondary">
                  Cancel
                </button>
                <button onClick={handleCreateDiscount} className="discount-btn-primary">
                  Create Discount
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;