import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const MOCK_ALERTS = [
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
    message: 'Order #1003 delivered successfully',
    time: '15 min ago',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    icon: '⚠️',
    title: 'Low Stock Warning',
    message: '5 items are running low. Check inventory.',
    time: '1 hour ago',
    read: true,
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  
  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAsRead = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🔔 Alerts</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount} unread notifications
          </Text>
        </View>
      </View>

      <ScrollView style={styles.alertsList}>
        {alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={[
              styles.alertCard,
              !alert.read && styles.alertCardUnread,
            ]}
            onPress={() => markAsRead(alert.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.alertIcon}>{alert.icon}</Text>
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                {!alert.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
  },
  header: {
    backgroundColor: '#FF9933',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  alertsList: {
    flex: 1,
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  alertCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFF9F0',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFF4E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 18,
  },
  alertTime: {
    fontSize: 10,
    color: '#999999',
  },
});