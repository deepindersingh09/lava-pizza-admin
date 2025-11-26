import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const MENU_COLLECTION = 'menuItems';
const INVENTORY_COLLECTION = 'inventory';
const CATEGORIES_COLLECTION = 'categories';

/**
 * Menu & Inventory Service
 */
class InventoryService {
  /**
   * Subscribe to real-time menu items updates
   * @param {Function} callback - Called when menu items change
   * @returns {Function} Unsubscribe function
   */
  subscribeToMenuItems(callback) {
    try {
      const menuQuery = query(
        collection(db, MENU_COLLECTION),
        orderBy('category'),
        orderBy('name')
      );
      
      const unsubscribe = onSnapshot(
        menuQuery,
        (snapshot) => {
          const items = [];
          snapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          callback(items, null);
        },
        (error) => {
          console.error('Error subscribing to menu items:', error);
          callback([], error);
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up menu subscription:', error);
      callback([], error);
      return () => {};
    }
  }

  /**
   * Subscribe to real-time inventory updates
   * @param {Function} callback - Called when inventory changes
   * @returns {Function} Unsubscribe function
   */
  subscribeToInventory(callback) {
    try {
      const inventoryQuery = query(
        collection(db, INVENTORY_COLLECTION),
        orderBy('category'),
        orderBy('name')
      );
      
      const unsubscribe = onSnapshot(
        inventoryQuery,
        (snapshot) => {
          const items = [];
          snapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          callback(items, null);
        },
        (error) => {
          console.error('Error subscribing to inventory:', error);
          callback([], error);
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up inventory subscription:', error);
      callback([], error);
      return () => {};
    }
  }

  /**
   * Get all menu items
   * @returns {Promise<Array>} Array of menu items
   */
  async getAllMenuItems() {
    try {
      const menuQuery = query(
        collection(db, MENU_COLLECTION),
        orderBy('category'),
        orderBy('name')
      );
      
      const snapshot = await getDocs(menuQuery);
      const items = [];
      
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return items;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  /**
   * Get all inventory items
   * @returns {Promise<Array>} Array of inventory items
   */
  async getAllInventory() {
    try {
      const inventoryQuery = query(
        collection(db, INVENTORY_COLLECTION),
        orderBy('category'),
        orderBy('name')
      );
      
      const snapshot = await getDocs(inventoryQuery);
      const items = [];
      
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return items;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }

  /**
   * Get menu item by ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Menu item
   */
  async getMenuItemById(itemId) {
    try {
      const itemDoc = await getDoc(doc(db, MENU_COLLECTION, itemId));
      
      if (itemDoc.exists()) {
        return {
          id: itemDoc.id,
          ...itemDoc.data(),
        };
      }
      
      throw new Error('Menu item not found');
    } catch (error) {
      console.error('Error fetching menu item:', error);
      throw error;
    }
  }

  /**
   * Get inventory item by ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Inventory item
   */
  async getInventoryItemById(itemId) {
    try {
      const itemDoc = await getDoc(doc(db, INVENTORY_COLLECTION, itemId));
      
      if (itemDoc.exists()) {
        return {
          id: itemDoc.id,
          ...itemDoc.data(),
        };
      }
      
      throw new Error('Inventory item not found');
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  /**
   * Add new menu item
   * @param {Object} itemData - Menu item data
   * @returns {Promise<string>} New item ID
   */
  async addMenuItem(itemData) {
    try {
      const docRef = await addDoc(collection(db, MENU_COLLECTION), {
        ...itemData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      console.log('Menu item added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  }

  /**
   * Add new inventory item
   * @param {Object} itemData - Inventory item data
   * @returns {Promise<string>} New item ID
   */
  async addInventoryItem(itemData) {
    try {
      const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), {
        ...itemData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastRestocked: Timestamp.now(),
      });
      
      console.log('Inventory item added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  }

  /**
   * Update menu item
   * @param {string} itemId - Item ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async updateMenuItem(itemId, updates) {
    try {
      const itemRef = doc(db, MENU_COLLECTION, itemId);
      
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      
      console.log(`Menu item ${itemId} updated successfully`);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   * @param {string} itemId - Item ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async updateInventoryItem(itemId, updates) {
    try {
      const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
      
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      
      console.log(`Inventory item ${itemId} updated successfully`);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }

  /**
   * Update stock level
   * @param {string} itemId - Item ID
   * @param {number} newStock - New stock level
   * @param {string} reason - Reason for update (restock, sale, adjustment, etc.)
   * @returns {Promise<void>}
   */
  async updateStock(itemId, newStock, reason = 'manual_adjustment') {
    try {
      const itemRef = doc(db, INVENTORY_COLLECTION, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error('Inventory item not found');
      }
      
      const currentStock = itemDoc.data().stock || 0;
      const difference = newStock - currentStock;
      
      await updateDoc(itemRef, {
        stock: newStock,
        updatedAt: Timestamp.now(),
        lastRestocked: reason === 'restock' ? Timestamp.now() : itemDoc.data().lastRestocked,
        stockHistory: [
          ...(itemDoc.data().stockHistory || []).slice(-50), // Keep last 50 entries
          {
            timestamp: Timestamp.now(),
            previousStock: currentStock,
            newStock: newStock,
            difference: difference,
            reason: reason,
          },
        ],
      });
      
      console.log(`Stock updated for item ${itemId}: ${currentStock} → ${newStock}`);
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  /**
   * Toggle menu item availability
   * @param {string} itemId - Item ID
   * @param {boolean} available - Availability status
   * @returns {Promise<void>}
   */
  async toggleAvailability(itemId, available) {
    try {
      await this.updateMenuItem(itemId, { available });
      console.log(`Menu item ${itemId} availability set to ${available}`);
    } catch (error) {
      console.error('Error toggling availability:', error);
      throw error;
    }
  }

  /**
   * Delete menu item
   * @param {string} itemId - Item ID
   * @returns {Promise<void>}
   */
  async deleteMenuItem(itemId) {
    try {
      // Get item to check for image
      const item = await this.getMenuItemById(itemId);
      
      // Delete image if exists
      if (item.imageUrl) {
        await this.deleteItemImage(item.imageUrl);
      }
      
      // Delete document
      await deleteDoc(doc(db, MENU_COLLECTION, itemId));
      console.log(`Menu item ${itemId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  /**
   * Delete inventory item
   * @param {string} itemId - Item ID
   * @returns {Promise<void>}
   */
  async deleteInventoryItem(itemId) {
    try {
      await deleteDoc(doc(db, INVENTORY_COLLECTION, itemId));
      console.log(`Inventory item ${itemId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  /**
   * Upload menu item image
   * @param {string} itemId - Item ID
   * @param {string} imageUri - Local image URI
   * @returns {Promise<string>} Download URL
   */
  async uploadItemImage(itemId, imageUri) {
    try {
      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create storage reference
      const storageRef = ref(storage, `menu-items/${itemId}/${Date.now()}.jpg`);
      
      // Upload image
      await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update menu item with image URL
      await this.updateMenuItem(itemId, { imageUrl: downloadURL });
      
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Delete menu item image
   * @param {string} imageUrl - Image URL to delete
   * @returns {Promise<void>}
   */
  async deleteItemImage(imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error if image doesn't exist
    }
  }

  /**
   * Get low stock items
   * @param {number} threshold - Stock threshold percentage (default 30%)
   * @returns {Promise<Array>} Array of low stock items
   */
  async getLowStockItems(threshold = 0.3) {
    try {
      const allItems = await this.getAllInventory();
      
      return allItems.filter((item) => {
        const stockPercentage = item.stock / item.reorderPoint;
        return stockPercentage <= threshold;
      });
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  }

  /**
   * Get critical stock items (very low)
   * @returns {Promise<Array>} Array of critical stock items
   */
  async getCriticalStockItems() {
    return this.getLowStockItems(0.3);
  }

  /**
   * Get out of stock items
   * @returns {Promise<Array>} Array of out of stock items
   */
  async getOutOfStockItems() {
    try {
      const inventoryQuery = query(
        collection(db, INVENTORY_COLLECTION),
        where('stock', '<=', 0)
      );
      
      const snapshot = await getDocs(inventoryQuery);
      const items = [];
      
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return items;
    } catch (error) {
      console.error('Error fetching out of stock items:', error);
      throw error;
    }
  }

  /**
   * Get menu items by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Array of menu items
   */
  async getMenuItemsByCategory(category) {
    try {
      const menuQuery = query(
        collection(db, MENU_COLLECTION),
        where('category', '==', category),
        orderBy('name')
      );
      
      const snapshot = await getDocs(menuQuery);
      const items = [];
      
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return items;
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw error;
    }
  }

  /**
   * Bulk update menu items
   * @param {Array<Object>} updates - Array of {id, ...updates}
   * @returns {Promise<void>}
   */
  async bulkUpdateMenuItems(updates) {
    try {
      const batch = writeBatch(db);
      
      updates.forEach(({ id, ...updateData }) => {
        const itemRef = doc(db, MENU_COLLECTION, id);
        batch.update(itemRef, {
          ...updateData,
          updatedAt: Timestamp.now(),
        });
      });
      
      await batch.commit();
      console.log(`Bulk updated ${updates.length} menu items`);
    } catch (error) {
      console.error('Error bulk updating menu items:', error);
      throw error;
    }
  }

  /**
   * Sync inventory with menu items
   * Ensures inventory exists for all menu items
   * @returns {Promise<void>}
   */
  async syncInventoryWithMenu() {
    try {
      const menuItems = await this.getAllMenuItems();
      const inventoryItems = await this.getAllInventory();
      
      const inventoryMap = new Map(
        inventoryItems.map((item) => [item.menuItemId, item])
      );
      
      const batch = writeBatch(db);
      let syncCount = 0;
      
      for (const menuItem of menuItems) {
        if (!inventoryMap.has(menuItem.id)) {
          // Create inventory item for this menu item
          const inventoryRef = doc(collection(db, INVENTORY_COLLECTION));
          batch.set(inventoryRef, {
            menuItemId: menuItem.id,
            name: menuItem.name,
            category: menuItem.category,
            stock: 0,
            reorderPoint: 10,
            price: menuItem.price,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          syncCount++;
        }
      }
      
      if (syncCount > 0) {
        await batch.commit();
        console.log(`Synced ${syncCount} inventory items with menu`);
      }
    } catch (error) {
      console.error('Error syncing inventory with menu:', error);
      throw error;
    }
  }
}

export default new InventoryService();
