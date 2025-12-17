// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';
import OrderService from '../services/OrderService';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Billing, 2: Payment, 3: Review

  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await CartService.getCart();
      if (data.success) {
        if (!data.data.items || data.data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setCart(data.data);
      }
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingChange = (field, value) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateBilling = () => {
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone || 
        !billingInfo.address || !billingInfo.city || !billingInfo.state || !billingInfo.zipCode) {
      alert('Please fill all billing information');
      return false;
    }
    return true;
  };

  const validateCard = () => {
    if (cardDetails.number.length !== 16) {
      alert('Card number must be 16 digits');
      return false;
    }
    if (!cardDetails.name) {
      alert('Please enter cardholder name');
      return false;
    }
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      alert('Please enter expiry date');
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      alert('CVV must be 3 digits');
      return false;
    }
    return true;
  };

  const handleCreateOrder = async () => {
    if (!validateBilling()) return;

    setProcessing(true);
    setError('');

    try {
      const data = await OrderService.createOrder(paymentMethod, billingInfo);
      if (data.success) {
        setOrderId(data.data._id);
        setCurrentStep(2);
      } else {
        setError(data.message || 'Failed to create order');
      }
    } catch (err) {
      setError('Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!validateCard()) return;

    setProcessing(true);
    setError('');

    try {
      const data = await OrderService.processPayment(orderId, cardDetails);
      if (data.success) {
        alert('✅ Payment successful! Order confirmed.');
        navigate(`/orders/${orderId}`);
      } else {
        setError(data.message || 'Payment failed');
      }
    } catch (err) {
      setError('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="checkout-page"><div className="loading">Loading...</div></div>;
  }

  const tax = cart.finalAmount * 0.08;
  const total = cart.finalAmount + tax;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Billing</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Payment</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirm</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Step 1: Billing Information */}
            {currentStep === 1 && (
              <div className="billing-section">
                <h2>Billing Information</h2>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={billingInfo.fullName}
                    onChange={(e) => handleBillingChange('fullName', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={billingInfo.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={billingInfo.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Address *"
                    value={billingInfo.address}
                    onChange={(e) => handleBillingChange('address', e.target.value)}
                    className="form-input full-width"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={billingInfo.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={billingInfo.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code *"
                    value={billingInfo.zipCode}
                    onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                    className="form-input"
                  />
                </div>
                <button
                  onClick={handleCreateOrder}
                  disabled={processing}
                  className="continue-btn-checkout"
                >
                  {processing ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="payment-section">
                <h2>Payment Information</h2>
                
                <div className="test-cards-info">
                  <h3>Test Card Numbers (Demo Mode)</h3>
                  <p>Use these test cards for demo payment:</p>
                  <ul>
                    <li><strong>Visa:</strong> 4532015112830366</li>
                    <li><strong>Mastercard:</strong> 5425233430109903</li>
                    <li><strong>CVV:</strong> Any 3 digits</li>
                    <li><strong>Expiry:</strong> Any future date</li>
                  </ul>
                </div>

                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    maxLength="16"
                    value={cardDetails.number}
                    onChange={(e) => handleCardChange('number', e.target.value.replace(/\D/g, ''))}
                    className="form-input full-width"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => handleCardChange('name', e.target.value)}
                    className="form-input full-width"
                  />
                  <select
                    value={cardDetails.expiryMonth}
                    onChange={(e) => handleCardChange('expiryMonth', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Month</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {(i + 1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={cardDetails.expiryYear}
                    onChange={(e) => handleCardChange('expiryYear', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Year</option>
                    {[...Array(10)].map((_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength="3"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                  />
                </div>

                <div className="button-group">
                  <button onClick={() => setCurrentStep(1)} className="back-btn">
                    Back
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={processing}
                    className="pay-btn"
                  >
                    {processing ? 'Processing Payment...' : `Pay ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.items.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <span>{item.contractor?.companyName}</span>
                    <span>{formatCurrency(item.pricing.finalAmount)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cart.finalAmount)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (8%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="total-row final">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}