import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type Timeframe = 'day' | 'week' | 'month' | 'year';

const mockData = {
  revenue: {
    day: [120, 150, 200, 180, 220, 250, 300],
    week: [1500, 1800, 2200, 2000, 2400, 2800, 3000],
    month: [8000, 9000, 10000, 9500, 11000, 12000, 13000],
    year: [120000, 130000, 140000, 150000, 160000, 170000, 180000],
  },
  customers: {
    day: [10, 15, 20, 18, 22, 25, 30],
    week: [100, 120, 150, 140, 160, 180, 200],
    month: [500, 600, 700, 650, 750, 800, 900],
    year: [6000, 6500, 7000, 7500, 8000, 8500, 9000],
  },
};

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('week');

  const timeframes: Timeframe[] = ['day', 'week', 'month', 'year'];

  const getTimeframeLabel = (timeframe: Timeframe) => {
    switch (timeframe) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
    }
  };

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${mockData.revenue[selectedTimeframe][mockData.revenue[selectedTimeframe].length - 1].toLocaleString()}`,
      change: '+12%',
      icon: 'attach-money' as const,
      color: '#4CAF50',
    },
    {
      title: 'Total Customers',
      value: mockData.customers[selectedTimeframe][mockData.customers[selectedTimeframe].length - 1].toLocaleString(),
      change: '+8%',
      icon: 'people' as const,
      color: '#2196F3',
    },
    {
      title: 'Average Order Value',
      value: '$45.99',
      change: '+5%',
      icon: 'shopping-cart' as const,
      color: '#FF9800',
    },
    {
      title: 'Customer Satisfaction',
      value: '94%',
      change: '+2%',
      icon: 'star' as const,
      color: '#FFC107',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={[Colors[colorScheme].tint, Colors[colorScheme].background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: '#fff' }]}>Analytics</Text>
          <Text style={[styles.subtitle, { color: '#fff' }]}>
            {getTimeframeLabel(selectedTimeframe)}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timeframeContainer}
      >
        {timeframes.map(timeframe => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              {
                backgroundColor: selectedTimeframe === timeframe
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].card
              }
            ]}
            onPress={() => setSelectedTimeframe(timeframe)}
          >
            <Text
              style={[
                styles.timeframeText,
                { color: selectedTimeframe === timeframe ? '#fff' : Colors[colorScheme].text }
              ]}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.kpiContainer}>
        {kpis.map((kpi, index) => (
          <View
            key={index}
            style={[styles.kpiCard, { backgroundColor: Colors[colorScheme].card }]}
          >
            <View style={styles.kpiHeader}>
              <MaterialIcons name={kpi.icon} size={24} color={kpi.color} />
              <Text style={[styles.kpiChange, { color: kpi.change.startsWith('+') ? '#4CAF50' : '#FF5722' }]}>
                {kpi.change}
              </Text>
            </View>
            <Text style={[styles.kpiValue, { color: Colors[colorScheme].text }]}>
              {kpi.value}
            </Text>
            <Text style={[styles.kpiTitle, { color: Colors[colorScheme].tabIconDefault }]}>
              {kpi.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
            Revenue Trend
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
          </TouchableOpacity>
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={[styles.chartPlaceholderText, { color: Colors[colorScheme].tabIconDefault }]}>
            Chart visualization will be implemented here
          </Text>
        </View>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: Colors[colorScheme].text }]}>
            Customer Growth
          </Text>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={24} color={Colors[colorScheme].tabIconDefault} />
          </TouchableOpacity>
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={[styles.chartPlaceholderText, { color: Colors[colorScheme].tabIconDefault }]}>
            Chart visualization will be implemented here
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  timeframeContainer: {
    paddingHorizontal: 16,
    marginTop: -30,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  kpiCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiChange: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  kpiTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  chartPlaceholderText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
}); 