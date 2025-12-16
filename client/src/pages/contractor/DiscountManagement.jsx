// client/src/pages/contractor/DiscountManagement.jsx

import React, { useState, useEffect } from 'react';
import './DiscountManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ✅ CRITICAL FIX: Helper function to get token from either location
const getAuthToken = () => {
  try {
    // Try getting token from user object first
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) {
        console.log('✅ Token found in user object');
        return user.token;
      }
    }
    
    // Fallback to direct token storage
    const directToken = localStorage.getItem('token');
    if (directToken) {
      console.log('✅ Token found in localStorage');
      return directToken;
    }
    
    console.error('❌ No token found in either location');
    return null;
  } catch (e) {
    console.error('❌ Error getting token:', e);
    return null;
  }
};

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
      const token = getAuthToken();
      
      if (!token) {
        console.error('❌ Cannot fetch discounts: No token available');
        alert('Please login again. Your session may have expired.');
        return;
      }

      console.log('📡 Fetching discounts with token:', token.substring(0, 20) + '...');

      const response = await fetch(`${API_URL}/discounts/my-discounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📥 Fetch discounts response:', response.status);
      
      const data = await response.json();
      console.log('📥 Fetch discounts data:', data);
      
      if (response.ok && data.success) {
        setDiscounts(data.data);
      } else {
        console.error('❌ Fetch failed:', data);
        if (response.status === 401) {
          alert('Authentication failed. Please login again.');
        }
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.error('❌ Cannot fetch analytics: No token available');
        return;
      }

      const response = await fetch(`${API_URL}/discounts/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('❌ Analytics error:', error);
    }
  };

  const handleCreateDiscount = async () => {
    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        alert('❌ Please enter a discount name');
        return;
      }

      if (!formData.description?.trim()) {
        alert('❌ Please enter a description');
        return;
      }

      if (!formData.endDate) {
        alert('❌ Please select an end date');
        return;
      }

      if (formData.value <= 0) {
        alert('❌ Discount value must be greater than 0');
        return;
      }

      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        alert('❌ End date must be after start date');
        return;
      }

      const token = getAuthToken();
      
      if (!token) {
        alert('❌ Please login again. Your session may have expired.');
        return;
      }

      console.log('📤 Sending to:', `${API_URL}/discounts/create`);
      console.log('📤 Data:', formData);
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');

      const response = await fetch(`${API_URL}/discounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response URL:', response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        
        if (response.status === 401) {
          alert('❌ Authentication failed. Please login again.');
          return;
        }
        
        throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (data.success) {
        alert('✅ Discount created successfully!');
        setShowCreateModal(false);
        fetchDiscounts();
        fetchAnalytics();
        resetForm();
      } else {
        if (data.errors) {
          const errorMessages = data.errors.map(e => `• ${e.field}: ${e.message}`).join('\n');
          alert(`❌ Validation Errors:\n${errorMessages}`);
        } else {
          alert(`❌ ${data.message || 'Failed to create discount'}`);
        }
      }
    } catch (error) {
      console.error('❌ Create error:', error);
      alert(`❌ Error: ${error.message}\n\nMake sure:\n1. Server is running on http://localhost:5000\n2. You're logged in as a contractor\n3. You have a contractor profile`);
    }
  };

  const handleToggleActive = async (discountId, currentStatus) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(`${API_URL}/discounts/${discountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchDiscounts();
      }
    } catch (error) {
      console.error('❌ Toggle error:', error);
    }
  };

  const handleDelete = async (discountId) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;

    try {
      const token = getAuthToken();
      
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch(`${API_URL}/discounts/${discountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Discount deleted successfully');
        fetchDiscounts();
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
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

      {/* Create Modal - (rest of the JSX remains the same as your original) */}
      {showCreateModal && (
        <div className="discount-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="discount-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="discount-modal-header">
              <h3>Create New Discount</h3>
              <button onClick={() => setShowCreateModal(false)} className="discount-close-btn">×</button>
            </div>

            <div className="discount-form-container">
              {/* Form fields remain the same - I'll include them for completeness */}
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