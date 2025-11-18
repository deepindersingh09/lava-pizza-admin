import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import OrdersScreen from './screens/OrdersScreen';
import InventoryScreen from './screens/InventoryScreen';
import TabBar from './components/TabBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A3164" />
      <View style={styles.content}>
        {activeTab === 'orders' ? <OrdersScreen /> : <InventoryScreen />}
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
  },
  content: {
    flex: 1,
  },
});