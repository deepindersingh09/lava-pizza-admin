import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';

export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'alerts', icon: '🔔', label: 'Alerts' },
    { id: 'customers', icon: '👥', label: 'Customers' },
    { id: 'menu', icon: '📋', label: 'Menu' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Safe area for iOS
  },
  tabRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#FFD700', // Golden yellow
    marginTop: -1,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999999',
  },
  activeTabText: {
    color: '#FFD700', // Golden yellow to match your theme
    fontWeight: '700',
  },
});