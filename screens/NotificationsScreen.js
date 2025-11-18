import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'urgent',
    icon: '🚨',
    title: 'Critical Stock Alert',
    message: 'Pepsi is critically low (3 items). Reorder immediately!',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'order',
    icon: '📦',
    title: 'New Order Received',
    message: 'Order #1005 from Michael Smith - $45.99',
    time: '5 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    icon: '✅',
    title: 'Order Completed',
    message: 'Order #1003 delivered successfully to Emily Rodriguez',
    time: '15 min ago',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    icon: '⚠️',
    title: 'Low Stock Warning',
    message: '5 items are running low. Check inventory now.',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    icon: 'ℹ️',
    title: 'Peak Hour Alert',
    message: 'Dinner rush starting soon (6-8 PM). Prepare kitchen.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'revenue',
    icon: '💰',
    title: 'Daily Revenue Target Met',
    message: 'Congratulations! You\'ve reached $1,200 today.',
    time: '3 hours ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent':
        return COLORS.status.danger;
      case 'warning':
        return COLORS.brand.amber;
      case 'success':
        return COLORS.status.success;
      case 'order':
        return COLORS.brand.primaryOrange;
      case 'revenue':
        return COLORS.brand.goldenYellow;
      default:
        return COLORS.status.info;
    }
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🔔 Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount} unread notifications
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {['all', 'unread', 'urgent', 'order', 'warning'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterTab,
              filter === filterType && styles.filterTabActive,
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === filterType && styles.filterTabTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.notificationCardUnread,
            ]}
            onPress={() => markAsRead(notification.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getNotificationColor(notification.type) + '20' },
              ]}
            >
              <Text style={styles.notificationIcon}>{notification.icon}</Text>
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={styles.emptyStateText}>No notifications found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    backgroundColor: COLORS.brand.primaryOrange,
    padding: SPACING.xl,
    paddingTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  markAllButton: {
    backgroundColor: COLORS.brand.goldenYellow,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  markAllButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  filterTabActive: {
    backgroundColor: COLORS.brand.primaryOrange,
    borderColor: COLORS.brand.primaryOrange,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  filterTabTextActive: {
    color: COLORS.text.primary,
  },
  notificationsList: {
    flex: 1,
    padding: SPACING.lg,
  },
  notificationCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brand.goldenYellow,
    backgroundColor: COLORS.background.accent,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  notificationTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brand.goldenYellow,
    marginLeft: SPACING.sm,
  },
  notificationMessage: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
  },
  emptyState: {
    paddingVertical: SPACING.xxl * 3,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text.tertiary,
  },
});