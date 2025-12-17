// client/src/services/CartService.js
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

class CartService {
  static async getCart() {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  }

  static async addToCart(estimateId) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estimateId })
      });
      return await response.json();
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  static async removeFromCart(itemId) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  static async clearCart() {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }
}

export default CartService;