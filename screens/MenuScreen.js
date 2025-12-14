import React, { useEffect, useMemo, useState } from 'react';
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
  Switch,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';
import MenuService from '../services/menuService';

export default function MenuScreenDynamic() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Subscribe to real-time menu updates
  useEffect(() => {
    const unsub = MenuService.subscribeToMenuItems((items, error) => {
      setLoading(false);

      if (error) {
        Alert.alert('Error', 'Failed to load menu');
        console.error(error);
        setMenuItems([]);
        return;
      }

      setMenuItems(items);
    });

    return () => unsub && unsub();
  }, []);

  const categories = useMemo(() => {
    const setIds = new Set(menuItems.map((i) => i.categoryId || i.category).filter(Boolean));
    return ['all', ...Array.from(setIds)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();

    return menuItems.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || desc.includes(q);

      const cat = item.categoryId || item.category || '';
      const matchesCategory = filterCategory === 'all' || cat === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, filterCategory]);

  const totalCount = menuItems.length;
  const activeCount = menuItems.filter((i) => i.available === true).length; // mapped from isActive
  const popularCount = menuItems.filter((i) => i.popular === true).length;

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditedItem({
      ...item,
      // ensure editable fields exist
      name: item.name || '',
      description: item.description || '',
      category: item.categoryId || item.category || '',
      price: typeof item.price === 'number' ? item.price : 0,
      available: item.available === true,
      popular: item.popular === true,
    });
    setIsEditMode(true);
  };

  const toggleAvailability = async (item) => {
    try {
      await MenuService.toggleAvailability(item.id, !item.available);
    } catch (e) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const saveChanges = async () => {
    if (!editedItem?.name) {
      Alert.alert('Error', 'Item name is required');
      return;
    }

    const priceNum = Number(editedItem.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      await MenuService.updateMenuItem(editedItem.id, {
        name: editedItem.name,
        description: editedItem.description,
        category: editedItem.category, // service maps -> categoryId
        price: priceNum,              // service maps -> basePrice
        available: editedItem.available, // service maps -> isActive
        popular: editedItem.popular,
      });

      Alert.alert('Success', 'Menu item updated successfully');
      setSelectedItem(null);
      setEditedItem(null);
      setIsEditMode(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to update item in Firestore');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
          <Text style={styles.headerSubtitle}>Menu Management</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primaryOrange} />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
        <Text style={styles.headerSubtitle}>Menu Management</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.status?.success || COLORS.brand.goldenYellow }]}>
            {activeCount}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.brand.primaryOrange }]}>
            {popularCount}
          </Text>
          <Text style={styles.statLabel}>Popular</Text>
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
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setFilterCategory(cat)}
            style={[
              styles.categoryButton,
              filterCategory === cat && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryButtonText,
                filterCategory === cat && styles.categoryButtonTextActive,
              ]}
            >
              {cat === 'all' ? 'All' : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.inventoryList}>
        {filteredItems.length === 0 ? (
          <View style={{ paddingVertical: SPACING.xxl, alignItems: 'center' }}>
            <Text style={{ color: COLORS.text.tertiary, fontSize: TYPOGRAPHY.sizes.base }}>
              No menu items found
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => openEditModal(item)}
              activeOpacity={0.7}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                {!!(item.categoryId || item.category) && (
                  <Text style={styles.itemCategory}>{item.categoryId || item.category}</Text>
                )}
                {!!item.description && (
                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>${Number(item.price || 0).toFixed(2)}</Text>

                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleAvailability(item);
                  }}
                >
                  <Text
                    style={[
                      styles.quickActionText,
                      item.available && styles.quickActionTextActive,
                    ]}
                  >
                    {item.available ? '✓ Active' : '✗ Inactive'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditMode && editedItem !== null}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setIsEditMode(false);
          setEditedItem(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Menu Item</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditMode(false);
                      setEditedItem(null);
                    }}
                  >
                    <Text style={styles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <Text style={styles.inputLabel}>Item Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={editedItem.name}
                    onChangeText={(text) => setEditedItem({ ...editedItem, name: text })}
                    placeholder="Enter item name"
                    placeholderTextColor={COLORS.text.tertiary}
                  />

                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editedItem.description}
                    onChangeText={(text) =>
                      setEditedItem({ ...editedItem, description: text })
                    }
                    placeholder="Enter description"
                    placeholderTextColor={COLORS.text.tertiary}
                    multiline
                    numberOfLines={3}
                  />

                  <Text style={styles.inputLabel}>Category ID *</Text>
                  <TextInput
                    style={styles.input}
                    value={editedItem.category}
                    onChangeText={(text) =>
                      setEditedItem({ ...editedItem, category: text })
                    }
                    placeholder="e.g. pizza, pasta, appetizers"
                    placeholderTextColor={COLORS.text.tertiary}
                  />

                  <Text style={styles.inputLabel}>Base Price ($) *</Text>
                  <TextInput
                    style={styles.input}
                    value={String(editedItem.price ?? '')}
                    onChangeText={(text) =>
                      setEditedItem({ ...editedItem, price: text })
                    }
                    placeholder="0.00"
                    placeholderTextColor={COLORS.text.tertiary}
                    keyboardType="decimal-pad"
                  />

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Active</Text>
                    <Switch
                      value={!!editedItem.available}
                      onValueChange={(value) =>
                        setEditedItem({ ...editedItem, available: value })
                      }
                      trackColor={{
                        false: COLORS.border.primary,
                        true: COLORS.brand.primaryOrange,
                      }}
                      thumbColor={
                        editedItem.available ? COLORS.text.primary : COLORS.text.tertiary
                      }
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Popular</Text>
                    <Switch
                      value={!!editedItem.popular}
                      onValueChange={(value) =>
                        setEditedItem({ ...editedItem, popular: value })
                      }
                      trackColor={{
                        false: COLORS.border.primary,
                        true: COLORS.brand.goldenYellow,
                      }}
                      thumbColor={
                        editedItem.popular ? COLORS.text.primary : COLORS.text.tertiary
                      }
                    />
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditMode(false);
                        setEditedItem(null);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.updateButton} onPress={saveChanges}>
                      <Text style={styles.updateButtonText}>Save Changes</Text>
                    </TouchableOpacity>
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

// Based on your existing Inventory styles, but adjusted for menu fields
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.primary },

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

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: {
    marginTop: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.tertiary,
  },

  statsContainer: { flexDirection: 'row', padding: SPACING.lg, gap: SPACING.md },
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
  clearButtonText: { color: COLORS.text.tertiary, fontSize: TYPOGRAPHY.sizes.lg },

  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.brand.primaryOrange,
    borderColor: COLORS.brand.primaryOrange,
  },
  categoryButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  categoryButtonTextActive: { color: COLORS.text.primary },

  inventoryList: { flex: 1, padding: SPACING.lg, paddingTop: 0 },

  itemCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  itemCategory: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.brand.goldenYellow,
  },
  itemDesc: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  itemPrice: {
    fontSize: 20,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },

  quickActionButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  quickActionTextActive: { color: COLORS.status?.success || COLORS.brand.goldenYellow },

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
    maxHeight: '90%',
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
  modalClose: { fontSize: 28, color: COLORS.text.tertiary },
  modalBody: { padding: SPACING.xl },

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
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  textArea: { height: 80, textAlignVertical: 'top' },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.primary,
    marginBottom: SPACING.md,
  },
  switchLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
  },

  buttonRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
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
