import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';

const MOCK_ORDERS = [
  {
    id: '1001',
    customerName: 'Sarah Johnson',
    items: [
      { name: 'Pepperoni Pizza', quantity: 2, price: 18.99 },
      { name: 'Garlic Bread', quantity: 1, price: 6.99 },
    ],
    total: 44.97,
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60000),
    phone: '(403) 555-0123',
    address: '123 Main St, Calgary, AB',
    paymentMethod: 'Credit Card',
    notes: 'Extra cheese, please!',
  },
  {
    id: '1002',
    customerName: 'Mike Chen',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 16.99 },
      { name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { name: 'Coke', quantity: 2, price: 2.99 },
    ],
    total: 31.96,
    status: 'preparing',
    timestamp: new Date(Date.now() - 15 * 60000),
    phone: '(403) 555-0456',
    address: '456 Oak Ave, Calgary, AB',
    paymentMethod: 'Cash',
  },
  {
    id: '1003',
    customerName: 'Emily Rodriguez',
    items: [
      { name: 'BBQ Chicken Pizza', quantity: 1, price: 19.99 },
      { name: 'Wings', quantity: 1, price: 14.99 },
    ],
    total: 34.98,
    status: 'completed',
    timestamp: new Date(Date.now() - 45 * 60000),
    phone: '(403) 555-0789',
    address: '789 Pine Rd, Calgary, AB',
    paymentMethod: 'Debit Card',
  },
  {
    id: '1004',
    customerName: 'David Kim',
    items: [
      { name: 'Hawaiian Pizza', quantity: 3, price: 17.99 },
      { name: 'Mozzarella Sticks', quantity: 1, price: 7.99 },
    ],
    total: 61.96,
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60000),
    phone: '(403) 555-0234',
    address: '234 Elm St, Calgary, AB',
    paymentMethod: 'Credit Card',
  },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.status.pending;
      case 'preparing':
        return COLORS.status.preparing;
      case 'completed':
        return COLORS.status.completed;
      default:
        return COLORS.text.tertiary;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    Alert.alert('Success', `Order #${orderId} updated to ${newStatus}`);
  };

  const formatTime = (date) => {
    const minutes = Math.floor((Date.now() - date) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
        <Text style={styles.headerSubtitle}>Orders Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {orders.filter((o) => o.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.brand.lavaOrange }]}>
            {orders.filter((o) => o.status === 'preparing').length}
          </Text>
          <Text style={styles.statLabel}>Preparing</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.status.success }]}>
            {orders.filter((o) => o.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'preparing', 'completed'].map((filterType) => (
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.brand.lavaRed} />
        }
      >
        {filteredOrders.map((order) => (
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
                {order.items.length} item(s)
              </Text>
              <Text style={styles.orderTotalText}>${order.total.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {filter !== 'all' ? filter : ''} orders found
            </Text>
          </View>
        )}
      </ScrollView>

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
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Customer</Text>
                    <Text style={styles.detailText}>{selectedOrder.customerName}</Text>
                    <Text style={styles.detailSubtext}>📞 {selectedOrder.phone}</Text>
                    <Text style={styles.detailSubtext}>📍 {selectedOrder.address}</Text>
                    <Text style={styles.detailSubtext}>💳 {selectedOrder.paymentMethod}</Text>
                    {selectedOrder.notes && (
                      <View style={styles.notesBox}>
                        <Text style={styles.notesLabel}>Special Instructions:</Text>
                        <Text style={styles.notesText}>{selectedOrder.notes}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🛒 Items</Text>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>
                          {item.quantity}x {item.name}
                        </Text>
                        <Text style={styles.itemPrice}>
                          ${(item.quantity * item.price).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalAmount}>
                        ${selectedOrder.total.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔄 Update Status</Text>
                    <View style={styles.statusButtons}>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          selectedOrder.status === 'pending' &&
                            styles.statusButtonActive,
                        ]}
                        onPress={() =>
                          updateOrderStatus(selectedOrder.id, 'pending')
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            selectedOrder.status === 'pending' &&
                              styles.statusButtonTextActive,
                          ]}
                        >
                          ⏳ Pending
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          selectedOrder.status === 'preparing' &&
                            styles.statusButtonActive,
                        ]}
                        onPress={() =>
                          updateOrderStatus(selectedOrder.id, 'preparing')
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            selectedOrder.status === 'preparing' &&
                              styles.statusButtonTextActive,
                          ]}
                        >
                          👨‍🍳 Preparing
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.statusButton,
                          selectedOrder.status === 'completed' &&
                            styles.statusButtonActive,
                        ]}
                        onPress={() =>
                          updateOrderStatus(selectedOrder.id, 'completed')
                        }
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            selectedOrder.status === 'completed' &&
                              styles.statusButtonTextActive,
                          ]}
                        >
                          ✅ Completed
                        </Text>
                      </TouchableOpacity>
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
    backgroundColor: COLORS.brand.lavaRed,
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
    borderColor: COLORS.border.light,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.lavaYellow,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.secondary,
  },
  filterTabActive: {
    backgroundColor: COLORS.brand.lavaRed,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  filterTabTextActive: {
    color: COLORS.text.primary,
  },
  ordersList: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
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
    borderTopColor: COLORS.border.light,
  },
  orderItemsText: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
  },
  orderTotalText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.lavaYellow,
  },
  emptyState: {
    paddingVertical: SPACING.xxl * 2,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text.tertiary,
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
    borderBottomColor: COLORS.border.light,
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
    borderLeftColor: COLORS.brand.lavaOrange,
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
    borderTopColor: COLORS.border.light,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  totalAmount: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.lavaRed,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: COLORS.brand.lavaRed,
    borderColor: COLORS.brand.lavaRed,
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