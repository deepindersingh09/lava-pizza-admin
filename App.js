// MUST BE FIRST - Initialize Firebase before anything else
import './firebase/config';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Platform, ActivityIndicator, Text } from 'react-native';
import OrdersScreen from './screens/OrdersScreenFirebase';  // ✅ Use Firebase version
import InventoryScreen from './screens/MenuScreen';  // We'll create this
import AnalyticsScreen from './screens/AnalyticsScreen';  // We'll create this
import AlertScreen from './screens/AlertScreen';  // Placeholder screen
import CustomerScreen from './screens/CustomerScreen';  // We'll create this
import LoginScreen from './screens/LoginScreen';
import TabBar from './components/TabBar';
import AuthService from './services/AuthService';
import NotificationService from './services/NotificationService';
import { COLORS } from './constants/Colors';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth
    const unsubscribe = AuthService.initializeAuthListener((user, error) => {
      setLoading(false);
      setIsAuthenticated(!!user);
      
      // Initialize notifications if authenticated
      if (user) {
        NotificationService.initialize().catch(err => {
          console.warn('Notifications not available:', err.message);
        });
      }
    });

    return () => {
      AuthService.cleanup();
      NotificationService.cleanup();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brand.primaryOrange} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'orders': return <OrdersScreen />;
      case 'analytics': return <AnalyticsScreen />;
      case 'alerts': return <AlertScreen />;
      case 'customers': return <CustomerScreen />;
      case 'menu': return <InventoryScreen />;
      default: return <OrdersScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>{renderScreen()}</View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
});