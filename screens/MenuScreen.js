import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/Colors';

const MOCK_MENU_ITEMS = [
  {
    id: '1',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with pepperoni, mozzarella, and tomato sauce',
    category: 'Pizza',
    price: 18.99,
    available: true,
    popular: true,
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce',
    category: 'Pizza',
    price: 16.99,
    available: true,
    popular: false,
  },
  {
    id: '3',
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
    category: 'Pizza',
    price: 19.99,
    available: true,
    popular: true,
  },
  {
    id: '4',
    name: 'Hawaiian Pizza',
    description: 'Ham, pineapple, and mozzarella cheese',
    category: 'Pizza',
    price: 17.99,
    available: false,
    popular: false,
  },
  {
    id: '5',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    category: 'Sides',
    price: 6.99,
    available: true,
    popular: true,
  },
  {
    id: '6',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    category: 'Salads',
    price: 8.99,
    available: true,
    popular: false,
  },
  {
    id: '7',
    name: 'Wings',
    description: 'Crispy chicken wings with your choice of sauce',
    category: 'Sides',
    price: 14.99,
    available: true,
    popular: true,
  },
  {
    id: '8',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    category: 'Desserts',
    price: 8.99,
    available: true,
    popular: false,
  },
];

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(menuItems.map((item) => item.category))];

  const toggleAvailability = (itemId) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditedItem({ ...item });
    setIsEditMode(true);
  };

  const saveChanges = () => {
    if (!editedItem.name || !editedItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setMenuItems(
      menuItems.map((item) =>
        item.id === editedItem.id ? editedItem : item
      )
    );

    Alert.alert('Success', 'Menu item updated successfully');
    setSelectedItem(null);
    setEditedItem(null);
    setIsEditMode(false);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍕 Lava Pizza</Text>
        <Text style={styles.headerSubtitle}>Menu Management</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{menuItems.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.status.success }]}>
            {menuItems.filter((i) => i.available).length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: COLORS.brand.lavaOrange }]}>
            {menuItems.filter((i) => i.popular).length}
          </Text>
          <Text style={styles.statLabel}>Popular</Text>
        </View>
      </View>

      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                filterCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setFilterCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  filterCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.menuList}>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <View style={styles.menuCardHeader}>
              <View style={styles.menuCardLeft}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemCategory}>{item.category}</Text>
                <Text style={styles.menuItemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.menuCardRight}>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                {item.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>🔥 Popular</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.menuCardFooter}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleAvailability(item.id);
                }}
              >
                <Text
                  style={[
                    styles.quickActionText,
                    item.available && styles.quickActionTextActive,
                  ]}
                >
                  {item.available ? '✓ Available' : '✗ Unavailable'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={(e) => {
                  e.stopPropagation();
                  openEditModal(item);
                }}
              >
                <Text style={styles.editButtonText}>✏️ Edit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No menu items found</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isEditMode && editedItem !== null}
        animationType="slide"
        transparent={true}
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
                    onChangeText={(text) =>
                      setEditedItem({ ...editedItem, name: text })
                    }
                    placeholder="Enter item name"
                    placeholderTextColor={COLORS.text.tertiary}
                  />

                  <Text style={styles.inputLabel}>Description *</Text>
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

                  <Text style={styles.inputLabel}>Category *</Text>
                  <TextInput
                    style={styles.input}
                    value={editedItem.category}
                    onChangeText={(text) =>
                      setEditedItem({ ...editedItem, category: text })
                    }
                    placeholder="Enter category"
                    placeholderTextColor={COLORS.text.tertiary}
                  />

                  <Text style={styles.inputLabel}>Price * ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={editedItem.price.toString()}
                    onChangeText={(text) =>
                      setEditedItem({
                        ...editedItem,
                        price: parseFloat(text) || 0,
                      })
                    }
                    placeholder="0.00"
                    placeholderTextColor={COLORS.text.tertiary}
                    keyboardType="decimal-pad"
                  />

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Available</Text>
                    <Switch
                      value={editedItem.available}
                      onValueChange={(value) =>
                        setEditedItem({ ...editedItem, available: value })
                      }
                      trackColor={{
                        false: COLORS.border.light,
                        true: COLORS.brand.lavaRed,
                      }}
                      thumbColor={
                        editedItem.available
                          ? COLORS.text.primary
                          : COLORS.text.tertiary
                      }
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Popular Item</Text>
                    <Switch
                      value={editedItem.popular}
                      onValueChange={(value) =>
                        setEditedItem({ ...editedItem, popular: value })
                      }
                      trackColor={{
                        false: COLORS.border.light,
                        true: COLORS.brand.lavaOrange,
                      }}
                      thumbColor={
                        editedItem.popular
                          ? COLORS.text.primary
                          : COLORS.text.tertiary
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
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={saveChanges}
                    >
                      <Text style={styles.saveButtonText}>Save Changes</Text>
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
  searchFilterContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    paddingRight: 40,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
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
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.brand.lavaRed,
    borderColor: COLORS.brand.lavaRed,
  },
  categoryButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  categoryButtonTextActive: {
    color: COLORS.text.primary,
  },
  menuList: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  menuCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  menuCardLeft: {
    flex: 1,
    marginRight: SPACING.md,
  },
  menuItemName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  menuItemCategory: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.brand.lavaYellow,
    marginBottom: SPACING.xs,
  },
  menuItemDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  menuCardRight: {
    alignItems: 'flex-end',
  },
  menuItemPrice: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.brand.lavaRed,
    marginBottom: SPACING.sm,
  },
  popularBadge: {
    backgroundColor: COLORS.brand.lavaOrange,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  popularBadgeText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#000000',
  },
  menuCardFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tertiary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  quickActionText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.tertiary,
  },
  quickActionTextActive: {
    color: COLORS.status.success,
  },
  editButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.brand.lavaRed,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
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
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
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
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.brand.lavaYellow,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    marginBottom: SPACING.md,
  },
  switchLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background.tertiary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  cancelButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.brand.lavaRed,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});