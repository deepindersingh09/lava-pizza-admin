import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';
import OrderService from '../services/OrderService';
import NotificationService from '../services/NotificationService';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  // Subscribe to real-time orders
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = OrderService.subscribeToOrders(
      (fetchedOrders, error) => {
        setLoading(false);
        if (error) {
          setError(error.message);
          Alert.alert('Error', 'Failed to load orders: ' + error.message);
        } else {
          setOrders(fetchedOrders);
          setError(null);
        }
      },
      { limit: 100 }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.status.pending;
      case 'preparing':
        return COLORS.status.preparing;
      case 'ready':
        return COLORS.status.warning;
      case 'completed':
        return COLORS.status.completed;
      case 'cancelled':
        return COLORS.status.danger;
      default:
        return COLORS.text.tertiary;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const oldStatus = orders.find((o) => o.id === orderId)?.status;
      
      await OrderService.updateOrderStatus(orderId, newStatus);
      
      // Send notification about status change
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        await NotificationService.alertOrderStatusChange(order, oldStatus, newStatus);
      }
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      Alert.alert('Success', `Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order: ' + error.message);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const orderDate = date instanceof Date ? date : new Date(date);
    const minutes = Math.floor((now - orderDate) / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedOrders = await OrderService.getAllOrders({ limit: 100 });
      setOrders(fetchedOrders);
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.status === filter);

  // Calculate stats
  const stats = {
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
          <Text style={styles.headerSubtitle}>Orders Dashboard</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primaryOrange} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
        <Text style={styles.headerSubtitle}>Orders Dashboard</Text>
        {orders.length > 0 && (
          <Text style={styles.headerCount}>{orders.length} total orders</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.brand.primaryOrange }]}>
            {stats.preparing}
          </Text>
          <Text style={styles.statLabel}>Preparing</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.status.warning }]}>
            {stats.ready}
          </Text>
          <Text style={styles.statLabel}>Ready</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.status.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'preparing', 'ready', 'completed'].map((filterType) => (
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

      <ScrollView
        style={styles.ordersList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.brand.primaryOrange}
          />
        }
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📦</Text>
            <Text style={styles.emptyStateText}>
              No {filter !== 'all' ? filter : ''} orders found
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Orders will appear here when customers place them
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => setSelectedOrder(order)}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderLeft}>
                  <Text style={styles.orderCustomer}>{order.customerName}</Text>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                </View>
                <View style={styles.orderRight}>
                  <Text style={styles.orderTime}>{formatTime(order.timestamp)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderItemsText}>
                  {order.items?.length || 0} item(s)
                </Text>
                <Text style={styles.orderTotalText}>
                  ${(order.total || 0).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Order Details Modal */}
      <Modal
        visible={selectedOrder !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
                    <Text style={styles.modalSubtitle}>
                      {formatTime(selectedOrder.timestamp)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                    <Text style={styles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {/* Customer Info */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Customer</Text>
                    <Text style={styles.detailText}>{selectedOrder.customerName}</Text>
                    {selectedOrder.phone && (
                      <Text style={styles.detailSubtext}>📞 {selectedOrder.phone}</Text>
                    )}
                    {selectedOrder.address && (
                      <Text style={styles.detailSubtext}>📍 {selectedOrder.address}</Text>
                    )}
                    {selectedOrder.paymentMethod && (
                      <Text style={styles.detailSubtext}>
                        💳 {selectedOrder.paymentMethod}
                      </Text>
                    )}
                    {selectedOrder.notes && (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesLabel}>Special Instructions:</Text>
                        <Text style={styles.notesText}>{selectedOrder.notes}</Text>
                      </View>
                    )}
                  </View>

                  {/* Items */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🛒 Items</Text>
                    {selectedOrder.items?.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                          {item.quantity}x {item.name}
                        </Text>
                        <Text style={styles.itemPrice}>
                          ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalAmount}>
                        ${(selectedOrder.total || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Status Update */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔄 Update Status</Text>
                    <View style={styles.statusButtons}>
                      {['pending', 'preparing', 'ready', 'completed'].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusButton,
                            selectedOrder.status === status && styles.statusButtonActive,
                          ]}
                          onPress={() => updateOrderStatus(selectedOrder.id, status)}
                        >
                          <Text
                            style={[
                              styles.statusButtonText,
                              selectedOrder.status === status &&
                                styles.statusButtonTextActive,
                            ]}
                          >
                            {getStatusText(status)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  headerCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
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
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.goldenYellow,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.secondary,
  },
  filterTabActive: {
    backgroundColor: COLORS.brand.primaryOrange,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  filterTabTextActive: {
    color: COLORS.text.primary,
  },
  ordersList: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  orderCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderLeft: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  orderId: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderTime: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
  },
  statusText: {
    color: '#000000',
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.primary,
  },
  orderItemsText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
  },
  orderTotalText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.goldenYellow,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.modal,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.primary,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
  modalClose: {
    fontSize: 28,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  modalBody: {
    padding: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.brand.goldenYellow,
    marginBottom: SPACING.md,
  },
  detailText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  detailSubtext: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  notesBox: {
    backgroundColor: COLORS.background.tertiary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand.secondaryOrange,
  },
  notesLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  itemName: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.primary,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  totalAmount: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.primaryOrange,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: COLORS.brand.primaryOrange,
    borderColor: COLORS.brand.primaryOrange,
  },
  statusButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  statusButtonTextActive: {
    color: COLORS.text.primary,
  },
});
