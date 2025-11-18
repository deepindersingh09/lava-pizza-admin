import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
        onPress={() => onTabChange('orders')}
      >
        <Text
          style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}
        >
          📦 Orders
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
        onPress={() => onTabChange('inventory')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'inventory' && styles.activeTabText,
          ]}
        >
          🍕 Inventory
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#DC2626',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#DC2626',
  },
});