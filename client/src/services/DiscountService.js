// client/src/services/DiscountService.js (NEW FILE)

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class DiscountService {
  // Get active discounts
  static async getActiveDiscounts(applicableTo = null, contractorId = null) {
    try {
      let url = `${API_URL}/discounts/active`;
      const params = new URLSearchParams();
      
      if (applicableTo) params.append('applicableTo', applicableTo);
      if (contractorId) params.append('contractorId', contractorId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Get active discounts error:', error);
      throw error;
    }
  }

  // Validate promo code
  static async validatePromoCode(code) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/discounts/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      return await response.json();
    } catch (error) {
      console.error('Validate promo code error:', error);
      throw error;
    }
  }

  // Create discount (Contractor only)
  static async createDiscount(discountData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/discounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(discountData)
      });

      return await response.json();
    } catch (error) {
      console.error('Create discount error:', error);
      throw error;
    }
  }

  // Get contractor's discounts
  static async getMyDiscounts() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/discounts/my-discounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Get my discounts error:', error);
      throw error;
    }
  }

  // Update discount
  static async updateDiscount(id, updateData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/discounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      return await response.json();
    } catch (error) {
      console.error('Update discount error:', error);
      throw error;
    }
  }

  // Delete discount
  static async deleteDiscount(id) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/discounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Delete discount error:', error);
      throw error;
    }
  }

  // Get analytics
  static async getAnalytics() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/discounts/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }
}

export default DiscountService;