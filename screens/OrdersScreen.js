import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

// Mock data
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
  },
  {
    id: '1003',
    customerName: 'Emily Rodriguez',
    items: [
      { name: 'BBQ Chicken Pizza', quantity: 1, price: 19.99 },
      { name: 'Wings', quantity: 12, price: 14.99 },
    ],
    total: 34.98,
    status: 'completed',
    timestamp: new Date(Date.now() - 45 * 60000),
    phone: '(403) 555-0789',
    address: '789 Pine Rd, Calgary, AB',
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
  },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FBBF24'; // Amber
      case 'preparing':
        return '#FF5C2B'; // Pizza Orange
      case 'completed':
        return '#22C55E'; // Green
      default:
        return '#9CA3AF';
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
  };

  const formatTime = (date) => {
    const minutes = Math.floor((Date.now() - date) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza Admin</Text>
        <Text style={styles.headerSubtitle}>Orders Dashboard</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {orders.filter((o) => o.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {orders.filter((o) => o.status === 'preparing').length}
          </Text>
          <Text style={styles.statLabel}>Preparing</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {orders.filter((o) => o.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.ordersList}>
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => setSelectedOrder(order)}
          >
            <View style={styles.orderHeader}>
              <View>
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
            <View style={styles.orderItems}>
              <Text style={styles.orderItemsText}>
                {order.items.length} item(s) • ${order.total.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
                  <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
                  <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                    <Text style={styles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  {/* Customer Info */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer</Text>
                    <Text style={styles.detailText}>{selectedOrder.customerName}</Text>
                    <Text style={styles.detailSubtext}>{selectedOrder.phone}</Text>
                    <Text style={styles.detailSubtext}>{selectedOrder.address}</Text>
                  </View>

                  {/* Items */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items</Text>
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

                  {/* Status Update */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Update Status</Text>
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
                          Pending
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
                          Preparing
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
                          Completed
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
    backgroundColor: '#050814',
  },
  header: {
    backgroundColor: '#1A3164',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC800',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  ordersList: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  orderCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
  orderItems: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  orderItemsText: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0B1020',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalClose: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  modalBody: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC800',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  detailSubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  itemPrice: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5C2B',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#FF5C2B',
    borderColor: '#FF5C2B',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
});