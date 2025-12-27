// client/src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import './OrderDetailsPage.css';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrderById(orderId);
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      in_progress: '#3b82f6',
      completed: '#059669',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      completed: '#10b981',
      failed: '#ef4444',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>{error}</h2>
          <button onClick={() => navigate('/cart')} className="back-btn">
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        {/* Header */}
        <div className="order-header">
          <div className="header-left">
            <button onClick={() => navigate(-1)} className="back-button">
              ← Back
            </button>
            <div>
              <h1>Order #{order.orderNumber}</h1>
              <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="status-badges">
            <span 
              className="status-badge" 
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
            <span 
              className="status-badge payment" 
              style={{ backgroundColor: getPaymentStatusColor(order.payment.status) }}
            >
              Payment: {order.payment.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Success Message for completed payment */}
        {order.payment.status === 'completed' && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <div>
              <h3>Payment Successful!</h3>
              <p>Transaction ID: {order.payment.transactionId}</p>
              <p>Payment completed on {formatDate(order.payment.paidAt)}</p>
            </div>
          </div>
        )}

        <div className="order-content">
          {/* Order Items */}
          <div className="order-main">
            <div className="order-section">
              <h2>Order Items</h2>
              <div className="items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-details">
                      <h3>{item.contractor?.companyName || 'Contractor'}</h3>
                      <p className="item-description">{item.projectDetails.description}</p>
                      <div className="item-specs">
                        <span>📅 {item.timeline.totalDays} days</span>
                        <span>🏠 {item.projectDetails.numberOfRooms} rooms</span>
                        <span>📐 {item.projectDetails.roomSize} sq ft</span>
                        <span>🎨 {item.projectDetails.projectType}</span>
                      </div>
                      {item.pricing.appliedDiscounts?.length > 0 && (
                        <div className="item-discounts">
                          {item.pricing.appliedDiscounts.map((disc, i) => (
                            <span key={i} className="discount-tag">
                              🎉 {disc.name} (-{formatCurrency(disc.amount)})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="item-pricing">
                      {item.pricing.discountAmount > 0 && (
                        <div className="original-price">
                          {formatCurrency(item.pricing.originalAmount)}
                        </div>
                      )}
                      <div className="final-price">
                        {formatCurrency(item.pricing.finalAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Information */}
            <div className="order-section">
              <h2>Billing Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{order.billing.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{order.billing.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{order.billing.phone}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Address:</span>
                  <span className="info-value">
                    {order.billing.address}, {order.billing.city}, {order.billing.state} {order.billing.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {order.payment.status === 'completed' && order.payment.cardDetails && (
              <div className="order-section">
                <h2>Payment Method</h2>
                <div className="payment-info">
                  <div className="card-icon">💳</div>
                  <div>
                    <p className="card-brand">{order.payment.cardDetails.brand}</p>
                    <p className="card-number">**** **** **** {order.payment.cardDetails.last4}</p>
                    <p className="card-expiry">
                      Expires: {order.payment.cardDetails.expiryMonth}/{order.payment.cardDetails.expiryYear}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.pricing.subtotal)}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.pricing.discount)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Tax (8%):</span>
                  <span>{formatCurrency(order.pricing.tax)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatCurrency(order.pricing.total)}</span>
                </div>
              </div>

              {order.payment.status === 'completed' && (
                <div className="payment-completed">
                  <div className="check-icon">✓</div>
                  <p>Payment Completed</p>
                </div>
              )}

              <div className="order-actions">
                <button 
                  onClick={() => navigate('/contractors')} 
                  className="action-btn primary"
                >
                  Browse More Projects
                </button>
                <button 
                  onClick={() => navigate('/cart')} 
                  className="action-btn secondary"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}