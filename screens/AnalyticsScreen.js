import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  const analytics = {
    week: { revenue: 8567.89, orders: 145, avgOrder: 59.09 },
    month: { revenue: 32456.78, orders: 587, avgOrder: 55.29 },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Analytics</Text>
        <Text style={styles.headerSubtitle}>Business Insights</Text>
      </View>

      <View style={styles.timeRangeContainer}>
        {['week', 'month'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.timeRangeButtonActive,
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === range && styles.timeRangeTextActive,
              ]}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>💰</Text>
            <Text style={styles.metricValue}>
              ${analytics[timeRange].revenue.toFixed(2)}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>📦</Text>
            <Text style={styles.metricValue}>{analytics[timeRange].orders}</Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>🎯</Text>
            <Text style={styles.metricValue}>
              ${analytics[timeRange].avgOrder.toFixed(2)}
            </Text>
            <Text style={styles.metricLabel}>Avg Order</Text>
          </View>
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>💡 Key Insights</Text>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>🚀</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Weekend Performance</Text>
              <Text style={styles.insightText}>
                Weekend sales are 45% higher than weekdays. Consider increasing
                inventory for Fridays and Saturdays.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>🕒</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Dinner Rush</Text>
              <Text style={styles.insightText}>
                6-8 PM accounts for 35% of daily orders. Ensure adequate staffing
                during these hours.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>🍕</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Top Item</Text>
              <Text style={styles.insightText}>
                Pepperoni Pizza is your best seller, accounting for 32% of all pizza orders.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
  },
  header: {
    backgroundColor: '#FF9933',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeRangeButtonActive: {
    backgroundColor: '#FF9933',
    borderColor: '#FF9933',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
  },
  timeRangeTextActive: {
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
  insightsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
});