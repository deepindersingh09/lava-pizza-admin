import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import OrderService from './OrderService';
import CustomerService from './CustomerService';
import InventoryService from './InventoryService';

/**
 * Analytics Service - Comprehensive business analytics and reporting
 */
class AnalyticsService {
  /**
   * Get dashboard summary stats
   * @param {Date} startDate - Start date (default: today)
   * @param {Date} endDate - End date (default: now)
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(startDate = null, endDate = null) {
    try {
      // Default to today
      if (!startDate) {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      }
      if (!endDate) {
        endDate = new Date();
      }
      
      // Fetch data in parallel
      const [orders, customers, inventory] = await Promise.all([
        OrderService.getOrdersByDateRange(startDate, endDate),
        CustomerService.getAllCustomers(),
        InventoryService.getAllInventory(),
      ]);
      
      // Calculate order stats
      const orderStats = this.calculateOrderMetrics(orders);
      
      // Calculate customer stats
      const customerStats = this.calculateCustomerMetrics(customers);
      
      // Calculate inventory stats
      const inventoryStats = this.calculateInventoryMetrics(inventory);
      
      return {
        orders: orderStats,
        customers: customerStats,
        inventory: inventoryStats,
        period: {
          startDate,
          endDate,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Calculate order metrics
   * @param {Array} orders - Array of orders
   * @returns {Object} Order metrics
   */
  calculateOrderMetrics(orders) {
    const metrics = {
      total: orders.length,
      pending: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      itemsSold: 0,
      averageItemsPerOrder: 0,
      peakHour: null,
      topItems: [],
    };
    
    const hourCounts = new Array(24).fill(0);
    const itemSales = new Map();
    
    orders.forEach((order) => {
      // Count by status
      if (order.status) {
        metrics[order.status] = (metrics[order.status] || 0) + 1;
      }
      
      // Sum revenue (only completed orders)
      if (order.status === 'completed' && order.total) {
        metrics.totalRevenue += order.total;
      }
      
      // Track items
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          metrics.itemsSold += item.quantity || 0;
          
          // Track top items
          const currentCount = itemSales.get(item.name) || 0;
          itemSales.set(item.name, currentCount + item.quantity);
        });
      }
      
