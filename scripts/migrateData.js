/**
 * Data Migration Script
 * Migrates mock data to Firebase Firestore
 * 
 * Usage: node scripts/migrateData.js
 */

import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';

// Mock data to migrate
const MOCK_MENU_ITEMS = [
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with pepperoni, mozzarella, and tomato sauce',
    category: 'Pizza',
    price: 18.99,
    available: true,
    popular: true,
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce',
    category: 'Pizza',
    price: 16.99,
    available: true,
    popular: false,
  },
  {
    id: 'bbq-chicken-pizza',
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
    category: 'Pizza',
    price: 19.99,
    available: true,
    popular: true,
  },
  {
    id: 'hawaiian-pizza',
    name: 'Hawaiian Pizza',
    description: 'Ham, pineapple, and mozzarella cheese',
    category: 'Pizza',
    price: 17.99,
    available: true,
    popular: false,
  },
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    category: 'Sides',
    price: 6.99,
    available: true,
    popular: true,
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    category: 'Salads',
    price: 8.99,
    available: true,
    popular: false,
  },
  {
    id: 'wings',
    name: 'Wings',
    description: 'Crispy chicken wings with your choice of sauce',
    category: 'Sides',
    price: 14.99,
    available: true,
    popular: true,
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks',
    description: 'Breaded mozzarella sticks served with marinara sauce',
    category: 'Sides',
    price: 7.99,
    available: true,
    popular: false,
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    category: 'Desserts',
    price: 8.99,
    available: true,
    popular: true,
  },
  {
    id: 'coke',
    name: 'Coca-Cola',
    description: 'Refreshing Coca-Cola soft drink',
    category: 'Drinks',
    price: 2.99,
    available: true,
    popular: true,
  },
  {
    id: 'sprite',
    name: 'Sprite',
    description: 'Lemon-lime flavored soft drink',
    category: 'Drinks',
    price: 2.99,
    available: true,
    popular: false,
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    description: 'Classic Pepsi cola',
    category: 'Drinks',
    price: 2.99,
    available: true,
    popular: false,
  },
];

const MOCK_INVENTORY = [
  { id: 'pepperoni-pizza', name: 'Pepperoni Pizza', stock: 15, category: 'Pizza', price: 18.99, reorderPoint: 10 },
  { id: 'margherita-pizza', name: 'Margherita Pizza', stock: 8, category: 'Pizza', price: 16.99, reorderPoint: 10 },
  { id: 'bbq-chicken-pizza', name: 'BBQ Chicken Pizza', stock: 12, category: 'Pizza', price: 19.99, reorderPoint: 10 },
  { id: 'hawaiian-pizza', name: 'Hawaiian Pizza', stock: 10, category: 'Pizza', price: 17.99, reorderPoint: 10 },
  { id: 'garlic-bread', name: 'Garlic Bread', stock: 25, category: 'Sides', price: 6.99, reorderPoint: 20 },
  { id: 'caesar-salad', name: 'Caesar Salad', stock: 18, category: 'Salads', price: 8.99, reorderPoint: 15 },
  { id: 'wings', name: 'Wings', stock: 30, category: 'Sides', price: 14.99, reorderPoint: 20 },
  { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', stock: 22, category: 'Sides', price: 7.99, reorderPoint: 15 },
  { id: 'coke', name: 'Coca-Cola', stock: 50, category: 'Drinks', price: 2.99, reorderPoint: 30 },
  { id: 'sprite', name: 'Sprite', stock: 45, category: 'Drinks', price: 2.99, reorderPoint: 30 },
  { id: 'pepsi', name: 'Pepsi', stock: 3, category: 'Drinks', price: 2.99, reorderPoint: 30 },
  { id: 'chocolate-lava-cake', name: 'Chocolate Lava Cake', stock: 6, category: 'Desserts', price: 8.99, reorderPoint: 10 },
];

const MOCK_ORDERS = [
  {
    id: 'order-001',
    customerName: 'Sarah Johnson',
    userId: 'user-001',
    items: [
      { name: 'Pepperoni Pizza', quantity: 2, price: 18.99 },
      { name: 'Garlic Bread', quantity: 1, price: 6.99 },
    ],
    total: 44.97,
    status: 'pending',
    phone: '(403) 555-0123',
    address: '123 Main St, Calgary, AB',
    paymentMethod: 'Credit Card',
    notes: 'Extra cheese, please!',
  },
  {
    id: 'order-002',
    customerName: 'Mike Chen',
    userId: 'user-002',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 16.99 },
      { name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { name: 'Coca-Cola', quantity: 2, price: 2.99 },
    ],
    total: 31.96,
    status: 'preparing',
    phone: '(403) 555-0456',
    address: '456 Oak Ave, Calgary, AB',
    paymentMethod: 'Cash',
  },
  {
    id: 'order-003',
    customerName: 'Emily Rodriguez',
    userId: 'user-003',
    items: [
      { name: 'BBQ Chicken Pizza', quantity: 1, price: 19.99 },
      { name: 'Wings', quantity: 1, price: 14.99 },
    ],
    total: 34.98,
    status: 'completed',
    phone: '(403) 555-0789',
    address: '789 Pine Rd, Calgary, AB',
    paymentMethod: 'Debit Card',
  },
];

