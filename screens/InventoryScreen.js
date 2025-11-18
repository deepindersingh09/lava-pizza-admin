import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

const MOCK_INVENTORY = [
  { id: '1', name: 'Pepperoni Pizza', stock: 15, category: 'Pizza', price: 18.99 },
  { id: '2', name: 'Margherita Pizza', stock: 8, category: 'Pizza', price: 16.99 },
  { id: '3', name: 'BBQ Chicken Pizza', stock: 12, category: 'Pizza', price: 19.99 },
  { id: '4', name: 'Hawaiian Pizza', stock: 10, category: 'Pizza', price: 17.99 },
  { id: '5', name: 'Garlic Bread', stock: 25, category: 'Sides', price: 6.99 },
  { id: '6', name: 'Caesar Salad', stock: 18, category: 'Salads', price: 8.99 },
  { id: '7', name: 'Wings', stock: 30, category: 'Sides', price: 14.99 },
  { id: '8', name: 'Mozzarella Sticks', stock: 22, category: 'Sides', price: 7.99 },
  { id: '9', name: 'Coke', stock: 50, category: 'Drinks', price: 2.99 },
  { id: '10', name: 'Sprite', stock: 45, category: 'Drinks', price: 2.99 },
];

export default function InventoryScreen() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStock, setNewStock] = useState('');

  const getStockColor = (stock) => {
    if (stock <= 5) return '#E62323';
    if (stock <= 10) return '#FBBF24';
    return '#22C55E';
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return 'Low Stock';
    if (stock <= 10) return 'Medium';
    return 'In Stock';
  };

  const updateStock = () => {
    if (!newStock || !selectedItem) return;

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) return;

    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id ? { ...item, stock: stockValue } : item
      )
    );

    setSelectedItem(null);
    setNewStock('');
  };

  const categories = [...new Set(inventory.map((item) => item.category))];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza Admin</Text>
        <Text style={styles.headerSubtitle}>Inventory Management</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{inventory.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#E62323' }]}>
            {inventory.filter((i) => i.stock <= 5).length}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#22C55E' }]}>
            {inventory.filter((i) => i.stock > 10).length}
          </Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
      </View>

      {/* Inventory List */}
      <ScrollView style={styles.inventoryList}>
        {categories.map((category) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {inventory
              .filter((item) => item.category === category)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => {
                    setSelectedItem(item);
                    setNewStock(item.stock.toString());
                  }}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.stockCount}>{item.stock}</Text>
                    <View
                      style={[
                        styles.stockBadge,
                        { backgroundColor: getStockColor(item.stock) },
                      ]}
                    >
                      <Text style={styles.stockBadgeText}>
                        {getStockStatus(item.stock)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* Update Stock Modal */}
      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Stock</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <Text style={styles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.itemNameModal}>{selectedItem.name}</Text>
                  <Text style={styles.currentStock}>
                    Current Stock: {selectedItem.stock}
                  </Text>

                  <Text style={styles.inputLabel}>New Stock Level</Text>
                  <TextInput
                    style={styles.input}
                    value={newStock}
                    onChangeText={setNewStock}
                    keyboardType="number-pad"
                    placeholder="Enter new stock level"
                    placeholderTextColor="#9CA3AF"
                  />

                  <TouchableOpacity style={styles.updateButton} onPress={updateStock}>
                    <Text style={styles.updateButtonText}>Update Stock</Text>
                  </TouchableOpacity>
                </View>
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
  inventoryList: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFC800',
    marginTop: 16,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemPrice: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  stockCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
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
    paddingBottom: 40,
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
  itemNameModal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  currentStock: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC800',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#FF5C2B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});