      // Track peak hours
      if (order.timestamp) {
        const hour = order.timestamp.getHours();
        hourCounts[hour]++;
      }
    });
    
    // Calculate averages
    const completedOrders = metrics.completed;
    if (completedOrders > 0) {
      metrics.averageOrderValue = metrics.totalRevenue / completedOrders;
    }
    if (metrics.total > 0) {
      metrics.averageItemsPerOrder = metrics.itemsSold / metrics.total;
    }
    
    // Find peak hour
    const maxHourOrders = Math.max(...hourCounts);
    metrics.peakHour = hourCounts.indexOf(maxHourOrders);
    
    // Get top 5 items
    metrics.topItems = Array.from(itemSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    return metrics;
  }

  /**
   * Calculate customer metrics
   * @param {Array} customers - Array of customers
   * @returns {Object} Customer metrics
   */
  calculateCustomerMetrics(customers) {
    return CustomerService.calculateCustomerStats(customers);
  }

  /**
   * Calculate inventory metrics
   * @param {Array} inventory - Array of inventory items
   * @returns {Object} Inventory metrics
   */
  calculateInventoryMetrics(inventory) {
    const metrics = {
      totalItems: inventory.length,
      inStock: 0,
      lowStock: 0,
      criticalStock: 0,
      outOfStock: 0,
      totalValue: 0,
      categories: {},
    };
    
    inventory.forEach((item) => {
      const stock = item.stock || 0;
      const reorderPoint = item.reorderPoint || 10;
      const price = item.price || 0;
      
      // Calculate stock status
      if (stock <= 0) {
        metrics.outOfStock++;
      } else if (stock <= reorderPoint * 0.3) {
        metrics.criticalStock++;
      } else if (stock <= reorderPoint * 0.7) {
        metrics.lowStock++;
      } else {
        metrics.inStock++;
      }
      
      // Calculate inventory value
      metrics.totalValue += stock * price;
      
      // Count by category
      const category = item.category || 'Uncategorized';
      metrics.categories[category] = (metrics.categories[category] || 0) + 1;
    });
    
    return metrics;
  }

  /**
   * Get revenue analytics for time period
   * @param {string} period - 'day', 'week', 'month', 'year'
   * @param {Date} endDate - End date (default: now)
   * @returns {Promise<Object>} Revenue analytics
   */
  async getRevenueAnalytics(period = 'week', endDate = new Date()) {
    try {
      const startDate = this.getStartDate(period, endDate);
      const orders = await OrderService.getOrdersByDateRange(startDate, endDate);
      
      // Filter completed orders only
      const completedOrders = orders.filter((o) => o.status === 'completed');
      
      // Group by date
      const revenueByDate = new Map();
      const ordersByDate = new Map();
      
      completedOrders.forEach((order) => {
        const dateKey = order.timestamp.toISOString().split('T')[0];
        
        revenueByDate.set(
          dateKey,
          (revenueByDate.get(dateKey) || 0) + order.total
        );
        
        ordersByDate.set(
          dateKey,
          (ordersByDate.get(dateKey) || 0) + 1
        );
      });
      
      // Convert to array format for charts
      const chartData = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        chartData.push({
          date: dateKey,
          revenue: revenueByDate.get(dateKey) || 0,
          orders: ordersByDate.get(dateKey) || 0,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Calculate totals and growth
      const totalRevenue = completedOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );
      const totalOrders = completedOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Get previous period for comparison
      const prevEndDate = new Date(startDate);
      prevEndDate.setSeconds(prevEndDate.getSeconds() - 1);
      const prevStartDate = this.getStartDate(period, prevEndDate);
      const prevOrders = await OrderService.getOrdersByDateRange(
        prevStartDate,
        prevEndDate
      );
      const prevCompletedOrders = prevOrders.filter((o) => o.status === 'completed');
      const prevRevenue = prevCompletedOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );
      
      const revenueGrowth = prevRevenue > 0
        ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
        : 0;
      
      return {
        period,
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth,
        chartData,
        previousPeriod: {
          revenue: prevRevenue,
          orders: prevCompletedOrders.length,
        },
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  /**
   * Get popular items analytics
   * @param {number} limit - Number of top items to return
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Array>} Popular items with sales data
   */
  async getPopularItems(limit = 10, startDate = null, endDate = null) {
    try {
      let orders;
      
      if (startDate && endDate) {
        orders = await OrderService.getOrdersByDateRange(startDate, endDate);
      } else {
        orders = await OrderService.getAllOrders();
      }
      
      // Only count completed orders
      const completedOrders = orders.filter((o) => o.status === 'completed');
      
      const itemSales = new Map();
      const itemRevenue = new Map();
      
      completedOrders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const name = item.name;
            const quantity = item.quantity || 0;
            const revenue = quantity * (item.price || 0);
            
            itemSales.set(name, (itemSales.get(name) || 0) + quantity);
            itemRevenue.set(name, (itemRevenue.get(name) || 0) + revenue);
          });
        }
      });
      
      // Convert to array and sort by quantity
      const popularItems = Array.from(itemSales.entries())
        .map(([name, quantity]) => ({
          name,
          quantity,
          revenue: itemRevenue.get(name) || 0,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit);
      
      return popularItems;
    } catch (error) {
      console.error('Error fetching popular items:', error);
      throw error;
    }
  }

  /**
   * Get hourly order distribution
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Array>} Hourly order counts
   */
  async getHourlyDistribution(startDate = null, endDate = null) {
    try {
      let orders;
      
      if (startDate && endDate) {
        orders = await OrderService.getOrdersByDateRange(startDate, endDate);
      } else {
        // Default to last 7 days
        endDate = new Date();
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        orders = await OrderService.getOrdersByDateRange(startDate, endDate);
      }
      
      const hourCounts = new Array(24).fill(0);
      const hourRevenue = new Array(24).fill(0);
      
      orders.forEach((order) => {
        if (order.timestamp) {
          const hour = order.timestamp.getHours();
          hourCounts[hour]++;
          
          if (order.status === 'completed' && order.total) {
            hourRevenue[hour] += order.total;
          }
        }
      });
      
      return hourCounts.map((count, hour) => ({
        hour,
        orders: count,
        revenue: hourRevenue[hour],
        label: `${hour}:00 - ${hour}:59`,
      }));
    } catch (error) {
      console.error('Error fetching hourly distribution:', error);
      throw error;
    }
  }

  /**
   * Get customer retention analytics
   * @returns {Promise<Object>} Retention metrics
   */
  async getCustomerRetention() {
    try {
      const customers = await CustomerService.getAllCustomers();
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const metrics = {
        totalCustomers: customers.length,
        repeatCustomers: 0,
        newCustomers: 0,
        activeCustomers: 0,
        churned: 0,
        retentionRate: 0,
        averageOrderFrequency: 0,
      };
      
      let totalOrders = 0;
      
      customers.forEach((customer) => {
        const orders = customer.totalOrders || 0;
        totalOrders += orders;
        
        if (orders > 1) {
          metrics.repeatCustomers++;
        }
        
        const createdAt = customer.createdAt || new Date(0);
        if (createdAt >= thirtyDaysAgo) {
          metrics.newCustomers++;
        }
        
        const lastOrderAt = customer.lastOrderAt || new Date(0);
        if (lastOrderAt >= thirtyDaysAgo) {
          metrics.activeCustomers++;
        } else if (orders > 0) {
          metrics.churned++;
        }
      });
      
      // Calculate retention rate
      const nonNewCustomers = metrics.totalCustomers - metrics.newCustomers;
      if (nonNewCustomers > 0) {
        metrics.retentionRate = 
          (metrics.activeCustomers / nonNewCustomers) * 100;
      }
      
      // Calculate average order frequency
      if (metrics.totalCustomers > 0) {
        metrics.averageOrderFrequency = totalOrders / metrics.totalCustomers;
      }
      
      return metrics;
    } catch (error) {
      console.error('Error fetching customer retention:', error);
      throw error;
    }
  }

  /**
   * Helper: Get start date based on period
   * @param {string} period - Time period
   * @param {Date} endDate - End date
   * @returns {Date} Start date
   */
  getStartDate(period, endDate) {
    const startDate = new Date(endDate);
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    return startDate;
  }

  /**
   * Generate comprehensive report
   * @param {string} period - 'day', 'week', 'month', 'year'
   * @returns {Promise<Object>} Complete analytics report
   */
  async generateReport(period = 'week') {
    try {
      const endDate = new Date();
      const startDate = this.getStartDate(period, endDate);
      
      const [
        dashboardStats,
        revenueAnalytics,
        popularItems,
        hourlyDistribution,
        customerRetention,
      ] = await Promise.all([
        this.getDashboardStats(startDate, endDate),
        this.getRevenueAnalytics(period, endDate),
        this.getPopularItems(10, startDate, endDate),
        this.getHourlyDistribution(startDate, endDate),
        this.getCustomerRetention(),
      ]);
      
      return {
        period,
        generatedAt: new Date(),
        dateRange: {
          start: startDate,
          end: endDate,
        },
        dashboard: dashboardStats,
        revenue: revenueAnalytics,
        popularItems,
        hourlyDistribution,
        customerRetention,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
