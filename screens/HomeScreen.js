import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function HomeScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🍕</Text>
        <Text style={styles.title}>Lava Pizza Admin</Text>
        <Text style={styles.subtitle}>Management Dashboard</Text>
      </View>

      {/* Main Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, styles.ordersButton]}
          onPress={() => onNavigate('orders')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📦</Text>
          </View>
          <Text style={styles.buttonTitle}>Orders</Text>
          <Text style={styles.buttonSubtitle}>
            View and manage incoming orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, styles.inventoryButton]}
          onPress={() => onNavigate('inventory')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📊</Text>
          </View>
          <Text style={styles.buttonTitle}>Inventory</Text>
          <Text style={styles.buttonSubtitle}>
            Manage stock and menu items
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Lava Pizza YYC</Text>
        <Text style={styles.footerSubtext}>Calgary, AB</Text>
      </View>
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
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  menuContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 20,
  },
  menuButton: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
  },
  ordersButton: {
    backgroundColor: '#111827',
    borderColor: '#FF5C2B',
  },
  inventoryButton: {
    backgroundColor: '#111827',
    borderColor: '#FFC800',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC800',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});