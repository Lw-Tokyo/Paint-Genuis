// client/src/services/OrderService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) return user.token;
    }
    return localStorage.getItem('token') || '';
  } catch (e) {
    return '';
  }
};

class OrderService {
  static async createOrder(paymentMethod, billingInfo) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod, billingInfo })
      });
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  static async processPayment(orderId, cardDetails) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders/payment/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, cardDetails })
      });
      return await response.json();
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  static async getMyOrders(page = 1, limit = 10) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders/my-orders?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  static async cancelOrder(orderId, reason) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      return await response.json();
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }
}

export default OrderService;