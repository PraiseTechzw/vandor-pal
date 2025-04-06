import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for orders
const orders = [
  {
    id: '1',
    customerName: 'John Doe',
    items: 3,
    total: 89.99,
    status: 'pending',
    date: '2024-04-06',
    deliveryAddress: '123 Main St, City',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    items: 2,
    total: 45.50,
    status: 'processing',
    date: '2024-04-06',
    deliveryAddress: '456 Oak Ave, Town',
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    items: 5,
    total: 150.75,
    status: 'delivered',
    date: '2024-04-05',
    deliveryAddress: '789 Pine Rd, Village',
  },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'delivered':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={[styles.customerName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.customerName}
          </Text>
          <Text style={[styles.orderDate, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.date}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="shopping-cart" size={20} color="#2196F3" />
          <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.items} items
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="attach-money" size={20} color="#4CAF50" />
          <Text style={[styles.detailText, { color: Colors[colorScheme ?? 'light'].text }]}>
            ${item.total}
          </Text>
        </View>
      </View>

      <View style={styles.deliveryInfo}>
        <MaterialIcons name="location-on" size={20} color="#666" />
        <Text style={[styles.deliveryText, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.deliveryAddress}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
        contentContainerStyle={styles.listContainer}
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
    padding: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    opacity: 0.7,
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
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 