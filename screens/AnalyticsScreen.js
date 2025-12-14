import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

import { db } from '../firebase/config';

const ORDERS_COLLECTION = 'orders';

function getRangeStart(range) {
  const now = new Date();
  const d = new Date(now);

  if (range === 'week') {
    d.setDate(now.getDate() - 7);
  } else {
    // month
    d.setDate(now.getDate() - 30);
  }

  d.setHours(0, 0, 0, 0);
  return d;
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toDateSafe(ts) {
  // supports createdAt (Timestamp) or old timestamp field
  if (ts?.toDate) return ts.toDate();
  return null;
}

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    avgOrder: 0,
  });

  const [insights, setInsights] = useState({
    weekendPct: 0,
    dinnerRushPct: 0,
    topItemName: '—',
    topItemPct: 0,
  });

  // ✅ Real-time Firestore listener (admin app)
  useEffect(() => {
    setLoading(true);

    const startDate = getRangeStart(timeRange);
    const startTs = Timestamp.fromDate(startDate);

    // NOTE: If Firestore asks for an index, it will show a "create index" link in console logs
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('createdAt', '>=', startTs),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const orders = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          orders.push({
            id: docSnap.id,
            ...data,
            createdAtDate:
              toDateSafe(data.createdAt) ||
              toDateSafe(data.timestamp) ||
              null,
          });
        });

        // -------- METRICS --------
        let revenue = 0;
        let count = 0;

        // -------- INSIGHTS --------
        let weekendOrders = 0;
        let weekdayOrders = 0;
        let dinnerRushOrders = 0;

        const itemCounts = {}; // name -> qty

        orders.forEach((o) => {
          count += 1;

          // revenue (checkout uses total)
          revenue += safeNumber(o.total);

          const dt = o.createdAtDate;
          if (dt) {
            const day = dt.getDay(); // 0 Sun .. 6 Sat
            const hour = dt.getHours();

            const isWeekend = day === 0 || day === 6;
            if (isWeekend) weekendOrders += 1;
            else weekdayOrders += 1;

            // Dinner rush 6–8 PM (18,19,20)
            if (hour >= 18 && hour <= 20) dinnerRushOrders += 1;
          }

          // top item (from items array)
          const items = Array.isArray(o.items) ? o.items : [];
          items.forEach((it) => {
            const name = (it?.name || '').trim();
            if (!name) return;
            const qty = safeNumber(it.quantity || 1);
            itemCounts[name] = (itemCounts[name] || 0) + qty;
          });
        });

        const avgOrder = count > 0 ? revenue / count : 0;

        setMetrics({
          revenue,
          orders: count,
          avgOrder,
        });

        // Weekend %
        const totalForWeekend = weekendOrders + weekdayOrders;
        const weekendPct =
          totalForWeekend > 0 ? Math.round((weekendOrders / totalForWeekend) * 100) : 0;

        // Dinner rush %
        const dinnerRushPct =
          count > 0 ? Math.round((dinnerRushOrders / count) * 100) : 0;

        // Top item
        let topItemName = '—';
        let topQty = 0;
        let totalQty = 0;

        Object.values(itemCounts).forEach((v) => (totalQty += safeNumber(v)));

        Object.entries(itemCounts).forEach(([name, qty]) => {
          const q = safeNumber(qty);
          if (q > topQty) {
            topQty = q;
            topItemName = name;
          }
        });

        const topItemPct = totalQty > 0 ? Math.round((topQty / totalQty) * 100) : 0;

        setInsights({
          weekendPct,
          dinnerRushPct,
          topItemName,
          topItemPct,
        });

        setLoading(false);
      },
      (error) => {
        console.error('❌ Analytics subscribe error:', error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [timeRange]);

  const display = useMemo(
    () => ({
      revenue: metrics.revenue,
      orders: metrics.orders,
      avgOrder: metrics.avgOrder,
    }),
    [metrics]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Analytics</Text>
        <Text style={styles.headerSubtitle}>Real-time Business Insights</Text>
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
            activeOpacity={0.85}
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

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#FF9933" />
          <Text style={styles.loadingText}>Loading real-time analytics…</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* ✅ FIX: wrap cards so they never go off screen */}
          <View style={styles.metricsWrap}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>💰</Text>
              <Text style={styles.metricValue}>${display.revenue.toFixed(2)}</Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📦</Text>
              <Text style={styles.metricValue}>{display.orders}</Text>
              <Text style={styles.metricLabel}>Total Orders</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🎯</Text>
              <Text style={styles.metricValue}>${display.avgOrder.toFixed(2)}</Text>
              <Text style={styles.metricLabel}>Avg Order</Text>
            </View>
          </View>

          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>💡 Key Insights (Live)</Text>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🚀</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Weekend Performance</Text>
                <Text style={styles.insightText}>
                  Weekend orders are {insights.weekendPct}% of orders in this range.
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🕒</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Dinner Rush (6–8 PM)</Text>
                <Text style={styles.insightText}>
                  {insights.dinnerRushPct}% of orders happened during 6–8 PM.
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>🍕</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Item</Text>
                <Text style={styles.insightText}>
                  {insights.topItemName} ({insights.topItemPct}% of items sold).
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF5' },

  header: {
    backgroundColor: '#FF9933',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#666666', marginTop: 4 },

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
  timeRangeText: { fontSize: 14, fontWeight: '600', color: '#999999' },
  timeRangeTextActive: { color: '#1A1A1A' },

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  loadingText: { marginTop: 10, color: '#666', fontWeight: '600' },

  scrollView: { flex: 1 },

  // ✅ FIX: wraps cards on small screens instead of overflowing
  metricsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  metricIcon: { fontSize: 32, marginBottom: 8 },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  metricLabel: { fontSize: 10, color: '#999999', textAlign: 'center' },

  insightsContainer: { marginHorizontal: 16, marginBottom: 16 },
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
  insightIcon: { fontSize: 32, marginRight: 12 },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  insightText: { fontSize: 12, color: '#666666', lineHeight: 18 },
});
