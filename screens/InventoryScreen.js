import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';
import InventoryService from '../services/InventoryService';
import NotificationService from '../services/NotificationService';

export default function InventoryScreenDynamic() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to real-time inventory updates
  useEffect(() => {
    const unsubscribe = InventoryService.subscribeToInventory((items, error) => {
      setLoading(false);
      if (error) {
        Alert.alert('Error', 'Failed to load inventory');
        console.error(error);
      } else {
        setInventory(items);
        
        // Check for low stock and send alerts
        items.forEach(item => {
          if (item.stock <= 0) {
            NotificationService.alertOutOfStock(item);
          } else if (item.stock <= item.reorderPoint * 0.3) {
            NotificationService.alertLowStock(item);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getStockColor = (stock, reorderPoint) => {
    if (stock <= reorderPoint * 0.3) return COLORS.inventory.outOfStock;
    if (stock <= reorderPoint * 0.7) return COLORS.inventory.lowStock;
    return COLORS.inventory.inStock;
  };

  const getStockStatus = (stock, reorderPoint) => {
    if (stock <= reorderPoint * 0.3) return 'Critical';
    if (stock <= reorderPoint * 0.7) return 'Low';
    return 'Good';
  };

  const updateStock = async () => {
    if (!newStock || !selectedItem) return;

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
      Alert.alert('Error', 'Please enter a valid stock number');
      return;
    }

    try {
      await InventoryService.updateStock(selectedItem.id, stockValue, 'manual_adjustment');
      Alert.alert('Success', `Updated stock for ${selectedItem.name}`);
      setSelectedItem(null);
      setNewStock('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update stock: ' + error.message);
    }
  };

  const categories = [...new Set(inventory.map((item) => item.category))];

  const filteredInventory = searchQuery
    ? inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : inventory;

  const criticalItems = inventory.filter(
    (item) => item.stock <= item.reorderPoint * 0.3
  ).length;

  const lowStockItems = inventory.filter(
    (item) =>
      item.stock > item.reorderPoint * 0.3 && item.stock <= item.reorderPoint * 0.7
  ).length;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
          <Text style={styles.headerSubtitle}>Inventory Management</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primaryOrange} />
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
        <Text style={styles.headerSubtitle}>Inventory Management</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{inventory.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.inventory.outOfStock }]}>
            {criticalItems}
          </Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.inventory.lowStock }]}>
            {lowStockItems}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor={COLORS.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.inventoryList}>
        {categories.map((category) => {
          const categoryItems = filteredInventory.filter(
            (item) => item.category === category
          );
          if (categoryItems.length === 0) return null;

          return (
            <View key={category}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {categoryItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => {
                    setSelectedItem(item);
                    setNewStock(item.stock.toString());
                  }}
                  activeOpacity={0.7}
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
                        { backgroundColor: getStockColor(item.stock, item.reorderPoint) },
                      ]}
                    >
                      <Text style={styles.stockBadgeText}>
                        {getStockStatus(item.stock, item.reorderPoint)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
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
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Current Stock</Text>
                      <Text style={styles.infoValue}>{selectedItem.stock}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Reorder Point</Text>
                      <Text style={styles.infoValue}>{selectedItem.reorderPoint}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Price</Text>
                      <Text style={styles.infoValue}>${selectedItem.price.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor: getStockColor(
                          selectedItem.stock,
                          selectedItem.reorderPoint
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.statusIndicatorText}>
                      Status: {getStockStatus(selectedItem.stock, selectedItem.reorderPoint)}
                    </Text>
                  </View>

                  <Text style={styles.inputLabel}>New Stock Level</Text>
                  <TextInput
                    style={styles.input}
                    value={newStock}
                    onChangeText={setNewStock}
                    keyboardType="number-pad"
                    placeholder="Enter new stock level"
                    placeholderTextColor={COLORS.text.tertiary}
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setSelectedItem(null)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.updateButton} onPress={updateStock}>
                      <Text style={styles.updateButtonText}>Update Stock</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain the same as your original InventoryScreen
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
    color: COLORS.brand.goldenYellow,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    paddingRight: 40,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  clearButton: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
    padding: SPACING.xs,
  },
  clearButtonText: {
    color: COLORS.text.tertiary,
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  inventoryList: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.brand.goldenYellow,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  itemCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  stockCount: {
    fontSize: 24,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  stockBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
  },
  stockBadgeText: {
    color: '#000000',
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
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
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.primary,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  modalClose: {
    fontSize: 28,
    color: COLORS.text.tertiary,
  },
  modalBody: {
    padding: SPACING.xl,
  },
  itemNameModal: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoItem: {
    flex: 1,
    backgroundColor: COLORS.background.tertiary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  statusIndicator: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  statusIndicatorText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: '#000000',
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.brand.goldenYellow,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background.tertiary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  updateButton: {
    flex: 1,
    backgroundColor: COLORS.brand.primaryOrange,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  updateButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});