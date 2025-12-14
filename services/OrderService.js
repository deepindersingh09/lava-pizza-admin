import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ORDERS_COLLECTION = 'orders';

/**
 * Order Service - Handles all order-related database operations
 */
class OrderService {
  /**
   * Subscribe to real-time orders updates
   * @param {Function} callback - Called when orders change
   * @param {Object} filters - Optional filters (status, limit, etc.)
   * @returns {Function} Unsubscribe function
   */
  subscribeToOrders(callback, filters = {}) {
    try {
      let ordersQuery = collection(db, ORDERS_COLLECTION);
      
      // Apply filters - FIXED: Changed from 'timestamp' to 'createdAt'
      const constraints = [orderBy('createdAt', 'desc')];
      
      if (filters.status) {
        constraints.unshift(where('status', '==', filters.status));
      }
      
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }
      
      ordersQuery = query(ordersQuery, ...constraints);
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(
        ordersQuery,
        (snapshot) => {
          const orders = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            orders.push({
              id: doc.id,
              ...data,
              // Handle both createdAt and old timestamp field
              timestamp: data.createdAt?.toDate() || data.timestamp?.toDate() || new Date(),
            });
          });
          callback(orders, null);
        },
        (error) => {
          console.error('Error subscribing to orders:', error);
          callback([], error);
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up orders subscription:', error);
      callback([], error);
      return () => {};
    }
  }

  /**
   * Get all orders (one-time fetch)
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of orders
   */
  async getAllOrders(filters = {}) {
    try {
      let ordersQuery = collection(db, ORDERS_COLLECTION);
      
      // FIXED: Changed from 'timestamp' to 'createdAt'
      const constraints = [orderBy('createdAt', 'desc')];
      
      if (filters.status) {
        constraints.unshift(where('status', '==', filters.status));
      }
      
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }
      
      ordersQuery = query(ordersQuery, ...constraints);
      
      const snapshot = await getDocs(ordersQuery);
      const orders = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          // Handle both createdAt and old timestamp field
          timestamp: data.createdAt?.toDate() || data.timestamp?.toDate() || new Date(),
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get a single order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order object
   */
  async getOrderById(orderId) {
    try {
      const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
      
      if (orderDoc.exists()) {
        const data = orderDoc.data();
        return {
          id: orderDoc.id,
          ...data,
          // Handle both createdAt and old timestamp field
          timestamp: data.createdAt?.toDate() || data.timestamp?.toDate() || new Date(),
        };
      }
      
      throw new Error('Order not found');
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} newStatus - New status (pending, preparing, ready, completed, cancelled)
   * @returns {Promise<void>}
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
        [`statusHistory.${newStatus}`]: Timestamp.now(),
      });
      
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Update multiple order fields
   * @param {string} orderId - Order ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async updateOrder(orderId, updates) {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      
      console.log(`Order ${orderId} updated successfully`);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Get orders by status
   * @param {string} status - Order status
   * @returns {Promise<Array>} Array of orders
   */
  async getOrdersByStatus(status) {
    return this.getAllOrders({ status });
  }

  /**
   * Get today's orders
   * @returns {Promise<Array>} Array of today's orders
   */
  async getTodaysOrders() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // FIXED: Changed from 'timestamp' to 'createdAt'
      const ordersQuery = query(
        collection(db, ORDERS_COLLECTION),
        where('createdAt', '>=', Timestamp.fromDate(today)),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(ordersQuery);
      const orders = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          // Handle both createdAt and old timestamp field
          timestamp: data.createdAt?.toDate() || data.timestamp?.toDate() || new Date(),
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching today\'s orders:', error);
      throw error;
    }
  }

  /**
   * Get orders in date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of orders
   */
  async getOrdersByDateRange(startDate, endDate) {
    try {
      // FIXED: Changed from 'timestamp' to 'createdAt'
      const ordersQuery = query(
        collection(db, ORDERS_COLLECTION),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(ordersQuery);
      const orders = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          // Handle both createdAt and old timestamp field
          timestamp: data.createdAt?.toDate() || data.timestamp?.toDate() || new Date(),
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      throw error;
    }
  }

  /**
   * Calculate order statistics
   * @param {Array} orders - Array of orders
   * @returns {Object} Statistics object
   */
  calculateOrderStats(orders) {
    const stats = {
      total: orders.length,
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    };
    
    orders.forEach((order) => {
      // Count by status
      if (order.status) {
        stats[order.status] = (stats[order.status] || 0) + 1;
      }
      
      // Sum revenue
      if (order.total) {
        stats.totalRevenue += order.total;
      }
    });
    
    // Calculate average
    stats.averageOrderValue = stats.total > 0 
      ? stats.totalRevenue / stats.total 
      : 0;
    
    return stats;
  }

  /**
   * Delete an order (admin only)
   * @param {string} orderId - Order ID
   * @returns {Promise<void>}
   */
  async deleteOrder(orderId) {
    try {
      await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  /**
   * Bulk update orders status
   * @param {Array<string>} orderIds - Array of order IDs
   * @param {string} newStatus - New status
   * @returns {Promise<void>}
   */
  async bulkUpdateStatus(orderIds, newStatus) {
    try {
      const batch = writeBatch(db);
      
      orderIds.forEach((orderId) => {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        batch.update(orderRef, {
          status: newStatus,
          updatedAt: Timestamp.now(),
          [`statusHistory.${newStatus}`]: Timestamp.now(),
        });
      });
      
      await batch.commit();
      console.log(`Bulk updated ${orderIds.length} orders to ${newStatus}`);
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      throw error;
    }
  }
}

export default new OrderService();