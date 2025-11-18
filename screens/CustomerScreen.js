import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phone: '(403) 555-0123',
    totalOrders: 45,
    totalSpent: 1234.56,
    status: 'vip',
  },
  {
    id: '2',
    name: 'Mike Chen',
    phone: '(403) 555-0456',
    totalOrders: 32,
    totalSpent: 890.45,
    status: 'regular',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    phone: '(403) 555-0789',
    totalOrders: 67,
    totalSpent: 2145.78,
    status: 'vip',
  },
];

export default function CustomersScreen() {
  const [customers] = useState(MOCK_CUSTOMERS);

  const vipCount = customers.filter((c) => c.status === 'vip').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 Customers</Text>
        <Text style={styles.headerSubtitle}>Customer Management</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{customers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#FFD700' }]}>
            {vipCount}
          </Text>
          <Text style={styles.statLabel}>VIP</Text>
        </View>
      </View>

      <ScrollView style={styles.customersList}>
        {customers.map((customer) => (
          <View key={customer.id} style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <View style={styles.customerLeft}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerContact}>{customer.phone}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      customer.status === 'vip' ? '#FFD700' : '#4CAF50',
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {customer.status === 'vip' ? '⭐ VIP' : '👤 Regular'}
                </Text>
              </View>
            </View>

            <View style={styles.customerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{customer.totalOrders}</Text>
                <Text style={styles.statItemLabel}>Orders</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  ${customer.totalSpent.toFixed(2)}
                </Text>
                <Text style={styles.statItemLabel}>Spent</Text>
              </View>
            </View>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9933',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  customersList: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  customerLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 12,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    height: 28,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  customerStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statItemLabel: {
    fontSize: 10,
    color: '#999999',
  },
});