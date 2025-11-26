import * as Notifications from 'expo-notifications';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Platform } from 'react-native';

const NOTIFICATIONS_COLLECTION = 'notifications';
const ALERTS_COLLECTION = 'alerts';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Notification Service - Handles push notifications and in-app alerts
 */
class NotificationService {
  constructor() {
    this.unsubscribeAlerts = null;
    this.expoPushToken = null;
  }

  /**
   * Initialize notification system
   * @returns {Promise<string>} Expo push token
   */
  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return null;
      }
      
      // Get push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      
      console.log('Expo Push Token:', token);
      
      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFD700',
        });
        
        await Notifications.setNotificationChannelAsync('orders', {
          name: 'Orders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF9933',
        });
        
        await Notifications.setNotificationChannelAsync('inventory', {
          name: 'Inventory',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#F44336',
        });
      }
      
      return token;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time alerts
   * @param {Function} callback - Called when new alerts arrive
   * @returns {Function} Unsubscribe function
   */
  subscribeToAlerts(callback) {
    try {
      const alertsQuery = query(
        collection(db, ALERTS_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      this.unsubscribeAlerts = onSnapshot(
        alertsQuery,
        (snapshot) => {
          const alerts = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            alerts.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date(),
            });
          });
          callback(alerts, null);
        },
        (error) => {
          console.error('Error subscribing to alerts:', error);
          callback([], error);
        }
      );
      
      return this.unsubscribeAlerts;
    } catch (error) {
      console.error('Error setting up alerts subscription:', error);
      callback([], error);
      return () => {};
    }
  }

  /**
   * Create a new alert
   * @param {Object} alertData - Alert data
   * @returns {Promise<string>} Alert ID
   */
  async createAlert(alertData) {
    try {
      const docRef = await addDoc(collection(db, ALERTS_COLLECTION), {
        ...alertData,
        timestamp: Timestamp.now(),
        read: false,
      });
      
      // Send push notification for critical alerts
      if (alertData.type === 'urgent' || alertData.type === 'critical') {
        await this.sendLocalNotification({
          title: alertData.title,
          body: alertData.message,
          data: { alertId: docRef.id, ...alertData },
        });
      }
      
      console.log('Alert created:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Send local push notification
   * @param {Object} notification - Notification content
   * @returns {Promise<string>} Notification ID
   */
  async sendLocalNotification(notification) {
    try {
      const { title, body, data } = notification;
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          channelId: data.type === 'order' ? 'orders' : data.type === 'inventory' ? 'inventory' : 'default',
        },
        trigger: null, // Send immediately
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  /**
   * Alert for new order
   * @param {Object} order - Order object
   * @returns {Promise<void>}
   */
  async alertNewOrder(order) {
    try {
      await this.createAlert({
        type: 'order',
        icon: '📦',
        title: 'New Order Received',
        message: `Order #${order.id} from ${order.customerName} - $${order.total.toFixed(2)}`,
        priority: 'high',
        orderId: order.id,
      });
    } catch (error) {
      console.error('Error creating new order alert:', error);
    }
  }

  /**
   * Alert for low stock
   * @param {Object} item - Inventory item
   * @returns {Promise<void>}
   */
  async alertLowStock(item) {
    try {
      const severity = item.stock <= item.reorderPoint * 0.3 ? 'urgent' : 'warning';
      
      await this.createAlert({
        type: severity,
        icon: severity === 'urgent' ? '🚨' : '⚠️',
        title: `${severity === 'urgent' ? 'Critical' : 'Low'} Stock Alert`,
        message: `${item.name} is ${severity === 'urgent' ? 'critically' : ''} low (${item.stock} items). ${severity === 'urgent' ? 'Reorder immediately!' : 'Consider restocking.'}`,
        priority: severity,
        itemId: item.id,
      });
    } catch (error) {
      console.error('Error creating low stock alert:', error);
    }
  }

  /**
   * Alert for out of stock
   * @param {Object} item - Inventory item
   * @returns {Promise<void>}
   */
  async alertOutOfStock(item) {
    try {
      await this.createAlert({
        type: 'urgent',
        icon: '❌',
        title: 'Out of Stock',
        message: `${item.name} is out of stock! Item unavailable for orders.`,
        priority: 'critical',
        itemId: item.id,
      });
    } catch (error) {
      console.error('Error creating out of stock alert:', error);
    }
  }

  /**
   * Alert for order status change
   * @param {Object} order - Order object
   * @param {string} oldStatus - Previous status
   * @param {string} newStatus - New status
   * @returns {Promise<void>}
   */
  async alertOrderStatusChange(order, oldStatus, newStatus) {
    try {
      const statusEmojis = {
        pending: '⏳',
        preparing: '👨‍🍳',
        ready: '✅',
        completed: '🎉',
        cancelled: '❌',
      };
      
      await this.createAlert({
        type: 'info',
        icon: statusEmojis[newStatus] || '📋',
        title: 'Order Status Updated',
        message: `Order #${order.id} changed from ${oldStatus} to ${newStatus}`,
        priority: 'normal',
        orderId: order.id,
      });
    } catch (error) {
      console.error('Error creating order status alert:', error);
    }
  }

  /**
   * Alert for daily revenue milestone
   * @param {number} revenue - Daily revenue
   * @param {number} target - Revenue target
   * @returns {Promise<void>}
   */
  async alertRevenueMilestone(revenue, target) {
    try {
      await this.createAlert({
        type: 'success',
        icon: '💰',
        title: 'Revenue Target Achieved!',
        message: `Congratulations! Daily revenue of $${revenue.toFixed(2)} has exceeded target of $${target.toFixed(2)}`,
        priority: 'normal',
      });
    } catch (error) {
      console.error('Error creating revenue milestone alert:', error);
    }
  }

  /**
   * Mark alert as read
   * @param {string} alertId - Alert ID
   * @returns {Promise<void>}
   */
  async markAsRead(alertId) {
    try {
      await updateDoc(doc(db, ALERTS_COLLECTION, alertId), {
        read: true,
        readAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  }

  /**
   * Mark all alerts as read
   * @returns {Promise<void>}
   */
  async markAllAsRead() {
    try {
      const alertsQuery = query(
        collection(db, ALERTS_COLLECTION),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(alertsQuery);
      
      const updatePromises = [];
      snapshot.forEach((doc) => {
        updatePromises.push(
          updateDoc(doc.ref, {
            read: true,
            readAt: Timestamp.now(),
          })
        );
      });
      
      await Promise.all(updatePromises);
      console.log(`Marked ${updatePromises.length} alerts as read`);
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
      throw error;
    }
  }

  /**
   * Schedule daily reports notification
   * @param {number} hour - Hour to send (0-23)
   * @returns {Promise<void>}
   */
  async scheduleDailyReport(hour = 9) {
    try {
      // Cancel existing daily report notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Schedule for tomorrow at specified hour
      const trigger = new Date();
      trigger.setDate(trigger.getDate() + 1);
      trigger.setHours(hour, 0, 0, 0);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Daily Report Ready',
          body: 'Your daily business report is ready to view',
          data: { type: 'daily_report' },
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        },
      });
      
      console.log(`Daily report scheduled for ${hour}:00`);
    } catch (error) {
      console.error('Error scheduling daily report:', error);
      throw error;
    }
  }

  /**
   * Request notification permissions
   * @returns {Promise<boolean>} True if granted
   */
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Get notification permissions status
   * @returns {Promise<string>} Permission status
   */
  async getPermissionsStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting notification permissions:', error);
      return 'undetermined';
    }
  }

  /**
   * Add notification received listener
   * @param {Function} callback - Called when notification is received
   * @returns {Object} Subscription object
   */
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add notification response listener
   * @param {Function} callback - Called when user taps notification
   * @returns {Object} Subscription object
   */
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Clean up subscriptions
   */
  cleanup() {
    if (this.unsubscribeAlerts) {
      this.unsubscribeAlerts();
      this.unsubscribeAlerts = null;
    }
  }

  /**
   * Get Expo push token
   * @returns {string|null} Push token
   */
  getPushToken() {
    return this.expoPushToken;
  }
}

export default new NotificationService();
