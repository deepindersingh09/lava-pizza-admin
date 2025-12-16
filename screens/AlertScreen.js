import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../firebase/config';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);

  /* 🔥 REAL-TIME ALERTS */
  useEffect(() => {
    const q = query(
      collection(db, 'alerts'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAlerts(data);
    });

    return () => unsub();
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  /* ✅ MARK ALERT AS READ */
  const markAsRead = async (alertId) => {
    try {
      await updateDoc(doc(db, 'alerts', alertId), {
        read: true,
      });
    } catch (err) {
      console.log('Failed to mark as read');
    }
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
        {alerts.map(alert => (
          <TouchableOpacity
            key={alert.id}
            style={[
              styles.alertCard,
              !alert.read && styles.alertCardUnread,
            ]}
            onPress={() => markAsRead(alert.id)}
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
              <Text style={styles.alertTime}>
                {alert.createdAt?.toDate?.().toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {alerts.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            No alerts yet
          </Text>
        )}
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