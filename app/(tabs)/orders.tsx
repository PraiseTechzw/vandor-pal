import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

// Mock data for orders
const orders = [
  {
    id: '1',
    items: [
      { name: 'Product A', quantity: 2, price: 25.99 },
      { name: 'Product B', quantity: 1, price: 15.50 },
    ],
    total: 67.48,
    status: 'pending',
    deliveryAddress: 'Street Vendor - Main Market',
    date: '2024-04-06',
  },
  {
    id: '2',
    items: [
      { name: 'Product C', quantity: 3, price: 10.00 },
      { name: 'Product D', quantity: 2, price: 20.00 },
    ],
    total: 70.00,
    status: 'completed',
    deliveryAddress: 'Street Vendor - City Center',
    date: '2024-04-05',
  },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderDate, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.date}
          </Text>
          <Text style={[styles.deliveryAddress, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.deliveryAddress}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={[styles.itemName, { color: Colors[colorScheme ?? 'light'].text }]}>
              {product.name}
            </Text>
            <View style={styles.itemDetails}>
              <Text style={[styles.itemQuantity, { color: Colors[colorScheme ?? 'light'].text }]}>
                {product.quantity}x
              </Text>
              <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].text }]}>
                ${product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={[styles.totalLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
          Total:
        </Text>
        <Text style={[styles.totalAmount, { color: Colors[colorScheme ?? 'light'].text }]}>
          ${item.total.toFixed(2)}
        </Text>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleCompleteOrder(item.id)}
          >
            <Text style={styles.actionButtonText}>Complete Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleCompleteOrder = (orderId) => {
    // TODO: Implement order completion logic
    console.log('Complete order:', orderId);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Orders
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingHorizontal: isSmallScreen ? 8 : 16 }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  listContainer: {
    paddingVertical: 16,
  },
  orderCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
    marginRight: 8,
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 