import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type Transaction = {
  id: string;
  customerName: string;
  amount: number;
  items: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  status: 'completed' | 'pending' | 'refunded';
  timestamp: string;
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    customerName: 'John Doe',
    amount: 45.99,
    items: 3,
    paymentMethod: 'card',
    status: 'completed',
    timestamp: '2 mins ago',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    amount: 120.50,
    items: 5,
    paymentMethod: 'cash',
    status: 'completed',
    timestamp: '15 mins ago',
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    amount: 89.99,
    items: 4,
    paymentMethod: 'mobile',
    status: 'pending',
    timestamp: '1 hour ago',
  },
];

export default function SalesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const timeframes = ['today', 'week', 'month', 'year'];

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'refunded':
        return '#FF5722';
      default:
        return Colors[colorScheme].text;
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={[styles.transactionCard, { backgroundColor: Colors[colorScheme].card }]}
      activeOpacity={0.8}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.customerInfo}>
          <MaterialIcons name="person" size={24} color={Colors[colorScheme].tint} />
          <Text style={[styles.customerName, { color: Colors[colorScheme].text }]}>
            {item.customerName}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Amount
          </Text>
          <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Items
          </Text>
          <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
            {item.items}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Payment
          </Text>
          <View style={styles.paymentMethod}>
            <MaterialIcons
              name={item.paymentMethod === 'card' ? 'credit-card' : item.paymentMethod === 'cash' ? 'money' : 'smartphone'}
              size={16}
              color={Colors[colorScheme].tint}
            />
            <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
              {item.paymentMethod}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <Text style={[styles.timestamp, { color: Colors[colorScheme].tabIconDefault }]}>
          {item.timestamp}
        </Text>
        <TouchableOpacity style={styles.receiptButton}>
          <MaterialIcons name="receipt" size={20} color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={[Colors[colorScheme].tint, Colors[colorScheme].background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: '#fff' }]}>Sales</Text>
          <Text style={[styles.subtitle, { color: '#fff' }]}>
            Track your business performance
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.statValue, { color: Colors[colorScheme].text }]}>
            $2,345
          </Text>
          <Text style={[styles.statLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Today's Sales
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.statValue, { color: Colors[colorScheme].text }]}>
            45
          </Text>
          <Text style={[styles.statLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Transactions
          </Text>
        </View>
      </View>

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

      <View style={styles.transactionsHeader}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
          Recent Transactions
        </Text>
        <TouchableOpacity>
          <Text style={[styles.viewAllText, { color: Colors[colorScheme].tint }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      />
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  timeframeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsList: {
    padding: 16,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  timestamp: {
    fontSize: 12,
  },
  receiptButton: {
    padding: 4,
  },
}); 