const MOCK_CUSTOMERS = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(403) 555-0123',
    totalOrders: 45,
    totalSpent: 1234.56,
  },
  {
    id: 'user-002',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    phone: '(403) 555-0456',
    totalOrders: 32,
    totalSpent: 890.45,
  },
  {
    id: 'user-003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '(403) 555-0789',
    totalOrders: 67,
    totalSpent: 2145.78,
  },
];

/**
 * Migrate menu items to Firestore
 */
async function migrateMenuItems() {
  console.log('Migrating menu items...');
  
  const batch = writeBatch(db);
  
  MOCK_MENU_ITEMS.forEach((item) => {
    const itemRef = doc(db, 'menuItems', item.id);
    batch.set(itemRef, {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });
  
  await batch.commit();
  console.log(`✓ Migrated ${MOCK_MENU_ITEMS.length} menu items`);
}

/**
 * Migrate inventory to Firestore
 */
async function migrateInventory() {
  console.log('Migrating inventory...');
  
  const batch = writeBatch(db);
  
  MOCK_INVENTORY.forEach((item) => {
    const itemRef = doc(db, 'inventory', item.id);
    batch.set(itemRef, {
      ...item,
      menuItemId: item.id,
      stockHistory: [],
      lastRestocked: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });
  
  await batch.commit();
  console.log(`✓ Migrated ${MOCK_INVENTORY.length} inventory items`);
}

/**
 * Migrate orders to Firestore
 */
async function migrateOrders() {
  console.log('Migrating orders...');
  
  const batch = writeBatch(db);
  
  MOCK_ORDERS.forEach((order, index) => {
    const orderRef = doc(db, 'orders', order.id);
    
    // Create timestamp (stagger by minutes for demo)
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - (MOCK_ORDERS.length - index) * 15);
    
    batch.set(orderRef, {
      ...order,
      timestamp: Timestamp.fromDate(timestamp),
      updatedAt: Timestamp.now(),
      statusHistory: {
        [order.status]: Timestamp.fromDate(timestamp),
      },
    });
  });
  
  await batch.commit();
  console.log(`✓ Migrated ${MOCK_ORDERS.length} orders`);
}

/**
 * Migrate customers to Firestore
 */
async function migrateCustomers() {
  console.log('Migrating customers...');
  
  const batch = writeBatch(db);
  
  MOCK_CUSTOMERS.forEach((customer) => {
    const customerRef = doc(db, 'users', customer.id);
    
    // Create timestamp (registered some time ago)
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365));
    
    const lastOrderAt = new Date();
    lastOrderAt.setDate(lastOrderAt.getDate() - Math.floor(Math.random() * 30));
    
    batch.set(customerRef, {
      ...customer,
      addresses: [
        {
          street: '123 Main St',
          city: 'Calgary',
          province: 'AB',
          postalCode: 'T2X 1X1',
          default: true,
        },
      ],
      createdAt: Timestamp.fromDate(createdAt),
      lastOrderAt: Timestamp.fromDate(lastOrderAt),
      updatedAt: Timestamp.now(),
    });
  });
  
  await batch.commit();
  console.log(`✓ Migrated ${MOCK_CUSTOMERS.length} customers`);
}

/**
 * Main migration function
 */
async function migrateAllData() {
  console.log('\n🚀 Starting data migration to Firebase...\n');
  
  try {
    await migrateMenuItems();
    await migrateInventory();
    await migrateOrders();
    await migrateCustomers();
    
    console.log('\n✅ Data migration completed successfully!\n');
    console.log('Summary:');
    console.log(`  - Menu Items: ${MOCK_MENU_ITEMS.length}`);
    console.log(`  - Inventory: ${MOCK_INVENTORY.length}`);
    console.log(`  - Orders: ${MOCK_ORDERS.length}`);
    console.log(`  - Customers: ${MOCK_CUSTOMERS.length}`);
    console.log(`  - Total: ${
      MOCK_MENU_ITEMS.length +
      MOCK_INVENTORY.length +
      MOCK_ORDERS.length +
      MOCK_CUSTOMERS.length
    } documents\n`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Clear all collections (use with caution!)
 */
async function clearAllData() {
  console.log('\n⚠️  WARNING: This will delete all data!\n');
  
  // This is a placeholder - implement if needed
  console.log('Clear function not implemented for safety');
  console.log('If you need to clear data, do it manually in Firebase Console\n');
}

// Export functions
export {
  migrateAllData,
  migrateMenuItems,
  migrateInventory,
  migrateOrders,
  migrateCustomers,
  clearAllData,
};

// If running directly (not imported)
if (require.main === module) {
  migrateAllData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
