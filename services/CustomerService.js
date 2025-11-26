import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const CUSTOMERS_COLLECTION = 'customers';
const USERS_COLLECTION = 'users';

/**
 * Customer Service - Handles customer data and analytics
 */
class CustomerService {
  /**
   * Subscribe to real-time customers updates
   * @param {Function} callback - Called when customers change
   * @returns {Function} Unsubscribe function
   */
  subscribeToCustomers(callback) {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(
        customersQuery,
        (snapshot) => {
          const customers = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            customers.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          });
          callback(customers, null);
        },
        (error) => {
          console.error('Error subscribing to customers:', error);
          callback([], error);
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up customers subscription:', error);
      callback([], error);
      return () => {};
    }
  }

  /**
   * Get all customers
   * @returns {Promise<Array>} Array of customers
   */
  async getAllCustomers() {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(customersQuery);
      const customers = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        customers.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer object
   */
  async getCustomerById(customerId) {
    try {
      const customerDoc = await getDoc(doc(db, USERS_COLLECTION, customerId));
      
      if (customerDoc.exists()) {
        const data = customerDoc.data();
        return {
          id: customerDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      
      throw new Error('Customer not found');
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  /**
   * Get customer by email
   * @param {string} email - Customer email
   * @returns {Promise<Object>} Customer object
   */
  async getCustomerByEmail(email) {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', email),
        limit(1)
      );
      
      const snapshot = await getDocs(customersQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      
      throw new Error('Customer not found');
    } catch (error) {
      console.error('Error fetching customer by email:', error);
      throw error;
    }
  }

  /**
   * Get customer by phone number
   * @param {string} phone - Customer phone
   * @returns {Promise<Object>} Customer object
   */
  async getCustomerByPhone(phone) {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        where('phone', '==', phone),
        limit(1)
      );
      
      const snapshot = await getDocs(customersQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }
      
      throw new Error('Customer not found');
    } catch (error) {
      console.error('Error fetching customer by phone:', error);
      throw error;
    }
  }

  /**
   * Update customer profile
   * @param {string} customerId - Customer ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async updateCustomer(customerId, updates) {
    try {
      const customerRef = doc(db, USERS_COLLECTION, customerId);
      
      await updateDoc(customerRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      
      console.log(`Customer ${customerId} updated successfully`);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  /**
   * Increment customer order count
   * @param {string} customerId - Customer ID
   * @param {number} orderTotal - Order total amount
   * @returns {Promise<void>}
   */
  async incrementOrderStats(customerId, orderTotal) {
    try {
      const customerRef = doc(db, USERS_COLLECTION, customerId);
      
      await updateDoc(customerRef, {
        totalOrders: increment(1),
        totalSpent: increment(orderTotal),
        lastOrderAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      console.log(`Customer ${customerId} order stats updated`);
    } catch (error) {
      console.error('Error incrementing order stats:', error);
      throw error;
    }
  }

  /**
   * Get VIP customers (high spenders)
   * @param {number} minSpent - Minimum amount spent (default $500)
   * @returns {Promise<Array>} Array of VIP customers
   */
  async getVIPCustomers(minSpent = 500) {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        where('totalSpent', '>=', minSpent),
        orderBy('totalSpent', 'desc')
      );
      
      const snapshot = await getDocs(customersQuery);
      const customers = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        customers.push({
          id: doc.id,
          ...data,
          status: 'vip',
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      return customers;
    } catch (error) {
      console.error('Error fetching VIP customers:', error);
      throw error;
    }
  }

  /**
   * Get top customers by spending
   * @param {number} limitCount - Number of customers to return
   * @returns {Promise<Array>} Array of top customers
   */
  async getTopCustomers(limitCount = 10) {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        orderBy('totalSpent', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(customersQuery);
      const customers = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        customers.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      return customers;
    } catch (error) {
      console.error('Error fetching top customers:', error);
      throw error;
    }
  }

  /**
   * Get recently active customers
   * @param {number} days - Number of days to look back (default 30)
   * @returns {Promise<Array>} Array of active customers
   */
  async getRecentlyActiveCustomers(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        where('lastOrderAt', '>=', Timestamp.fromDate(cutoffDate)),
        orderBy('lastOrderAt', 'desc')
      );
      
      const snapshot = await getDocs(customersQuery);
      const customers = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        customers.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastOrderAt: data.lastOrderAt?.toDate() || null,
        });
      });
      
      return customers;
    } catch (error) {
      console.error('Error fetching recently active customers:', error);
      throw error;
    }
  }

  /**
   * Get new customers in date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of new customers
   */
  async getNewCustomers(startDate, endDate) {
    try {
      const customersQuery = query(
        collection(db, USERS_COLLECTION),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(customersQuery);
      const customers = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        customers.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      return customers;
    } catch (error) {
      console.error('Error fetching new customers:', error);
      throw error;
    }
  }

  /**
   * Calculate customer lifetime value (CLV)
   * @param {Object} customer - Customer object
   * @returns {number} Customer lifetime value
   */
  calculateCLV(customer) {
    const totalSpent = customer.totalSpent || 0;
    const totalOrders = customer.totalOrders || 0;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    // Simple CLV calculation: avgOrderValue * expectedOrders * profit margin
    const expectedOrdersPerYear = 12;
    const profitMargin = 0.3;
    const expectedLifetimeYears = 3;
    
    return avgOrderValue * expectedOrdersPerYear * profitMargin * expectedLifetimeYears;
  }

  /**
   * Calculate customer statistics
   * @param {Array} customers - Array of customers
   * @returns {Object} Customer statistics
   */
  calculateCustomerStats(customers) {
    const stats = {
      total: customers.length,
      vip: 0,
      regular: 0,
      new: 0,
      active: 0,
      totalRevenue: 0,
      averageLifetimeValue: 0,
      averageOrdersPerCustomer: 0,
      topCustomer: null,
    };
    
    let totalOrders = 0;
    let maxSpent = 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    customers.forEach((customer) => {
      // Count VIP vs regular
      const spent = customer.totalSpent || 0;
      if (spent >= 500) {
        stats.vip++;
      } else {
        stats.regular++;
      }
      
      // Count new customers (registered in last 7 days)
      const createdAt = customer.createdAt || new Date(0);
      if (createdAt >= sevenDaysAgo) {
        stats.new++;
      }
      
      // Count active customers (ordered in last 30 days)
      const lastOrderAt = customer.lastOrderAt || new Date(0);
      if (lastOrderAt >= thirtyDaysAgo) {
        stats.active++;
      }
      
      // Sum revenue and orders
      stats.totalRevenue += spent;
      totalOrders += customer.totalOrders || 0;
      
      // Find top customer
      if (spent > maxSpent) {
        maxSpent = spent;
        stats.topCustomer = customer;
      }
    });
    
    // Calculate averages
    if (stats.total > 0) {
      stats.averageLifetimeValue = stats.totalRevenue / stats.total;
      stats.averageOrdersPerCustomer = totalOrders / stats.total;
    }
    
    return stats;
  }

  /**
   * Get customer order history
   * @param {string} customerId - Customer ID
   * @returns {Promise<Array>} Array of customer orders
   */
  async getCustomerOrders(customerId) {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', customerId),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(ordersQuery);
      const orders = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  /**
   * Search customers by name, email, or phone
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching customers
   */
  async searchCustomers(searchTerm) {
    try {
      const allCustomers = await this.getAllCustomers();
      
      const searchLower = searchTerm.toLowerCase();
      
      return allCustomers.filter((customer) => {
        const name = (customer.name || '').toLowerCase();
        const email = (customer.email || '').toLowerCase();
        const phone = (customer.phone || '').toLowerCase();
        
        return (
          name.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
}

export default new CustomerService();
