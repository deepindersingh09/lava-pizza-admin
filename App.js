import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import OrdersScreen from './screens/OrdersScreen';
import InventoryScreen from './screens/InventoryScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import AlertScreen from './screens/AlertScreen';
import CustomerScreen from './screens/CustomerScreen';
import TabBar from './components/TabBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');

  const renderScreen = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'alerts':
        return <AlertScreen />;
      case 'customers':
        return <CustomerScreen />;
      case 'menu':
        return <InventoryScreen />;
      default:
        return <OrdersScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
      <View style={styles.content}>
        {renderScreen()}
      </View>
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
  content: {
    flex: 1,
  },
});