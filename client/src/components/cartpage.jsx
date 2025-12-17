import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {cart?.items?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!cart?.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some estimates to get started!</p>
            <button
              onClick={() => navigate('/contractors')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Contractors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {item.contractor?.companyName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.projectDetails.description}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📅 {item.timeline.totalDays} days</span>
                        <span>🏠 {item.projectDetails.numberOfRooms} rooms</span>
                        <span>📐 {item.projectDetails.roomSize} sq ft</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-4">
                    {item.pricing.discountAmount > 0 ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Original:</span>
                          <span className="line-through text-gray-500">
                            {formatCurrency(item.pricing.originalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>-{formatCurrency(item.pricing.discountAmount)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-blue-600">
                            {formatCurrency(item.pricing.finalAmount)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-blue-600">
                          {formatCurrency(item.pricing.finalAmount)}
                        </span>
                      </div>
                    )}

                    {item.pricing.appliedDiscounts?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {item.pricing.appliedDiscounts.map((disc, idx) => (
                          <div key={idx} className="text-xs text-green-600 flex items-center gap-2">
                            <span>🎉</span>
                            <span>{disc.name}</span>
                            {disc.code && (
                              <code className="bg-green-50 px-2 py-0.5 rounded">
                                {disc.code}
                              </code>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(cart.totalAmount)}</span>
                  </div>
                  
                  {cart.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings:</span>
                      <span>-{formatCurrency(cart.totalDiscount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%):</span>
                    <span>{formatCurrency(cart.finalAmount * 0.08)}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {formatCurrency(cart.finalAmount * 1.08)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/contractors')}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💳</span>
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">
                        Test Payment Mode
                      </p>
                      <p className="text-blue-700">
                        This is a demo checkout. Use test card numbers for payment.
                      </p>
                    </div>
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