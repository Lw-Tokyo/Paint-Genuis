// client/src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';
import './CartPage.css';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await CartService.getCart();
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const data = await CartService.removeFromCart(itemId);
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return;
    
    try {
      const data = await CartService.clearCart();
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          {cart?.items?.length > 0 && (
            <button onClick={handleClearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {!cart?.items || cart.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some estimates to get started!</p>
            <button onClick={() => navigate('/contractors')} className="browse-btn">
              Browse Contractors
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-header">
                    <div className="item-info">
                      <h3>{item.contractor?.companyName}</h3>
                      <p className="item-description">{item.projectDetails.description}</p>
                      <div className="item-details">
                        <span>📅 {item.timeline.totalDays} days</span>
                        <span>🏠 {item.projectDetails.numberOfRooms} rooms</span>
                        <span>📐 {item.projectDetails.roomSize} sq ft</span>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem(item._id)} className="remove-btn">
                      ✕
                    </button>
                  </div>

                  <div className="item-pricing">
                    {item.pricing.discountAmount > 0 ? (
                      <div className="pricing-details">
                        <div className="price-row">
                          <span>Original:</span>
                          <span className="original-price">
                            {formatCurrency(item.pricing.originalAmount)}
                          </span>
                        </div>
                        <div className="price-row discount">
                          <span>Discount:</span>
                          <span>-{formatCurrency(item.pricing.discountAmount)}</span>
                        </div>
                        <div className="price-row total">
                          <span>Total:</span>
                          <span>{formatCurrency(item.pricing.finalAmount)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="price-row total">
                        <span>Total:</span>
                        <span>{formatCurrency(item.pricing.finalAmount)}</span>
                      </div>
                    )}

                    {item.pricing.appliedDiscounts?.length > 0 && (
                      <div className="applied-discounts">
                        {item.pricing.appliedDiscounts.map((disc, idx) => (
                          <div key={idx} className="discount-badge">
                            <span>🎉</span>
                            <span>{disc.name}</span>
                            {disc.code && <code>{disc.code}</code>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary-section">
              <div className="order-summary">
                <h3>Order Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(cart.totalAmount)}</span>
                  </div>
                  
                  {cart.totalDiscount > 0 && (
                    <div className="summary-row discount">
                      <span>Savings:</span>
                      <span>-{formatCurrency(cart.totalDiscount)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span>Tax (8%):</span>
                    <span>{formatCurrency(cart.finalAmount * 0.08)}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatCurrency(cart.finalAmount * 1.08)}</span>
                  </div>
                </div>

                <button onClick={() => navigate('/checkout')} className="checkout-btn">
                  Proceed to Checkout
                </button>

                <button onClick={() => navigate('/contractors')} className="continue-btn">
                  Continue Shopping
                </button>

                <div className="test-mode-notice">
                  <span className="icon">💳</span>
                  <div>
                    <p className="title">Test Payment Mode</p>
                    <p className="desc">This is a demo checkout. Use test card numbers for payment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}