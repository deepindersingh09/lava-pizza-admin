import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';
import CustomerService from '../services/CustomerService';

export default function CustomerScreenDynamic() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = CustomerService.subscribeToCustomers((fetchedCustomers, error) => {
      setLoading(false);
      if (error) {
        Alert.alert('Error', 'Failed to load customers');
        console.error(error);
      } else {
        setCustomers(fetchedCustomers);
      }
    });

    return () => unsubscribe();
  }, []);

  const vipCount = customers.filter((c) => (c.totalSpent || 0) >= 500).length;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👥 Customers</Text>
          <Text style={styles.headerSubtitle}>Customer Management</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primaryOrange} />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      </View>
    );
  }

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
          <Text style={[styles.statNumber, { color: COLORS.brand.goldenYellow }]}>
            {vipCount}
          </Text>
          <Text style={styles.statLabel}>VIP</Text>
        </View>
      </View>

      <ScrollView style={styles.customersList}>
        {customers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateText}>No customers yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Customers will appear here once they place orders
            </Text>
          </View>
        ) : (
          customers.map((customer) => {
            const isVIP = (customer.totalSpent || 0) >= 500;
            return (
              <View key={customer.id} style={styles.customerCard}>
                <View style={styles.customerHeader}>
                  <View style={styles.customerLeft}>
                    <Text style={styles.customerName}>{customer.name || 'Unknown'}</Text>
                    <Text style={styles.customerContact}>{customer.phone || customer.email}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isVIP ? COLORS.brand.goldenYellow : COLORS.status.success,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {isVIP ? '⭐ VIP' : '👤 Regular'}
                    </Text>
                  </View>
                </View>

                <View style={styles.customerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{customer.totalOrders || 0}</Text>
                    <Text style={styles.statItemLabel}>Orders</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      ${(customer.totalSpent || 0).toFixed(2)}
                    </Text>
                    <Text style={styles.statItemLabel}>Spent</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    backgroundColor: COLORS.brand.primaryOrange,
    padding: SPACING.xl,
    paddingTop: SPACING.md,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.tertiary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.primaryOrange,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
  customersList: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  customerCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  customerLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  customerContact: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    height: 28,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#000000',
  },
  customerStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border.primary,
    paddingTop: SPACING.md,
    gap: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.goldenYellow,
    marginBottom: SPACING.xs,
  },
  statItemLabel: {
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
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.tertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});