// services/menuService.js
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const MENU_COLLECTION = 'menu_items'; // 👈 IMPORTANT: match Firestore collection name

class MenuService {
  /**
   * Subscribe to real-time menu items
   * @param {(items:any[], error:any)=>void} callback
   * @returns {() => void} unsubscribe
   */
  subscribeToMenuItems(callback) {
    let unsub = () => {};

    const mapDoc = (d) => {
      const data = d.data() || {};
      return {
        id: d.id,

        // normalized fields your UI expects
        name: data.name || '',
        description: data.description || '',
        categoryId: data.categoryId ?? data.category ?? '',
        price:
          typeof data.basePrice === 'number'
            ? data.basePrice
            : typeof data.price === 'number'
            ? data.price
            : 0,
        available:
          typeof data.isActive === 'boolean'
            ? data.isActive
            : typeof data.available === 'boolean'
            ? data.available
            : true,
        popular: !!data.popular,

        // keep original fields too (helps debugging)
        ...data,
      };
    };

    const startListener = (qRef) => {
      return onSnapshot(
        qRef,
        (snapshot) => {
          const items = [];
          snapshot.forEach((d) => items.push(mapDoc(d)));
          callback(items, null);
        },
        (error) => {
          console.log('🔥 MENU SUBSCRIBE ERROR:', error?.code, error?.message);
          callback([], error);
        }
      );
    };

    try {
      // ✅ Best query (needs categoryId + name fields, and may need an index)
      const bestQuery = query(
        collection(db, MENU_COLLECTION),
        orderBy('categoryId'),
        orderBy('name')
      );

      unsub = startListener(bestQuery);
      return unsub;
    } catch (err) {
      console.log('🔥 MENU SUBSCRIBE SETUP FAILED:', err?.message);
      callback([], err);
      return () => {};
    }
  }

  /**
   * Update a menu item (normalized inputs)
   */
  async updateMenuItem(itemId, updates) {
    const ref = doc(db, MENU_COLLECTION, itemId);

    const payload = {
      updatedAt: Timestamp.now(),
    };

    // map common fields
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;

    if (updates.category !== undefined) payload.categoryId = updates.category;
    if (updates.categoryId !== undefined) payload.categoryId = updates.categoryId;

    if (updates.price !== undefined) payload.basePrice = Number(updates.price) || 0;
    if (updates.basePrice !== undefined) payload.basePrice = Number(updates.basePrice) || 0;

    if (updates.available !== undefined) payload.isActive = !!updates.available;
    if (updates.isActive !== undefined) payload.isActive = !!updates.isActive;

    if (updates.popular !== undefined) payload.popular = !!updates.popular;

    await updateDoc(ref, payload);
  }

  async toggleAvailability(itemId, available) {
    return this.updateMenuItem(itemId, { available });
  }
}

export default new MenuService();
